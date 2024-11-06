// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

interface IRandomnessReceiver {
    /**
     * @notice Receives a random value associated with a specific request.
     * @dev This function is called to provide the randomness generated for a given request ID.
     * It is intended to be called by a trusted source that provides randomness.
     * @param requestId The unique identifier of the randomness request.
     * @param randomness The generated random value, provided as a `bytes32` type.
     */
    function receiveRandomness(uint256 requestId, bytes32 randomness) external;
}
