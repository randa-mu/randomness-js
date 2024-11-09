// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {FeistelShuffleOptimised} from "./FeistelShuffleOptimised.sol";

library Randomness {
    function getRandomnessProvider() public pure returns(address randomnessProvider){
        return 0x9ed5a27a9f18529848D03AE699bDECC2Ba8D10FE;
    }

    /**
      * @notice selects a set of indices randomly from a given array length
      * @dev It is intended to be called with randomn bytes from the dcrypt or drand networks, but can also be called
      * with random bytes from another source.
      * @param lengthOfArray the length of the array you wish to draw indices from
      * @param countToDraw the number of indices you wish to draw from the array
      * @param randomBytes 32 bytes of uniformly distributed randomness
      */
    function selectArrayIndices(uint256 lengthOfArray, uint256 countToDraw, bytes32 randomBytes)
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
