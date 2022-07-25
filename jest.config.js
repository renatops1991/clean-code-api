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
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  testEnvironment: 'node',
  preset: '@shelf/jest-mongodb',
  transform: {
    '^.+\\.ts?$': ['@swc/jest']
  },
  moduleNameMapper: {
    '@/tests/(.*)': '<rootDir>/tests/$1',
    '@/(.*)': '<rootDir>/src/$1'
  }
}
