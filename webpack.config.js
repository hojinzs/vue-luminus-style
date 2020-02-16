const path = require('path')
// const webpack = require('webpack');
const { VueLoaderPlugin } = require('vue-loader')

module.exports = {
    mode: 'development',
    entry: './luminus/components.js',
    output: {
        path: path.resolve(__dirname + '/dist'),
        filename: 'luminus.js',
        // library: 'lumi-carousel',
        // libraryTarget: 'umd',
        // umdNamedDefine: true
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: 'vue-loader',
            },
            // {
            //     test: /\.js$/,
            //     exclude: /node_modules/,
            //     use: {
            //         loader: 'babel-loader',
            //         options: {
            //             presets: ['@babel/preset-env']
            //         }
            //     },
            // },
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
        new VueLoaderPlugin(),
        // new webpack.LoaderOptionsPlugin({
        //     minimize: true,
        //     debug: false,
        // })
    ],
    // optimization: {},
    resolve: {
        modules: ['node_modules', path.join(__dirname, 'node_modules')],
        extensions: ['.js', '.json', '.jsx', '.css', '.vue', '.styl'],
        // alias: {
        //     'vue$' : 'vue/dist/vue.common.js'
        // }
    },
};