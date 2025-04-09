import * as dotenv from "dotenv"
import {describe, it, expect, beforeAll} from "@jest/globals"
import {NonceManager, Wallet, WebSocketProvider} from "ethers"
import {FILECOIN_CALIBNET_CONTRACT_ADDRESS, Randomness} from "../src"

// filecoin calibnet might take forever
const TEST_TIMEOUT = 200_000
describe("randomness", () => {
    beforeAll(() => {
        dotenv.config()
    })
    it("can be requested from a testnet and verified", async () => {
        const rpc = new WebSocketProvider(process.env.NETWORK_RPC_URL || "")
        const wallet = new NonceManager(new Wallet(process.env.NETWORK_PRIVATE_KEY || "", rpc))
        const randomness = new Randomness(wallet, FILECOIN_CALIBNET_CONTRACT_ADDRESS)
        expect(randomness).not.toEqual(null)

        const response = await randomness.requestRandomness(1, TEST_TIMEOUT)
        await randomness.verify(response)
    }, TEST_TIMEOUT)

})
