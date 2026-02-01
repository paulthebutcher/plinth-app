import { SearchError, type SearchResponse, type SearchResult } from './types'

export type ExaOptions = {
  numResults?: number
  type?: 'keyword' | 'neural'
  includeDomains?: string[]
  excludeDomains?: string[]
}

const EXA_API_URL = 'https://api.exa.ai/search'

const toSearchResult = (result: any): SearchResult => ({
  url: result.url,
  title: result.title ?? result.url,
  snippet: result.snippet ?? result.text ?? '',
  score: typeof result.score === 'number' ? result.score : undefined,
  publishedDate: result.published_date ?? result.publishedDate ?? undefined,
})

const isRetryableStatus = (status: number) => status === 429 || status >= 500

export async function search(query: string, options?: ExaOptions): Promise<SearchResponse> {
  const apiKey = process.env.EXA_API_KEY
  if (!apiKey) {
    throw new SearchError('Missing EXA_API_KEY', 'missing_api_key', false)
  }

  const payload = {
    query,
    num_results: options?.numResults ?? 10,
    type: options?.type ?? 'neural',
    include_domains: options?.includeDomains,
    exclude_domains: options?.excludeDomains,
  }

  try {
    const response = await fetch(EXA_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const text = await response.text()
      throw new SearchError(
        `Exa search failed (${response.status})`,
        text || String(response.status),
        isRetryableStatus(response.status)
      )
    }

    const data = await response.json()
    const results = Array.isArray(data?.results)
      ? data.results.map(toSearchResult)
      : []

    console.info('Exa search', { query, results: results.length })

    return {
      results,
      query,
      source: 'exa',
    }
  } catch (error) {
    if (error instanceof SearchError) {
      throw error
    }
    const err = error as { message?: string }
    throw new SearchError(err?.message ?? 'Exa search failed', 'unknown_error', false)
  }
}
