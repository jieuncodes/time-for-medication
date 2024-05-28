// jest.config.mjs
import { pathsToModuleNameMapper } from 'ts-jest';
import { readFileSync } from 'fs';
import { URL } from 'url';

const tsconfig = JSON.parse(
  readFileSync(new URL('./tsconfig.json', import.meta.url), 'utf-8')
);

const jestConfig = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  testMatch: [
    '**/?(*.)+(spec|test).[tj]s?(x)',
    '**/?(*.)+(spec|test).[m]ts'
  ],
  transform: {
    '^.+\\.(ts|tsx|mts)$': ['ts-jest', { useESM: true }],
  },
  moduleNameMapper: pathsToModuleNameMapper(tsconfig.compilerOptions.paths || {}, { prefix: '<rootDir>/' }),
  extensionsToTreatAsEsm: ['.mts'],
  moduleFileExtensions: ['ts', 'tsx', 'mts', 'mjs', 'js', 'jsx', 'json', 'node']
};

export default jestConfig;
