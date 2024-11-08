// extracts an event log of a given type from a transaction receipt that matches the address provided
import {AbiCoder, EventFragment, Interface, ParamType, Result, TransactionReceipt} from "ethers"

export function extractLogs<T extends Interface, E extends EventFragment>(iface: T, receipt: TransactionReceipt, contractAddress: string, event: E): Array<Result> {
    return receipt.logs
        .filter(log => log.address.toLowerCase() === contractAddress.toLowerCase())
        .map(log => iface.decodeEventLog(event, log.data, log.topics))
}

// returns the first instance of an event log from a transaction receipt that matches the address provided
export function extractSingleLog<T extends Interface, E extends EventFragment>(iface: T, receipt: TransactionReceipt, contractAddress: string, event: E): Result {
    const events = extractLogs(iface, receipt, contractAddress, event)
    if (events.length === 0) {
        throw Error(`contract at ${contractAddress} didn't emit the ${event.name} event`)
    }
    return events[0]
}


// any because that's how naughty ethers wants it
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const encodeParams = (dataTypes: readonly ParamType[] | readonly string[], data: readonly any[]): string => {
    const abiCoder = AbiCoder.defaultAbiCoder()
    return abiCoder.encode(dataTypes, data)
}
