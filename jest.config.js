const configMerge = require('@craigmiller160/config-merge');
const jestConfig = require('@craigmiller160/jest-config');
const jestConfigTs = require('@craigmiller160/jest-config-ts');
const path = require('path');

module.exports = configMerge(jestConfig, jestConfigTs, {
    setupFilesAfterEnv: [
        path.join(process.cwd(), 'test', 'setupTests.ts')
    ]
});
