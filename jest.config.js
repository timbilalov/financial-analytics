module.exports = {
    verbose: true,
    moduleNameMapper: {
        '@utils/(.*)': '<rootDir>/src/utils/$1',
        '@helpers': '<rootDir>/src/utils/helpers',
        '@constants': '<rootDir>/src/utils/constants',
        '@logic': '<rootDir>/src/logic',
        '@store': '<rootDir>/src/store',
    },
    coverageReporters: [
        'text',
    ],
};
