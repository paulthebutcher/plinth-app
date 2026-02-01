# Phase 2: AI Analysis Pipeline (Weeks 4-6)

**Goal**: Full evidence-first AI pipeline operational. Decision analysis complete in 5-8 minutes.

**Status**: ⏳ Not Started

> **Architecture Reference**: See [LLM_ORCHESTRATION.md](../../specs/LLM_ORCHESTRATION.md) for the complete pipeline.

---

## ⚠️ Pre-Phase Checklist

Before starting ANY prompt in this phase, verify:

- [ ] Phase 1 (Decision Engine) is complete and all milestones pass
- [ ] You can create a decision, fill frame/context, and reach results page
- [ ] Database has: `decisions`, `constraints`, `jobs`, `users`, `organizations` tables
- [ ] Auth flow works end-to-end (login → dashboard → analyze flow)
- [ ] `npm run dev` starts without errors
- [ ] `npm run build` completes without TypeScript errors

---

## SYSTEMIC NOTES FOR ALL PROMPTS

### Existing Files (DO NOT RECREATE)
These files already exist from Phase 0-1. Prompts should EXTEND, not recreate:

**Auth & API Patterns:**
- `src/lib/auth/require-org-context.ts` — Use this for ALL API routes
- `src/lib/supabase/server.ts` — Server-side Supabase client
- `src/lib/supabase/client.ts` — Browser Supabase client
- `src/lib/utils.ts` — Utility functions (cn, etc.)

**API Routes (extend these patterns):**
- `src/app/api/decisions/route.ts` — GET/POST decisions
- `src/app/api/decisions/[id]/route.ts` — GET/PATCH/DELETE single decision
- `src/app/api/decisions/[id]/frame/route.ts` — PATCH frame fields
- `src/app/api/decisions/[id]/context/route.ts` — PATCH context fields
- `src/app/api/decisions/[id]/analyze/route.ts` — POST to start analysis
- `src/app/api/decisions/[id]/constraints/route.ts` — GET/POST constraints
- `src/app/api/jobs/[id]/route.ts` — GET job status

**UI Components:**
- `src/app/(dashboard)/analyze/[id]/scanning/page.tsx` — Scanning page (update to use real job)
- `src/components/analyze/scanning-progress.tsx` — Progress display (update for real progress)
- `src/hooks/use-job-polling.ts` — Job status polling

### Standard Auth Pattern (use requireOrgContext)
```typescript
import { requireOrgContext } from '@/lib/auth/require-org-context'

export async function POST(request: NextRequest) {
  const ctx = await requireOrgContext()
  if (!ctx.ok) return ctx.errorResponse

  const { supabase, user, orgId } = ctx
  // ... rest of handler
}
```

### Database Tables to Create in This Phase
```sql
-- Evidence cards from web scraping
evidence (
  id, decision_id, org_id,
  claim, source_url, source_title, source_snippet,
  credibility_score, relevance_score, freshness,
  extracted_at, created_at
)

-- Generated options
options (
  id, decision_id, org_id,
  title, summary, commits_to, deprioritizes,
  primary_upside, primary_risk,
  reversibility, reversibility_explanation,
  evidence_ids[], -- array of evidence IDs that ground this option
  created_at
)

-- Evidence-to-option mapping
evidence_mappings (
  id, option_id, evidence_id, decision_id,
  relationship, -- 'supporting' | 'contradicting' | 'unknown'
  relevance_explanation, impact_level,
  created_at
)

-- Option scores
option_scores (
  id, option_id, decision_id,
  evidence_strength, evidence_recency, source_reliability,
  corroboration, constraint_fit, assumption_risk,
  total_score, score_rationale,
  created_at
)
```

### Error Response Pattern
```typescript
// 400 - Validation error
{ error: { code: 'validation_error', message: 'Specific message' } }

// 401 - Not authenticated (handled by requireOrgContext)
{ error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } }

// 404 - Not found
{ error: { code: 'not_found', message: 'Resource not found' } }

// 500 - Server error
{ error: { code: 'server_error', message: error.message } }
```

---

## Overview: The AI Pipeline

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        ANALYSIS PIPELINE                                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Step 3: EVIDENCE SCAN (The Big One)                                     │
│  ├── 3A: Query Planning (LLM-only)                                       │
│  ├── 3B: URL Discovery (Exa/Tavily)                                      │
│  ├── 3C: Content Extraction (Firecrawl)                                  │
│  └── 3D: Evidence Card Generation (LLM)                                  │
│                                                                          │
│  Step 4: OPTION GENERATION                                               │
│  └── Generate 3-6 distinct commitments from evidence                     │
│                                                                          │
│  Step 5: EVIDENCE-TO-OPTION MAPPING                                      │
│  └── Supporting / Contradicting / Unknown per option                     │
│                                                                          │
│  Step 6: CONFIDENCE SCORING                                              │
│  └── Transparent scoring with 6 factors                                  │
│                                                                          │
│  Step 7: RECOMMENDATION                                                  │
│  └── Primary + hedge + decision changers                                 │
│                                                                          │
│  Step 8: BRIEF GENERATION                                                │
│  └── Exportable artifact with citations                                  │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

**Budget per Decision**: ~12 queries, 40 URLs, 25 scrapes, ~$0.50

---

## 2.1 External Services Setup (Week 4)

> **⚠️ MANUAL SETUP REQUIRED**: This section requires creating accounts and getting API keys. Cannot be automated.

### OpenAI API

1. Go to platform.openai.com → API Keys
2. Create new secret key
3. Add to `.env.local`:
   ```env
   OPENAI_API_KEY=sk-...
   ```

### Exa (Primary Search)

1. Go to exa.ai → Sign up
2. Get API key from dashboard
3. Add to `.env.local`:
   ```env
   EXA_API_KEY=...
   ```

### Firecrawl (Primary Scraping)

1. Go to firecrawl.dev → Sign up
2. Get API key from dashboard
3. Add to `.env.local`:
   ```env
   FIRECRAWL_API_KEY=fc-...
   ```

### Tavily (Fallback Search)

1. Go to tavily.com → Sign up
2. Get API key from dashboard
3. Add to `.env.local`:
   ```env
   TAVILY_API_KEY=tvly-...
   ```

### Apify (Fallback Scraping)

1. Go to apify.com → Sign up
2. Get API token from settings
3. Add to `.env.local`:
   ```env
   APIFY_API_TOKEN=apify_api_...
   ```

**Add all to Vercel Environment Variables for all environments.**

| Task | Acceptance Criteria | Tests | Status |
|------|---------------------|-------|--------|
| 🔧 OpenAI setup | API key works, GPT-4o/mini accessible | Manual: test call | |
| 🔧 Exa setup | API key works, search returns results | Manual: test search | |
| 🔧 Firecrawl setup | API key works, can scrape URL | Manual: test scrape | |
| 🔧 Tavily setup | API key works, fallback tested | Manual: test search | |
| 🔧 Apify setup | API token works | Manual: verify | |
| 🔧 Vercel env vars | All keys in all environments | Manual: verify | |

---

## 2.2 Service Clients (Week 4)

> **ANNOTATION**: Each client is isolated with its own error handling. Clients return typed responses for TypeScript safety. Mock implementations allow testing without API keys.

### 2.2a Create OpenAI Client

**Windsurf Prompt:**
```
GOAL: Create OpenAI client wrapper with streaming support.

FILES TO CREATE:
- src/lib/services/openai.ts

BEHAVIOR:
1. Export async function `complete(prompt: string, options?: CompletionOptions)`
   - options: { model?: 'gpt-4o' | 'gpt-4o-mini', temperature?: number, maxTokens?: number }
   - Default model: 'gpt-4o-mini' (cost optimization)
   - Uses OpenAI SDK: `import OpenAI from 'openai'`
   - Returns: { content: string, usage: { promptTokens, completionTokens } }

2. Export async function `completeJSON<T>(prompt: string, schema: z.ZodSchema<T>, options?: CompletionOptions)`
   - Same as complete but parses response as JSON
   - Validates against provided Zod schema
   - Retries once if JSON parsing fails
   - Returns: { data: T, usage: { promptTokens, completionTokens } }

3. Export async function `stream(prompt: string, options?: CompletionOptions)`
   - Returns AsyncIterable<string> for streaming responses
   - Use for brief generation where streaming UX matters

4. Error handling:
   - Wrap all calls in try/catch
   - Retry 3x with exponential backoff (1s, 2s, 4s) for rate limits
   - Throw typed error: `new OpenAIError(message, code, retryable)`

CONSTRAINTS:
- Use `OPENAI_API_KEY` from process.env
- DO NOT log API key
- DO log token usage for cost tracking
- Create src/lib/services/index.ts to re-export all services

ACCEPTANCE CRITERIA:
- `complete('Say hello')` returns response with usage
- `completeJSON(prompt, schema)` returns validated object
- Retries on rate limit errors
- TypeScript compiles without errors

⚠️ CANNOT FULLY TEST UNTIL: OpenAI API key configured
```

| Task | Acceptance Criteria | Status |
|------|---------------------|-------|--------|
| 💻 OpenAI client | complete() and completeJSON() work | |
| 💻 Streaming | stream() returns async iterable | |
| 💻 Retry logic | Retries 3x on rate limits | |

---

### 2.2b Create Search Clients (Exa + Tavily)

**Windsurf Prompt:**
```
GOAL: Create Exa (primary) and Tavily (fallback) search clients.

FILES TO CREATE:
- src/lib/services/exa.ts
- src/lib/services/tavily.ts

SHARED TYPES (create in src/lib/services/types.ts):
```typescript
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
```

EXA CLIENT (exa.ts):
1. Export async function `search(query: string, options?: ExaOptions)`
   - options: { numResults?: number, type?: 'keyword' | 'neural', includeDomains?: string[], excludeDomains?: string[] }
   - Default numResults: 10
   - Uses Exa SDK or REST API
   - Returns: SearchResponse

2. Error handling:
   - Throw `SearchError` with retryable flag
   - Log query and result count (not full results)

TAVILY CLIENT (tavily.ts):
1. Export async function `search(query: string, options?: TavilyOptions)`
   - options: { maxResults?: number, searchDepth?: 'basic' | 'advanced' }
   - Default maxResults: 10
   - Returns: SearchResponse (same shape as Exa)

2. This is FALLBACK - only called when Exa fails

CONSTRAINTS:
- Use `EXA_API_KEY` and `TAVILY_API_KEY` from process.env
- Both must return same SearchResponse shape for interchangeability
- DO NOT include full page content (that's Firecrawl's job)

ACCEPTANCE CRITERIA:
- `exaSearch('AI trends')` returns SearchResponse with URLs
- `tavilySearch('AI trends')` returns same shape
- Can swap between them without code changes

⚠️ CANNOT FULLY TEST UNTIL: Exa and Tavily API keys configured
```

| Task | Acceptance Criteria | Status |
|------|---------------------|-------|--------|
| 💻 Exa client | search() returns SearchResponse | |
| 💻 Tavily client | search() returns same shape | |
| 💻 Shared types | SearchResult, SearchResponse exported | |

---

### 2.2c Create Scraping Clients (Firecrawl + Apify)

**Windsurf Prompt:**
```
GOAL: Create Firecrawl (primary) and Apify (fallback) scraping clients.

FILES TO CREATE:
- src/lib/services/firecrawl.ts
- src/lib/services/apify.ts

SHARED TYPES (add to src/lib/services/types.ts):
```typescript
export interface ScrapedContent {
  url: string
  title: string
  text: string  // Clean extracted text, no HTML
  wordCount: number
  extractedAt: string  // ISO timestamp
  source: 'firecrawl' | 'apify'
}
```

FIRECRAWL CLIENT (firecrawl.ts):
1. Export async function `scrape(url: string, options?: FirecrawlOptions)`
   - options: { timeout?: number, waitForJS?: boolean }
   - Default timeout: 30000ms
   - Returns: ScrapedContent

2. Export async function `scrapeWithFallback(url: string)`
   - Try Firecrawl default first
   - If fails, try with waitForJS: true
   - If still fails, try Apify
   - If all fail, return null (graceful skip)
   - Log which method succeeded

3. Error handling:
   - Timeout after 30s
   - Return null on permanent failures (404, blocked)
   - Retry on temporary failures (5xx, network)

APIFY CLIENT (apify.ts):
1. Export async function `scrape(url: string)`
   - Uses Apify web scraper actor
   - Returns: ScrapedContent (same shape)
   - This is FALLBACK only

CONSTRAINTS:
- Use `FIRECRAWL_API_KEY` and `APIFY_API_TOKEN` from process.env
- Limit extracted text to 10,000 words (truncate if longer)
- Strip HTML tags, scripts, styles
- Preserve paragraph structure with newlines

ACCEPTANCE CRITERIA:
- `scrape('https://example.com')` returns clean text
- `scrapeWithFallback(url)` tries all methods in order
- Returns null instead of throwing on unfixable failures
- Text is clean (no HTML tags)

⚠️ CANNOT FULLY TEST UNTIL: Firecrawl and Apify API keys configured
```

| Task | Acceptance Criteria | Status |
|------|---------------------|-------|--------|
| 💻 Firecrawl client | scrape() returns ScrapedContent | |
| 💻 Apify client | scrape() returns same shape | |
| 💻 Fallback chain | scrapeWithFallback() tries all methods | |
| 💻 Graceful failures | Returns null, doesn't throw | |

---

### 2.2d Create Cache Layer

**Windsurf Prompt:**
```
GOAL: Create caching layer for expensive operations.

FILES TO CREATE:
- src/lib/services/cache.ts

BEHAVIOR:
1. Use Supabase for persistent cache (create `cache` table)
2. Export functions:
   - `getCached<T>(key: string): Promise<T | null>`
   - `setCache<T>(key: string, value: T, ttlSeconds: number): Promise<void>`
   - `invalidateCache(keyPattern: string): Promise<void>`

3. Cache key patterns:
   - `search:${hash(query)}` — Search results, TTL: 24 hours
   - `scrape:${hash(url)}` — Scraped content, TTL: 7 days
   - `evidence:${decisionId}` — Evidence cards, TTL: 1 hour

4. Table schema:
   ```sql
   CREATE TABLE cache (
     key TEXT PRIMARY KEY,
     value JSONB NOT NULL,
     expires_at TIMESTAMPTZ NOT NULL,
     created_at TIMESTAMPTZ DEFAULT NOW()
   );
   CREATE INDEX idx_cache_expires ON cache(expires_at);
   ```

5. Auto-cleanup: Delete expired entries on read miss

CONSTRAINTS:
- Use Supabase service role for cache operations (bypass RLS)
- Serialize/deserialize with JSON
- Handle cache misses gracefully (return null, don't throw)
- Log cache hits/misses for debugging

ACCEPTANCE CRITERIA:
- setCache then getCached returns same value
- Expired entries return null
- Cache reduces API calls on repeated operations

⚠️ CAN TEST LOCALLY: Uses Supabase, no external API keys needed
```

| Task | Acceptance Criteria | Status |
|------|---------------------|-------|--------|
| 💻 Cache table | Migration creates cache table | |
| 💻 get/set functions | Round-trip works | |
| 💻 TTL expiration | Expired entries return null | |

---

## 2.3 Evidence Scan Pipeline (Week 4-5)

> **ANNOTATION**: This is the most complex part. Each sub-step is a separate function that can be tested independently. The Inngest function orchestrates them.

### 2.3a Query Planner (Step 3A)

**Windsurf Prompt:**
```
GOAL: Create query planner that converts decision frame into search queries.

FILES TO CREATE:
- src/lib/analysis/query-planner.ts

BEHAVIOR:
1. Export async function `planQueries(decision: DecisionInput): Promise<QueryPlan[]>`

2. Input type:
   ```typescript
   interface DecisionInput {
     decisionFrame: string
     decisionType: string
     companyContext?: string
     constraints?: { category: string, description: string }[]
   }
   ```

3. Output type:
   ```typescript
   interface QueryPlan {
     query: string           // The search query
     intent: string          // What we're looking for
     freshness: 'any' | 'recent' | 'realtime'  // How fresh results need to be
     domainHints?: string[]  // Preferred domains (optional)
   }
   ```

4. LLM call:
   - Use completeJSON from openai client
   - Model: gpt-4o-mini (cost optimization)
   - Prompt structure:
     ```
     You are a research assistant planning web searches for a strategic decision.

     Decision: {decisionFrame}
     Type: {decisionType}
     Context: {companyContext}
     Constraints: {constraints}

     Generate 8-20 targeted search queries that will find:
     - Market data and trends
     - Competitor information
     - Expert opinions and analysis
     - Case studies and examples
     - Risks and challenges
     - Success factors

     For each query, specify:
     - query: The exact search string
     - intent: What information you're looking for
     - freshness: 'recent' for time-sensitive, 'any' for evergreen
     - domainHints: Preferred sources (optional)

     Output as JSON array.
     ```

5. Validation:
   - Must return 8-20 queries
   - Each query must have query and intent
   - Retry once if validation fails

CONSTRAINTS:
- Use openai client from src/lib/services/openai.ts
- DO NOT make search calls (that's URL discovery)
- Log query count and token usage

ACCEPTANCE CRITERIA:
- Returns 8-20 QueryPlan objects
- Each has query, intent, freshness
- Works for all 5 decision types
- TypeScript compiles

⚠️ CANNOT FULLY TEST UNTIL: OpenAI API key configured
⚠️ CAN MOCK TEST: Use mock OpenAI responses
```

| Task | Acceptance Criteria | Status |
|------|---------------------|-------|--------|
| 💻 Query planner | Generates 8-20 queries | |
| 💻 Prompt engineering | Queries are targeted and diverse | |
| 💻 Validation | Retries on invalid output | |

---

### 2.3b URL Discovery (Step 3B)

**Windsurf Prompt:**
```
GOAL: Execute search queries and compile URL shortlist.

FILES TO CREATE:
- src/lib/analysis/url-discovery.ts

BEHAVIOR:
1. Export async function `discoverUrls(queries: QueryPlan[]): Promise<UrlShortlist>`

2. Output type:
   ```typescript
   interface UrlCandidate {
     url: string
     title: string
     snippet: string
     query: string      // Which query found this
     intent: string     // From QueryPlan
     score: number      // Pre-scrape relevance score 0-100
   }

   interface UrlShortlist {
     candidates: UrlCandidate[]
     totalFound: number
     deduplicated: number
   }
   ```

3. Process:
   a. For each query, call Exa search (parallel, max 5 concurrent)
   b. If Exa fails for a query, fallback to Tavily
   c. Collect all results (expect 80-150 raw URLs)
   d. Deduplicate by URL
   e. Score each URL based on:
      - Title relevance to decision
      - Snippet quality
      - Domain authority (known good sources)
      - Freshness (if query requires recent)
   f. Sort by score, keep top 40-60

4. Deduplication:
   - Exact URL match
   - Same domain + similar path (80% match)

CONSTRAINTS:
- Use exa and tavily clients from src/lib/services/
- Use cache layer for repeated queries
- Max 5 concurrent search requests
- Log: queries executed, URLs found, deduplicated count

ACCEPTANCE CRITERIA:
- Returns 40-60 unique URLs
- Each URL has score and source query
- Deduplication removes obvious duplicates
- Falls back to Tavily when Exa fails

⚠️ CANNOT FULLY TEST UNTIL: Exa/Tavily API keys configured
```

| Task | Acceptance Criteria | Status |
|------|---------------------|-------|--------|
| 💻 URL discovery | Executes queries, collects URLs | |
| 💻 Deduplication | Removes duplicates | |
| 💻 Scoring | Pre-scrape relevance scores | |
| 💻 Fallback | Uses Tavily when Exa fails | |

---

### 2.3c Content Extractor (Step 3C)

**Windsurf Prompt:**
```
GOAL: Scrape top URLs and extract clean content.

FILES TO CREATE:
- src/lib/analysis/content-extractor.ts

BEHAVIOR:
1. Export async function `extractContent(urls: UrlCandidate[]): Promise<ExtractedContent[]>`

2. Input: Top 25-35 URLs by score

3. Output type:
   ```typescript
   interface ExtractedContent {
     url: string
     title: string
     text: string
     wordCount: number
     extractedAt: string
     sourceQuery: string
     sourceIntent: string
   }
   ```

4. Process:
   a. Take top 25-35 URLs by score
   b. Scrape in parallel (max 10 concurrent)
   c. Use scrapeWithFallback() from firecrawl client
   d. Filter out failures (null returns)
   e. Truncate text to 5000 words per page
   f. Log success/failure counts

5. Content cleaning:
   - Remove navigation, headers, footers
   - Remove ads and sidebars
   - Keep main article content
   - Preserve paragraph breaks

CONSTRAINTS:
- Use firecrawl client with fallback chain
- Use cache layer (check before scraping)
- Max 10 concurrent scrapes
- Timeout: 30s per URL
- Skip URLs that fail all fallback methods

ACCEPTANCE CRITERIA:
- Scrapes 20-30 URLs successfully (some failures expected)
- Clean text without HTML
- Each result linked to source query/intent
- Graceful handling of failures

⚠️ CANNOT FULLY TEST UNTIL: Firecrawl API key configured
```

| Task | Acceptance Criteria | Status |
|------|---------------------|-------|--------|
| 💻 Content extractor | Scrapes 20-30 URLs | |
| 💻 Parallel scraping | Max 10 concurrent | |
| 💻 Content cleaning | No HTML, clean text | |
| 💻 Failure handling | Skips failed URLs gracefully | |

---

### 2.3d Evidence Generator (Step 3D)

**Windsurf Prompt:**
```
GOAL: Extract evidence cards from scraped content using LLM.

FILES TO CREATE:
- src/lib/analysis/evidence-generator.ts

BEHAVIOR:
1. Export async function `generateEvidence(content: ExtractedContent[], decision: DecisionInput): Promise<EvidenceCard[]>`

2. Output type:
   ```typescript
   interface EvidenceCard {
     id: string                  // Generated UUID
     claim: string               // The factual claim (1-2 sentences)
     sourceUrl: string
     sourceTitle: string
     sourceSnippet: string       // Relevant quote from source
     credibilityScore: number    // 0-100
     relevanceScore: number      // 0-100 (to this decision)
     freshness: 'current' | 'recent' | 'dated'
     extractedAt: string
   }
   ```

3. Process:
   a. For each scraped page (parallel, max 5 concurrent):
      - Send text + decision context to LLM
      - Extract 3-8 factual claims per page
      - Each claim must cite specific text from source
   b. Collect all cards (expect 60-150 raw)
   c. Deduplicate similar claims
   d. Score relevance to decision
   e. Keep top 25-40 cards

4. LLM prompt for extraction:
   ```
   You are extracting factual claims from a web page for decision analysis.

   Decision: {decisionFrame}
   Source URL: {url}
   Source Title: {title}
   Content: {text}

   Extract 3-8 factual claims that are relevant to this decision.
   For each claim:
   - claim: A specific, factual statement (not opinion)
   - sourceSnippet: The exact quote from the text supporting this claim
   - credibilityScore: 0-100 based on source quality and specificity
   - relevanceScore: 0-100 based on how relevant to the decision
   - freshness: 'current' (<3 months), 'recent' (3-12 months), 'dated' (>1 year)

   Only include claims that are:
   - Factual and verifiable
   - Relevant to the decision
   - Supported by the source text

   Output as JSON array.
   ```

5. Deduplication:
   - Semantic similarity check (LLM)
   - Keep higher-scored version of similar claims

CONSTRAINTS:
- Use gpt-4o-mini for cost
- Max 5 concurrent LLM calls
- Must link each claim to source text
- Generate UUID for each card

ACCEPTANCE CRITERIA:
- Returns 25-40 evidence cards
- Each card has claim, source, scores
- No duplicate or near-duplicate claims
- Claims are factual, not opinions

⚠️ CANNOT FULLY TEST UNTIL: OpenAI API key configured
```

| Task | Acceptance Criteria | Status |
|------|---------------------|-------|--------|
| 💻 Evidence generator | Extracts claims from content | |
| 💻 Per-page processing | 3-8 claims per page | |
| 💻 Deduplication | Removes similar claims | |
| 💻 Scoring | Credibility and relevance scores | |

---

### 2.3e Evidence Scan Orchestrator

**Windsurf Prompt:**
```
GOAL: Create Inngest function that orchestrates the full evidence scan.

FILES TO CREATE:
- src/lib/inngest/client.ts
- src/lib/inngest/functions/evidence-scan.ts
- src/app/api/inngest/route.ts

INSTALL FIRST:
npm install inngest

INNGEST CLIENT (src/lib/inngest/client.ts):
```typescript
import { Inngest } from 'inngest'

export const inngest = new Inngest({
  id: 'plinth',
  name: 'Plinth Decision Analysis',
})
```

EVIDENCE SCAN FUNCTION (evidence-scan.ts):
```typescript
import { inngest } from '../client'
import { planQueries } from '@/lib/analysis/query-planner'
import { discoverUrls } from '@/lib/analysis/url-discovery'
import { extractContent } from '@/lib/analysis/content-extractor'
import { generateEvidence } from '@/lib/analysis/evidence-generator'

export const evidenceScan = inngest.createFunction(
  { id: 'evidence-scan', name: 'Evidence Scan' },
  { event: 'decision/scan.requested' },
  async ({ event, step }) => {
    const { decisionId, decision } = event.data

    // Step 3A: Plan queries
    const queries = await step.run('plan-queries', async () => {
      return planQueries(decision)
    })

    // Update job progress
    await step.run('update-progress-20', async () => {
      await updateJobProgress(decisionId, 20, 'Searching for evidence...')
    })

    // Step 3B: Discover URLs
    const urls = await step.run('discover-urls', async () => {
      return discoverUrls(queries)
    })

    await step.run('update-progress-40', async () => {
      await updateJobProgress(decisionId, 40, 'Extracting content...')
    })

    // Step 3C: Extract content
    const content = await step.run('extract-content', async () => {
      return extractContent(urls.candidates.slice(0, 35))
    })

    await step.run('update-progress-60', async () => {
      await updateJobProgress(decisionId, 60, 'Generating evidence cards...')
    })

    // Step 3D: Generate evidence
    const evidence = await step.run('generate-evidence', async () => {
      return generateEvidence(content, decision)
    })

    // Save evidence to database
    await step.run('save-evidence', async () => {
      await saveEvidenceCards(decisionId, evidence)
    })

    await step.run('update-progress-70', async () => {
      await updateJobProgress(decisionId, 70, 'Evidence scan complete')
    })

    return { evidenceCount: evidence.length }
  }
)

// Helper functions
async function updateJobProgress(decisionId: string, progress: number, message: string) {
  // Update job record in database
}

async function saveEvidenceCards(decisionId: string, evidence: EvidenceCard[]) {
  // Insert evidence cards into database
}
```

INNGEST API ROUTE (src/app/api/inngest/route.ts):
```typescript
import { serve } from 'inngest/next'
import { inngest } from '@/lib/inngest/client'
import { evidenceScan } from '@/lib/inngest/functions/evidence-scan'

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [evidenceScan],
})
```

CONSTRAINTS:
- Each step.run is a checkpoint (resumes on failure)
- Update job progress after each major step
- Log timing for each step
- Handle partial failures gracefully

ACCEPTANCE CRITERIA:
- Inngest dev server shows function registered
- Triggering event runs full pipeline
- Job progress updates visible in database
- Evidence cards saved to database

⚠️ CANNOT FULLY TEST UNTIL: All API keys configured + Inngest dev server running
⚠️ CAN TEST STRUCTURE: Inngest function registered, steps defined
```

| Task | Acceptance Criteria | Status |
|------|---------------------|-------|--------|
| 💻 Inngest client | Client configured | |
| 💻 Evidence scan function | All 4 steps orchestrated | |
| 💻 Progress updates | Job progress reflects current step | |
| 💻 API route | Inngest endpoint works | |

---

## 2.4 Option Generation (Week 5)

### 2.4a Option Composer

**Windsurf Prompt:**
```
GOAL: Generate strategic options from evidence cards.

FILES TO CREATE:
- src/lib/analysis/option-composer.ts

BEHAVIOR:
1. Export async function `composeOptions(evidence: EvidenceCard[], decision: DecisionInput): Promise<Option[]>`

2. Output type:
   ```typescript
   interface Option {
     id: string
     title: string              // Short name (e.g., "Build In-House AI")
     summary: string            // 2-3 sentence description
     commitsTo: string[]        // What this option commits to
     deprioritizes: string[]    // What gets deprioritized
     primaryUpside: string      // Main benefit
     primaryRisk: string        // Main risk
     reversibility: number      // 1-5
     reversibilityExplanation: string
     groundedInEvidence: string[] // Evidence card IDs
   }
   ```

3. LLM call (GPT-4o for quality):
   ```
   You are generating strategic options for a business decision.

   Decision: {decisionFrame}
   Type: {decisionType}
   Constraints: {constraints}

   Evidence summary:
   {top 30 evidence cards with claims}

   Generate 4-6 DISTINCT strategic options. Each option must be:
   - A clear COMMITMENT (not vague like "consider options")
   - GROUNDED in the evidence provided
   - MUTUALLY EXCLUSIVE from other options
   - ACTIONABLE within the constraints

   For each option:
   - title: Short, clear name
   - summary: 2-3 sentences explaining the option
   - commitsTo: What this option explicitly commits to (list)
   - deprioritizes: What gets deprioritized if this is chosen (list)
   - primaryUpside: The main benefit of this option
   - primaryRisk: The main risk of this option
   - reversibility: 1 (easily reversible) to 5 (irreversible)
   - reversibilityExplanation: Why this reversibility rating
   - groundedInEvidence: IDs of evidence cards that support this option

   Output as JSON array.
   ```

4. Validation:
   - Must return 4-6 options
   - Each option must reference at least 2 evidence cards
   - Options must be distinct (not variations of same idea)

CONSTRAINTS:
- Use GPT-4o (not mini) for option quality
- Max input: top 30 evidence cards by relevance
- Each option must link to specific evidence

ACCEPTANCE CRITERIA:
- Returns 4-6 distinct options
- Each option grounded in evidence (has evidence IDs)
- Options are mutually exclusive commitments
- TypeScript compiles

⚠️ CANNOT FULLY TEST UNTIL: Evidence scan complete + OpenAI configured
```

| Task | Acceptance Criteria | Status |
|------|---------------------|-------|--------|
| 💻 Option composer | Generates 4-6 options | |
| 💻 Evidence grounding | Each option links to evidence | |
| 💻 Distinctness | Options are mutually exclusive | |

---

### 2.4b Option Deduplication

**Windsurf Prompt:**
```
GOAL: Merge cosmetically similar options.

FILES TO CREATE:
- src/lib/analysis/option-deduper.ts

BEHAVIOR:
1. Export async function `dedupeOptions(options: Option[]): Promise<Option[]>`

2. Use GPT-4o-mini to identify similar options:
   - If two options are >70% similar in intent, merge them
   - Keep the better-articulated version
   - Combine evidence references

3. Final output: 3-6 distinct options

CONSTRAINTS:
- Never reduce below 3 options
- Log which options were merged and why

ACCEPTANCE CRITERIA:
- Merges similar options
- Maintains 3-6 final options
- Merged options have combined evidence

⚠️ CANNOT FULLY TEST UNTIL: Option composer complete
```

| Task | Acceptance Criteria | Status |
|------|---------------------|-------|--------|
| 💻 Option deduper | Merges similar options | |
| 💻 Minimum threshold | Never below 3 options | |

---

### 2.4c Option Generation Orchestrator

**Windsurf Prompt:**
```
GOAL: Create Inngest function for option generation.

FILES TO CREATE:
- src/lib/inngest/functions/generate-options.ts

BEHAVIOR:
1. Triggered after evidence scan completes
2. Steps:
   a. Fetch evidence cards from database
   b. Call option composer
   c. Call option deduper
   d. Save options to database
   e. Update job progress to 80%

2. Event: 'decision/options.requested'

CONSTRAINTS:
- Runs after evidence-scan completes
- Saves options to `options` table
- Updates decision.analysis_status to 'options'

ACCEPTANCE CRITERIA:
- Options saved to database
- Job progress at 80% after completion

⚠️ CANNOT FULLY TEST UNTIL: Evidence scan complete
```

| Task | Acceptance Criteria | Status |
|------|---------------------|-------|--------|
| 💻 Generate options function | Orchestrates option generation | |
| 💻 Database save | Options persisted | |

---

## 2.5 Evidence-to-Option Mapping (Week 5)

### 2.5a Evidence Mapper

**Windsurf Prompt:**
```
GOAL: Map each evidence card to each option with relationship classification.

FILES TO CREATE:
- src/lib/analysis/evidence-mapper.ts

BEHAVIOR:
1. Export async function `mapEvidence(options: Option[], evidence: EvidenceCard[]): Promise<EvidenceMapping[]>`

2. Output type:
   ```typescript
   interface EvidenceMapping {
     optionId: string
     evidenceId: string
     relationship: 'supporting' | 'contradicting' | 'unknown'
     relevanceExplanation: string
     impactLevel: 'high' | 'medium' | 'low'
   }
   ```

3. For each option, classify each evidence card:
   - Supporting: Evidence that supports this option
   - Contradicting: Evidence that argues against this option
   - Unknown: Evidence that doesn't clearly support or contradict

4. LLM call (GPT-4o):
   ```
   For this strategic option:
   Title: {option.title}
   Summary: {option.summary}

   Classify each piece of evidence:

   Evidence 1: {evidence.claim}
   Evidence 2: {evidence.claim}
   ...

   For each evidence, provide:
   - evidenceId: The ID of the evidence
   - relationship: 'supporting', 'contradicting', or 'unknown'
   - relevanceExplanation: Why this evidence relates (or doesn't) to this option
   - impactLevel: 'high', 'medium', or 'low' based on how much this evidence matters

   Output as JSON array.
   ```

CONSTRAINTS:
- Process one option at a time (parallel across options)
- Every evidence card must be classified for every option
- Log mapping counts per option

ACCEPTANCE CRITERIA:
- Every (option, evidence) pair has a mapping
- Relationships are justified with explanations
- Impact levels assigned

⚠️ CANNOT FULLY TEST UNTIL: Options generated
```

| Task | Acceptance Criteria | Status |
|------|---------------------|-------|--------|
| 💻 Evidence mapper | Classifies all evidence for all options | |
| 💻 Relationship types | Supporting/contradicting/unknown | |
| 💻 Impact levels | High/medium/low assigned | |

---

### 2.5b Map Evidence Orchestrator

**Windsurf Prompt:**
```
GOAL: Create Inngest function for evidence mapping.

FILES TO CREATE:
- src/lib/inngest/functions/map-evidence.ts

BEHAVIOR:
1. Triggered after option generation completes
2. Steps:
   a. Fetch options and evidence from database
   b. Call evidence mapper
   c. Save mappings to database
   d. Update job progress to 85%

3. Event: 'decision/mapping.requested'

CONSTRAINTS:
- Runs after generate-options completes
- Saves to `evidence_mappings` table
- Updates decision.analysis_status to 'mapping'

ACCEPTANCE CRITERIA:
- Mappings saved to database
- Job progress at 85% after completion

⚠️ CANNOT FULLY TEST UNTIL: Options generated
```

| Task | Acceptance Criteria | Status |
|------|---------------------|-------|--------|
| 💻 Map evidence function | Orchestrates mapping | |
| 💻 Database save | Mappings persisted | |

---

## 2.6 Confidence Scoring (Week 5-6)

### 2.6a Option Scorer

**Windsurf Prompt:**
```
GOAL: Calculate transparent confidence scores for each option.

FILES TO CREATE:
- src/lib/analysis/option-scorer.ts

BEHAVIOR:
1. Export async function `scoreOptions(options: Option[], mappings: EvidenceMapping[], evidence: EvidenceCard[]): Promise<OptionScore[]>`

2. Output type:
   ```typescript
   interface OptionScore {
     optionId: string
     factors: {
       evidenceStrength: number    // 0-100, weight: 25%
       evidenceRecency: number     // 0-100, weight: 15%
       sourceReliability: number   // 0-100, weight: 15%
       corroboration: number       // 0-100, weight: 15%
       constraintFit: number       // 0-100, weight: 15%
       assumptionRisk: number      // 0-100, weight: 15%
     }
     totalScore: number            // Weighted average 0-100
     scoreRationale: string        // Plain language explanation
   }
   ```

3. Scoring factors:
   - evidenceStrength: How strong is the supporting evidence?
   - evidenceRecency: How recent is the evidence?
   - sourceReliability: How credible are the sources?
   - corroboration: Do multiple sources agree?
   - constraintFit: How well does option fit constraints?
   - assumptionRisk: How many unverified assumptions?

4. Use LLM (GPT-4o-mini) to:
   - Calculate each factor score
   - Generate plain-language rationale

CONSTRAINTS:
- TRANSPARENT scoring - no black box
- Each factor explained in rationale
- Log score distributions

ACCEPTANCE CRITERIA:
- Each option has 6-factor breakdown
- Total score is weighted average
- Rationale explains each factor in plain language

⚠️ CANNOT FULLY TEST UNTIL: Evidence mapping complete
```

| Task | Acceptance Criteria | Status |
|------|---------------------|-------|--------|
| 💻 Option scorer | 6-factor scoring | |
| 💻 Transparency | Each factor explained | |
| 💻 Rationale | Plain language explanation | |

---

### 2.6b Score Options Orchestrator

**Windsurf Prompt:**
```
GOAL: Create Inngest function for option scoring.

FILES TO CREATE:
- src/lib/inngest/functions/score-options.ts

BEHAVIOR:
1. Triggered after evidence mapping completes
2. Steps:
   a. Fetch options, mappings, evidence from database
   b. Call option scorer
   c. Save scores to database
   d. Update job progress to 90%

3. Event: 'decision/scoring.requested'

CONSTRAINTS:
- Runs after map-evidence completes
- Saves to `option_scores` table
- Updates decision.analysis_status to 'scoring'

ACCEPTANCE CRITERIA:
- Scores saved to database
- Job progress at 90% after completion

⚠️ CANNOT FULLY TEST UNTIL: Evidence mapping complete
```

| Task | Acceptance Criteria | Status |
|------|---------------------|-------|--------|
| 💻 Score options function | Orchestrates scoring | |
| 💻 Database save | Scores persisted | |

---

## 2.7 Recommendation Generation (Week 6)

### 2.7a Recommender

**Windsurf Prompt:**
```
GOAL: Generate final recommendation with decision changers.

FILES TO CREATE:
- src/lib/analysis/recommender.ts

BEHAVIOR:
1. Export async function `generateRecommendation(options: Option[], scores: OptionScore[], mappings: EvidenceMapping[]): Promise<Recommendation>`

2. Output type:
   ```typescript
   interface Recommendation {
     primaryOptionId: string
     primaryConfidence: number      // 0-100
     primaryRationale: string       // Why this option
     hedgeOptionId?: string         // Optional second-best
     hedgeCondition?: string        // When to consider hedge
     decisionChangers: DecisionChanger[]
     monitorTriggers: MonitorTrigger[]
   }

   interface DecisionChanger {
     condition: string              // What would change the recommendation
     wouldFavor: string             // Which option it would favor
     likelihood: 'low' | 'medium' | 'high'
   }

   interface MonitorTrigger {
     signal: string                 // What to monitor
     source: string                 // Where to monitor
     threshold: string              // When to act
     frequency: 'daily' | 'weekly' | 'monthly'
   }
   ```

3. LLM call (GPT-4o):
   ```
   Based on this analysis:

   Options with scores:
   {options with their scores and rationales}

   Evidence summary:
   {key supporting and contradicting evidence per option}

   Generate a recommendation:
   1. Primary option: Which option do you recommend and why?
   2. Confidence: How confident (0-100) and what drives uncertainty?
   3. Hedge: Is there a second-best option to consider? Under what conditions?
   4. Decision changers: What 3-5 future events would change this recommendation?
   5. Monitor triggers: What signals should be tracked post-decision?

   Be specific and actionable.
   ```

CONSTRAINTS:
- Must provide rationale, not just pick highest score
- Decision changers must be specific and measurable
- Monitor triggers must be actionable

ACCEPTANCE CRITERIA:
- Primary recommendation with confidence and rationale
- 3-5 decision changers
- 3-5 monitor triggers
- Hedge option if scores are close

⚠️ CANNOT FULLY TEST UNTIL: Option scoring complete
```

| Task | Acceptance Criteria | Status |
|------|---------------------|-------|--------|
| 💻 Recommender | Generates recommendation | |
| 💻 Decision changers | 3-5 specific conditions | |
| 💻 Monitor triggers | Actionable signals | |

---

### 2.7b Generate Recommendation Orchestrator

**Windsurf Prompt:**
```
GOAL: Create Inngest function for recommendation generation.

FILES TO CREATE:
- src/lib/inngest/functions/generate-recommendation.ts

BEHAVIOR:
1. Triggered after option scoring completes
2. Steps:
   a. Fetch options, scores, mappings from database
   b. Call recommender
   c. Save recommendation to database
   d. Update decision record with recommendation
   e. Update job progress to 95%

3. Event: 'decision/recommendation.requested'

CONSTRAINTS:
- Runs after score-options completes
- Updates decision with:
  - recommendation_id
  - confidence_score
  - recommendation_rationale
- Updates decision.analysis_status to 'recommending'

ACCEPTANCE CRITERIA:
- Recommendation saved to database
- Decision record updated
- Job progress at 95%

⚠️ CANNOT FULLY TEST UNTIL: Option scoring complete
```

| Task | Acceptance Criteria | Status |
|------|---------------------|-------|--------|
| 💻 Generate recommendation function | Orchestrates recommendation | |
| 💻 Database save | Recommendation persisted | |
| 💻 Decision update | Decision record has recommendation | |

---

## 2.8 Brief Generation (Week 6)

### 2.8a Brief Writer

**Windsurf Prompt:**
```
GOAL: Generate exportable decision brief with citations.

FILES TO CREATE:
- src/lib/analysis/brief-writer.ts

BEHAVIOR:
1. Export async function `writeBrief(decision: FullDecision): Promise<Brief>`

2. Input: Full decision with all related data (frame, context, evidence, options, scores, recommendation)

3. Output type:
   ```typescript
   interface Brief {
     id: string
     decisionId: string
     sections: {
       framing: string           // Decision question, constraints, stakes
       optionsConsidered: string // All options including rejected
       evidenceSummary: string   // Key evidence with citations
       assumptionsLedger: string // Declared and implicit assumptions
       recommendation: string    // Primary + hedge + confidence
       openQuestions: string     // Unresolved unknowns
       metadata: string          // Owner, stakeholders, date
     }
     citations: Citation[]
     generatedAt: string
   }

   interface Citation {
     id: string
     url: string
     title: string
     accessedAt: string
     snippetHash: string        // For verification
   }
   ```

4. LLM call (GPT-4o):
   - Compose narrative from structured data
   - Ensure all claims are cited
   - Use professional but accessible tone

CONSTRAINTS:
- All factual claims must have citations
- Keep each section concise (aim for 2-page total brief)
- Output both JSON (for rendering) and Markdown (for export)

ACCEPTANCE CRITERIA:
- All 7 sections populated
- Citations linked to evidence cards
- Readable in 5 minutes

⚠️ CANNOT FULLY TEST UNTIL: Recommendation complete
```

| Task | Acceptance Criteria | Status |
|------|---------------------|-------|--------|
| 💻 Brief writer | Generates 7-section brief | |
| 💻 Citations | All claims cited | |
| 💻 Export formats | JSON and Markdown | |

---

### 2.8b Generate Brief Orchestrator

**Windsurf Prompt:**
```
GOAL: Create Inngest function for brief generation (final step).

FILES TO CREATE:
- src/lib/inngest/functions/generate-brief.ts

BEHAVIOR:
1. Triggered after recommendation generation completes
2. Steps:
   a. Fetch full decision with all related data
   b. Call brief writer
   c. Save brief to database
   d. Update decision.analysis_status to 'complete'
   e. Update job status to 'completed', progress to 100%

3. Event: 'decision/brief.requested'

CONSTRAINTS:
- Runs after generate-recommendation completes
- Saves to `briefs` table
- THIS IS THE FINAL STEP - sets analysis_status to 'complete'

ACCEPTANCE CRITERIA:
- Brief saved to database
- Decision status is 'complete'
- Job status is 'completed'
- Job progress is 100%

⚠️ CANNOT FULLY TEST UNTIL: Recommendation complete
```

| Task | Acceptance Criteria | Status |
|------|---------------------|-------|--------|
| 💻 Generate brief function | Final orchestration step | |
| 💻 Completion status | Decision marked complete | |

---

## 2.9 Main Orchestration Function (Week 6)

**Windsurf Prompt:**
```
GOAL: Create main orchestration function that chains all steps.

FILES TO CREATE:
- src/lib/inngest/functions/analyze-decision.ts
- src/lib/inngest/functions/index.ts (update)

MAIN ORCHESTRATION (analyze-decision.ts):
```typescript
import { inngest } from '../client'

export const analyzeDecision = inngest.createFunction(
  { id: 'analyze-decision', name: 'Analyze Decision' },
  { event: 'decision/analyze.requested' },
  async ({ event, step }) => {
    const { decisionId, jobId } = event.data

    // Step 1: Evidence Scan (Steps 3A-3D)
    await step.invoke('evidence-scan', {
      function: evidenceScan,
      data: { decisionId }
    })

    // Step 2: Generate Options (Step 4)
    await step.invoke('generate-options', {
      function: generateOptions,
      data: { decisionId }
    })

    // Step 3: Map Evidence (Step 5)
    await step.invoke('map-evidence', {
      function: mapEvidence,
      data: { decisionId }
    })

    // Step 4: Score Options (Step 6)
    await step.invoke('score-options', {
      function: scoreOptions,
      data: { decisionId }
    })

    // Step 5: Generate Recommendation (Step 7)
    await step.invoke('generate-recommendation', {
      function: generateRecommendation,
      data: { decisionId }
    })

    // Step 6: Generate Brief (Step 8)
    await step.invoke('generate-brief', {
      function: generateBrief,
      data: { decisionId }
    })

    return { status: 'complete', decisionId }
  }
)
```

UPDATE INDEX (functions/index.ts):
```typescript
export { analyzeDecision } from './analyze-decision'
export { evidenceScan } from './evidence-scan'
export { generateOptions } from './generate-options'
export { mapEvidence } from './map-evidence'
export { scoreOptions } from './score-options'
export { generateRecommendation } from './generate-recommendation'
export { generateBrief } from './generate-brief'
```

UPDATE API ROUTE (src/app/api/inngest/route.ts):
- Import and register all functions

UPDATE /api/decisions/[id]/analyze/route.ts:
- Instead of just creating job, also trigger Inngest event:
```typescript
await inngest.send({
  name: 'decision/analyze.requested',
  data: { decisionId: decision.id, jobId: job.id }
})
```

CONSTRAINTS:
- Each step is durable (resumes on failure)
- Main function is the entry point
- Sub-functions can also run independently (for retries)

ACCEPTANCE CRITERIA:
- Clicking "Continue to Analysis" triggers full pipeline
- Pipeline runs all 6 steps in sequence
- Job progress updates visible in scanning page
- Decision marked complete when done

⚠️ FULL END-TO-END TEST: Requires all API keys + Inngest dev server
```

| Task | Acceptance Criteria | Status |
|------|---------------------|-------|--------|
| 💻 Main orchestration | Chains all functions | |
| 💻 Function index | All functions exported | |
| 💻 API integration | Analyze endpoint triggers Inngest | |
| 💻 E2E test | Full pipeline works | |

---

## 2.10 Update Results UI (Week 6)

**Windsurf Prompt:**
```
GOAL: Update results page to display real analysis data.

FILES TO UPDATE:
- src/app/(dashboard)/analyze/[id]/results/page.tsx
- src/components/analyze/results-tabs.tsx
- src/components/analyze/evidence-placeholder.tsx → evidence-list.tsx
- src/components/analyze/options-placeholder.tsx → options-list.tsx
- src/components/analyze/recommendation-placeholder.tsx → recommendation-view.tsx

RESULTS PAGE:
1. Fetch full decision data including:
   - evidence cards
   - options with scores
   - evidence mappings
   - recommendation
   - brief

2. Pass to ResultsTabs component

EVIDENCE LIST:
1. Show all evidence cards
2. Filter by: supporting, contradicting, all
3. Each card shows: claim, source, scores, freshness badge
4. Click to expand: full snippet, link to source

OPTIONS LIST:
1. Show all options with scores
2. Recommended option highlighted
3. Each option shows:
   - Title, summary
   - Score breakdown (6 factors as bar chart)
   - Commits to / deprioritizes lists
   - Supporting/contradicting evidence counts
4. Expandable: show linked evidence cards

RECOMMENDATION VIEW:
1. Primary recommendation with confidence gauge
2. Rationale text
3. Hedge option (if exists) with condition
4. Decision changers list
5. Monitor triggers list

CONSTRAINTS:
- Use existing shadcn components
- Loading states while data fetches
- Empty states if analysis incomplete

ACCEPTANCE CRITERIA:
- Results page shows real data after analysis
- All three tabs functional
- Recommendation clearly presented
- Evidence properly cited

⚠️ CANNOT FULLY TEST UNTIL: Full pipeline produces data
```

| Task | Acceptance Criteria | Status |
|------|---------------------|-------|--------|
| 💻 Results page | Fetches real data | |
| 💻 Evidence list | Shows evidence cards | |
| 💻 Options list | Shows options with scores | |
| 💻 Recommendation view | Shows recommendation | |

---

## Phase 2 Milestone

**Full AI analysis pipeline operational. Decision analyzed in 5-8 minutes.**

### Checklist
- [ ] All external services configured and tested
- [ ] Service clients with fallbacks working
- [ ] Evidence scan pipeline complete (3A-3D)
- [ ] Option generation from evidence working
- [ ] Evidence-to-option mapping complete
- [ ] Confidence scoring with transparent factors
- [ ] Recommendation with decision changers
- [ ] Brief generation with citations
- [ ] Main orchestration function durable
- [ ] Results UI shows real data
- [ ] Full end-to-end test passing

### What CAN Be Tested Without Full Setup
- [ ] TypeScript compiles for all new files
- [ ] Inngest functions register (check Inngest dashboard)
- [ ] Database tables created (run migrations)
- [ ] API routes return expected error shapes
- [ ] UI components render with mock data

### What REQUIRES Full Setup
- [ ] OpenAI calls (query planning, evidence extraction, options, scoring, recommendation, brief)
- [ ] Exa/Tavily searches (URL discovery)
- [ ] Firecrawl scraping (content extraction)
- [ ] Full pipeline end-to-end

### Cost Verification

After Phase 2, verify costs match estimates:
- ~12 Exa requests per decision
- ~25 Firecrawl scrapes per decision
- ~40k tokens per decision
- **Total: ~$0.50 per decision**

---

## Debugging Notes

*Add notes here as you work through this phase:*

```
<!-- Example:
2024-02-01: Exa returning too few results for some queries
- Issue: Query too specific
- Fix: Added fallback to Tavily for broader coverage
-->
```

---

**Previous Phase:** [02-decision-engine.md](./02-decision-engine.md)
**Next Phase:** [04-outputs.md](./04-outputs.md)
