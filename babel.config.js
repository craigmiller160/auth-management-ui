const configMerge = require('@craigmiller160/config-merge');
const babelConfig = require('@craigmiller160/babel-config');
const babelConfigReact = require('@craigmiller160/babel-config-react');

module.exports = configMerge(babelConfig, babelConfigReact);
