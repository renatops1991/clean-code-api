module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/main/**',
    '!**/mocks/**',
    '!**/fixtures/**',
    '!<rootDir>/src/**/protocols/**',
    '!<rootDir>/src/**/**-protocols.ts',
    '!<rootDir>/src/domain/usecases/**',
    '!<rootDir>/src/domain/models/**'
  ],
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  roots: ['<rootDir>/src'],
  testEnvironment: 'node',
  preset: '@shelf/jest-mongodb',
  transform: {
    '.+\\.ts$': 'ts-jest'
  },
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1'
  }
}
