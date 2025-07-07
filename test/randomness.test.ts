import * as dotenv from "dotenv"
import { describe, it, expect, beforeAll } from "@jest/globals"
import { getBytes, JsonRpcProvider, NonceManager, Wallet, WebSocketProvider } from "ethers"
import { Randomness, RandomnessVerificationParameters } from "../src"
import { keccak_256 } from "@noble/hashes/sha3"

// filecoin calibnet might take forever
const TEST_TIMEOUT = 30_000
const FILECOIN_TEST_TIMEOUT = 200_000

describe("randomness", () => {
    beforeAll(() => {
        dotenv.config()
    })

    it("nonsense input shouldn't verify", async () => {
        const rpc = createProvider(process.env.BASE_RPC_URL || "")
        const wallet = new NonceManager(new Wallet(process.env.BASE_PRIVATE_KEY || "", rpc))
        const randomnessClient = Randomness.createBaseSepolia(wallet)

        const signature = "0xdeadbeefdeadbeefdeadbeefdeadbeefdead"
        const randomness = keccak_256(getBytes(signature))

        const result = await randomnessClient.verify({
            requestID: 1n,
            nonce: 1n,
            randomness,
            signature,
        }, { shouldBlowUp: false })

        expect(result).toBeFalsy()
    })

    it("should verify if randomness and signature are created with the correct DCIPHER_PUBLIC_KEY", async () => {
        const rpc = createProvider(process.env.BASE_RPC_URL || "")
        const wallet = new NonceManager(new Wallet(process.env.BASE_PRIVATE_KEY || "", rpc))

        const randomness = Randomness.createBaseSepolia(wallet)
        const verificationParameters: RandomnessVerificationParameters = {
            requestID: 25n,
            nonce: 25n,
            randomness: '0x346009d2228e596c5876e466a172dcb953e79a6fe884f2ebcd7cce7089fc1e2e',
            signature: '0x11d68386b988522ac91c29e2e65a97e75f45bedd62f1ae568d410658f4d108940aff191aea3b97b5f2f1de0d03c577fcf21743c8ba14218159ea1e0597c8ab60'
        }
        expect(await randomness.verify(verificationParameters)).toBeTruthy();
    })

    it("should return non-zero request price to cover BLS operations when callbackGasLimit is zero", async () => {
        const rpc = createProvider(process.env.BASE_RPC_URL || "")
        const wallet = new NonceManager(new Wallet(process.env.BASE_PRIVATE_KEY || "", rpc))
        const randomness = Randomness.createBaseSepolia(wallet)
        const callbackGasLimit = 0n;
        const [estimatedRequestPrice, ] = await randomness.calculateRequestPriceNative(callbackGasLimit);
        expect(estimatedRequestPrice).toBeGreaterThan(0n);
    }, TEST_TIMEOUT)

    it("can be requested from a base sepolia and verified", async () => {
        const rpc = createProvider("http://localhost:1337")
        const wallet = new NonceManager(new Wallet(process.env.BASE_PRIVATE_KEY || "", rpc))

        const randomness = Randomness.createBaseSepolia(wallet)
        expect(randomness).not.toEqual(null)

        const response = await randomness.requestRandomness({ callbackGasLimit: 100_000n })
        expect(await randomness.verify(response)).toBeTruthy()

        rpc.destroy()
    }, TEST_TIMEOUT)

    it("can be requested from polygon pos and verified", async () => {
        const rpc = createProvider(process.env.POLYGON_RPC_URL || "")
        const wallet = new NonceManager(new Wallet(process.env.POLYGON_PRIVATE_KEY || "", rpc))

        const randomness = Randomness.createPolygonPos(wallet)
        expect(randomness).not.toEqual(null)

        const response = await randomness.requestRandomness({ callbackGasLimit: 100_000n })
        expect(await randomness.verify(response)).toBeTruthy()

        rpc.destroy()
    }, TEST_TIMEOUT)

    it("can be requested from filecoin testnet and verified", async () => {
        const rpc = createProvider(process.env.FILECOIN_RPC_URL || "")
        const wallet = new NonceManager(new Wallet(process.env.FILECOIN_PRIVATE_KEY || "", rpc))

        const randomness = Randomness.createFilecoinCalibnet(wallet)
        expect(randomness).not.toEqual(null)

        const response = await randomness.requestRandomness({ callbackGasLimit: 444_000_000n, timeoutMs: FILECOIN_TEST_TIMEOUT })
        expect(await randomness.verify(response)).toBeTruthy()

        rpc.destroy()
    }, FILECOIN_TEST_TIMEOUT)

    // skipped because it needs real funds
    it.skip("can be requested from filecoin mainnet and verified", async () => {
        const rpc = createProvider(process.env.FILECOIN_MAINNET_RPC_URL || "")
        const wallet = new NonceManager(new Wallet(process.env.FILECOIN_MAINNET_PRIVATE_KEY || "", rpc))

        const randomness = Randomness.createFilecoinMainnet(wallet)
        expect(randomness).not.toEqual(null)
    
        const response = await randomness.requestRandomness({ callbackGasLimit: 100_000n })
        expect(await randomness.verify(response)).toBeTruthy()
    
        rpc.destroy()
    }, FILECOIN_TEST_TIMEOUT)

    // skipped because it needs real funds
    it.skip("can be requested from avalanche c chain and verified", async () => {
        const rpc = createProvider(process.env.AVALANCHE_C_CHAIN_RPC_URL || "")
        const wallet = new NonceManager(new Wallet(process.env.AVALANCHE_C_CHAIN_PRIVATE_KEY || "", rpc))

        const randomness = Randomness.createAvalancheCChain(wallet)
        expect(randomness).not.toEqual(null)

        const response = await randomness.requestRandomness({ confirmations: 1, timeoutMs: TEST_TIMEOUT, callbackGasLimit: 100_000n })
        expect(await randomness.verify(response)).toBeTruthy()

        rpc.destroy()
    }, TEST_TIMEOUT)

    it("can be requested from optimism sepolia and verified", async () => {
        const rpc = createProvider(process.env.OPTIMISM_SEPOLIA_RPC_URL || "")
        const wallet = new NonceManager(new Wallet(process.env.OPTIMISM_SEPOLIA_PRIVATE_KEY || "", rpc))

        const randomness = Randomness.createOptimismSepolia(wallet)
        expect(randomness).not.toEqual(null)

        const response = await randomness.requestRandomness({ confirmations: 1, timeoutMs: TEST_TIMEOUT, callbackGasLimit: 100_000n })
        expect(await randomness.verify(response)).toBeTruthy()

        rpc.destroy()
    }, TEST_TIMEOUT)

    it("can be requested from arbitrum sepolia and verified", async () => {

        const rpc = createProvider(process.env.ARBITRUM_SEPOLIA_RPC_URL || "")
        const wallet = new NonceManager(new Wallet(process.env.ARBITRUM_SEPOLIA_PRIVATE_KEY || "", rpc))

        const randomness = Randomness.createArbitrumSepolia(wallet)
        expect(randomness).not.toEqual(null)

        const response = await randomness.requestRandomness({ confirmations: 1, timeoutMs: FILECOIN_TEST_TIMEOUT, callbackGasLimit: 100_000n })
        expect(await randomness.verify(response)).toBeTruthy()

        rpc.destroy()
    }, TEST_TIMEOUT)

    it("can be requested from sei testnet and verified", async () => {
        const rpc = createProvider(process.env.SEI_TESTNET_RPC_URL || "")
        const wallet = new NonceManager(new Wallet(process.env.SEI_TESTNET_PRIVATE_KEY || "", rpc))

        const randomness = Randomness.createSeiTestnet(wallet)
        expect(randomness).not.toEqual(null)

        const response = await randomness.requestRandomness({ confirmations: 1, timeoutMs: TEST_TIMEOUT, callbackGasLimit: 100_000n })
        expect(await randomness.verify(response)).toBeTruthy()

        rpc.destroy()
    }, TEST_TIMEOUT)
})

function createProvider(url: string): JsonRpcProvider | WebSocketProvider {
    if (url.startsWith("http")) {
        return new JsonRpcProvider(url, undefined, { pollingInterval: 1000 })
    }
    if (url.startsWith("ws")) {
        return new WebSocketProvider(url)
    }
    throw new Error(`provider cannot be created for the protocol in ${url}`)
}
