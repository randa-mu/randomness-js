import {FeeData} from "ethers"


export function getGasPrice(feeData: FeeData, gasPriceMultiplier: bigint): bigint {
    // feeData.gasPrice: Legacy flat gas price (used on non-EIP-1559 chains like Filecoin or older EVMs)
    if (feeData.gasPrice != null) {
        return feeData.gasPrice
    }

    // if gasPrice wasn't set, we can assume EIP-1559 pricing

    // feeData.maxFeePerGas: Max total gas price we're willing to pay
    const maxFeePerGas = feeData.maxFeePerGas ?? 0n;

    // feeData.maxPriorityFeePerGas: Tip to incentivize validators (goes directly to them)
    // 0 is allowed in the spec but discouraged in reality
    const maxPriorityFeePerGas = feeData.maxPriorityFeePerGas ?? 0n;
    if (maxPriorityFeePerGas === 0n) {
        console.warn("priority fee was empty - this will probably lead to a reeeeeally long confirmation time")
    }

    if (maxFeePerGas === 0n) {
        throw new Error("the RPC provided unexpected gas results: neither parameters for legacy nor EIP-1559 gas pricing were provided");
    }

    // (base + priority) is used in EIP-1559
    return (maxFeePerGas + maxPriorityFeePerGas) * gasPriceMultiplier;
}
