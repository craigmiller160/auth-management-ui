const { createProxyMiddleware } = require('http-proxy-middleware');

const createProxy = (app) => {
    app.use(createProxyMiddleware('/api', {
        target: 'https://localhost:7004',
        changeOrigin: true,
        secure: true,
        pathRewrite: {
            '^/api': ''
        },
        logLevel: 'debug'
    }));

    app.use(createProxyMiddleware('/oauth2', {
        target: '',
        changeOrigin: true,
        secure: true,
        pathRewrite: {
            '^/oauth2': ''
        },
        logLevel: 'debug'
    }));
};

module.exports = createProxy;
