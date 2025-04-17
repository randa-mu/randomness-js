import {
    BigNumberish,
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
export const FURNACE_TESTNET_CONTRACT_ADDRESS = "0x8192aF4ce49f473fCa7e3e5a8d819B0763Def048"
export const FILECOIN_CALIBNET_CONTRACT_ADDRESS = "0x9c789bc7F2B5c6619Be1572A39F2C3d6f33001dC"
export const BASE_SEPOLIA_CONTRACT_ADDRESS = "0x455bfe4B1B4393b458d413E2B0778A95F9B84B82"
export const POLYGON_POS_CONTRACT_ADDRESS = "0x455bfe4B1B4393b458d413E2B0778A95F9B84B82"

const iface = RandomnessSender__factory.createInterface()

export function createBlsDst(chainId: bigint): string {
    if (chainId <= 0n) {
        throw new Error("cannot create a BLS domain separator for an invalid chainId")
    }

    return `dcipher-randomness-v01-BN254G1_XMD:KECCAK-256_SVDW_RO_${encodeParams(["uint256"], [chainId])}_`
}

export type RandomnessVerificationParameters = {
    requestID: bigint,
    nonce: bigint,
    randomness: BytesLike
    signature: BytesLike
}

export type RandomnessVerificationConfig = {
    shouldBlowUp: boolean // determines whether the verification function silently returns a boolean on failure or explodes
}

export class Randomness {
    private readonly contract: RandomnessSender
    // any human who can find the right hex format to parse this point shall be crowned the [king|queen|catgirl] of England
    private readonly pk = new bn254.G2.ProjectivePoint(
        {
            c0: 17445541620214498517833872661220947475697073327136585274784354247720096233162n,
            c1: 18268991875563357240413244408004758684187086817233527689475815128036446189503n
        },
        {
            c0: 11401601170172090472795479479864222172123705188644469125048759621824127399516n,
            c1: 8044854403167346152897273335539146380878155193886184396711544300199836788154n
        },
        {
            c0: 1n, c1: 0n
        }
    )

    constructor(
        private readonly rpc: Signer | Provider,
        private readonly contractAddress: string = FURNACE_TESTNET_CONTRACT_ADDRESS,
        private readonly chainId: bigint,
        private readonly defaultRequestTimeoutMs: number = 15_000,
    ) {
        console.log(`created randomness-js client with address ${contractAddress}`)
        this.contract = RandomnessSender__factory.connect(contractAddress, rpc)
    }

    static createFilecoinCalibnet(rpc: Signer | Provider): Randomness {
        // filecoin block time is 30s, so give a longer default timeout
        return new Randomness(rpc, FILECOIN_CALIBNET_CONTRACT_ADDRESS, 314159n, 90_000)
    }

    static createFurnace(rpc: Signer | Provider): Randomness {
        return new Randomness(rpc, FURNACE_TESTNET_CONTRACT_ADDRESS, 64630n)
    }

    static createBaseSepolia(rpc: Signer | Provider): Randomness {
        return new Randomness(rpc, BASE_SEPOLIA_CONTRACT_ADDRESS, 84532n)
    }

    static createPolygonPos(rpc: Signer | Provider): Randomness {
        return new Randomness(rpc, POLYGON_POS_CONTRACT_ADDRESS, 137n)
    }

    static createFromChainId(rpc: Signer | Provider, chainId: BigNumberish): Randomness {
        switch (chainId.toString().toLowerCase()) {
            case "314159":
            case "314159n":
            case "0x4cb2f":
                return Randomness.createFilecoinCalibnet(rpc)

            case "64630":
            case "64630n":
            case "0xfc76":
                return Randomness.createFurnace(rpc)

            case "84532":
            case "84532n":
            case "0x14a34":
                return Randomness.createBaseSepolia(rpc)

            case "137":
            case "137n":
            case "0x89":
                return Randomness.createPolygonPos(rpc)

            default:
                throw new Error("unsupported chainId :(")
        }
    }

    async requestRandomness(confirmations = 1, timeoutMs = this.defaultRequestTimeoutMs): Promise<RandomnessVerificationParameters> {
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

    async verify(
        parameters: RandomnessVerificationParameters,
        config: RandomnessVerificationConfig = {shouldBlowUp: true}
    ): Promise<boolean> {
        const {randomness, signature, nonce} = parameters

        const signatureBytes = getBytes(signature)
        if (!equalBytes(getBytes(keccak256(signatureBytes)), getBytes(randomness))) {
            throw Error("randomness did not match the signature provided")
        }

        // we go through these hoops to give callers the option of using the boolean or
        // using exceptions for control flow
        let verifies = false
        let errorDuringVerification = false
        try {
            const m = getBytes(keccak256(encodeParams(["uint256"], [nonce])))
            verifies = bn254.verifyShortSignature(signatureBytes, m, this.pk, {DST: createBlsDst(this.chainId)})

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (_) {
            errorDuringVerification = true
        }

        if (verifies) {
            return true
        }
        if (!config.shouldBlowUp) {
            return false
        }
        if (!errorDuringVerification) {
            throw Error("signature failed to verify")
        }
        throw Error("error during signature verification: was your signature formatted correctly?")
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
