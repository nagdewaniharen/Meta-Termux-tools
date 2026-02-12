import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  compress: true,
  turbopack: {},
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    webpackBuildWorker: false,
  },

  /**
   * Proxy all /api/* requests that do NOT match a local Next.js
   * route (i.e. everything except /api/auth/*) through to the
   * Express server.
   *
   * Next.js checks its own app/api/ routes first; only requests
   * with no local match fall through to the fallback array.
   */
  async rewrites() {
    const serverUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

    return {
      beforeFiles: [],
      afterFiles: [],
      fallback: [
        {
          source: '/api/:path*',
          destination: `${serverUrl}/:path*`,
        },
      ],
    }
  },
}

export default nextConfig
