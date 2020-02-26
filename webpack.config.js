const path = require('path')
const webpack = require('webpack')
const { VueLoaderPlugin } = require('vue-loader')

module.exports = {
    mode: 'development',
    entry: {
        luminus: './luminus/components.js',
    },
    output: {
        path: path.resolve(__dirname + '/dist'),
        filename: '[name].js',
        library: 'Luminus',
        libraryTarget: 'umd',
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: 'vue-loader',
            },
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                },
                exclude: /node_modules/,
            },
            {
                test: /\.styl(us)?$/,
                use: [
                    'vue-style-loader',
                    'css-loader',
                    {
                        loader: 'stylus-loader',
                        options: {
                            data: `@import "luminus/luminus.styl";`
                        }
                    },
                ],
            },
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new VueLoaderPlugin(),
    ],
    resolve: {
        modules: ['node_modules', path.join(__dirname, 'node_modules')],
        extensions: ['.js', '.json', '.jsx', '.css', '.vue', '.styl'],
    },
};