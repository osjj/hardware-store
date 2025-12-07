/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'admin.bunnybot.top' },
      { protocol: 'https', hostname: 'api.bunnybot.top' },
    ],
  },
}

module.exports = nextConfig
