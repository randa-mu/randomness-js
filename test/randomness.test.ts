import * as dotenv from "dotenv"
import {describe, it, expect, beforeAll} from "@jest/globals"
import {BytesLike, getBytes, JsonRpcProvider, NonceManager, Wallet, WebSocketProvider} from "ethers"
import {Randomness} from "../src"
import {keccak_256} from "@noble/hashes/sha3"

// filecoin calibnet might take forever
const TEST_TIMEOUT = 200_000
describe("randomness", () => {
    beforeAll(() => {
        dotenv.config()
    })

    it("nonsense input shouldn't verify", async () => {
        const rpc = createProvider(process.env.FURNACE_RPC_URL || "")
        const wallet = new NonceManager(new Wallet(process.env.FURNACE_PRIVATE_KEY || "", rpc))
        const randomnessClient = Randomness.createFurnace(wallet)

        const signature = "0xdeadbeefdeadbeefdeadbeefdeadbeefdead"
        const randomness = keccak_256(getBytes(signature))

        const result = await randomnessClient.verify({
            requestID: 1n,
            nonce: 1n,
            randomness,
            signature,
        })

        expect(result).toBeFalsy()
    })

    it("can be requested from a furnace testnet and verified", async () => {
        const rpc = createProvider(process.env.FURNACE_RPC_URL || "")
        const wallet = new NonceManager(new Wallet(process.env.FURNACE_PRIVATE_KEY || "", rpc))

        const randomness = Randomness.createFurnace(wallet)
        expect(randomness).not.toEqual(null)

        const response = await randomness.requestRandomness(1, TEST_TIMEOUT)
        console.log("randomness requested")
        expect(await randomness.verify(response)).toBeTruthy()

        rpc.destroy()
    }, TEST_TIMEOUT)

    it("can be requested from a base sepolia and verified", async () => {
        const rpc = createProvider(process.env.BASE_RPC_URL || "")
        const wallet = new NonceManager(new Wallet(process.env.BASE_PRIVATE_KEY || "", rpc))

        const randomness = Randomness.createBaseSepolia(wallet)
        expect(randomness).not.toEqual(null)

        const response = await randomness.requestRandomness(1, TEST_TIMEOUT)
        console.log("randomness requested")
        expect(await randomness.verify(response)).toBeTruthy()

        rpc.destroy()
    }, TEST_TIMEOUT)

    it("can be requested from a polygon pos and verified", async () => {
        const rpc = createProvider(process.env.POLYGON_RPC_URL || "")
        const wallet = new NonceManager(new Wallet(process.env.POLYGON_PRIVATE_KEY || "", rpc))

        const randomness = Randomness.createPolygonPos(wallet)
        expect(randomness).not.toEqual(null)

        const response = await randomness.requestRandomness(1, TEST_TIMEOUT)
        console.log("randomness requested")
        expect(await randomness.verify(response)).toBeTruthy()

        rpc.destroy()
    }, TEST_TIMEOUT)

    it("can be requested from filecoin testnet and verified", async () => {
        const rpc = createProvider(process.env.FILECOIN_RPC_URL || "")
        const wallet = new NonceManager(new Wallet(process.env.FILECOIN_PRIVATE_KEY || "", rpc))

        const randomness = Randomness.createFilecoinCalibnet(wallet)
        expect(randomness).not.toEqual(null)

        const response = await randomness.requestRandomness(1, TEST_TIMEOUT)
        expect(await randomness.verify(response)).toBeTruthy()

        rpc.destroy()
    }, TEST_TIMEOUT)

})

function createProvider(url: string): JsonRpcProvider | WebSocketProvider {
    if (url.startsWith("http")) {
        return new JsonRpcProvider(url, undefined, {pollingInterval: 1000})
    }
    if (url.startsWith("ws")) {
        return new WebSocketProvider(url)
    }
    throw new Error(`provider cannot be created for the protocol in ${url}`)
}
