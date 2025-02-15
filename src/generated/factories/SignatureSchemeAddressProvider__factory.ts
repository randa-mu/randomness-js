/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type {
  Signer,
  AddressLike,
  ContractDeployTransaction,
  ContractRunner,
} from "ethers";
import type { NonPayableOverrides } from "../common";
import type {
  SignatureSchemeAddressProvider,
  SignatureSchemeAddressProviderInterface,
} from "../SignatureSchemeAddressProvider";

const _abi = [
  {
    type: "constructor",
    inputs: [
      {
        name: "owner",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "ADMIN_ROLE",
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
  {
    type: "function",
    name: "DEFAULT_ADMIN_ROLE",
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
  {
    type: "function",
    name: "getRoleAdmin",
    inputs: [
      {
        name: "role",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    outputs: [
      {
        name: "",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getSignatureSchemeAddress",
    inputs: [
      {
        name: "schemeID",
        type: "string",
        internalType: "string",
      },
    ],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "grantRole",
    inputs: [
      {
        name: "role",
        type: "bytes32",
        internalType: "bytes32",
      },
      {
        name: "account",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "hasRole",
    inputs: [
      {
        name: "role",
        type: "bytes32",
        internalType: "bytes32",
      },
      {
        name: "account",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "bool",
        internalType: "bool",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "isSupportedScheme",
    inputs: [
      {
        name: "schemeID",
        type: "string",
        internalType: "string",
      },
    ],
    outputs: [
      {
        name: "",
        type: "bool",
        internalType: "bool",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "renounceRole",
    inputs: [
      {
        name: "role",
        type: "bytes32",
        internalType: "bytes32",
      },
      {
        name: "callerConfirmation",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "revokeRole",
    inputs: [
      {
        name: "role",
        type: "bytes32",
        internalType: "bytes32",
      },
      {
        name: "account",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "supportsInterface",
    inputs: [
      {
        name: "interfaceId",
        type: "bytes4",
        internalType: "bytes4",
      },
    ],
    outputs: [
      {
        name: "",
        type: "bool",
        internalType: "bool",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "updateSignatureScheme",
    inputs: [
      {
        name: "schemeID",
        type: "string",
        internalType: "string",
      },
      {
        name: "schemeAddress",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    name: "NewSignatureSchemeAddressAdded",
    inputs: [
      {
        name: "schemeID",
        type: "string",
        indexed: true,
        internalType: "string",
      },
      {
        name: "schemeAddress",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "addedAt",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "RoleAdminChanged",
    inputs: [
      {
        name: "role",
        type: "bytes32",
        indexed: true,
        internalType: "bytes32",
      },
      {
        name: "previousAdminRole",
        type: "bytes32",
        indexed: true,
        internalType: "bytes32",
      },
      {
        name: "newAdminRole",
        type: "bytes32",
        indexed: true,
        internalType: "bytes32",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "RoleGranted",
    inputs: [
      {
        name: "role",
        type: "bytes32",
        indexed: true,
        internalType: "bytes32",
      },
      {
        name: "account",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "sender",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "RoleRevoked",
    inputs: [
      {
        name: "role",
        type: "bytes32",
        indexed: true,
        internalType: "bytes32",
      },
      {
        name: "account",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "sender",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "error",
    name: "AccessControlBadConfirmation",
    inputs: [],
  },
  {
    type: "error",
    name: "AccessControlUnauthorizedAccount",
    inputs: [
      {
        name: "account",
        type: "address",
        internalType: "address",
      },
      {
        name: "neededRole",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
  },
] as const;

const _bytecode =
  "0x608060405234801561000f575f80fd5b50604051610bd9380380610bd983398101604081905261002e916101a7565b6001600160a01b03811661003f5750335b6100495f826100fe565b61008e5760405162461bcd60e51b815260206004820152601160248201527011dc985b9d081c9bdb194819985a5b1959607a1b60448201526064015b60405180910390fd5b6100b87fa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c21775826100fe565b6100f85760405162461bcd60e51b815260206004820152601160248201527011dc985b9d081c9bdb194819985a5b1959607a1b6044820152606401610085565b506101d4565b5f828152602081815260408083206001600160a01b038516845290915281205460ff1661019e575f838152602081815260408083206001600160a01b03861684529091529020805460ff191660011790556101563390565b6001600160a01b0316826001600160a01b0316847f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45060016101a1565b505f5b92915050565b5f602082840312156101b7575f80fd5b81516001600160a01b03811681146101cd575f80fd5b9392505050565b6109f8806101e15f395ff3fe608060405234801561000f575f80fd5b50600436106100c4575f3560e01c80635bb09cf81161007d578063a217fddf11610058578063a217fddf146101fd578063bab867da14610204578063d547741f14610217575f80fd5b80635bb09cf81461015b57806375b238fc1461019357806391d14854146101ba575f80fd5b80632f2ff15d116100ad5780632f2ff15d146101205780632fc9fa331461013557806336568abe14610148575f80fd5b806301ffc9a7146100c8578063248a9ca3146100f0575b5f80fd5b6100db6100d6366004610830565b61022a565b60405190151581526020015b60405180910390f35b6101126100fe366004610876565b5f9081526020819052604090206001015490565b6040519081526020016100e7565b61013361012e3660046108b5565b6102c2565b005b6100db610143366004610924565b6102ec565b6101336101563660046108b5565b610346565b61016e610169366004610924565b6103a4565b60405173ffffffffffffffffffffffffffffffffffffffff90911681526020016100e7565b6101127fa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c2177581565b6100db6101c83660046108b5565b5f9182526020828152604080842073ffffffffffffffffffffffffffffffffffffffff93909316845291905290205460ff1690565b6101125f81565b610133610212366004610963565b6103e5565b6101336102253660046108b5565b6105c4565b5f7fffffffff0000000000000000000000000000000000000000000000000000000082167f7965db0b0000000000000000000000000000000000000000000000000000000014806102bc57507f01ffc9a7000000000000000000000000000000000000000000000000000000007fffffffff000000000000000000000000000000000000000000000000000000008316145b92915050565b5f828152602081905260409020600101546102dc816105e8565b6102e683836105f5565b50505050565b5f8073ffffffffffffffffffffffffffffffffffffffff16600184846040516103169291906109b3565b9081526040519081900360200190205473ffffffffffffffffffffffffffffffffffffffff161415905092915050565b73ffffffffffffffffffffffffffffffffffffffff81163314610395576040517f6697b23200000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b61039f82826106ee565b505050565b5f600183836040516103b79291906109b3565b9081526040519081900360200190205473ffffffffffffffffffffffffffffffffffffffff16905092915050565b61040e7fa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c217756105e8565b73ffffffffffffffffffffffffffffffffffffffff8116158015610447575073ffffffffffffffffffffffffffffffffffffffff81163b155b156104d9576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602a60248201527f496e76616c696420636f6e7472616374206164647265737320666f722073636860448201527f656d65416464726573730000000000000000000000000000000000000000000060648201526084015b60405180910390fd5b80600184846040516104ec9291906109b3565b908152604051908190036020018120805473ffffffffffffffffffffffffffffffffffffffff939093167fffffffffffffffffffffffff00000000000000000000000000000000000000009093169290921790915560019061055190859085906109b3565b9081526040519081900360200181205473ffffffffffffffffffffffffffffffffffffffff169061058590859085906109b3565b604051908190038120428252907f0a1cd6a1e0a7b200d28ead555f3cee96e0d2def049535fbcfdc2926bc4cec5049060200160405180910390a3505050565b5f828152602081905260409020600101546105de816105e8565b6102e683836106ee565b6105f281336107a7565b50565b5f8281526020818152604080832073ffffffffffffffffffffffffffffffffffffffff8516845290915281205460ff166106e7575f8381526020818152604080832073ffffffffffffffffffffffffffffffffffffffff86168452909152902080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff001660011790556106853390565b73ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16847f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45060016102bc565b505f6102bc565b5f8281526020818152604080832073ffffffffffffffffffffffffffffffffffffffff8516845290915281205460ff16156106e7575f8381526020818152604080832073ffffffffffffffffffffffffffffffffffffffff8616808552925280832080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0016905551339286917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a45060016102bc565b5f8281526020818152604080832073ffffffffffffffffffffffffffffffffffffffff8516845290915290205460ff1661082c576040517fe2517d3f00000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff82166004820152602481018390526044016104d0565b5050565b5f60208284031215610840575f80fd5b81357fffffffff000000000000000000000000000000000000000000000000000000008116811461086f575f80fd5b9392505050565b5f60208284031215610886575f80fd5b5035919050565b803573ffffffffffffffffffffffffffffffffffffffff811681146108b0575f80fd5b919050565b5f80604083850312156108c6575f80fd5b823591506108d66020840161088d565b90509250929050565b5f8083601f8401126108ef575f80fd5b50813567ffffffffffffffff811115610906575f80fd5b60208301915083602082850101111561091d575f80fd5b9250929050565b5f8060208385031215610935575f80fd5b823567ffffffffffffffff81111561094b575f80fd5b610957858286016108df565b90969095509350505050565b5f805f60408486031215610975575f80fd5b833567ffffffffffffffff81111561098b575f80fd5b610997868287016108df565b90945092506109aa90506020850161088d565b90509250925092565b818382375f910190815291905056fea2646970667358221220f1ada9f05bd94b957a6160b3f30570f7bafbe7bc7da27d6331ffd707b71c46fd64736f6c63430008180033";

type SignatureSchemeAddressProviderConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: SignatureSchemeAddressProviderConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class SignatureSchemeAddressProvider__factory extends ContractFactory {
  constructor(...args: SignatureSchemeAddressProviderConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    owner: AddressLike,
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(owner, overrides || {});
  }
  override deploy(
    owner: AddressLike,
    overrides?: NonPayableOverrides & { from?: string }
  ) {
    return super.deploy(owner, overrides || {}) as Promise<
      SignatureSchemeAddressProvider & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(
    runner: ContractRunner | null
  ): SignatureSchemeAddressProvider__factory {
    return super.connect(runner) as SignatureSchemeAddressProvider__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): SignatureSchemeAddressProviderInterface {
    return new Interface(_abi) as SignatureSchemeAddressProviderInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): SignatureSchemeAddressProvider {
    return new Contract(
      address,
      _abi,
      runner
    ) as unknown as SignatureSchemeAddressProvider;
  }
}
