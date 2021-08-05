const webpack = require('webpack');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './public',
    host: 'localhost',
    historyApiFallback: true,
    // respond to 404s with index.html
    inline: true,
    port: 3300,
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
});
