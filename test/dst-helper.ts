import {encodeParams} from "../src/ethers-helpers"

export function createBlsDst(chainId: bigint): string {
    if (chainId <= 0n) {
        throw new Error("cannot create a BLS domain separator for an invalid chainId")
    }

    return `dcipher-randomness-v01-BN254G1_XMD:KECCAK-256_SVDW_RO_${encodeParams(["uint256"], [chainId])}_`
}