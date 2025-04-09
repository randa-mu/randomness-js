# randomness-js

A convenience library for retrieving, verifying and deriving randomness from the dcrypt network.

Build everything by running `npm run build`. This creates a dist directory containing commonjs and esm modules.

Solidity interfaces for randomness can be found in our [solidity repo](https://github.com/randa-mu/randamu-solidity-contracts).

## Usage
First install the package by running `npm install randomness-js`
Then create an instance of randomness for your preferred network. An example for filecoin is below:
```javascript
import { JsonRpcProvider, Wallet } from "ethers"
import { Randomness } from "randomness-js"

// set up your ethers objects
const rpc = new JsonRpcProvider("https://api.calibration.node.glif.io/rpc/v1")
const wallet = new Wallet("<YOUR PRIVATE KEY HERE>", rpc)

// create and request some randomness
const randomness = Randomness.createFilecoinCalibnet(wallet)
const response = await randomness.requestRandomness()

// the smart contracts verify the randomness anyway, but doesn't hurt to verify it for yourself to be sure :)
await randomness.verify(response)
```

## Development
- Clone the repo
- run `git submodule update --init --recursive`
For running the tests, you need to create a `.env` file at the project root filling in the fields detailed in [`.env.sample`](./.env.sample).