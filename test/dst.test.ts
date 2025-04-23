import {describe, it, expect} from "@jest/globals"
import {createBlsDst} from "../src/index"

describe("creating a BLS DST", () => {
    it("should blow up on 0 chainID", () => {
        expect(() => createBlsDst(0n)).toThrowError()
    })
    it("should blow up on negative chainID", () => {
        expect(() => createBlsDst(-1n)).toThrowError()
    })
    it("should correctly format valid chainIDs to 32 bytes", () =>{
        expect(createBlsDst(1n)).toEqual("dcipher-randomness-v01-BN254G1_XMD:KECCAK-256_SVDW_RO_0x0000000000000000000000000000000000000000000000000000000000000001_")
    })
})
