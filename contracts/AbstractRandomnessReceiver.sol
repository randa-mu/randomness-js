// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {IRandomnessReceiver} from "./IRandomnessReceiver.sol";

abstract contract AbstractRandomnessReceiver {
    address randomnessRequester;

    error NotAuthorizedRandomnessProvider();

    modifier onlyRandomnessProvider(){
        if (msg.sender != randomnessRequester) revert NotAuthorizedRandomnessProvider();
        _;
    }

    constructor(address _randomnessRequester) {
        randomnessRequester = _randomnessRequester;
    }
}