// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "../IRandomnessReceiver.sol";
import "../IRandomnessProvider.sol";

contract MockRandomnessRequester is IRandomnessProvider {
    // the DST is used to separate randomness being used as signatures for other things
    string public constant DST = "randomness:0.0.1:bn254";
    // while the signature is verifiable, this is done elsewhere so ensure only the signer contract can write back here
    bytes32 public constant SIGNER_ROLE = keccak256("SIGNER_ROLE");
    
    // Request stores details needed to verify the signature
    struct Request {
        uint256 nonce;
        address callback;
    }

    event RandomnessRequested(uint256 indexed requestID, uint256 nonce, address requester);
    event RandomnessCallbackSuccess(uint256 indexed requestID, bytes32 randomness, bytes signature);
    event RandomnessCallbackFailed(uint256 indexed requestID, bytes32 randomness, bytes signature);

    mapping(uint256 => address) requestIdToReceiver;    
    uint256 public lastRequestId;
    uint256[] requests;
    mapping(address => uint256[]) public receiverToRequestIds;

    function requestRandomness() external returns (uint256) {
        lastRequestId++;
        requestIdToReceiver[lastRequestId] = msg.sender;
        requests.push(lastRequestId);
        return lastRequestId;
    }

    function getRequest(uint256 requestId) external view returns (TypesLib.RandomnessRequest memory){
        return TypesLib.RandomnessRequest(requestId, requestIdToReceiver[requestId]);
    }

    function getAllRequests() external view returns (TypesLib.RandomnessRequest[] memory){
        TypesLib.RandomnessRequest[] memory allRequests = new TypesLib.RandomnessRequest[](lastRequestId);
        for(uint i; i<lastRequestId; i++){
            address callBack = requestIdToReceiver[requests[i]];
            allRequests[i] = TypesLib.RandomnessRequest(requests[i], callBack);
        }
        return allRequests;
    }

    function messageFrom(TypesLib.RandomnessRequest memory r) external pure returns (bytes memory){
        bytes memory m = abi.encode(DST, r.requestId);
        return abi.encodePacked(keccak256(m));
    }

    // Function to manually provide the contract with the desired randomness
    function answerRequest(uint256 requestId, bytes32 randomness) external {
        address callback = requestIdToReceiver[requestId];
        IRandomnessReceiver receiver = IRandomnessReceiver(callback);
        receiver.receiveRandomness(requestId, randomness);
    }
}