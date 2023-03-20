/** @type {import('next').NextConfig} */
// const { withExpo } = require('@expo/next-adapter');
const withImages = require('next-images')
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development'
})

// EXPO example: https://github.com/expo/examples/tree/master/with-nextjs/pages

// const nextConfig = withExpo(withImages({
const nextConfig = withPWA(
  withImages({
    reactStrictMode: true,
    swcMinify: true,
    transpilePackages: ['react-native', 'expo'],
    images: {
      unoptimized: true
    },
    webpack: config => {
      config.experiments.topLevelAwait = true
      config.resolve.alias = {
        ...(config.resolve.alias || {}),
        // Transform all direct `react-native` imports to `react-native-web`
        'react-native$': 'react-native-web'
      }
      config.resolve.extensions = ['.web.js', '.web.ts', '.web.tsx', ...config.resolve.extensions]
      return config
    }
    // experimental: {
    //   appDir: false,
    // },
  })
)

module.exports = nextConfig
