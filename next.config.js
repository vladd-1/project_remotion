/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // Handle remotion's specific needs
    config.resolve.alias = {
      ...config.resolve.alias,
    };
    
    // Externalize ffmpeg-related modules on the server
    if (isServer) {
      config.externals.push({
        'fluent-ffmpeg': 'commonjs fluent-ffmpeg',
      });
    }

    return config;
  },
  // Increase body size limit for video uploads
  api: {
    bodyParser: {
      sizeLimit: '500mb',
    },
  },
  experimental: {
    serverComponentsExternalPackages: ['@remotion/renderer'],
  },
};

module.exports = nextConfig;

