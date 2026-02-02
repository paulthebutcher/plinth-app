import { NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'

export async function GET() {
  const error = new Error('Sentry test error - this is intentional!')
  Sentry.captureException(error)

  // Wait for Sentry to send the event before function ends
  await Sentry.flush(2000)

  return NextResponse.json({ error: 'Test error sent to Sentry' }, { status: 500 })
}

export async function POST() {
  Sentry.captureMessage('Sentry test message - this is intentional!', 'info')
  await Sentry.flush(2000)
  return NextResponse.json({ status: 'Test message sent to Sentry' })
}
