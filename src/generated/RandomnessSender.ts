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
  EventFragment,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedLogDescription,
  TypedListener,
  TypedContractMethod,
} from "./common";

export declare namespace TypesLib {
  export type RandomnessRequestStruct = {
    nonce: BigNumberish;
    callback: AddressLike;
  };

  export type RandomnessRequestStructOutput = [
    nonce: bigint,
    callback: string
  ] & { nonce: bigint; callback: string };
}

export interface RandomnessSenderInterface extends Interface {
  getFunction(
      nameOrSignature:
          | "DEFAULT_ADMIN_ROLE"
          | "DST"
          | "getAllRequests"
          | "getRequest"
          | "getRoleAdmin"
          | "grantRole"
          | "hasRole"
          | "isInFlight"
          | "messageFrom"
          | "nonce"
          | "receiveSignature"
          | "renounceRole"
          | "requestRandomness"
          | "revokeRole"
          | "schemeID"
          | "supportsInterface"
  ): FunctionFragment;

  getEvent(
      nameOrSignatureOrTopic:
          | "RandomnessCallbackFailed"
          | "RandomnessCallbackSuccess"
          | "RandomnessRequested"
          | "RoleAdminChanged"
          | "RoleGranted"
          | "RoleRevoked"
  ): EventFragment;

  encodeFunctionData(
      functionFragment: "DEFAULT_ADMIN_ROLE",
      values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "DST", values?: undefined): string;
  encodeFunctionData(
      functionFragment: "getAllRequests",
      values?: undefined
  ): string;
  encodeFunctionData(
      functionFragment: "getRequest",
      values: [BigNumberish]
  ): string;
  encodeFunctionData(
      functionFragment: "getRoleAdmin",
      values: [BytesLike]
  ): string;
  encodeFunctionData(
      functionFragment: "grantRole",
      values: [BytesLike, AddressLike]
  ): string;
  encodeFunctionData(
      functionFragment: "hasRole",
      values: [BytesLike, AddressLike]
  ): string;
  encodeFunctionData(
      functionFragment: "isInFlight",
      values: [BigNumberish]
  ): string;
  encodeFunctionData(
      functionFragment: "messageFrom",
      values: [TypesLib.RandomnessRequestStruct]
  ): string;
  encodeFunctionData(functionFragment: "nonce", values?: undefined): string;
  encodeFunctionData(
      functionFragment: "receiveSignature",
      values: [BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(
      functionFragment: "renounceRole",
      values: [BytesLike, AddressLike]
  ): string;
  encodeFunctionData(
      functionFragment: "requestRandomness",
      values?: undefined
  ): string;
  encodeFunctionData(
      functionFragment: "revokeRole",
      values: [BytesLike, AddressLike]
  ): string;
  encodeFunctionData(functionFragment: "schemeID", values?: undefined): string;
  encodeFunctionData(
      functionFragment: "supportsInterface",
      values: [BytesLike]
  ): string;

  decodeFunctionResult(
      functionFragment: "DEFAULT_ADMIN_ROLE",
      data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "DST", data: BytesLike): Result;
  decodeFunctionResult(
      functionFragment: "getAllRequests",
      data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getRequest", data: BytesLike): Result;
  decodeFunctionResult(
      functionFragment: "getRoleAdmin",
      data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "grantRole", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "hasRole", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "isInFlight", data: BytesLike): Result;
  decodeFunctionResult(
      functionFragment: "messageFrom",
      data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "nonce", data: BytesLike): Result;
  decodeFunctionResult(
      functionFragment: "receiveSignature",
      data: BytesLike
  ): Result;
  decodeFunctionResult(
      functionFragment: "renounceRole",
      data: BytesLike
  ): Result;
  decodeFunctionResult(
      functionFragment: "requestRandomness",
      data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "revokeRole", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "schemeID", data: BytesLike): Result;
  decodeFunctionResult(
      functionFragment: "supportsInterface",
      data: BytesLike
  ): Result;
}

export namespace RandomnessCallbackFailedEvent {
  export type InputTuple = [
    requestID: BigNumberish,
    randomness: BytesLike,
    signature: BytesLike
  ];
  export type OutputTuple = [
    requestID: bigint,
    randomness: string,
    signature: string
  ];
  export interface OutputObject {
    requestID: bigint;
    randomness: string;
    signature: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace RandomnessCallbackSuccessEvent {
  export type InputTuple = [
    requestID: BigNumberish,
    randomness: BytesLike,
    signature: BytesLike
  ];
  export type OutputTuple = [
    requestID: bigint,
    randomness: string,
    signature: string
  ];
  export interface OutputObject {
    requestID: bigint;
    randomness: string;
    signature: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace RandomnessRequestedEvent {
  export type InputTuple = [
    requestID: BigNumberish,
    nonce: BigNumberish,
    requester: AddressLike,
    requestedAt: BigNumberish
  ];
  export type OutputTuple = [
    requestID: bigint,
    nonce: bigint,
    requester: string,
    requestedAt: bigint
  ];
  export interface OutputObject {
    requestID: bigint;
    nonce: bigint;
    requester: string;
    requestedAt: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace RoleAdminChangedEvent {
  export type InputTuple = [
    role: BytesLike,
    previousAdminRole: BytesLike,
    newAdminRole: BytesLike
  ];
  export type OutputTuple = [
    role: string,
    previousAdminRole: string,
    newAdminRole: string
  ];
  export interface OutputObject {
    role: string;
    previousAdminRole: string;
    newAdminRole: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace RoleGrantedEvent {
  export type InputTuple = [
    role: BytesLike,
    account: AddressLike,
    sender: AddressLike
  ];
  export type OutputTuple = [role: string, account: string, sender: string];
  export interface OutputObject {
    role: string;
    account: string;
    sender: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace RoleRevokedEvent {
  export type InputTuple = [
    role: BytesLike,
    account: AddressLike,
    sender: AddressLike
  ];
  export type OutputTuple = [role: string, account: string, sender: string];
  export interface OutputObject {
    role: string;
    account: string;
    sender: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface RandomnessSender extends BaseContract {
  connect(runner?: ContractRunner | null): RandomnessSender;
  waitForDeployment(): Promise<this>;

  interface: RandomnessSenderInterface;

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

  DEFAULT_ADMIN_ROLE: TypedContractMethod<[], [string], "view">;

  DST: TypedContractMethod<[], [string], "view">;

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

  getRoleAdmin: TypedContractMethod<[role: BytesLike], [string], "view">;

  grantRole: TypedContractMethod<
      [role: BytesLike, account: AddressLike],
      [void],
      "nonpayable"
  >;

  hasRole: TypedContractMethod<
      [role: BytesLike, account: AddressLike],
      [boolean],
      "view"
  >;

  isInFlight: TypedContractMethod<[requestID: BigNumberish], [boolean], "view">;

  messageFrom: TypedContractMethod<
      [r: TypesLib.RandomnessRequestStruct],
      [string],
      "view"
  >;

  nonce: TypedContractMethod<[], [bigint], "view">;

  receiveSignature: TypedContractMethod<
      [requestID: BigNumberish, signature: BytesLike],
      [void],
      "nonpayable"
  >;

  renounceRole: TypedContractMethod<
      [role: BytesLike, callerConfirmation: AddressLike],
      [void],
      "nonpayable"
  >;

  requestRandomness: TypedContractMethod<[], [bigint], "nonpayable">;

  revokeRole: TypedContractMethod<
      [role: BytesLike, account: AddressLike],
      [void],
      "nonpayable"
  >;

  schemeID: TypedContractMethod<[], [string], "view">;

  supportsInterface: TypedContractMethod<
      [interfaceId: BytesLike],
      [boolean],
      "view"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
      key: string | FunctionFragment
  ): T;

  getFunction(
      nameOrSignature: "DEFAULT_ADMIN_ROLE"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
      nameOrSignature: "DST"
  ): TypedContractMethod<[], [string], "view">;
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
      nameOrSignature: "getRoleAdmin"
  ): TypedContractMethod<[role: BytesLike], [string], "view">;
  getFunction(
      nameOrSignature: "grantRole"
  ): TypedContractMethod<
      [role: BytesLike, account: AddressLike],
      [void],
      "nonpayable"
  >;
  getFunction(
      nameOrSignature: "hasRole"
  ): TypedContractMethod<
      [role: BytesLike, account: AddressLike],
      [boolean],
      "view"
  >;
  getFunction(
      nameOrSignature: "isInFlight"
  ): TypedContractMethod<[requestID: BigNumberish], [boolean], "view">;
  getFunction(
      nameOrSignature: "messageFrom"
  ): TypedContractMethod<
      [r: TypesLib.RandomnessRequestStruct],
      [string],
      "view"
  >;
  getFunction(
      nameOrSignature: "nonce"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
      nameOrSignature: "receiveSignature"
  ): TypedContractMethod<
      [requestID: BigNumberish, signature: BytesLike],
      [void],
      "nonpayable"
  >;
  getFunction(
      nameOrSignature: "renounceRole"
  ): TypedContractMethod<
      [role: BytesLike, callerConfirmation: AddressLike],
      [void],
      "nonpayable"
  >;
  getFunction(
      nameOrSignature: "requestRandomness"
  ): TypedContractMethod<[], [bigint], "nonpayable">;
  getFunction(
      nameOrSignature: "revokeRole"
  ): TypedContractMethod<
      [role: BytesLike, account: AddressLike],
      [void],
      "nonpayable"
  >;
  getFunction(
      nameOrSignature: "schemeID"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
      nameOrSignature: "supportsInterface"
  ): TypedContractMethod<[interfaceId: BytesLike], [boolean], "view">;

  getEvent(
      key: "RandomnessCallbackFailed"
  ): TypedContractEvent<
      RandomnessCallbackFailedEvent.InputTuple,
      RandomnessCallbackFailedEvent.OutputTuple,
      RandomnessCallbackFailedEvent.OutputObject
  >;
  getEvent(
      key: "RandomnessCallbackSuccess"
  ): TypedContractEvent<
      RandomnessCallbackSuccessEvent.InputTuple,
      RandomnessCallbackSuccessEvent.OutputTuple,
      RandomnessCallbackSuccessEvent.OutputObject
  >;
  getEvent(
      key: "RandomnessRequested"
  ): TypedContractEvent<
      RandomnessRequestedEvent.InputTuple,
      RandomnessRequestedEvent.OutputTuple,
      RandomnessRequestedEvent.OutputObject
  >;
  getEvent(
      key: "RoleAdminChanged"
  ): TypedContractEvent<
      RoleAdminChangedEvent.InputTuple,
      RoleAdminChangedEvent.OutputTuple,
      RoleAdminChangedEvent.OutputObject
  >;
  getEvent(
      key: "RoleGranted"
  ): TypedContractEvent<
      RoleGrantedEvent.InputTuple,
      RoleGrantedEvent.OutputTuple,
      RoleGrantedEvent.OutputObject
  >;
  getEvent(
      key: "RoleRevoked"
  ): TypedContractEvent<
      RoleRevokedEvent.InputTuple,
      RoleRevokedEvent.OutputTuple,
      RoleRevokedEvent.OutputObject
  >;

  filters: {
    "RandomnessCallbackFailed(uint256,bytes32,bytes)": TypedContractEvent<
        RandomnessCallbackFailedEvent.InputTuple,
        RandomnessCallbackFailedEvent.OutputTuple,
        RandomnessCallbackFailedEvent.OutputObject
    >;
    RandomnessCallbackFailed: TypedContractEvent<
        RandomnessCallbackFailedEvent.InputTuple,
        RandomnessCallbackFailedEvent.OutputTuple,
        RandomnessCallbackFailedEvent.OutputObject
    >;

    "RandomnessCallbackSuccess(uint256,bytes32,bytes)": TypedContractEvent<
        RandomnessCallbackSuccessEvent.InputTuple,
        RandomnessCallbackSuccessEvent.OutputTuple,
        RandomnessCallbackSuccessEvent.OutputObject
    >;
    RandomnessCallbackSuccess: TypedContractEvent<
        RandomnessCallbackSuccessEvent.InputTuple,
        RandomnessCallbackSuccessEvent.OutputTuple,
        RandomnessCallbackSuccessEvent.OutputObject
    >;

    "RandomnessRequested(uint256,uint256,address,uint256)": TypedContractEvent<
        RandomnessRequestedEvent.InputTuple,
        RandomnessRequestedEvent.OutputTuple,
        RandomnessRequestedEvent.OutputObject
    >;
    RandomnessRequested: TypedContractEvent<
        RandomnessRequestedEvent.InputTuple,
        RandomnessRequestedEvent.OutputTuple,
        RandomnessRequestedEvent.OutputObject
    >;

    "RoleAdminChanged(bytes32,bytes32,bytes32)": TypedContractEvent<
        RoleAdminChangedEvent.InputTuple,
        RoleAdminChangedEvent.OutputTuple,
        RoleAdminChangedEvent.OutputObject
    >;
    RoleAdminChanged: TypedContractEvent<
        RoleAdminChangedEvent.InputTuple,
        RoleAdminChangedEvent.OutputTuple,
        RoleAdminChangedEvent.OutputObject
    >;

    "RoleGranted(bytes32,address,address)": TypedContractEvent<
        RoleGrantedEvent.InputTuple,
        RoleGrantedEvent.OutputTuple,
        RoleGrantedEvent.OutputObject
    >;
    RoleGranted: TypedContractEvent<
        RoleGrantedEvent.InputTuple,
        RoleGrantedEvent.OutputTuple,
        RoleGrantedEvent.OutputObject
    >;

    "RoleRevoked(bytes32,address,address)": TypedContractEvent<
        RoleRevokedEvent.InputTuple,
        RoleRevokedEvent.OutputTuple,
        RoleRevokedEvent.OutputObject
    >;
    RoleRevoked: TypedContractEvent<
        RoleRevokedEvent.InputTuple,
        RoleRevokedEvent.OutputTuple,
        RoleRevokedEvent.OutputObject
    >;
  };
}
