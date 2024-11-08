import {describe, it, expect} from "@jest/globals"
import {JsonRpcProvider, NonceManager, Wallet} from "ethers"
import {Randomness} from "../src"

describe("randomness", () => {
    it("class can be constructed", async () => {
        const rpc = new JsonRpcProvider("https://furnace.firepit.network")
        const wallet = new NonceManager(new Wallet("0x5cb3c5ba25c91d84ef5dabf4152e909795074f9958b091b010644cb9c30e3203", rpc))
        const randomness = new Randomness(wallet)
        expect(randomness).not.toEqual(null)
    })
})