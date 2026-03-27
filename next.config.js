const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Image configuration
  images: {
    domains: ['localhost', 'rapidtie.vaultstring.com'],
    formats: ['image/avif', 'image/webp'],
  },

  // Environment variables that will be available on the client
  env: {
    PROJECT_NAME: 'Rapid Tie Payment Gateway',
  },

  // Experimental features (optional)
  experimental: {
    optimizeCss: false, // Set to true if you want CSS optimization
  },

  // Redirects
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ]
  },

  // Headers for security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig