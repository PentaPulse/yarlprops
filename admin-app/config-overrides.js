const path = require('path');

module.exports = {
  webpack: (config) => {
    config.resolve.fallback = {
      util: require.resolve('util/')
    };
    return config;
  }
};
