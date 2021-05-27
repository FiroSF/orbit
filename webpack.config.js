const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname + '/build'),
    },
    mode: 'none',
    module: {
        rules: [
            {
                test: /\.html$/,
                use: [
                    {
                        loader: 'html-loader',
                        options: {},
                    },
                ],
            },
        ],
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: './src/html/index.html', // public/index.html 파일을 읽는다.
            filename: 'index.html', // output으로 출력할 파일은 index.html 이다.
        }),
    ],
};
