const path = require('path')
const webpack = require('webpack');
const { VueLoaderPlugin } = require('vue-loader')

module.exports = {
    mode: 'development',
    entry: {
        'luminus' : './lib/components.js',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: 'vue-loader',
            },
            {
                test: /\.m?js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                },
                // exclude: /node_modules/,
            },
            {
                test: /\.styl(us)?$/,
                use: [
                    // 'vue-style-loader',
                    'css-loader',
                    'stylus-loader',
                ],
            },
        ]
    },
    plugins: [
        new VueLoaderPlugin()
    ],
    // optimization: {},
    resolve: {
        modules: ['node_modules'],
        extensions: ['.js', '.json', '.jsx', '.css', '.vue', '.styl'],
    },
};