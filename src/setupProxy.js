const { createProxyMiddleware } = require('http-proxy-middleware');

const createProxy = (app) => {
    app.use(createProxyMiddleware('/api', {
        target: 'https://localhost:7004',
        changeOrigin: true,
        pathRewrite: {
            '^/api': ''
        },
        logLevel: 'debug'
    }));
};

module.exports = createProxy;
