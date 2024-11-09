// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {IRandomnessReceiver} from "./IRandomnessReceiver.sol";

abstract contract AbstractRandomnessReceiver {
    address public immutable RANDOMNESS_PROVIDER = 0x9ed5a27a9f18529848D03AE699bDECC2Ba8D10FE;

    error NotAuthorizedRandomnessProvider();

    modifier onlyRandomnessProvider(){
        if (msg.sender != RANDOMNESS_PROVIDER) revert NotAuthorizedRandomnessProvider();
        _;
    }
}