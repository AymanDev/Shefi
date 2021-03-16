const path = require('path');
const Dotenv = require('dotenv-webpack');
const nodeExternals = require('webpack-node-externals');

module.exports = env => {
    const isDevelopment = env.NODE_ENV === 'development';
    return {
        entry: path.resolve(__dirname, 'src/index.ts'),
        mode: env.NODE_ENV,
        output: {
            path: path.resolve(__dirname, 'build'),
            filename: 'bundle.min.js?v=[fullhash:6]',
        },
        optimization: {
            minimize: true,
        },
        module: {
            rules: [
                {
                    test: /\.ts?$/,
                    use: 'ts-loader',
                },
            ],
        },
        plugins: [new Dotenv()],
        resolve: {
            extensions: ['.tsx', '.ts', '.js', '.json'],
        },
        target: 'node',
        externals: [nodeExternals()],
    };
};
