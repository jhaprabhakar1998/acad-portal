module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '^jose/(.*)$': '<rootDir>/node_modules/jose/dist/node/cjs/$1',
    },
    setupFiles: ['dotenv/config'],
};