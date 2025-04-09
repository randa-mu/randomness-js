## randomness-js

A convenience library for retrieving, verifying and deriving randomness from the dcrypt network.

Build everything by running `npm run build`. This creates a dist directory containing commonjs and esm modules.

Solidity interfaces for randomness can be found in our [solidity repo](https://github.com/randa-mu/randamu-solidity-contracts).

## Development
- Clone the repo
- run `git submodule update --init --recursive`
For running the tests, you need to create a `.env` file at the project root filling in the fields detailed in [`.env.sample`](./.env.sample).