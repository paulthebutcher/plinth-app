import { SearchError, type SearchResponse, type SearchResult } from './types'

export type TavilyOptions = {
  maxResults?: number
  searchDepth?: 'basic' | 'advanced'
}

const TAVILY_API_URL = 'https://api.tavily.com/search'

const toSearchResult = (result: any): SearchResult => ({
  url: result.url,
  title: result.title ?? result.url,
  snippet: result.snippet ?? result.content ?? '',
  score: typeof result.score === 'number' ? result.score : undefined,
  publishedDate: result.published_date ?? result.publishedDate ?? undefined,
})

const isRetryableStatus = (status: number) => status === 429 || status >= 500

export async function search(query: string, options?: TavilyOptions): Promise<SearchResponse> {
  const apiKey = process.env.TAVILY_API_KEY
  if (!apiKey) {
    throw new SearchError('Missing TAVILY_API_KEY', 'missing_api_key', false)
  }

  const payload = {
    api_key: apiKey,
    query,
    max_results: options?.maxResults ?? 10,
    search_depth: options?.searchDepth ?? 'basic',
    include_raw_content: false,
  }

  try {
    const response = await fetch(TAVILY_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const text = await response.text()
      throw new SearchError(
        `Tavily search failed (${response.status})`,
        text || String(response.status),
        isRetryableStatus(response.status)
      )
    }

    const data = await response.json()
    const results = Array.isArray(data?.results)
      ? data.results.map(toSearchResult)
      : []

    console.info('Tavily search', { query, results: results.length })

    return {
      results,
      query,
      source: 'tavily',
    }
  } catch (error) {
    if (error instanceof SearchError) {
      throw error
    }
    const err = error as { message?: string }
    throw new SearchError(err?.message ?? 'Tavily search failed', 'unknown_error', false)
  }
}
