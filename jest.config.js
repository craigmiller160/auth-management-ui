const configMerge = require('@craigmiller160/config-merge');
const jestConfig = require('@craigmiller160/jest-config');
const jestConfigTs = require('@craigmiller160/jest-config-ts');

module.exports = configMerge(jestConfig, jestConfigTs);
