module.exports = {
  extends: ['@bjerk/eslint-config', 'plugin:jest/recommended'],
  ignorePatterns: ['dist/**/*'],
  parserOptions: {
    project: true,
    tsconfigRootDir: __dirname,
  },
};
