import {bn254} from "@kevincharm/noble-bn254-drand"
import {ethers} from "ethers"

export const DCIPHER_PUBLIC_KEY = new bn254.G2.ProjectivePoint(
    {
        c0: 19466273993852079063924474392378816199685375459664529508122564849204533666468n,
        c1: 21131687462638968537850845255670528066014536613738342153553860006061609469324n
    },
    {
        c0: 7578617840607454142936008614752231508238355116367494353476740252708767858492n,
        c1: 5343514427465363660208643216752839104127697387077797304816316938005257664244n
    },
    {
        c0: 1n, c1: 0n
    }
)

export type NetworkConfig = {
    name: string
    chainId: bigint
    contractAddress: `0x${string}`
    dst: string
    gasLimit: number
    maxFeePerGas: bigint
    maxPriorityFeePerGas: bigint
    // e.g. 100% = 2x total)
    gasBufferPercent: bigint
    callbackGasLimitDefault: bigint
    gasMultiplierDefault: bigint
}

export const FILECOIN_CALIBNET: NetworkConfig = {
    name: "filecoin_calibnet",
    chainId: 314159n,
    contractAddress: "0x94C5774DEa83a921244BF362a98c12A5aAD18c87",
    dst: "dcipher-randomness-v01-BN254G1_XMD:KECCAK-256_SVDW_RO_0x000000000000000000000000000000000000000000000000000000000004cb2f_",
    gasLimit: 5_000_000,
    maxFeePerGas: ethers.parseUnits("0.2", "gwei"),
    maxPriorityFeePerGas: ethers.parseUnits("0.2", "gwei"),
    gasBufferPercent: 300n,
    callbackGasLimitDefault: 444_000_000n,
    gasMultiplierDefault: 50n,
}

export const FILECOIN_MAINNET: NetworkConfig = {
    name: "filecoin_mainnet",
    chainId: 314n,
    contractAddress: "0xDD6FdE56432Cd3c868FEC7F1430F741967Fb0de8",
    dst: "dcipher-randomness-v01-BN254G1_XMD:KECCAK-256_SVDW_RO_0x000000000000000000000000000000000000000000000000000000000000013a_",
    gasLimit: 5_000_000,
    maxFeePerGas: ethers.parseUnits("0.2", "gwei"),
    maxPriorityFeePerGas: ethers.parseUnits("0.2", "gwei"),
    gasBufferPercent: 300n,
    callbackGasLimitDefault: 444_000_000n,
    gasMultiplierDefault: 50n,
}

export const BASE_SEPOLIA: NetworkConfig = {
    name: "base_sepolia",
    chainId: 84532n,
    contractAddress: "0xf4e080Db4765C856c0af43e4A8C4e31aA3b48779",
    dst: "dcipher-randomness-v01-BN254G1_XMD:KECCAK-256_SVDW_RO_0x0000000000000000000000000000000000000000000000000000000000014a34_",
    gasLimit: 100_000,
    maxFeePerGas: ethers.parseUnits("0.2", "gwei"),
    maxPriorityFeePerGas: ethers.parseUnits("0.2", "gwei"),
    gasBufferPercent: 100n,
    callbackGasLimitDefault: 1_000_000n,
    gasMultiplierDefault: 10n,
}

export const POLYGON_POS: NetworkConfig = {
    name: "polygon_pos",
    chainId: 137n,
    contractAddress: "0xf4e080Db4765C856c0af43e4A8C4e31aA3b48779",
    dst: "dcipher-randomness-v01-BN254G1_XMD:KECCAK-256_SVDW_RO_0x0000000000000000000000000000000000000000000000000000000000000089_",
    gasLimit: 100_000,
    maxFeePerGas: ethers.parseUnits("0.2", "gwei"),
    maxPriorityFeePerGas: ethers.parseUnits("0.2", "gwei"),
    gasBufferPercent: 100n,
    callbackGasLimitDefault: 1_000_000n,
    gasMultiplierDefault: 10n,
}

export const AVALANCHE_C_CHAIN: NetworkConfig = {
    name: "avalanche_c_chain",
    chainId: 43114n,
    contractAddress: "0xf4e080Db4765C856c0af43e4A8C4e31aA3b48779",
    dst: "dcipher-randomness-v01-BN254G1_XMD:KECCAK-256_SVDW_RO_0x000000000000000000000000000000000000000000000000000000000000a86a_",
    gasLimit: 100_000,
    maxFeePerGas: ethers.parseUnits("0.2", "gwei"),
    maxPriorityFeePerGas: ethers.parseUnits("0.2", "gwei"),
    gasBufferPercent: 100n,
    callbackGasLimitDefault: 1_000_000n,
    gasMultiplierDefault: 10n,
}

export const OPTIMISM_SEPOLIA: NetworkConfig = {
    name: "optimism_sepolia",
    chainId: 11155420n,
    contractAddress: "0xf4e080Db4765C856c0af43e4A8C4e31aA3b48779",
    dst: "dcipher-randomness-v01-BN254G1_XMD:KECCAK-256_SVDW_RO_0x0000000000000000000000000000000000000000000000000000000000aa37dc_",
    gasLimit: 100_000,
    maxFeePerGas: ethers.parseUnits("0.2", "gwei"),
    maxPriorityFeePerGas: ethers.parseUnits("0.2", "gwei"),
    gasBufferPercent: 100n,
    callbackGasLimitDefault: 1_000_000n,
    gasMultiplierDefault: 10n,
}

export const ARBITRUM_SEPOLIA: NetworkConfig = {
    name: "arbitrum_sepolia",
    chainId: 421614n,
    contractAddress: "0xf4e080Db4765C856c0af43e4A8C4e31aA3b48779",
    dst: "dcipher-randomness-v01-BN254G1_XMD:KECCAK-256_SVDW_RO_0x0000000000000000000000000000000000000000000000000000000000066eee_",
    gasLimit: 100_000,
    maxFeePerGas: ethers.parseUnits("0.2", "gwei"),
    maxPriorityFeePerGas: ethers.parseUnits("0.2", "gwei"),
    gasBufferPercent: 100n,
    callbackGasLimitDefault: 1_000_000n,
    gasMultiplierDefault: 10n,
}

export const SEI_TESTNET: NetworkConfig = {
    name: "sei_testnet",
    chainId: 1328n,
    contractAddress: "0xf4e080Db4765C856c0af43e4A8C4e31aA3b48779",
    dst: "dcipher-randomness-v01-BN254G1_XMD:KECCAK-256_SVDW_RO_0x0000000000000000000000000000000000000000000000000000000000000530_",
    gasLimit: 100_000,
    maxFeePerGas: ethers.parseUnits("0.2", "gwei"),
    maxPriorityFeePerGas: ethers.parseUnits("0.2", "gwei"),
    gasBufferPercent: 100n,
    callbackGasLimitDefault: 1_000_000n,
    gasMultiplierDefault: 10n,
}

export const SUPPORTED_TESTNETS = [FILECOIN_CALIBNET, BASE_SEPOLIA, AVALANCHE_C_CHAIN, OPTIMISM_SEPOLIA, ARBITRUM_SEPOLIA, SEI_TESTNET]
export const SUPPORTED_MAINNETS = [FILECOIN_MAINNET, POLYGON_POS]

export function configForChainId(chainId: bigint | number | string): NetworkConfig {
    chainId = BigInt(chainId)

    for (const chain of [...SUPPORTED_MAINNETS, ...SUPPORTED_TESTNETS]) {
        if (chain.chainId === chainId) {
            return chain
        }
    }
    throw new Error(`no chain config found for chainId: ${chainId}`)
}
