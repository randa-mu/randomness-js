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

    it("can fetch and verify randomness request data of existing request id from filecoin testnet", async () => {
        const rpc = new JsonRpcProvider("https://filecoin-calibration.chainup.net/rpc/v1")
        const wallet = new NonceManager(new Wallet("0xa9ab07494ce8b1731cef05524c0890ce5dba8160d1e721c4ad6894cb99a71d70", rpc))
        const randomness = new Randomness(wallet, "0x9c789bc7F2B5c6619Be1572A39F2C3d6f33001dC")
        
        const randomnessVerificationParameters = await randomness.fetchRandomnessRequest(2n)
        console.log(randomnessVerificationParameters)
        expect(randomnessVerificationParameters.nonce).toBeGreaterThan(0)
        expect(randomnessVerificationParameters.signature).not.toEqual("0x")
        
        expect(await randomness.verify(randomnessVerificationParameters)).toBe(true)
    })

    it("verification should fail for randomness request data of non-existing request id from filecoin testnet", async () => {
        const rpc = new JsonRpcProvider("https://filecoin-calibration.chainup.net/rpc/v1")
        const wallet = new NonceManager(new Wallet("0xa9ab07494ce8b1731cef05524c0890ce5dba8160d1e721c4ad6894cb99a71d70", rpc))
        const randomness = new Randomness(wallet, "0x9c789bc7F2B5c6619Be1572A39F2C3d6f33001dC")
        
        const randomnessVerificationParameters = await randomness.fetchRandomnessRequest(2000n)
        console.log(randomnessVerificationParameters)
        expect(randomnessVerificationParameters.nonce).toBe(0n)
        expect(randomnessVerificationParameters.signature).toEqual("0x")
        
        await expect(randomness.verify(randomnessVerificationParameters)).rejects.toThrow("randomness did not match the signature provided");
    })
})