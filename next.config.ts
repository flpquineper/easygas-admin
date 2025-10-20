/** @type {import('next').NextConfig} */
const nextConfig = {

  images: {
    remotePatterns: [
      {
       protocol: 'https',
        hostname: 'trevogas.com.br',
        port: '',
        pathname: '/wp-content/**',
      },
    ],
  },
};

module.exports = nextConfig;