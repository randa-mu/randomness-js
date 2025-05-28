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
import {RandomnessSender__factory} from "./generated"
import {TypedContractEvent, TypedListener} from "./generated/common"
import {RandomnessCallbackSuccessEvent, RandomnessSender} from "./generated/RandomnessSender"
import {
    NetworkConfig,
    configForChainId,
    BASE_SEPOLIA,
    FILECOIN_CALIBNET,
    FILECOIN_MAINNET,
    FURNACE,
    POLYGON_POS, DCIPHER_PUBLIC_KEY, AVALANCHE_C_CHAIN, OPTIMISM_SEPOLIA, ARBITRUM_SEPOLIA, SEI_TESTNET
} from "./networks"
import {getGasPrice} from "./gas"

const iface = RandomnessSender__factory.createInterface()

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

    constructor(
        private readonly rpc: Signer | Provider,
        private readonly networkConfig: NetworkConfig,
        private readonly defaultRequestTimeoutMs: number = 15_000,
    ) {
        console.log(`created randomness-js client with address ${this.networkConfig.contractAddress}`)
        this.contract = RandomnessSender__factory.connect(this.networkConfig.contractAddress, rpc)
    }

    // you can create a client from the chainID or use the static methods per chain at the bottom
    static createFromChainId(rpc: Signer | Provider, chainId: BigNumberish): Randomness {
        return new Randomness(rpc, configForChainId(chainId))
    }

    async requestRandomness(
        callbackGasLimit: bigint = this.networkConfig.callbackGasLimitDefault,
        gasMultiplier: bigint = this.networkConfig.gasMultiplierDefault,
        timeoutMs = this.defaultRequestTimeoutMs,
        confirmations = 1
    ): Promise<RandomnessVerificationParameters> {
        if (this.rpc.provider == null) {
            throw Error("RPC requires a provider to request randomness")
        }
        const feeData = await this.rpc.provider.getFeeData()
        const txGasPrice = getGasPrice(feeData, gasMultiplier)
        const requestPrice = await this.contract.estimateRequestPriceNative(
            this.networkConfig.gasLimit,
            txGasPrice
        );

        // 2. Apply buffer e.g. 100% = 2x total
        const valueToSend = requestPrice + (requestPrice * this.networkConfig.gasBufferPercent) / 100n;

        const tx = await this.contract.requestRandomness(callbackGasLimit, {
            value: valueToSend,
            maxFeePerGas: feeData.maxFeePerGas,
            maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
        })

        const receipt = await tx.wait(confirmations, timeoutMs)
        if (!receipt) {
            throw Error("no receipt because confirmations were 0")
        }

        const [requestID, nonce] = extractSingleLog(iface, receipt, this.networkConfig.contractAddress, iface.getEvent("RandomnessRequested"))

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
            verifies = bn254.verifyShortSignature(signatureBytes, m, DCIPHER_PUBLIC_KEY, {DST: this.networkConfig.dst})

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

    async getRequestPriceEstimate(
        callbackGasLimit: bigint = this.networkConfig.callbackGasLimitDefault,
        gasPriceMultiplier: bigint = this.networkConfig.gasMultiplierDefault
    ): Promise<bigint> {
        if (this.rpc.provider == null) {
            throw new Error("RPC requires a provider to estimate gas")
        }
        const feeData = await this.rpc.provider.getFeeData()
        const txGasPrice = getGasPrice(feeData, gasPriceMultiplier)
        return this.contract.estimateRequestPriceNative(callbackGasLimit, txGasPrice)
    }

    static createFilecoinMainnet(rpc: Signer | Provider): Randomness {
        // filecoin block time is 30s, so give a longer default timeout
        return new Randomness(rpc, FILECOIN_MAINNET, 90_000)
    }

    static createFilecoinCalibnet(rpc: Signer | Provider): Randomness {
        // filecoin block time is 30s, so give a longer default timeout
        return new Randomness(rpc, FILECOIN_CALIBNET, 90_000)
    }

    static createFurnace(rpc: Signer | Provider): Randomness {
        return new Randomness(rpc, FURNACE)
    }

    static createBaseSepolia(rpc: Signer | Provider): Randomness {
        return new Randomness(rpc, BASE_SEPOLIA)
    }

    static createPolygonPos(rpc: Signer | Provider): Randomness {
        return new Randomness(rpc, POLYGON_POS)
    }

    static createAvalancheCChain(rpc: Signer | Provider): Randomness {
        return new Randomness(rpc, AVALANCHE_C_CHAIN)
    }

    static createOptimismSepolia(rpc: Signer | Provider): Randomness {
        return new Randomness(rpc, OPTIMISM_SEPOLIA)

    }

    static createArbitrumSepolia(rpc: Signer | Provider): Randomness {
        return new Randomness(rpc, ARBITRUM_SEPOLIA)
    }

    static createSeiTestnet(rpc: Signer | Provider): Randomness {
        return new Randomness(rpc, SEI_TESTNET)
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
