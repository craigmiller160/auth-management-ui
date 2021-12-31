const { merge } = require('webpack-merge');
const config = require('@craigmiller160/webpack-config');
const sassConfig = require('@craigmiller160/webpack-config-sass');
const tsConfig = require('@craigmiller160/webpack-config-ts');

const localDevServerConfig = {
    devServer: {
        port: 3000,
        https: true,
        proxy: {
            '/auth-management/api': {
                target: 'https://localhost:7004',
                changeOrigin: true,
                secure: false,
                pathRewrite: {
                    '^/auth-management/api': ''
                },
                logLevel: 'debug'
            },
            '/auth-management/oauth2': {
                target: 'https://localhost:7003',
                changeOrigin: true,
                secure: false,
                pathRewrite: {
                    '^/auth-management/oauth2': ''
                },
                logLevel: 'debug'
            }
        }
    }
};

const parts = [config, sassConfig, tsConfig];

if (process.env.NODE_ENV === 'development') {
    parts.push(localDevServerConfig);
}

module.exports = merge(parts);
