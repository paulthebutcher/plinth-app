# LLM Orchestration Architecture

> **Version:** 1.0
> **Goal:** Cost + speed optimized AI pipeline with credible citations

---

## Core Architecture Principles

| Principle | Implementation |
|-----------|----------------|
| **Route before retrieve** | Small, cheap model decides what to fetch, from where, how much |
| **Search ≠ scrape** | Search APIs for URL discovery; scrape only the shortlist |
| **Two-pass summarization** | First pass: cheap extraction. Second pass: only top evidence |
| **Hard cap everything** | Max queries, max pages, max tokens per decision |
| **Cache aggressively** | URL→text, URL→fingerprint, query→SERP, evidence cards |

---

## Budget Defaults (Per Decision)

| Resource | Default | Max |
|----------|---------|-----|
| Search queries | 12 | 20 |
| URLs discovered | 40 | 60 |
| Pages scraped | 25 | 35 |
| Deep reads (second-pass) | 6 | 10 |
| Evidence cards | 25-40 | 50 |
| LLM calls (cheap) | ~30 | 50 |
| LLM calls (mid) | 4-6 | 10 |

---

## Service Stack

### Primary Stack

| Service | Purpose | Pricing Model |
|---------|---------|---------------|
| **Exa** | Semantic/keyword search, URL discovery | Request-based |
| **Firecrawl** | Clean content extraction, JS handling | Credits/pages |
| **OpenAI GPT-4o** | Mid-tier synthesis, option generation | Tokens |
| **OpenAI GPT-4o-mini** | Cheap extraction, classification | Tokens |

### Fallback Services

| Service | When to Use |
|---------|-------------|
| **Tavily** | Alternate search lane, broader web coverage |
| **Apify** | Platform-specific scrapers (LinkedIn, app stores) |
| **Playwright (self-hosted)** | High-volume stable sources |

---

## Step-by-Step Orchestration

### Step 0: Entry / Route Decision

**Goal:** Determine analysis mode and cost envelope.

```
┌─────────────────────────────────────────────────────────────────┐
│ INPUT                                                           │
│   • User clicks "Analyze a Decision"                            │
│                                                                 │
│ LLM CALL (cheap, <1k tokens)                                    │
│   • Router: classify decision type + stakes                     │
│                                                                 │
│ OUTPUT                                                          │
│   • decision_profile: {type, horizon, stakes, risk_tolerance}   │
│   • retrieval_budget: {max_queries, max_urls, max_scrapes}      │
│                                                                 │
│ TOOLS: None (LLM-only)                                          │
└─────────────────────────────────────────────────────────────────┘
```

**Model:** GPT-4o-mini
**Tokens:** ~500-800

---

### Step 1: Decision Framing

**Goal:** Convert user text into stable schema, extract implied unknowns.

```
┌─────────────────────────────────────────────────────────────────┐
│ INPUT                                                           │
│   • Decision statement (user text)                              │
│   • Decision type, time horizon, stakes (user selections)       │
│                                                                 │
│ LLM CALLS                                                       │
│   1. Schema Filler (cheap): fills DecisionSchemaV1              │
│   2. Assumption Miner (cheap): extracts implicit assumptions    │
│                                                                 │
│ OUTPUT                                                          │
│   • DecisionSchemaV1                                            │
│   • AssumptionsLedgerV1 (declared/implicit/unverified)          │
│   • ResearchQuestions[] (ranked by importance)                  │
│                                                                 │
│ TOOLS: None (do not browse yet)                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Model:** GPT-4o-mini
**Tokens:** ~1,500-2,000
**Key Output:** `ResearchQuestions[]` — drives the evidence scan

---

### Step 2: Context Anchoring

**Goal:** Attach constraints without polluting external evidence.

```
┌─────────────────────────────────────────────────────────────────┐
│ INPUT                                                           │
│   • User-provided context (optional)                            │
│   • Known constraints                                           │
│   • Known assumptions                                           │
│                                                                 │
│ LLM CALLS                                                       │
│   1. Context Normalizer (cheap): structure constraints          │
│   2. Contamination Guard (cheap): label claims needing verify   │
│                                                                 │
│ OUTPUT                                                          │
│   • Constraints[]                                               │
│   • ClaimsToVerify[] (added to evidence scan targets)           │
│                                                                 │
│ TOOLS: None                                                     │
└─────────────────────────────────────────────────────────────────┘
```

**Model:** GPT-4o-mini
**Tokens:** ~800-1,200

---

### Step 3: Evidence Scan (The Big One)

**Goal:** Fast URL discovery + minimal scraping + evidence cards.

#### 3A: Query Planning (LLM-only)

```
┌─────────────────────────────────────────────────────────────────┐
│ INPUT                                                           │
│   • ResearchQuestions[]                                         │
│   • Decision context                                            │
│   • ClaimsToVerify[]                                            │
│                                                                 │
│ LLM CALL (cheap)                                                │
│   • Query Planner: convert to 8-20 targeted search queries      │
│     - Include competitor names, product terms, regulatory terms │
│     - Attach freshness windows (30/90/365 days)                 │
│     - Add domain hints (docs, press, filings)                   │
│                                                                 │
│ OUTPUT                                                          │
│   • QueryPlan[]: {query, intent, freshness_days, domain_hints}  │
│                                                                 │
│ TOOLS: None                                                     │
└─────────────────────────────────────────────────────────────────┘
```

**Model:** GPT-4o-mini
**Tokens:** ~1,000-1,500

#### 3B: URL Discovery (Search API)

```
┌─────────────────────────────────────────────────────────────────┐
│ INPUT                                                           │
│   • QueryPlan[]                                                 │
│                                                                 │
│ TOOL CALLS (concurrent, bounded to 5-10)                        │
│   Primary: Exa semantic/keyword search                          │
│   Fallback: Tavily for broader coverage                         │
│                                                                 │
│ PROCESSING                                                      │
│   • Deduplicate by canonical URL + near-duplicate title         │
│   • Score URLs pre-scrape:                                      │
│     - Source quality priors (docs > press > blogs)              │
│     - Recency fit to freshness window                           │
│     - Topical match to query intent                             │
│                                                                 │
│ OUTPUT                                                          │
│   • UrlShortlist[] (typically 20-60 URLs)                       │
│                                                                 │
│ TOOLS: Exa, Tavily (fallback)                                   │
└─────────────────────────────────────────────────────────────────┘
```

**Cost:** ~12 Exa requests
**Latency:** ~3-5 seconds (parallel)

#### 3C: Content Extraction (Scrape Shortlist Only)

```
┌─────────────────────────────────────────────────────────────────┐
│ INPUT                                                           │
│   • UrlShortlist[] (top 25-35 by score)                         │
│                                                                 │
│ TOOL CALLS (concurrent, rate-limited)                           │
│   Primary: Firecrawl /scrape                                    │
│   Fallback chain:                                               │
│     1. Retry with JS rendering                                  │
│     2. Route to Apify actor                                     │
│     3. Queue for Playwright                                     │
│                                                                 │
│ PROCESSING                                                      │
│   • Extract main content only (strip nav, ads, etc.)            │
│   • Enforce max tokens per page                                 │
│   • Cache: URL → clean text + fingerprint                       │
│                                                                 │
│ OUTPUT                                                          │
│   • ScrapedContent[]: {url, title, text, extractedAt}           │
│                                                                 │
│ TOOLS: Firecrawl, Apify (fallback)                              │
└─────────────────────────────────────────────────────────────────┘
```

**Cost:** ~25 Firecrawl credits
**Latency:** ~10-20 seconds (parallel with rate limits)

#### 3D: Evidence Card Generation (Cheap Model)

```
┌─────────────────────────────────────────────────────────────────┐
│ INPUT                                                           │
│   • ScrapedContent[]                                            │
│   • DecisionSchema (for relevance)                              │
│                                                                 │
│ LLM CALLS (cheap, 1 per page)                                   │
│   • Evidence Extractor per page:                                │
│     - Extract 3-8 bullet "claims"                               │
│     - Each claim has: quote-snippet, timestamp, entity tags     │
│     - Add: "what this suggests" + "what would falsify it"       │
│     - Confidence factors: source type, recency, corroboration   │
│                                                                 │
│ PROCESSING                                                      │
│   • Limit per-page tokens via chunking                          │
│   • Use top-k chunks by relevance                               │
│                                                                 │
│ OUTPUT                                                          │
│   • EvidenceCards[] (typically 25-40)                           │
│                                                                 │
│ TOOLS: None (LLM-only)                                          │
└─────────────────────────────────────────────────────────────────┘
```

**Model:** GPT-4o-mini
**Tokens:** ~500-800 per page × 25 pages = ~15,000-20,000 tokens
**Latency:** ~15-25 seconds (parallel)

---

### Step 4: Option Generation

**Goal:** Generate 3-6 distinct commitments consistent with evidence.

```
┌─────────────────────────────────────────────────────────────────┐
│ INPUT                                                           │
│   • DecisionSchema                                              │
│   • Constraints[]                                               │
│   • EvidenceCards[] (top 30 by relevance)                       │
│                                                                 │
│ LLM CALLS                                                       │
│   1. Option Composer (mid): generate 4-6 distinct options       │
│   2. Option Deduper (cheap): merge lookalikes                   │
│                                                                 │
│ PROCESSING                                                      │
│   • Ensure each option is grounded in specific evidence         │
│   • Validate distinctiveness (not cosmetically different)       │
│                                                                 │
│ OUTPUT                                                          │
│   • Options[] (3-6 options)                                     │
│                                                                 │
│ TOOLS: None                                                     │
└─────────────────────────────────────────────────────────────────┘
```

**Model:** GPT-4o (mid) + GPT-4o-mini (dedup)
**Tokens:** ~3,000-4,000

---

### Step 5: Evidence-to-Option Mapping

**Goal:** For each option, show supporting/contradicting/unknown.

```
┌─────────────────────────────────────────────────────────────────┐
│ INPUT                                                           │
│   • Options[]                                                   │
│   • EvidenceCards[]                                             │
│   • AssumptionsLedger                                           │
│                                                                 │
│ LLM CALLS                                                       │
│   1. Mapper (mid): create per-option support/contradict/unknown │
│   2. Corroboration Planner (cheap): identify re-retrieval needs │
│                                                                 │
│ CONDITIONAL RE-RETRIEVAL                                        │
│   If high-impact unknowns remain:                               │
│     • Trigger mini-loop back to Step 3                          │
│     • 2-4 additional searches, scrape 5-10 pages max            │
│                                                                 │
│ OUTPUT                                                          │
│   • OptionEvidenceMap[]                                         │
│   • Updated AssumptionsLedger (linked to options)               │
│                                                                 │
│ TOOLS: Exa, Firecrawl (conditional)                             │
└─────────────────────────────────────────────────────────────────┘
```

**Model:** GPT-4o (mid) + GPT-4o-mini
**Tokens:** ~2,500-3,500

---

### Step 6: Confidence Scoring

**Goal:** Quantify decision quality with transparent factors.

```
┌─────────────────────────────────────────────────────────────────┐
│ INPUT                                                           │
│   • Options[]                                                   │
│   • OptionEvidenceMap[]                                         │
│   • Constraints[]                                               │
│   • User risk tolerance / time horizon                          │
│                                                                 │
│ LLM CALLS                                                       │
│   • Scorer (cheap/mid): assign scores per factor                │
│     - Evidence strength                                         │
│     - Evidence recency                                          │
│     - Source reliability                                        │
│     - Corroboration level                                       │
│     - Constraint fit                                            │
│     - Assumption risk                                           │
│                                                                 │
│ PROCESSING                                                      │
│   • Keep scoring deterministic: rule-based + LLM explanation    │
│   • Generate sensitivity analysis for adjustable knobs          │
│                                                                 │
│ OUTPUT                                                          │
│   • OptionScores[] with rationale                               │
│   • SensitivityKnobs (risk, horizon, budget)                    │
│                                                                 │
│ TOOLS: None                                                     │
└─────────────────────────────────────────────────────────────────┘
```

**Model:** GPT-4o-mini
**Tokens:** ~1,500-2,000

---

### Step 7: Recommendation

**Goal:** Produce recommendation + explicit conditions.

```
┌─────────────────────────────────────────────────────────────────┐
│ INPUT                                                           │
│   • OptionScores[]                                              │
│   • OptionEvidenceMap[]                                         │
│   • AssumptionsLedger                                           │
│                                                                 │
│ LLM CALL (mid)                                                  │
│   • Recommender:                                                │
│     - Pick primary + hedge                                      │
│     - Enumerate 3-5 "decision changers"                         │
│     - Generate "monitor triggers" tied to assumptions           │
│                                                                 │
│ OUTPUT                                                          │
│   • Recommendation                                              │
│   • DecisionChangers[]                                          │
│   • MonitorTriggers[]                                           │
│                                                                 │
│ TOOLS: None                                                     │
└─────────────────────────────────────────────────────────────────┘
```

**Model:** GPT-4o
**Tokens:** ~2,000-2,500

---

### Step 8: Decision Artifact

**Goal:** Produce audited brief with citations.

```
┌─────────────────────────────────────────────────────────────────┐
│ INPUT                                                           │
│   • All previous outputs                                        │
│                                                                 │
│ LLM CALLS                                                       │
│   1. Brief Writer (mid): compose narrative                      │
│   2. Citation Binder (cheap): link claims to evidence + URLs    │
│                                                                 │
│ OUTPUT                                                          │
│   • DecisionBrief.md (or JSON for rendering)                    │
│   • Citations[] (URL + accessed_at + snippet_hash)              │
│                                                                 │
│ TOOLS: None (PDF generation is non-LLM)                         │
└─────────────────────────────────────────────────────────────────┘
```

**Model:** GPT-4o + GPT-4o-mini
**Tokens:** ~3,000-4,000

---

### Step 9: Post-Decision Tracking

**Goal:** Ongoing monitoring without full re-crawls.

```
┌─────────────────────────────────────────────────────────────────┐
│ INPUT                                                           │
│   • MonitorTriggers[]                                           │
│   • Original evidence fingerprints                              │
│                                                                 │
│ LLM CALLS (scheduled)                                           │
│   1. Monitor Planner (cheap): create query subscriptions        │
│   2. Delta Summarizer (cheap): only when changes detected       │
│                                                                 │
│ TOOL CALLS (scheduled)                                          │
│   • Daily/weekly: Exa/Tavily search for trigger queries         │
│   • On change: Firecrawl re-scrape affected URLs                │
│                                                                 │
│ OUTPUT                                                          │
│   • ChangeAlerts[] (when material change detected)              │
│                                                                 │
│ TOOLS: Exa, Firecrawl (scheduled, lightweight)                  │
└─────────────────────────────────────────────────────────────────┘
```

**Model:** GPT-4o-mini (only on changes)
**Cost:** Minimal (search-only until change detected)

---

## Cost Estimation (Per Decision)

### Token Usage

| Step | Model | Tokens (est.) |
|------|-------|---------------|
| 0. Entry | mini | 800 |
| 1. Framing | mini | 2,000 |
| 2. Context | mini | 1,200 |
| 3D. Evidence extraction | mini | 20,000 |
| 4. Options | mid | 4,000 |
| 5. Mapping | mid + mini | 3,500 |
| 6. Scoring | mini | 2,000 |
| 7. Recommendation | mid | 2,500 |
| 8. Brief | mid + mini | 4,000 |
| **Total** | | **~40,000 tokens** |

### API Costs

| Service | Usage | Est. Cost |
|---------|-------|-----------|
| GPT-4o-mini | ~25k tokens | ~$0.01 |
| GPT-4o | ~15k tokens | ~$0.15 |
| Exa | 12 requests | ~$0.10 |
| Firecrawl | 25 pages | ~$0.25 |
| **Total per decision** | | **~$0.50** |

---

## Caching Strategy

### What to Cache

| Cache Key | Value | TTL |
|-----------|-------|-----|
| `url:{hash}` | Clean extracted text | 24 hours |
| `url:{hash}:fingerprint` | Content hash | 7 days |
| `query:{hash}` | SERP results | 1 hour |
| `evidence_card:{hash}` | Extracted evidence | 24 hours |
| `decision:{id}:step:{n}` | Step output | Session |

### Cache Storage

- **Redis** for hot cache (queries, recent URLs)
- **Supabase** for cold cache (evidence cards, extracted text)

---

## Error Handling

### Scrape Failures

```typescript
async function scrapeWithFallback(url: string): Promise<ScrapedContent> {
  // 1. Try Firecrawl
  const result = await firecrawl.scrape(url);
  if (result.success) return result;

  // 2. Retry with JS rendering
  const jsResult = await firecrawl.scrape(url, { waitFor: 3000 });
  if (jsResult.success) return jsResult;

  // 3. Try Apify (if available actor)
  if (hasApifyActor(url)) {
    const apifyResult = await apify.run(url);
    if (apifyResult.success) return apifyResult;
  }

  // 4. Log and skip
  logger.warn(`Failed to scrape: ${url}`);
  return null;
}
```

### LLM Failures

- Retry with exponential backoff (max 3 attempts)
- Fallback to cheaper model for non-critical steps
- Never block user; show partial results with "[Still analyzing...]"

---

## Inngest Job Structure

```typescript
// Main orchestration function
export const analyzeDecision = inngest.createFunction(
  { id: 'analyze-decision' },
  { event: 'decision/analyze.requested' },
  async ({ event, step }) => {
    const { decisionId, userId } = event.data;

    // Step 1: Frame decision
    const frame = await step.run('frame-decision', async () => {
      return frameDecision(event.data.input);
    });

    // Step 2: Context (optional)
    const context = await step.run('anchor-context', async () => {
      return anchorContext(frame, event.data.context);
    });

    // Step 3: Evidence scan (longest step)
    const evidence = await step.run('scan-evidence', async () => {
      return scanEvidence(frame, context);
    });

    // Step 4: Generate options
    const options = await step.run('generate-options', async () => {
      return generateOptions(frame, context, evidence);
    });

    // Step 5: Map evidence
    const mapping = await step.run('map-evidence', async () => {
      return mapEvidence(options, evidence);
    });

    // Step 6: Score options
    const scores = await step.run('score-options', async () => {
      return scoreOptions(options, mapping);
    });

    // Step 7: Generate recommendation
    const recommendation = await step.run('recommend', async () => {
      return generateRecommendation(options, scores, mapping);
    });

    // Step 8: Generate brief
    const brief = await step.run('generate-brief', async () => {
      return generateBrief(frame, options, evidence, recommendation);
    });

    // Save final output
    await step.run('save-output', async () => {
      return saveDecisionOutput(decisionId, {
        frame, context, evidence, options, mapping, scores, recommendation, brief
      });
    });

    return { decisionId, status: 'complete' };
  }
);
```

---

## Schemas

### DecisionSchemaV1

```typescript
interface DecisionSchemaV1 {
  id: string;
  statement: string;
  normalizedStatement: string;
  type: DecisionType;
  timeHorizon: TimeHorizon;
  reversibility: number;
  stakes: number;
  scope: Scope;

  inferred: {
    riskTolerance: RiskLevel;
    freshnessRequirement: number;
    competitiveScope: string[];
    confidenceThreshold: number;
  };

  retrievalBudget: {
    maxQueries: number;
    maxUrls: number;
    maxScrapes: number;
    maxDeepReads: number;
  };
}
```

### EvidenceCardV1

```typescript
interface EvidenceCardV1 {
  id: string;
  claim: string;
  snippet: string;
  source: {
    url: string;
    title: string;
    publisher: string;
    publishedAt: Date | null;
    accessedAt: Date;
    snippetHash: string;
  };
  signalType: SignalType;
  confidence: {
    sourceReliability: ConfidenceLevel;
    recency: RecencyLevel;
    corroboration: CorroborationLevel;
    overall: number;
  };
  interpretation: string;
  falsificationCriteria: string;
  relevanceTags: string[];
  entityTags: string[];
}
```

### OptionV1

```typescript
interface OptionV1 {
  id: string;
  title: string;
  summary: string;
  commitsTo: string;
  deprioritizes: string;
  primaryUpside: string;
  primaryRisk: string;
  reversibility: ReversibilityLevel;
  reversibilityExplanation: string;
  groundedInEvidence: string[];
}
```

### RecommendationV1

```typescript
interface RecommendationV1 {
  primaryOptionId: string;
  confidence: number;
  rationale: string;
  hedgeOptionId: string | null;
  hedgeCondition: string | null;
  decisionChangers: {
    condition: string;
    wouldFavor: string;
    likelihood: LikelihoodLevel;
  }[];
  monitorTriggers: {
    signal: string;
    source: string;
    threshold: string;
    checkFrequency: CheckFrequency;
  }[];
}
```
