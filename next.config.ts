import type { NextConfig } from 'next'
import { withSentryConfig } from '@sentry/nextjs'

const nextConfig: NextConfig = {
  // Config options here
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
