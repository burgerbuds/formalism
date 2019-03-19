const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const settings = {
    name: 'Formalism',
    devServerUrl: 'http://localhost:8080',
    jsEntry: {
        'input/base': './input/base.scss',
        'input/outlined': './input/outlined.scss',
        'input/underlined': './input/underlined.scss',

        'select/base': './select/base.scss',
        'select/outlined': './select/outlined.scss',

        'checkbox/base': './checkbox/base.scss',
        'checkbox/outlined': './checkbox/outlined.scss',
        'checkbox/solid': './checkbox/solid.scss',

        'radio/base': './radio/base.scss',
        'radio/outlined': './radio/outlined.scss',

        'textarea/base': './textarea/base.scss',
        'textarea/outlined': './textarea/outlined.scss',

        'search/base': './search/base.scss',
        'search/outlined': './search/outlined.scss',

        'switcher/base': './switcher/base.scss',
        'switcher/formal': './switcher/formal.scss',
        'switcher/outlined': './switcher/outlined.scss',

        'fieldset/fieldset': './fieldset/base.scss',
        'fieldset/outlined': './fieldset/outlined.scss',
        'fieldset/naked': './fieldset/naked.scss',

        'notification/base': './notification/base.scss',
        'notification/outlined': './notification/outlined.scss',

        'file/base': './file/base.scss',
        'file/outlined': './file/outlined.scss',
    },
    destination: path.resolve(__dirname, 'dist'),
    templates: path.resolve(__dirname, 'src'),
};
console.log(path.resolve(__dirname, 'dist'));
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
                            useBuiltIns: 'entry',
                            targets: {
                                browsers: [
                                    '> 1%',
                                    'last 2 versions',
                                    'Firefox ESR',
                                    'IE > 9',
                                ],
                            },
                        },
                    ],
                ],
            },
        },
    };
};

// Configure Babel loader
const configureHtmlLoader = () => {
    return {
        test: /\.html$/,
        loader: require.resolve('file-loader'),
        options: {
            name: '[name].[ext]',
        },
    };
};

// Configure the stylesheet loader
const configureStylesheetLoader = isProduction => {
    return isProduction
        ? {
              test: /\.(sa|sc|c)ss$/,
              use: [
                  MiniCssExtractPlugin.loader, // 4. Convert the JS to a CSS file
                  {
                      loader: 'css-loader', // 3. Convert CSS to JS object
                  },
                  {
                      loader: 'postcss-loader', // 2. Run CSS through PostCss
                  },
                  'sass-loader', // 1. Convert SCSS to CSS
              ],
          }
        : {
              test: /\.(sa|sc|c)ss$/,
              use: [
                  'style-loader', // 4. Insert hot CSS into the page
                  'css-loader', // 3. Convert CSS to JS object
                  {
                      loader: 'postcss-loader', // 2. Run CSS through PostCss
                      options: {
                          plugins: [require('autoprefixer')],
                      },
                  },
                  'sass-loader', // 1. Convert SCSS to CSS
              ],
          };
};

module.exports = (env, argv) => {
    const isProduction = argv.mode === 'production';
    return {
        entry: settings.jsEntry,
        // output: {
        //     path: settings.destination,
        // },
        optimization: {
            minimizer: [
                new TerserPlugin({
                    cache: true,
                    parallel: true,
                }),
                new OptimizeCSSAssetsPlugin({
                    cssProcessorOptions: {
                        safe: true,
                        discardComments: true,
                    },
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
            rules: [
                configureHtmlLoader(),
                configureBabelLoader(),
                configureStylesheetLoader(isProduction),
            ],
        },
        plugins: [
            // Remove build folder before building
            new CleanWebpackPlugin(settings.destination, {
                verbose: false, // disable logging
                root: path.resolve(__dirname, '/'),
            }),
            isProduction
                ? new MiniCssExtractPlugin({
                      filename: '[name].css',
                  })
                : new FriendlyErrorsWebpackPlugin({
                      compilationSuccessInfo: {
                          messages: [
                              `The ${settings.name} demo is running at: ${
                                  settings.devServerUrl
                              }`,
                          ],
                      },
                      onErrors: (severity, errors) => {
                          if (severity !== 'error') return;
                          const error = errors[0];
                          console.log(error.message);
                      },
                  }),
        ],
    };
};
