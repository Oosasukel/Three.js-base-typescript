const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = (env) => ({
  entry: {
    app: './src/main.ts',
  },

  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, '../dist'),
  },

  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: 'index.html',
        },
        {
          from: 'assets/**/*',
        },
      ],
    }),
    new CleanWebpackPlugin(),
  ],

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },

  ...env,
});
