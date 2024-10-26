// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {FeistelShuffleOptimised} from "./FeistelShuffleOptimised.sol";
library Randomness {
  
    function selectArrayIndices(uint256 lengthOfArray, uint256 countToDraw, bytes calldata signature)
        public
        pure
        returns (uint256[] memory)
    {
        if (lengthOfArray == 0) {
            return new uint256[](0);
        }

        uint256[] memory winners = new uint256[](countToDraw);
        if (lengthOfArray <= countToDraw) {
            for (uint256 i = 0; i < countToDraw; i++) {
                winners[i] = i;
            }
            return winners;
        }

        bytes32 randomBytes = keccak256(signature);
        uint256 randomness;
        assembly {
            randomness := randomBytes
        }

        for (uint256 i = 0; i < countToDraw; i++) {
            winners[i] = FeistelShuffleOptimised.deshuffle(i, lengthOfArray, randomness, 10);
        }

        return winners;
    }
}
