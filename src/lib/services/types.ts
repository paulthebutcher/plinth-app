export interface SearchResult {
  url: string
  title: string
  snippet: string
  score?: number
  publishedDate?: string
}

export interface SearchResponse {
  results: SearchResult[]
  query: string
  source: 'exa' | 'tavily'
}

export interface ScrapedContent {
  url: string
  title: string
  text: string
  wordCount: number
  extractedAt: string
  source: 'firecrawl' | 'apify'
}

export class SearchError extends Error {
  code?: string
  retryable: boolean

  constructor(message: string, code?: string, retryable = false) {
    super(message)
    this.name = 'SearchError'
    this.code = code
    this.retryable = retryable
  }
}
