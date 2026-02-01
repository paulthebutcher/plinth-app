import { createHash } from 'crypto'
import { scrapeWithFallback } from '@/lib/services/firecrawl'
import { getCached, setCache } from '@/lib/services/cache'
import type { UrlCandidate } from '@/lib/analysis/url-discovery'
import type { ScrapedContent } from '@/lib/services/types'

export interface ExtractedContent {
  url: string
  title: string
  text: string
  wordCount: number
  extractedAt: string
  sourceQuery: string
  sourceIntent: string
}

const CACHE_TTL_SECONDS = 60 * 60 * 24 * 7
const MAX_CONCURRENCY = 10

const hashKey = (value: string) =>
  createHash('sha256').update(value).digest('hex')

const limitWords = (text: string, maxWords: number) => {
  const words = text.split(/\s+/).filter(Boolean)
  if (words.length <= maxWords) {
    return { text, wordCount: words.length }
  }
  const truncated = words.slice(0, maxWords).join(' ')
  return { text: truncated, wordCount: maxWords }
}

const runWithConcurrency = async <T, R>(
  items: T[],
  concurrency: number,
  worker: (item: T) => Promise<R>
) => {
  const results: R[] = []
  let index = 0

  const runners = Array.from({ length: Math.min(concurrency, items.length) }).map(async () => {
    while (index < items.length) {
      const currentIndex = index
      index += 1
      results[currentIndex] = await worker(items[currentIndex])
    }
  })

  await Promise.all(runners)
  return results
}

const buildCacheKey = (url: string) => `scrape:${hashKey(url)}`

const getScrape = async (url: string): Promise<ScrapedContent | null> => {
  const cacheKey = buildCacheKey(url)
  const cached = await getCached<ScrapedContent>(cacheKey)
  if (cached) return cached

  const scraped = await scrapeWithFallback(url)
  if (scraped) {
    await setCache(cacheKey, scraped, CACHE_TTL_SECONDS)
  }

  return scraped
}

export async function extractContent(urls: UrlCandidate[]): Promise<ExtractedContent[]> {
  const sorted = [...urls].sort((a, b) => b.score - a.score)
  const targetCount = Math.min(35, Math.max(25, sorted.length))
  const selected = sorted.slice(0, targetCount)

  const results = await runWithConcurrency(selected, MAX_CONCURRENCY, async (candidate) => {
    const scraped = await getScrape(candidate.url)
    if (!scraped) return null
    const trimmed = limitWords(scraped.text, 5000)
    return {
      url: scraped.url,
      title: scraped.title,
      text: trimmed.text,
      wordCount: trimmed.wordCount,
      extractedAt: scraped.extractedAt,
      sourceQuery: candidate.query,
      sourceIntent: candidate.intent,
    }
  })

  const successful = results.filter((item): item is ExtractedContent => Boolean(item))

  console.info('Content extraction', {
    attempted: selected.length,
    succeeded: successful.length,
    failed: selected.length - successful.length,
  })

  return successful
}
