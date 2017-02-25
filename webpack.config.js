const webpack = require('webpack');

module.exports = {
  entry: './client/src/app.jsx',
  output: {
    filename: 'app.js',
    path: './client/build',
    publicPath: '/build/'
  },
  module: {
    rules : [
      {
        test: /\.jsx$/,
        exclude: [/node_modules/],
        use: [{
          loader: 'babel-loader',
          query: {
            presets: ['es2015', 'react', 'stage-0']
          }
        }],
      },
      {
        test: /\.json$/,
        use: [{
          loader: 'json-loader'
        }]
      }
    ]
  }
}