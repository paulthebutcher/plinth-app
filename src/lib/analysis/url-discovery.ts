import { createHash } from 'crypto'
import { search as exaSearch } from '@/lib/services/exa'
import { search as tavilySearch } from '@/lib/services/tavily'
import { getCached, setCache } from '@/lib/services/cache'
import type { SearchResponse, SearchResult } from '@/lib/services/types'
import type { QueryPlan } from '@/lib/analysis/query-planner'

export interface UrlCandidate {
  url: string
  title: string
  snippet: string
  query: string
  intent: string
  score: number
}

export interface UrlShortlist {
  candidates: UrlCandidate[]
  totalFound: number
  deduplicated: number
}

const CACHE_TTL_SECONDS = 60 * 60 * 24
const MAX_CONCURRENCY = 5

const trustedDomains = [
  'reuters.com',
  'bloomberg.com',
  'wsj.com',
  'ft.com',
  'economist.com',
  'hbr.org',
  'mckinsey.com',
  'bain.com',
  'bcg.com',
  'gartner.com',
  'forrester.com',
  'statista.com',
  'cbinsights.com',
  'techcrunch.com',
  'wired.com',
  'gov',
  'edu',
]

const hashKey = (value: string) =>
  createHash('sha256').update(value).digest('hex')

const normalizeUrl = (url: string) => {
  try {
    const parsed = new URL(url)
    const pathname = parsed.pathname.replace(/\/+$/, '')
    return `${parsed.origin}${pathname}`.toLowerCase()
  } catch {
    return url.toLowerCase()
  }
}

const getDomain = (url: string) => {
  try {
    return new URL(url).hostname.toLowerCase()
  } catch {
    return ''
  }
}

const pathSimilarity = (a: string, b: string) => {
  const maxLen = Math.max(a.length, b.length)
  if (maxLen === 0) return 1
  let i = 0
  while (i < a.length && i < b.length && a[i] === b[i]) {
    i += 1
  }
  return i / maxLen
}

const isTrustedDomain = (domain: string) =>
  trustedDomains.some((trusted) => domain === trusted || domain.endsWith(`.${trusted}`))

const tokenScore = (text: string, tokens: string[]) => {
  const lower = text.toLowerCase()
  const hits = tokens.filter((token) => token && lower.includes(token)).length
  return tokens.length ? hits / tokens.length : 0
}

const scoreSnippetQuality = (snippet: string) => {
  const length = snippet.trim().length
  if (length >= 120 && length <= 320) return 1
  if (length >= 60) return 0.6
  return 0.2
}

const scoreFreshness = (publishedDate?: string, freshness?: QueryPlan['freshness']) => {
  if (!publishedDate || !freshness || freshness === 'any') return 0
  const published = new Date(publishedDate).getTime()
  if (Number.isNaN(published)) return 0
  const ageDays = (Date.now() - published) / (1000 * 60 * 60 * 24)
  if (freshness === 'realtime') return ageDays <= 30 ? 1 : 0.2
  return ageDays <= 180 ? 0.7 : 0.2
}

const scoreCandidate = (
  result: SearchResult,
  plan: QueryPlan
) => {
  const tokens = `${plan.query} ${plan.intent}`.toLowerCase().split(/\W+/).filter(Boolean)
  const titleScore = tokenScore(result.title ?? '', tokens)
  const snippetScore = scoreSnippetQuality(result.snippet ?? '')
  const domainScore = isTrustedDomain(getDomain(result.url)) ? 1 : 0.3
  const freshnessScore = scoreFreshness(result.publishedDate, plan.freshness)

  const score =
    30 +
    titleScore * 40 +
    snippetScore * 15 +
    domainScore * 10 +
    freshnessScore * 5

  return Math.max(0, Math.min(100, Math.round(score)))
}

const fetchSearch = async (plan: QueryPlan): Promise<SearchResponse> => {
  const cacheKey = `search:${hashKey(plan.query)}`
  const cached = await getCached<SearchResponse>(cacheKey)
  if (cached) {
    return cached
  }

  try {
    const response = await exaSearch(plan.query)
    await setCache(cacheKey, response, CACHE_TTL_SECONDS)
    return response
  } catch {
    const response = await tavilySearch(plan.query)
    await setCache(cacheKey, response, CACHE_TTL_SECONDS)
    return response
  }
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

export async function discoverUrls(queries: QueryPlan[]): Promise<UrlShortlist> {
  console.info('URL discovery: executing queries', { count: queries.length })

  const responses = await runWithConcurrency(queries, MAX_CONCURRENCY, fetchSearch)

  const rawCandidates = responses.flatMap((response, index) => {
    const plan = queries[index]
    return response.results.map((result) => ({
      url: result.url,
      title: result.title,
      snippet: result.snippet,
      query: plan.query,
      intent: plan.intent,
      score: 0,
      publishedDate: result.publishedDate,
    }))
  })

  const totalFound = rawCandidates.length

  const exactMap = new Map<string, typeof rawCandidates[number]>()
  rawCandidates.forEach((candidate) => {
    const key = normalizeUrl(candidate.url)
    if (!exactMap.has(key)) {
      exactMap.set(key, candidate)
    }
  })

  const deduped: typeof rawCandidates = []
  exactMap.forEach((candidate) => deduped.push(candidate))

  const finalCandidates: UrlCandidate[] = []
  const seenByDomain: Record<string, string[]> = {}

  deduped.forEach((candidate) => {
    const domain = getDomain(candidate.url)
    const normalizedPath = normalizeUrl(candidate.url).replace(/^https?:\/\/[^/]+/i, '')
    const existingPaths = seenByDomain[domain] ?? []
    const isDuplicate = existingPaths.some((path) => pathSimilarity(path, normalizedPath) >= 0.8)

    if (!isDuplicate) {
      seenByDomain[domain] = [...existingPaths, normalizedPath]
      finalCandidates.push({
        url: candidate.url,
        title: candidate.title,
        snippet: candidate.snippet,
        query: candidate.query,
        intent: candidate.intent,
        score: 0,
      })
    }
  })

  const scored = finalCandidates.map((candidate) => {
    const plan = queries.find((planItem) => planItem.query === candidate.query)
    const score = plan
      ? scoreCandidate(
          {
            url: candidate.url,
            title: candidate.title,
            snippet: candidate.snippet,
            publishedDate: rawCandidates.find((c) => c.url === candidate.url)?.publishedDate,
          },
          plan
        )
      : 0
    return { ...candidate, score }
  })

  scored.sort((a, b) => b.score - a.score)
  const shortlisted = scored.slice(0, 60)

  console.info('URL discovery summary', {
    totalFound,
    deduplicated: finalCandidates.length,
    shortlisted: shortlisted.length,
  })

  return {
    candidates: shortlisted,
    totalFound,
    deduplicated: finalCandidates.length,
  }
}
