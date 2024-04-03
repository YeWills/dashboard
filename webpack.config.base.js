const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

const publicPath = '/';

module.exports = {
  entry: path.resolve(__dirname, 'src', 'index.js'),
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath,
    chunkFilename: '[chunkhash].async.js',
  },
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, 'src', 'components'),
      '@pages': path.resolve(__dirname, 'src', 'pages'),
      '@utils': path.resolve(__dirname, 'src', 'utils'),
      '@primaryTool': path.resolve(__dirname, 'primaryTool'),
      '@models': path.resolve(__dirname, 'src', 'models'),
      '@routes': path.resolve(__dirname, 'src', 'routes'),
      '@services': path.resolve(__dirname, 'src', 'services'),
      '@src': path.resolve(__dirname, 'src'),
      '@root': path.resolve(__dirname),
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [path.resolve(__dirname, 'src'), path.resolve(__dirname, 'primaryTool')],
        exclude: [],
        loader: 'babel-loader?cacheDirectory',
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader?modules&localIdentName=__[name]-[local]-[hash:5]__', 'sass-loader'],
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
        ],
      },
      {
        test: /\.(ttf|eot|svg|woff|woff2|png|svg|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
            },
          },
        ],
      },
    ],
  },
  externals: {},
  node: {
    fs: 'empty',
    module: 'empty',
  },
  // devtool: 'source-map',
  devtool: 'hidden-source-map',
  optimization: {
    splitChunks: {
      cacheGroups: {
        styles: {
          name: 'styles',
          test: /\.(css|less)/,
          chunks: 'all',
          enforce: true,
        },
      },
    },
  },
  plugins: [
    new ProgressBarPlugin(),
    new FriendlyErrorsWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src', 'index.ejs'),
      filename: 'index.html',
      hash: true,
    }),
    new webpack.HotModuleReplacementPlugin(),
    new ManifestPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        APP_ENV: JSON.stringify(process.env.APP_ENV),
      },
    }),
  ],
};
