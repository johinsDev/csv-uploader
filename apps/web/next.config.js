/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {},
  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  swcMinify: true,
}

module.exports = nextConfig
