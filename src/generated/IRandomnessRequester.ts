/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumberish,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedListener,
  TypedContractMethod,
} from "./common";

export declare namespace TypesLib {
  export type RandomnessRequestStruct = {
    requestID: BigNumberish;
    nonce: BigNumberish;
    callback: AddressLike;
  };

  export type RandomnessRequestStructOutput = [
    requestID: bigint,
    nonce: bigint,
    callback: string
  ] & { requestID: bigint; nonce: bigint; callback: string };
}

export interface IRandomnessRequesterInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "getAllRequests"
      | "getRequest"
      | "messageFrom"
      | "requestRandomness"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "getAllRequests",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getRequest",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "messageFrom",
    values: [TypesLib.RandomnessRequestStruct]
  ): string;
  encodeFunctionData(
    functionFragment: "requestRandomness",
    values?: undefined
  ): string;

  decodeFunctionResult(
    functionFragment: "getAllRequests",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getRequest", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "messageFrom",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "requestRandomness",
    data: BytesLike
  ): Result;
}

export interface IRandomnessRequester extends BaseContract {
  connect(runner?: ContractRunner | null): IRandomnessRequester;
  waitForDeployment(): Promise<this>;

  interface: IRandomnessRequesterInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  getAllRequests: TypedContractMethod<
    [],
    [TypesLib.RandomnessRequestStructOutput[]],
    "view"
  >;

  getRequest: TypedContractMethod<
    [requestId: BigNumberish],
    [TypesLib.RandomnessRequestStructOutput],
    "view"
  >;

  messageFrom: TypedContractMethod<
    [r: TypesLib.RandomnessRequestStruct],
    [string],
    "view"
  >;

  requestRandomness: TypedContractMethod<[], [bigint], "nonpayable">;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "getAllRequests"
  ): TypedContractMethod<
    [],
    [TypesLib.RandomnessRequestStructOutput[]],
    "view"
  >;
  getFunction(
    nameOrSignature: "getRequest"
  ): TypedContractMethod<
    [requestId: BigNumberish],
    [TypesLib.RandomnessRequestStructOutput],
    "view"
  >;
  getFunction(
    nameOrSignature: "messageFrom"
  ): TypedContractMethod<
    [r: TypesLib.RandomnessRequestStruct],
    [string],
    "view"
  >;
  getFunction(
    nameOrSignature: "requestRandomness"
  ): TypedContractMethod<[], [bigint], "nonpayable">;

  filters: {};
}
