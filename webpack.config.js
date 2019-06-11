const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

const settings = {
    name: 'Formalism',
    devServerUrl: 'http://localhost:8080',
    jsEntry: {
        main: './src/main.js',
    },
    destination: path.resolve(__dirname),
    templates: path.resolve(__dirname, 'src'),
};

// Configure Babel loader
const configureBabelLoader = () => {
    return {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
            loader: 'babel-loader',
            options: {
                presets: [
                    [
                        '@babel/preset-env',
                        {
                            modules: false,
                            useBuiltIns: 'usage',
                            corejs: '3.0.1',
                        },
                    ],
                ],
            },
        },
    };
};

module.exports = (env, argv) => {
    // const isProduction = argv.mode === 'production';
    return {
        entry: settings.jsEntry,
        output: {
            path: settings.destination,
            filename: '[name].js',
            libraryTarget: 'umd',
            library: 'lib',
            umdNamedDefine: true,
            globalObject: `(typeof self !== 'undefined' ? self : this)`,
        },
        optimization: {
            minimizer: [
                new TerserPlugin({
                    cache: true,
                    parallel: true,
                }),
            ],
        },
        devServer: {
            public: settings.devServerUrl,
            contentBase: path.resolve(__dirname, settings.templates),
            quiet: true,
            stats: 'errors-only',
            host: '0.0.0.0',
            disableHostCheck: true,
        },
        module: {
            rules: [configureBabelLoader()],
        },
    };
};
