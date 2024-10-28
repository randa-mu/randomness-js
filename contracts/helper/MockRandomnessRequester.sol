// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "../IRandomnessReceiver.sol";
import "../IRandomnessProvider.sol";

contract MockRandomnessRequester is IRandomnessProvider {
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
        TypesLib.RandomnessRequest[] memory allRequests = new TypesLib.RandomnessRequest[](15);
        for(uint i; i<15; i++){
            address callBack = requestIdToReceiver[requests[i]];
            allRequests[i] = TypesLib.RandomnessRequest(requests[i], callBack);
        }
        return allRequests;
    }

    function messageFrom(TypesLib.RandomnessRequest memory r) external pure returns (bytes memory){
        return bytes("");
    }

    function answerRequest(uint256 requestId, bytes32 randomness) external {
        address callback = requestIdToReceiver[requestId];
        IRandomnessReceiver receiver = IRandomnessReceiver(callback);
        receiver.receiveRandomness(requestId, randomness);
    }
}