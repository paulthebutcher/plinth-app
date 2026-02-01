import { type ScrapedContent } from './types'

const APIFY_API_URL =
  'https://api.apify.com/v2/acts/apify~website-content-crawler/run-sync-get-dataset-items'

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

export async function scrape(url: string): Promise<ScrapedContent | null> {
  const apiToken = process.env.APIFY_API_TOKEN
  if (!apiToken) {
    return null
  }

  try {
    const response = await fetch(`${APIFY_API_URL}?token=${apiToken}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        startUrls: [{ url }],
        maxCrawlDepth: 0,
        maxPagesPerCrawl: 1,
        proxyConfiguration: { useApifyProxy: true },
        removeSelectors: ['script', 'style', 'noscript'],
        saveMarkdown: false,
      }),
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    const item = Array.isArray(data) ? data[0] : null
    if (!item) return null

    const rawText =
      item.text ||
      item.content ||
      item.markdown ||
      (item.html ? stripHtml(item.html) : '')
    const cleaned = normalizeWhitespace(rawText)
    const { text, wordCount } = limitWords(cleaned, 10000)

    return {
      url: item.url || url,
      title: item.title || item.pageTitle || url,
      text,
      wordCount,
      extractedAt: new Date().toISOString(),
      source: 'apify',
    }
  } catch (error) {
    return null
  }
}
