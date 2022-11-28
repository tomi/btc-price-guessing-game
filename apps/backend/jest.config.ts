/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

export const config = {
  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,

  // The directory where Jest should output its coverage files
  coverageDirectory: "coverage",

  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: "v8",

  // The glob patterns Jest uses to detect test files
  testMatch: ["<rootDir>/tests/**/*.test.ts"],

  // An array of regexp pattern strings that are matched against all test paths, matched tests are skipped
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],

  // A map from regular expressions to paths to transformers
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { tsconfig: "./tests/tsconfig.test.json" }],
  },
};

export default config;
