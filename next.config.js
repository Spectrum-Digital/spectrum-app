/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  experimental: {
    swcPlugins: [['@swc-jotai/react-refresh', {}]],
  },
  trailingSlash: true
}
