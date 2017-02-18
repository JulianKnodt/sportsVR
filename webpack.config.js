const webpack = require('webpack');

module.exports = {
  entry: './client/src/app.js',
  output: {
    filename: 'app.js',
    path: './client/build',
    publicPath: '/build/'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react', 'stage-0']
        }
      }
    ]
  }
}