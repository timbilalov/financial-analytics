module.exports = {
    root: true,
    'ignorePatterns': [
        'public/*',
    ],
    env: {
        'browser': true,
        'node': true,
        'es2021': true,
        'jest/globals': true,
    },
    parser: '@typescript-eslint/parser',
    plugins: [
        '@typescript-eslint',
        'typescript-enum',
        'jest',
    ],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:jest/recommended',
    ],
    rules: {
        quotes: ['error', 'single'],
        'object-curly-spacing': ['error', 'always'],
        'comma-dangle': ['error', 'always-multiline'],
    },
    globals: {
        'System': true,
    },
};
