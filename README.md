# randomness-js

A JavaScript/TypeScript SDK to request, verify, and derive randomness from [the dcipher network](https://dcipher.network/), supported by the [randomness-solidity](https://github.com/randa-mu/randomness-solidity) contract. 
## 🌍 Overview

This project provides a client-side SDK to request on-chain randomness from the supported blockchains by interacting with the `RandomnessSender` contract implemented in [`randomness-solidity`](https://github.com/randa-mu/randomness-solidity). It allows you to:

- Integrate with a deployed `RandomnessSender` smart contract
- Request and verify on-chain randomness from your dApp frontend/backend


### 🌐 Supported Networks

Please see the [list of supported networks](https://docs.dcipher.network/networks/randomness) in the dcipher documentation.

## 📦 Getting started

### Installation

Install the `randomness-js` library into your frontend project.
```bash
npm install randomness-js
# or
yarn add randomness-js
```

### Usage

#### Connect to the supported network
Create an instance of randomness for your preferred network.
```ts
import { Randomness } from "randomness-js"
import { JsonRpcProvider, Wallet } from "ethers"

// set up your ethers objects
const rpc = new JsonRpcProvider("https://api.calibration.node.glif.io/rpc/v1")
const wallet = new Wallet("<YOUR PRIVATE KEY HERE>", rpc)

// create randomness instance on Base Sepolia testnet
const randomness = Randomness.createBaseSepolia(wallet)
```
You can also create the randomness instance for your desired network using its chainId. Check the [supported networks](#-supported-networks) for details.
```ts
//create randomness instance using the chainID
const randomness = Randomness.createFromChainId(wallet, <SUPPORTED_CHAIN_ID>)
```

#### Request randomness

```ts
const response = await randomness.requestRandomness()
```

#### Verify randomness
The smart contracts verify the randomness anyway, but it doesn't hurt to verify it for yourself to be sure.
```ts
await randomness.verify(response)
```

You can avoid throwing errors on verification failure by passing config parameters like so:
```ts
const isVerified = await randomness.verify(response, { shouldBlowUp: false })
```

## 🛠 Development
Clone the repo
```bash
git clone https://github.com/randa-mu/randomness-js.git
cd randomness-js
git submodule update --init --recursive
```
Install the dependencies and build the projects to generate contract files.
```bash
npm install
npm run build
```

For running the tests, you need to create a `.env` file at the project root, filling in the fields detailed in [`.env.sample`](./.env.sample).
```bash
npm run test
```

## 🤝 Contributing

We welcome pull requests and issues. If you find a bug or want to request a feature, feel free to open an issue or PR!

## 📄 License

This project is licensed under the [MIT License](./LICENSE).
