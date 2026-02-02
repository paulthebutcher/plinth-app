/**
 * Structured logger for server-side operations.
 * Outputs JSON in production, pretty-prints in development.
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogContext {
  [key: string]: unknown
}

const isDev = process.env.NODE_ENV === 'development'

function formatMessage(
  level: LogLevel,
  message: string,
  context?: LogContext
): string {
  const timestamp = new Date().toISOString()
  const data = { timestamp, level, message, ...context }

  if (isDev) {
    // Pretty print in development
    const emoji = { debug: '🔍', info: 'ℹ️', warn: '⚠️', error: '❌' }[level]
    const contextStr = context ? ` ${JSON.stringify(context)}` : ''
    return `${emoji} [${level.toUpperCase()}] ${message}${contextStr}`
  }

  // JSON in production (for log aggregation)
  return JSON.stringify(data)
}

export const logger = {
  debug(message: string, context?: LogContext) {
    if (isDev) {
      console.debug(formatMessage('debug', message, context))
    }
  },

  info(message: string, context?: LogContext) {
    console.info(formatMessage('info', message, context))
  },

  warn(message: string, context?: LogContext) {
    console.warn(formatMessage('warn', message, context))
  },

  error(message: string, context?: LogContext) {
    console.error(formatMessage('error', message, context))
  },

  /**
   * Log API request with timing
   */
  request(
    method: string,
    path: string,
    statusCode: number,
    durationMs: number,
    context?: LogContext
  ) {
    const level = statusCode >= 500 ? 'error' : statusCode >= 400 ? 'warn' : 'info'
    this[level](`${method} ${path} ${statusCode}`, {
      method,
      path,
      statusCode,
      durationMs,
      ...context,
    })
  },

  /**
   * Log with timing - returns a function to call when done
   */
  time(operation: string, context?: LogContext): () => void {
    const start = Date.now()
    return () => {
      const durationMs = Date.now() - start
      this.info(`${operation} completed`, { durationMs, ...context })
    }
  },
}

/**
 * Wrap an async function with timing logs
 */
export function withTiming<T>(
  operation: string,
  fn: () => Promise<T>,
  context?: LogContext
): Promise<T> {
  const done = logger.time(operation, context)
  return fn().finally(done)
}
