const CleanWebpackPlugin = require('clean-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const merge = require('webpack-merge');
const baseConf = require('./webpack.config.base');

const proConf = {
  stats: {
    children: false,
  },
  performance: {
    hints: false,
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        styles: {
          name: 'styles',
          test: /\.(css|less)/,
          chunks: 'all',
          enforce: true,
        },
        commons: {
          name: 'commons',
          chunks: 'initial',
          minChunks: 2,
        },
        vendors: {
          name: 'vendors',
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
        },
      },
    },
    runtimeChunk: true,
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new CompressionPlugin({
      filename: '[path].gz[query]',
    }),
  ],
};

module.exports = merge(baseConf, proConf);
