import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Enable in all environments (set to false locally if too noisy)
  enabled: true,

  // Sample rate for error events (1.0 = 100%)
  sampleRate: 1.0,

  // Performance monitoring (optional, can reduce to save quota)
  tracesSampleRate: 0.1,

  // Don't capture console logs as breadcrumbs (reduces noise)
  integrations: [
    Sentry.breadcrumbsIntegration({
      console: false,
    }),
  ],

  // Filter out noisy errors
  ignoreErrors: [
    // Browser extensions
    'top.GLOBALS',
    // Random plugins/extensions
    'originalCreateNotification',
    'canvas.contentDocument',
    // Facebook borance
    'fb_xd_fragment',
    // Chrome specific
    'ResizeObserver loop limit exceeded',
    // Network errors
    'Failed to fetch',
    'NetworkError',
    'Load failed',
  ],
})
