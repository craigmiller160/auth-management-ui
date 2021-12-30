const babelConfig = require('@craigmiller160/babel-config');
const babelConfigReact = require('@craigmiller160/babel-config-react');
const { merge } = require('lodash'); // TODO try and just use single function

const config = merge(babelConfig, babelConfigReact);

module.exports = config;
