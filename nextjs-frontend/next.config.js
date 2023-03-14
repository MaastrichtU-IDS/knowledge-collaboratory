/** @type {import('next').NextConfig} */
const { withExpo } = require('@expo/next-adapter');
const withImages = require('next-images')
// const withPWA = require("next-pwa")
// ({
//   pwa: {
//     dest: "public",
//     register: true,
//     skipWaiting: true,
//     reactStrictMode: true,
//     productionBrowserSourceMaps: true,
//     disable: process.env.NODE_ENV === "development",
//   }
// })

// EXPO example: https://github.com/expo/examples/tree/master/with-nextjs/pages
// PWA: https://codewithmarish.com/post/build-pwa-with-nextjs-under-1-min

// const nextConfig = withPWA(withExpo(withImages({
const nextConfig = withExpo(withImages({
  // projectRoot: __dirname,
  experimental: {
    appDir: false,
    forceSwcTransforms: true,
  },
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: [
    "react-native",
    "expo",
    // Add more React Native / Expo packages here...
  ],
  webpack: (config) => {
    config.experiments.topLevelAwait = true
    return config;
  },
}))
// })))

module.exports = nextConfig
