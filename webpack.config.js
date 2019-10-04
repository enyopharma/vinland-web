const path = require('path')

const ManifestPlugin = require('webpack-manifest-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")

module.exports = (env, argv) => {
    return {
        entry: {
            app: './frontend/js/app.js',
            form: './frontend/js/form/index.ts',
        },
        watch: argv.mode == 'development',
        devtool: argv.mode == 'development' ? 'inline-source-map' : false,
        output: {
            filename: '[name].[contenthash].js',
            path: path.resolve(__dirname, './public/build'),
            publicPath: 'build/',
        },
        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.scss'],
            alias: {
                form: path.resolve(__dirname, './frontend/js/form'),
            },
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env', '@babel/preset-react']
                        },
                    },
                },
                {
                    test: /\.scss$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        'css-loader',
                        'sass-loader',
                    ],
                },
                {
                    test: /\.ts(x?)$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: "ts-loader",
                        },
                    ],
                },
                {
                    enforce: "pre",
                    test: /\.js$/,
                    loader: "source-map-loader"
                },
            ],
        },
        plugins: [
            new ManifestPlugin,
            new CleanWebpackPlugin,
            new MiniCssExtractPlugin({
                filename: '[name].[contenthash].css',
            }),
        ],
        optimization: {
            moduleIds: 'hashed',
            runtimeChunk: 'single',
        },
    }
}
