/** @type {import('next').NextConfig} */
const config = {
  images: {
    // VPNs that use fake-IP DNS can make Sanity's CDN resolve inside
    // 198.18.0.0/15, which Next's server-side optimizer correctly rejects.
    // Let the browser load remote assets directly during local development.
    unoptimized: process.env.NODE_ENV === 'development',
    remotePatterns: [
      { hostname: 'cdn.sanity.io' },
      { hostname: 'source.unsplash.com' },
      { hostname: 'f4.bcbits.com' },
    ],
  },
  typescript: {
    // Set this to false if you want production builds to abort if there's type errors
    ignoreBuildErrors: process.env.VERCEL_ENV === 'production',
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  experimental: {
    taint: true,
  },
}

export default config
