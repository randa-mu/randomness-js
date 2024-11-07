// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {IRandomnessReceiver} from "./IRandomnessReceiver.sol";

abstract contract AbstractRandomnessReceiver {
    address randomnessProvider;

    error NotAuthorizedRandomnessProvider();

    modifier onlyRandomnessProvider(){
        if (msg.sender != randomnessProvider) revert NotAuthorizedRandomnessProvider();
        _;
    }

    constructor(address _randomnessProvider) {
        randomnessProvider = _randomnessProvider;
    }
}