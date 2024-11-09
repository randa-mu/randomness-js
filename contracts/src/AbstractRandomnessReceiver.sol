// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {IRandomnessReceiver} from "./IRandomnessReceiver.sol";

abstract contract AbstractRandomnessReceiver {
    address public immutable RANDOMNESS_PROVIDER = 0xe1051fbd7ed11716b306aefec409275b17aadcbf;

    error NotAuthorizedRandomnessProvider();

    modifier onlyRandomnessProvider(){
        if (msg.sender != RANDOMNESS_PROVIDER) revert NotAuthorizedRandomnessProvider();
        _;
    }
}