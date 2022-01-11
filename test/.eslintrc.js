/**
 * This file provides the test-specific ESLint configuration.
 *
 * This file extends the root-level config by setting the environment to be
 * `jest`, which declares a few global variables (such as `describe`, `test`,
 * `expect`, etc.). It also disables some rules that are in conflict with Jest
 * testing.
 *
 * ESLint will continue looking into parent folders for a .eslintrc.js file
 * until it finds one with `root: true`.
 */
module.exports = {
  env: {
    jest: true
  }
}
