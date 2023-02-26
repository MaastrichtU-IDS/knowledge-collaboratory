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
