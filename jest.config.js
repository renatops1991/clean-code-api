module.exports = {
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  transform: {
    // eslint-disable-next-line comma-dangle
    '.+\\.ts$': 'ts-jest',
    // eslint-disable-next-line comma-dangle
  },
  // eslint-disable-next-line semi
};
