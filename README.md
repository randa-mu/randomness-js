## @randamu/randomness-js

A convenience library for retrieving, verifying and deriving randomness from the dcrypt network.

Build everything by running `npm run build`. This creates an `index.js` and `index.d.ts` at the root directory.

Solidity interfaces for randomenss can be found in the [randomness-solidity](./randomness-solidity) directory.

### Key Capabilities

Using this library, developers can:

* Derive randomness.
* Retrieve randomness request response / data.
* Verify the randomness request response.


### On-Chain Integration

Solidity interfaces used for on-chain randomness requests can be found in the [randomness-solidity](./randomness-solidity) directory and the documentation for the solidity interfaces can be found in the [randomness-solidity](github.com/randa-mu/randomness-solidity.git) repository.

#### Smart Contract Addresses

| Contract        | Address | Network          |
|-----------------|---------|------------------|
| RandomnessSender Proxy | 0x9c789bc7F2B5c6619Be1572A39F2C3d6f33001dC   | Filecoin Calibnet |


### Installation

To install the library, install the latest version using:

```sh
npm install randomness-js
```

### Usage Example

#### Prerequisites

* [ethers](https://www.npmjs.com/package/ethers) for wallet setup and message encoding.

Here’s how to use RandomnessJS to create a randomness request for the Filecoin Calibration testnet.

```js
import {JsonRpcProvider, NonceManager, Wallet} from "ethers"
import { Randomness } from "randomness-js";

async function main() {
    // provider
    const rpc = new JsonRpcProvider("https://filecoin-calibration.chainup.net/rpc/v1")
    // User wallet
    const wallet = new NonceManager(new Wallet("your-private-key", rpc))
    const randomness = new Randomness(wallet, "RandomnessSender Proxy contract address from above table")

    // create a randomness request - returns the response from the oracle
    const {requestID, nonce, randomness, signature} = await randomness.requestRandomness();

    // we can also fetch the randomness request response / data for a specific request id
    // const {requestID, nonce, randomness, signature} = await randomness.fetchRandomnessRequest(<requestID input here>);

    // to verify the randomness request response we can use the verify function
    // which will perform a signature verification using the DST for signature generation and the unique request nonce
    // returns a boolean - true / false
    // await randomness.verify({requestID, nonce, randomness, signature})
}

main().catch((error) => {
  console.error("Error:", error);
});
```