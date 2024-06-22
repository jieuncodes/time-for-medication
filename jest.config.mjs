// jest.config.mjs
import { pathsToModuleNameMapper } from "ts-jest";
import { readFileSync } from "fs";
import { URL } from "url";

const tsconfig = JSON.parse(
  readFileSync(new URL("./tsconfig.json", import.meta.url), "utf-8")
);

const jestConfig = {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",
  roots: ["<rootDir>/server/src", "<rootDir>/tests"],
  testMatch: ["**/tests/**/*.test.ts"],
  transform: {
    "^.+\\.(ts|tsx|mts)$": ["ts-jest", { useESM: true }],
  },
  moduleNameMapper: pathsToModuleNameMapper(tsconfig.compilerOptions.paths, {
    prefix: "<rootDir>/",
  }),
  setupFilesAfterEnv: ["./jest.setup.ts"],
  extensionsToTreatAsEsm: [".ts"],
  moduleFileExtensions: [
    "ts",
    "tsx",
    "mts",
    "mjs",
    "js",
    "jsx",
    "json",
    "node",
  ],
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["json", "lcov", "text", "clover"],
  coveragePathIgnorePatterns: ["/node_modules/", "/tests/"],
  reporters: ["default"],
  testTimeout: 30000,
  verbose: true,
};

export default jestConfig;
