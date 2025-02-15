/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Interface, type ContractRunner } from "ethers";
import type {
  IERC1822Proxiable,
  IERC1822ProxiableInterface,
} from "../../draft-IERC1822.sol/IERC1822Proxiable";

const _abi = [
  {
    type: "function",
    name: "proxiableUUID",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    stateMutability: "view",
  },
] as const;

export class IERC1822Proxiable__factory {
  static readonly abi = _abi;
  static createInterface(): IERC1822ProxiableInterface {
    return new Interface(_abi) as IERC1822ProxiableInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): IERC1822Proxiable {
    return new Contract(address, _abi, runner) as unknown as IERC1822Proxiable;
  }
}
