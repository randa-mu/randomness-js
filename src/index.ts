import {
    BigNumberish,
    BytesLike,
    getBytes,
    keccak256,
    Provider,
    Signer,
} from "ethers"
import { bn254 } from "@kevincharm/noble-bn254-drand"
import { equalBytes } from "@noble/curves/abstract/utils"
import { encodeParams, extractSingleLog } from "./ethers-helpers"
import { RandomnessSender__factory, RandomnessSender } from "./generated"
import {
    NetworkConfig,
    configForChainId,
    BASE_SEPOLIA,
    FILECOIN_CALIBNET,
    FILECOIN_MAINNET,
    POLYGON_POS,
    DCIPHER_PUBLIC_KEY,
    AVALANCHE_C_CHAIN,
    OPTIMISM_SEPOLIA,
    ARBITRUM_SEPOLIA,
    SEI_TESTNET
} from "./networks"

const iface = RandomnessSender__factory.createInterface()

// Common utils
const NETWORK_IDS = {
    FILECOIN_MAINNET: 314,
    FILECOIN_TESTNET: 314159,
}

const isFilecoin = (networkId: number) => [NETWORK_IDS.FILECOIN_MAINNET, NETWORK_IDS.FILECOIN_TESTNET].includes(networkId)

export type RandomnessVerificationParameters = {
    requestID: bigint,
    nonce: bigint,
    randomness: BytesLike
    signature: BytesLike
}

export type RandomnessVerificationConfig = {
    shouldBlowUp: boolean // determines whether the verification function silently returns a boolean on failure or explodes
}

type RequestRandomnessParams = {
    callbackGasLimit: bigint
    timeoutMs: number
    confirmations: number
    pollingIntervalMs: number
}

export class Randomness {
    private readonly contract: RandomnessSender
    private readonly defaultRequestParams: RequestRandomnessParams

    constructor(
        private readonly rpc: Signer | Provider,
        private readonly networkConfig: NetworkConfig,
        defaultRequestTimeoutMs: number = 60_000,
    ) {
        console.log(`created randomness-js client with address ${this.networkConfig.contractAddress}`)
        this.contract = RandomnessSender__factory.connect(this.networkConfig.contractAddress, rpc)
        this.defaultRequestParams = {
            callbackGasLimit: networkConfig.callbackGasLimitDefault,
            timeoutMs: defaultRequestTimeoutMs,
            confirmations: 1,
            pollingIntervalMs: 500,
        }
    }

    // you can create a client from the chainID or use the static methods per chain at the bottom
    static createFromChainId(rpc: Signer | Provider, chainId: BigNumberish): Randomness {
        return new Randomness(rpc, configForChainId(chainId))
    }

    async requestRandomness(config: Partial<RequestRandomnessParams> = this.defaultRequestParams): Promise<RandomnessVerificationParameters> {
        if (this.rpc.provider == null) {
            throw Error("RPC requires a provider to request randomness")
        }

        const { callbackGasLimit, timeoutMs, } = { ...this.defaultRequestParams, ...config }

        // 1. Get chain ID and fee data
        const [network, feeData] = await Promise.all([
            this.rpc.provider!.getNetwork(),
            this.rpc.provider!.getFeeData(),
        ]);

        const chainId = network.chainId;

        // feeData.maxFeePerGas: Max total gas price we're willing to pay (base + priority), used in EIP-1559
        const maxFeePerGas = feeData.maxFeePerGas!;

        // feeData.maxPriorityFeePerGas: Tip to incentivize validators (goes directly to them)
        const maxPriorityFeePerGas = feeData.maxPriorityFeePerGas!;

        // 2. Use EIP-1559 pricing
        const txGasPrice = (maxFeePerGas + maxPriorityFeePerGas) * 10n;

        // 3. Estimate request price using the selected txGasPrice
        const requestPrice = await this.contract.estimateRequestPriceNative(
            callbackGasLimit,
            txGasPrice
        );

        // 4. Apply buffer (e.g. 100% = 2× total)
        const bufferPercent = isFilecoin(Number(chainId)) ? 300n : 50n;
        const valueToSend = requestPrice + (requestPrice * bufferPercent) / 100n;

        // 5. Estimate gas
        const estimatedGas = await this.contract.requestRandomness.estimateGas(
            callbackGasLimit,
            {
                value: valueToSend,
                gasPrice: txGasPrice,
            }
        );

        // 6. Send transaction
        const tx = await this.contract.requestRandomness(
            callbackGasLimit,
            {
                value: valueToSend,
                gasLimit: estimatedGas,
                gasPrice: txGasPrice,
            }
        );

        const receipt = await tx.wait();
        if (!receipt) {
            throw new Error("Transaction was not mined");
        }

        const [requestID] = extractSingleLog(iface, receipt, this.networkConfig.contractAddress, iface.getEvent("RandomnessRequested"))
        const start = Date.now()
        while (Date.now() - start < timeoutMs) {
            const [, , , , , , signature, nonce] = await this.contract.getRequest(requestID)

            if (signature !== "0x") {
                return { requestID, randomness: keccak256(signature), nonce, signature }
            }
            await sleep(config.pollingIntervalMs ?? 500)
        }

        throw new Error("timed out waiting for randomness request")
    }

    async verify(
        parameters: RandomnessVerificationParameters,
        config: RandomnessVerificationConfig = { shouldBlowUp: true }
    ): Promise<boolean> {
        const { randomness, signature, nonce } = parameters

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
            verifies = bn254.verifyShortSignature(signatureBytes, m, DCIPHER_PUBLIC_KEY, { DST: this.networkConfig.dst })

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


    /**
     * Calculates the request price for a blocklock request given the callbackGasLimit.
     * @param callbackGasLimit The callbackGasLimit to use when fulfilling the request with a decryption key.
     * @returns The estimated request price and the transaction gas price used
     */
    async calculateRequestPriceNative(callbackGasLimit: bigint): Promise<[bigint, bigint]> {
        if (this.rpc.provider == null) {
            throw Error("RPC requires a provider to request randomness")
        }

        // 1. Get chain ID and fee data
        const [network, feeData] = await Promise.all([
            this.rpc.provider!.getNetwork(),
            this.rpc.provider!.getFeeData(),
        ]);

        const chainId = network.chainId;

        const maxFeePerGas = feeData.maxFeePerGas!;

        const maxPriorityFeePerGas = feeData.maxPriorityFeePerGas!;

        // 2. Use EIP-1559 pricing
        const txGasPrice = (maxFeePerGas + maxPriorityFeePerGas) * 10n;

        // 3. Estimate request price using the selected txGasPrice
        const requestPrice = await this.contract.estimateRequestPriceNative(
            callbackGasLimit,
            txGasPrice
        );

        // 4. Apply buffer (e.g. 100% = 2× total)
        const bufferPercent = isFilecoin(Number(chainId)) ? 300n : 100n;
        const valueToSend = requestPrice + (requestPrice * bufferPercent) / 100n;

        return [valueToSend, txGasPrice];
    }

    static createFilecoinMainnet(rpc: Signer | Provider): Randomness {
        // filecoin block time is 30s, so give a longer default timeout
        return new Randomness(rpc, FILECOIN_MAINNET, 90_000)
    }

    static createFilecoinCalibnet(rpc: Signer | Provider): Randomness {
        // filecoin block time is 30s, so give a longer default timeout
        return new Randomness(rpc, FILECOIN_CALIBNET, 90_000)
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

async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
}
