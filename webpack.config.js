const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = env => {
    const isDevelopment = env.NODE_ENV === 'development';
    return {
        entry: './src/index.js',
        output: {
            path: path.resolve(__dirname, 'build'),
            filename: 'bundle.min.js?v=[hash:6]',
        },
        module: {
            rules: [
                {
                    test: /\.ts?$/,
                    use: 'ts-loader',
                    options: {

                    },
                },
            ],
        },
        plugins: [new Dotenv()],
    };
};
