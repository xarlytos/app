const webpack = require('@nativescript/webpack');
const { resolve } = require('path');
const webpackActual = require('webpack');

module.exports = (env) => {
  webpack.init(env);

  // Learn how to customize:
  // https://docs.nativescript.org/webpack

  webpack.chainWebpack((config) => {
    // Add your webpack configurations here
    
    // Fix for the ProvidePlugin error
    config.plugin('provide').use(webpackActual.ProvidePlugin, [{
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer']
    }]);
  });

  return webpack.resolveConfig();
};
