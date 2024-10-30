import {Buffer} from "buffer"
import {
    AbiCoder,
    type BaseContract,
    BytesLike, keccak256,
    LogDescription,
    Provider,
    Signer,
    TransactionReceipt
} from "ethers"
import {G2} from "mcl-wasm"
import {bytesEqual, BlsBn254} from "./bls-bn254"
import {RandomnessRequester, RandomnessRequester__factory} from "./generated"

export const VERIFIER_PUBLIC_KEY = "0xcaf65381e7d3d3379164abb88f94ee5675c748b8a0113987fa0b38cc9ed39126bf3702fdc4f4572f0260ffebe969a0165e401fb361508a1098b025510ae26328"
export const RANDOMNESS_ADDRESS_TESTNET = "0x8bAe3eB71458B7339AA362fd7F26BF1B95677BB5"
export type RandomnessVerificationParameters = {
    requestID: bigint,
    nonce: bigint,
    randomness: BytesLike
    signature: BytesLike
}

export class Randomness {
    private readonly contract: RandomnessRequester
    private bls: BlsBn254 | undefined
    private pk: G2 | undefined

    constructor(private readonly rpc: Signer | Provider, randomnessContractAddress: string = RANDOMNESS_ADDRESS_TESTNET) {
        this.contract = RandomnessRequester__factory.connect(randomnessContractAddress, rpc)
    }

    async requestRandomness(confirmations = 1, timeoutMs = 30000): Promise<RandomnessVerificationParameters> {
        if (this.rpc.provider == null) {
            throw Error("RPC requires a provider to request randomness")
        }

        const tx = await this.contract.requestRandomness()
        const receipt = await tx.wait(confirmations)
        if (!receipt) {
            throw Error("no receipt because confirmations were 0")
        }

        // we parse the `requestID` from the tx receipt, because the tx doesn't get it for some godforsaken reason
        const logs = parseLogs(receipt, this.contract, "RandomnessRequested")
        if (logs.length === 0) {
            throw Error("`requestRandomness` didn't emit the expected log")
        }
        const [requestID, nonce] = logs[0].args

        return new Promise((resolve, reject) => {
            // then we have to both check the past and listen to the future for emitted events
            // lest we miss our fulfilled randomness. We set the listeners first... in case
            // by some magic our request is fulfilled _between_ the lines
            const successFilter = this.contract.filters.RandomnessCallbackSuccess(requestID)
            const failureFilter = this.contract.filters.RandomnessCallbackFailed(requestID)
            this.contract.once(successFilter, (rID, randomness, signature) => {
                console.log(`received requestID ${rID}`)
                resolve({
                    requestID,
                    nonce,
                    randomness,
                    signature
                })
            })
            this.contract.once(failureFilter, (rID, randomness, signature) => {
                console.log(`received requestID ${rID}`)
                resolve({
                    requestID,
                    nonce,
                    randomness,
                    signature
                })
            })

            this.contract.queryFilter(this.contract.filters.RandomnessCallbackSuccess(requestID), -3).then(events => {
                const pastEvents = events.map(it => it.args)
                    .filter(it => it !== null)
                // if we get an event matching our query, that's the one
                if (pastEvents.length > 0) {
                    const [, randomness, signature] = pastEvents[0]
                    resolve({requestID, nonce, randomness, signature})
                }
            })

            setTimeout(() => {
                this.contract.off(successFilter)
                this.contract.off(failureFilter)
                reject(new Error("timed out requesting randomness"))
            }, timeoutMs)
        })
    }

    async verify(parameters: RandomnessVerificationParameters): Promise<boolean> {
        if (!this.bls || !this.pk) {
            this.bls = await BlsBn254.create()
            this.pk = this.bls.g2From(VERIFIER_PUBLIC_KEY)
        }
        const {randomness, signature, nonce} = parameters
        const randDST = "randomness:0.0.1:bn254"
        const blsDST = Buffer.from("BLS_SIG_BN254G1_XMD:KECCAK-256_SVDW_RO_NUL_")

        if (!bytesEqual(keccak256(signature), randomness)) {
            throw Error("randomness did not match the signature provided")
        }

        const m = keccak256(AbiCoder.defaultAbiCoder().encode(["string", "uint256"], [randDST, nonce]))
        const h_m = this.bls.hashToPoint(blsDST, Buffer.from(m, "hex"))

        const s = this.bls.g1From(signature)

        return this.bls.verify(h_m, this.pk, s)
    }
}

function parseLogs(receipt: TransactionReceipt, contract: BaseContract, eventName: string): Array<LogDescription> {
    return receipt.logs
        .map(log => {
            try {
                return contract.interface.parseLog(log)
            } catch {
                return null
            }
        })
        .filter(log => log !== null)
        .filter(log => log?.name === eventName)
}
