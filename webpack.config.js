const path = require('path');
const webpack = require('webpack');

module.exports = {
  watch: true,
  mode: 'production',
  entry: './src/js/_index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(svg|woff|woff2|ttf|eot|otf|bmp|png|jpe?g|ico|gif|mp3|mp4)$/,
        loader: 'file-loader',
      },
    ],
  },
  plugins: [
    // Use the ProvidePlugin constructor to inject jquery implicit globals
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': "jquery'",
      'window.$': 'jquery',
    }),
  ],
};
