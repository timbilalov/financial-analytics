module.exports = {
    testEnvironment: 'jsdom',
    verbose: true,
    moduleNameMapper: {
        '@utils': '<rootDir>/src/utils',
        '@helpers': '<rootDir>/src/helpers',
        '@constants': '<rootDir>/src/constants',
        '@test-constants': '<rootDir>/src/tests/test-constants',
        '@store': '<rootDir>/src/store',
        '@data': '<rootDir>/src/data',
        '@fetch': '<rootDir>/src/data/fetch',
        '@parse': '<rootDir>/src/data/parse',
        '@presentation': '<rootDir>/src/presentation',
    },
    coverageReporters: [
        'text',
    ],
    moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
    transform: {
        '^.+\\.(ts)$': 'ts-jest',
    },
    globals: {
        'ts-jest': {
            babel: true,
            tsConfig: 'tsconfig.json',
        },
    },
    setupFilesAfterEnv: [
        '<rootDir>/src/tests/setup-tests.ts',
    ],
};
