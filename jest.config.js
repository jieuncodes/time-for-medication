// jest.config.js //

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  testMatch: [
      '**/__tests__/**/*.[jt]s?(x)', 
      '**/?(*.)+(spec|test).[tj]s?(x)'
  ],
  transform: {
      '^.+\\.(ts|tsx)$': 'ts-jest',
  },
};
