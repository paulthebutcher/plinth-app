import type { NextConfig } from 'next'
import { withSentryConfig } from '@sentry/nextjs'

const nextConfig: NextConfig = {
  // Enable instrumentation hook for Sentry
  experimental: {
    instrumentationHook: true,
  },
}

export default withSentryConfig(nextConfig, {
  // Sentry options
  org: 'plinth-wq',
  project: 'javascript-nextjs',

  // Suppress logs during build
  silent: true,

  // Source maps config
  sourcemaps: {
    deleteSourcemapsAfterUpload: true,
  },
})
