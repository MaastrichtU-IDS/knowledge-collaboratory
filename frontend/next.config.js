/** @type {import('next').NextConfig} */
const { withExpo } = require('@expo/next-adapter');

const nextConfig = withExpo({
  experimental: {
    appDir: true,
  },
  webpack: (config) => {
    config.experiments.topLevelAwait = true
    return config;
  },
})

module.exports = nextConfig



// const { withExpo } = require('@expo/next-adapter');
// const withPlugins = require('next-compose-plugins');
// const withTM = require('next-transpile-modules')(['react-native-web']);

// const nextConfig = {
//   experimental: {
//     appDir: true,
//   },
//   webpack: (config) => {
//     config.experiments.topLevelAwait = true
//     return config;
//   },
// };

// module.exports = withPlugins([withTM, [withExpo, { projectRoot: __dirname }]], nextConfig);
