const jestConfig = require('@craigmiller160/jest-config');
const jestConfigBabel = require('@craigmiller160/jest-config-babel');
const jestConfigTs = require('@craigmiller160/jest-config-ts');
const { merge } = require('lodash'); // TODO maybe i can only add this one function?

module.exports = merge(merge(jestConfig, jestConfigBabel), jestConfigTs);
