const merge = require('webpack-merge');
const { port, httpUrl } = require('./const');

const baseConf = require('./webpack.config.base');

const localConf = {
  devServer: {
    disableHostCheck: true,
    host: '0.0.0.0',
    port,
    open: 'http://localhost:2022',
    hot: true,
    quiet: true,
    historyApiFallback: true,
    overlay: {
      errors: true,
    },
    stats: {
      children: false,
      chunks: false,
      assets: false,
      modules: false,
    },
    proxy: {
      '/tryqapi': {
        target: httpUrl,
        changeOrigin: true,
        secure: false,
      },
    },
  },
};

module.exports = merge(localConf, baseConf);
