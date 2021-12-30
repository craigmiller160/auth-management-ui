const createPresetEnv = (modules) => ([
    '@babel/preset-env',
    {
        modules,
        useBuiltIns: 'entry',
        corejs: 3
    }
]);

const config = {
    presets: [
        '@babel/preset-react'
    ],
    plugins: [
    ],
    env: {
        development: {
            presets: [
                createPresetEnv(false)
            ]
        },
        production: {
            presets: [
                createPresetEnv(false)
            ]
        },
        test: {
            presets: [
                createPresetEnv('commonjs')
            ],
            plugins: [
                '@babel/plugin-transform-modules-commonjs'
            ]
        }
    }
};

module.exports = config;
