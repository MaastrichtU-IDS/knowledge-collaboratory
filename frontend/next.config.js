/** @type {import('next').NextConfig} */
const { withExpo } = require('@expo/next-adapter');
const withImages = require('next-images')

const nextConfig = withExpo(withImages({
  projectRoot: __dirname,
  experimental: {
    appDir: true,
  },
  webpack: (config) => {
    config.experiments.topLevelAwait = true
    return config;
  },
}))

module.exports = nextConfig
