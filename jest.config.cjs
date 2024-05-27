module.exports = {
    transform: {
      '^.+\\.[t|j]sx?$': 'babel-jest',
    },
    setupFilesAfterEnv: ['./setupTests.js'],
    moduleNameMapper: {
      '^.+\\.(jpg|jpeg|png|gif|webp|svg|css)$': 'jest-transform-stub'
    },
    testEnvironment: 'jsdom',
    testPathIgnorePatterns: ["./node_modules/"]
  };