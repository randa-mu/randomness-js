/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Interface, type ContractRunner } from "ethers";
import type {
  IRandomnessRequester,
  IRandomnessRequesterInterface,
} from "../IRandomnessRequester";

const _abi = [
  {
    type: "function",
    name: "getAllRequests",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "tuple[]",
        internalType: "struct TypesLib.RandomnessRequest[]",
        components: [
          {
            name: "requestID",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "nonce",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "callback",
            type: "address",
            internalType: "address",
          },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getRequest",
    inputs: [
      {
        name: "requestId",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct TypesLib.RandomnessRequest",
        components: [
          {
            name: "requestID",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "nonce",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "callback",
            type: "address",
            internalType: "address",
          },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "messageFrom",
    inputs: [
      {
        name: "r",
        type: "tuple",
        internalType: "struct TypesLib.RandomnessRequest",
        components: [
          {
            name: "requestID",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "nonce",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "callback",
            type: "address",
            internalType: "address",
          },
        ],
      },
    ],
    outputs: [
      {
        name: "",
        type: "bytes",
        internalType: "bytes",
      },
    ],
    stateMutability: "pure",
  },
  {
    type: "function",
    name: "requestRandomness",
    inputs: [],
    outputs: [
      {
        name: "requestID",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "nonpayable",
  },
] as const;

export class IRandomnessRequester__factory {
  static readonly abi = _abi;
  static createInterface(): IRandomnessRequesterInterface {
    return new Interface(_abi) as IRandomnessRequesterInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): IRandomnessRequester {
    return new Contract(address, _abi, runner) as unknown as IRandomnessRequester;
  }
}