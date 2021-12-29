const jestConfig = require('@craigmiller160/jest-config');
const jestConfigBabel = require('@craigmiller160/jest-config-babel');
const jestConfigTs = require('@craigmiller160/jest-config-ts');

module.exports = {
	...jestConfig,
	...jestConfigBabel,
	...jestConfigTs
};
