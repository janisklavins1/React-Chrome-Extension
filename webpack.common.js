const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    entry: {
        popup: path.resolve('src/popup/index.js'),
        options: path.resolve('src/options/index.js'),
        background: path.resolve('src/background/background.js'),
        contentScript: path.resolve('src/contentScript/contentScript.js'),
        newTab: path.resolve('src/tabs/index.js'),
    },
    module: {
        rules: [
            {
                test: /\.js|jsx$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env',
                            ['@babel/preset-react', {"runtime": "automatic"}]
                        ],
                    }
                }
            },
            {
                test: /\.css$/i,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                        },
                    }
                ],
            },
            {
                type: 'assets/resource',
                test: /\.(png|jpg|jpeg|gif|woff|woff2|tff|eot|svg)$/,
            },
        ]
    },
    "plugins": [
        new CleanWebpackPlugin({
            cleanStaleWebpackAssets: false
        }),
        new CopyPlugin({
            patterns: [{
                from: path.resolve('src/static'),
                to: path.resolve('dist')
            }]
        }),
        ...getHtmlPlugins([
            'popup',
            'options',
            'newTab'
        ])
    ],
    resolve: {
        extensions: ['.js']
    },
    output: {
        filename: '[name].js',
        path: path.join(__dirname, 'dist')
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
        }
    }
}

function getHtmlPlugins(chunks) {
    return chunks.map(chunk => new HtmlPlugin({
        title: 'React Extension',
        filename: `${chunk}.html`,
        chunks: [chunk]
    }))
}