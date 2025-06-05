export default {
  preset: "ts-jest",
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".ts"],
  transform: {
    "^.+\\.(ts|tsx)$": ["ts-jest", {
      useESM: true,
    }],
  },
  testPathIgnorePatterns: [
    "<rootDir>/randomness-solidity/lib/chainlink/", // ignore the submodule test files
  ],
};

