module.exports = {
  transform: {
    "^.+\\.(t|j)sx?$": ["@swc/jest"],
  },
  "coverageDirectory": "<rootDir>/coverage",
  "moduleFileExtensions": [
    "ts",
    "tsx",
    "js"
  ],
  "testMatch": [
    "**/*.test.(ts)"
  ],
  "testPathIgnorePatterns": [
    "<rootDir>/dist/"
  ],
  "moduleDirectories": [
    "node_modules",
    "src"
  ]
};