import * as dotenv from "dotenv"
import {describe, it, expect, beforeAll} from "@jest/globals"
import {JsonRpcProvider, NonceManager, Wallet, WebSocketProvider} from "ethers"
import {FILECOIN_CALIBNET_CONTRACT_ADDRESS, FURNACE_TESTNET_CONTRACT_ADDRESS, Randomness} from "../src"

// filecoin calibnet might take forever
const TEST_TIMEOUT = 200_000
describe("randomness", () => {
    beforeAll(() => {
        dotenv.config()
    })

    it("can be requested from filecoin testnet and verified", async () => {
        const rpc = createProvider(process.env.FILECOIN_RPC_URL || "")
        const wallet = new NonceManager(new Wallet(process.env.FILECOIN_PRIVATE_KEY || "", rpc))

        const randomness = new Randomness(wallet, FILECOIN_CALIBNET_CONTRACT_ADDRESS)
        expect(randomness).not.toEqual(null)

        const response = await randomness.requestRandomness(1, TEST_TIMEOUT)
        await randomness.verify(response)

        rpc.destroy()
    }, TEST_TIMEOUT)

    it("can be requested from a furnace testnet and verified", async () => {
        const rpc = createProvider(process.env.FURNACE_RPC_URL || "")
        const wallet = new NonceManager(new Wallet(process.env.FURNACE_PRIVATE_KEY || "", rpc))

        const randomness = new Randomness(wallet, FURNACE_TESTNET_CONTRACT_ADDRESS)
        expect(randomness).not.toEqual(null)

        const response = await randomness.requestRandomness(1, TEST_TIMEOUT)
        console.log("randomness requested")
        await randomness.verify(response)

        rpc.destroy()
    }, TEST_TIMEOUT)

})

function createProvider(url: string): JsonRpcProvider | WebSocketProvider {
    if (url.startsWith("http")) {
        return new JsonRpcProvider(url, undefined, { pollingInterval: 100})
    }
    if (url.startsWith("ws")) {
        return  new WebSocketProvider(url)
    }
    throw new Error(`provider cannot be created for the protocol in ${url}`)
}
