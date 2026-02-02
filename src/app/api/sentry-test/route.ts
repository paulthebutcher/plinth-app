import { NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'

export async function GET() {
  // Debug: Check if DSN is configured
  const dsn = process.env.SENTRY_DSN
  const publicDsn = process.env.NEXT_PUBLIC_SENTRY_DSN
  const client = Sentry.getClient()

  const debug = {
    hasDsn: !!dsn,
    hasPublicDsn: !!publicDsn,
    dsnPrefix: dsn?.substring(0, 30) + '...',
    hasClient: !!client,
    clientDsn: client?.getDsn()?.toString()?.substring(0, 30) + '...',
  }

  console.log('[sentry-test] Debug info:', debug)

  const error = new Error('Sentry test error - this is intentional!')
  Sentry.captureException(error)

  // Wait for Sentry to send the event before function ends
  const flushed = await Sentry.flush(2000)

  return NextResponse.json({
    error: 'Test error sent to Sentry',
    debug,
    flushed,
  }, { status: 500 })
}

export async function POST() {
  Sentry.captureMessage('Sentry test message - this is intentional!', 'info')
  await Sentry.flush(2000)
  return NextResponse.json({ status: 'Test message sent to Sentry' })
}
