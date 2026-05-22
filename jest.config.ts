import type { Config } from 'jest'

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^nanoid$': '<rootDir>/tests/__mocks__/nanoid.ts',
  },
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      tsconfig: {
        module: 'ESNext',
        moduleResolution: 'bundler',
        allowImportingTsExtensions: true,
        noEmit: true,
        strict: true,
        target: 'ES2020',
        lib: ['ES2020', 'DOM'],
        isolatedModules: true,
        esModuleInterop: true,
      },
      useESM: false,
    }],
  },
  transformIgnorePatterns: [
    'node_modules/(?!nanoid)',
  ],
  testMatch: ['<rootDir>/tests/**/*.spec.ts'],
}

export default config
