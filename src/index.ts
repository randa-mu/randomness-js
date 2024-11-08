import {Buffer} from "buffer"
import {
    BytesLike,
    getBytes,
    keccak256,
    Provider,
    Signer,
} from "ethers"
import {G2} from "mcl-wasm"
import {RandomnessSender__factory} from "./generated"
import {
    RandomnessCallbackFailedEvent,
    RandomnessCallbackSuccessEvent,
    RandomnessSender
} from "./generated/RandomnessSender"
import {BlsBn254, bytesEqual} from "./bls-bn254"
import {encodeParams, extractSingleLog} from "./ethers-helpers"
import {withTimeout} from "./misc"
import {TypedContractEvent, TypedListener} from "./generated/common"

const defaultContractAddress = "0xba0a7e16c66be57510e5c44ac2fcdec09241711f"
// the verifier's BLS public key arranged as magical bigints to avoid promises in creation
export const VERIFIER_PUBLIC_KEY: [bigint, bigint, bigint, bigint] = [
    17445541620214498517833872661220947475697073327136585274784354247720096233162n,
    18268991875563357240413244408004758684187086817233527689475815128036446189503n,
    11401601170172090472795479479864222172123705188644469125048759621824127399516n,
    8044854403167346152897273335539146380878155193886184396711544300199836788154n,
]
const iface = RandomnessSender__factory.createInterface()

export type RandomnessVerificationParameters = {
    requestID: bigint,
    nonce: bigint,
    randomness: BytesLike
    signature: BytesLike
}

export class Randomness {
    private readonly contract: RandomnessSender
    private bls: BlsBn254 | undefined
    private pk: G2 | undefined

    constructor(private readonly rpc: Signer | Provider, private readonly contractAddress: string = defaultContractAddress) {
        console.log(`created randomness-js client with address ${contractAddress}`)
        this.contract = RandomnessSender__factory.connect(contractAddress, rpc)
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
            const failureFilter = this.contract.filters.RandomnessCallbackFailed(requestID)

            // how many blocks we're willing to look back - don't really expect it to be more than 1
            const blockLookBack = 3

            // cleanup to do once we've managed all the events
            const cleanup = () => {
                this.contract.off(successFilter)
                this.contract.off(failureFilter)
            }
            const randomnessCallback = (result: RandomnessVerificationParameters) => {
                resolve(result)
                cleanup()
            }
            const randomnessListener = createRandomnessListener(nonce, randomnessCallback)
            this.contract.once(successFilter, randomnessListener)
            this.contract.once(failureFilter, randomnessListener)

            const randomnessFilter = createRandomnessLogListener(nonce, randomnessCallback)
            this.contract.queryFilter(successFilter, -blockLookBack)
                .then(randomnessFilter)
                .catch(reject)
            this.contract.queryFilter(failureFilter, -blockLookBack)
                .then(randomnessFilter)
                .catch(reject)

            setTimeout(() => {
                cleanup()
                reject(new Error("timed out requesting randomness"))
            }, timeoutMs)
        })
    }

    async verify(parameters: RandomnessVerificationParameters): Promise<boolean> {
        if (!this.bls) {
            this.bls = await BlsBn254.create()
        }
        if (!this.pk) {
            this.pk = this.bls.g2FromEvm(VERIFIER_PUBLIC_KEY)
        }
        const {randomness, signature, nonce} = parameters
        const randDST = "randomness:0.0.1:bn254"
        const blsDST = Buffer.from("BLS_SIG_BN254G1_XMD:KECCAK-256_SVDW_RO_NUL_")

        if (!bytesEqual(keccak256(signature), randomness)) {
            throw Error("randomness did not match the signature provided")
        }

        const m = keccak256(encodeParams(["string", "uint256"], [randDST, nonce]))
        const h_m = this.bls.hashToPoint(blsDST, getBytes(m))
        const s = this.bls.g1FromEvmHex(signature)

        return this.bls.verify(h_m, this.pk, s)
    }
}

function createRandomnessListener(nonce: bigint, cb: (arg: RandomnessVerificationParameters) => void): TypedListener<TypedContractEvent> {
    return (log: RandomnessCallbackSuccessEvent.Log | RandomnessCallbackFailedEvent.Log) => {
        const [requestID, randomness, signature] = log.args
        cb({requestID, nonce, randomness, signature})
    }
}

function createRandomnessLogListener(nonce: bigint, cb: (arg: RandomnessVerificationParameters) => void) {
    return (logs: RandomnessCallbackSuccessEvent.Log[] | RandomnessCallbackFailedEvent.Log[]) => {
        if (logs.length === 0) {
            return
        }
        if (!logs[0].args) {
            console.error("got a log without args somehow...")
            return
        }
        cb({...logs[0].args, nonce})
    }
}


