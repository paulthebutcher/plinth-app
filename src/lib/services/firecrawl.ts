import { type ScrapedContent } from './types'
import { scrape as scrapeWithApify } from './apify'

export type FirecrawlOptions = {
  timeout?: number
  waitForJS?: boolean
}

const FIRECRAWL_API_URL = 'https://api.firecrawl.dev/v1/scrape'

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const isRetryableStatus = (status: number) => status === 429 || status >= 500
const isPermanentStatus = (status: number) => status === 400 || status === 401 || status === 403 || status === 404

const normalizeWhitespace = (value: string) =>
  value
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim()

const stripHtml = (html: string) => {
  const withoutScripts = html.replace(/<script[\s\S]*?<\/script>/gi, '')
  const withoutStyles = withoutScripts.replace(/<style[\s\S]*?<\/style>/gi, '')
  const withBreaks = withoutStyles
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<\/li>/gi, '\n')
  const withoutTags = withBreaks.replace(/<[^>]+>/g, '')
  const decoded = withoutTags
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
  return normalizeWhitespace(decoded)
}

const limitWords = (text: string, maxWords: number) => {
  const words = text.split(/\s+/).filter(Boolean)
  if (words.length <= maxWords) {
    return { text, wordCount: words.length }
  }
  const truncated = words.slice(0, maxWords).join(' ')
  return { text: truncated, wordCount: maxWords }
}

const buildScrapedContent = (data: {
  url: string
  title?: string
  text?: string
  html?: string
}) => {
  const rawText = data.text ?? (data.html ? stripHtml(data.html) : '')
  const cleaned = normalizeWhitespace(rawText)
  const { text, wordCount } = limitWords(cleaned, 10000)
  return {
    url: data.url,
    title: data.title ?? data.url,
    text,
    wordCount,
    extractedAt: new Date().toISOString(),
    source: 'firecrawl' as const,
  }
}

const firecrawlRequest = async (url: string, options?: FirecrawlOptions) => {
  const apiKey = process.env.FIRECRAWL_API_KEY
  if (!apiKey) {
    throw new Error('Missing FIRECRAWL_API_KEY')
  }

  const timeout = options?.timeout ?? 30000
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(FIRECRAWL_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        url,
        formats: ['text', 'html'],
        timeout: Math.round(timeout / 1000),
        waitFor: options?.waitForJS ? 2000 : undefined,
      }),
      signal: controller.signal,
    })

    if (!response.ok) {
      const text = await response.text()
      const error = new Error(text || `Firecrawl failed (${response.status})`) as Error & {
        status?: number
      }
      error.status = response.status
      throw error
    }

    const data = await response.json()
    const content = data?.data ?? data

    return buildScrapedContent({
      url: content?.url ?? url,
      title: content?.title,
      text: content?.text ?? content?.content,
      html: content?.html,
    })
  } finally {
    clearTimeout(timeoutId)
  }
}

export async function scrape(url: string, options?: FirecrawlOptions): Promise<ScrapedContent | null> {
  const delays = [1000, 2000, 4000]
  let lastError: unknown

  for (let attempt = 0; attempt <= delays.length; attempt += 1) {
    try {
      return await firecrawlRequest(url, options)
    } catch (error) {
      lastError = error
      const status = (error as { status?: number }).status
      if (status && isPermanentStatus(status)) {
        return null
      }
      if (status && !isRetryableStatus(status)) {
        return null
      }
      if (attempt === delays.length) {
        break
      }
      await sleep(delays[attempt])
    }
  }

  const status = (lastError as { status?: number }).status
  if (status && isPermanentStatus(status)) {
    return null
  }
  return null
}

export async function scrapeWithFallback(url: string): Promise<ScrapedContent | null> {
  const primary = await scrape(url)
  if (primary) {
    console.info('Scrape succeeded', { source: 'firecrawl' })
    return primary
  }

  const jsFallback = await scrape(url, { waitForJS: true })
  if (jsFallback) {
    console.info('Scrape succeeded', { source: 'firecrawl-js' })
    return jsFallback
  }

  const apify = await scrapeWithApify(url)
  if (apify) {
    console.info('Scrape succeeded', { source: 'apify' })
  }
  return apify
}
