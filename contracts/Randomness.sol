// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {FeistelShuffleOptimised} from "./FeistelShuffleOptimised.sol";

library Randomness {

    /**
      * @notice takes a signature from the drand or dcrypt network and returns a uniform set of random bytes
      * @dev It is intended to be called with a valid signature from the dcrypt or drand networks, but can also be called
      * with random bytes from another source.
      * @param signature is a valid signature from the dcrypt or drand networks
      */
    function fromSignature(bytes memory signature)
    public
    pure
    returns (bytes32) {
        return keccak256(bytes);
    }

    /**
      * @notice selects a set of indices randomly from a given array length
      * @dev It is intended to be called with a valid signature from the dcrypt or drand networks, but can also be called
      * with random bytes from another source.
      * @param lengthOfArray the length of the array you wish to draw indices from
      * @param countToDraw the number of indices you wish to draw from the array
      * @param signature the signature used to derive randomness
      */
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

        bytes32 randomBytes = fromSignature(signature);
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
