import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,

  // Enable in all environments (set to false locally if too noisy)
  enabled: true,

  // Sample rate for error events
  sampleRate: 1.0,

  // Performance monitoring
  tracesSampleRate: 0.1,
})
