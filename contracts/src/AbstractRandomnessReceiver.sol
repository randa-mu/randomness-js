// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {IRandomnessReceiver} from "./IRandomnessReceiver.sol";

abstract contract AbstractRandomnessReceiver {
    address public immutable RANDOMNESS_PROVIDER = 0x4633bbdb16153B325bbcef4Baa770d718Eb552b8;

    error NotAuthorizedRandomnessProvider();

    modifier onlyRandomnessProvider(){
        if (msg.sender != RANDOMNESS_PROVIDER) revert NotAuthorizedRandomnessProvider();
        _;
    }
}