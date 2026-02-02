import { NextResponse } from 'next/server'

export async function GET() {
  throw new Error('Sentry test error - this is intentional!')
}

export async function POST() {
  // This endpoint can be used to test Sentry without throwing
  // Just returns success
  return NextResponse.json({ status: 'Sentry is configured' })
}
