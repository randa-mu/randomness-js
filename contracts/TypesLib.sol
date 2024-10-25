// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

library TypesLib {

    // RandomnessRequest stores details needed to verify the signature
    struct RandomnessRequest {
        uint256 requestID;
        address callback;
    }

}
