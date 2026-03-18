/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Exclude browser-only packages from SSR bundling
  experimental: {
    serverComponentsExternalPackages: [
      "@shelby-protocol/sdk",
    ],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Tell webpack to ignore browser-only modules on the server
      config.resolve.alias = {
        ...config.resolve.alias,
        "@shelby-protocol/sdk/browser": false,
      };
    } else {
      // Browser polyfills
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: require.resolve("crypto-browserify"),
        stream: require.resolve("stream-browserify"),
        buffer: require.resolve("buffer"),
      };
    }
    return config;
  },
};

module.exports = nextConfig;
