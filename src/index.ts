import {
    BytesLike,
    getBytes,
    keccak256,
    Provider,
    Signer,
} from "ethers"
import {bn254} from "@kevincharm/noble-bn254-drand"
import {equalBytes} from "@noble/curves/abstract/utils"
import {encodeParams, extractSingleLog} from "./ethers-helpers"
import {withTimeout} from "./misc"
import {RandomnessSender__factory} from "./generated"
import {TypedContractEvent, TypedListener} from "./generated/common"
import {RandomnessCallbackSuccessEvent, RandomnessSender} from "./generated/RandomnessSender"

/* addresses of the deployed contracts */
export const FURNACE_TESTNET_CONTRACT_ADDRESS = "0x6ac6390653d8d75b9baff66401198efc3684e0ec"
export const FILECOIN_CALIBNET_CONTRACT_ADDRESS = "0x9c789bc7F2B5c6619Be1572A39F2C3d6f33001dC"

/* some cryptographic parameters that are also defined in the contracts, but we duplicate here for performance */
const RANDOMNESS_DST = "randomness:0.0.1:bn254"
const BLS_DST = "BLS_SIG_BN254G1_XMD:KECCAK-256_SVDW_RO_NUL_"

/* ethers.js magic beans */
const iface = RandomnessSender__factory.createInterface()

export type RandomnessVerificationParameters = {
    requestID: bigint,
    nonce: bigint,
    randomness: BytesLike
    signature: BytesLike
}

export class Randomness {
    private readonly contract: RandomnessSender
    // the format of this public key is _NOT_ the same format as evm-land.
    // only the lord himself knows how to convert from one to the other
    private readonly pk = bn254.G2.ProjectivePoint.fromHex("00f26a1fbba69685a1606f8104d0f218546a774099d78218e01bf63bf08b94fb0eafa51a62570209e04f66f390f41b7a1dae3d9350af7b413e4c65ffc4ca3a6c0815fe3e100c6f2c9a05f8ac898f9aa5c54164771500426ce54b52c6e0958e52111fa5a435e9d442cf69939a379e25841c65c3be365e851fdd04539e9b2462a1")

    constructor(private readonly rpc: Signer | Provider, private readonly contractAddress: string = FURNACE_TESTNET_CONTRACT_ADDRESS) {
        console.log(`created randomness-js client with address ${contractAddress}`)
        this.contract = RandomnessSender__factory.connect(contractAddress, rpc)
    }

    static createFilecoinCalibnet(rpc: Signer | Provider): Randomness {
        return new Randomness(rpc, FILECOIN_CALIBNET_CONTRACT_ADDRESS)
    }

    static createFurnace(rpc: Signer | Provider): Randomness {
        return new Randomness(rpc, FURNACE_TESTNET_CONTRACT_ADDRESS)
    }

    async requestRandomness(confirmations = 1, timeoutMs = 60000): Promise<RandomnessVerificationParameters> {
        if (this.rpc.provider == null) {
            throw Error("RPC requires a provider to request randomness")
        }

        const receipt = await withTimeout(
            this.contract.requestRandomness().then(tx => tx.wait(confirmations)),
            timeoutMs
        )
        if (!receipt) {
            throw Error("no receipt because confirmations were 0")
        }

        const [requestID, nonce] = extractSingleLog(iface, receipt, this.contractAddress, iface.getEvent("RandomnessRequested"))

        return new Promise((resolve, reject) => {
            // then we have to both check the past and listen to the future for emitted events
            // lest we miss our fulfilled randomness. We set the listeners first... in case
            // by some magic our request is fulfilled _between_ the lines
            const successFilter = this.contract.filters.RandomnessCallbackSuccess(requestID)

            // how many blocks we're willing to look back - don't really expect it to be more than 1
            const blockLookBack = 3
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let timeout: any = null

            // cleanup to do once we've managed all the events
            const cleanup = () => {
                this.contract.off(successFilter)
                clearTimeout(timeout)
            }
            const randomnessCallback = (result: RandomnessVerificationParameters) => {
                resolve(result)
                cleanup()
            }
            const randomnessListener = createRandomnessListener(nonce, randomnessCallback)
            this.contract.once(successFilter, randomnessListener)

            const randomnessFilter = createRandomnessLogListener(nonce, randomnessCallback)
            this.contract.queryFilter(successFilter, -blockLookBack)
                .then(randomnessFilter)
                .catch(reject)

            timeout = setTimeout(() => {
                cleanup()
                reject(new Error("timed out requesting randomness"))
            }, timeoutMs)
        })
    }

    async verify(parameters: RandomnessVerificationParameters): Promise<boolean> {
        const {randomness, signature, nonce} = parameters

        if (!equalBytes(getBytes(keccak256(signature)), getBytes(randomness))) {
            throw Error("randomness did not match the signature provided")
        }

        const m = keccak256(encodeParams(["string", "uint256"], [RANDOMNESS_DST, nonce]))
        return bn254.verifyShortSignature(getBytes(signature), getBytes(m), this.pk, {DST: BLS_DST})
    }
}

function createRandomnessListener(nonce: bigint, cb: (arg: RandomnessVerificationParameters) => void): TypedListener<TypedContractEvent> {
    return (log: RandomnessCallbackSuccessEvent.Log) => {
        const [requestID, randomness, signature] = log.args
        cb({requestID, nonce, randomness, signature})
    }
}

function createRandomnessLogListener(nonce: bigint, cb: (arg: RandomnessVerificationParameters) => void) {
    return (logs: RandomnessCallbackSuccessEvent.Log[]) => {
        if (logs.length === 0) {
            return
        }
        if (!logs[0].args) {
            console.error("got a log without args somehow...")
            return
        }
        const [requestID, randomness, signature] = logs[0].args
        cb({requestID, randomness, signature, nonce})
    }
}
