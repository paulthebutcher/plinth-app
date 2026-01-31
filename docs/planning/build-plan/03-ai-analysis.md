# Phase 2: AI Analysis Pipeline (Weeks 4-6)

**Goal**: Full evidence-first AI pipeline operational. Decision analysis complete in 5-8 minutes.

**Status**: ⏳ Not Started

> **Architecture Reference**: See [LLM_ORCHESTRATION.md](../../specs/LLM_ORCHESTRATION.md) for the complete pipeline.

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

**🔧 External Setup (do this first):**

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

**Windsurf Prompt:**
```
Read docs/specs/LLM_ORCHESTRATION.md for service usage patterns.

Create service client wrappers:
1. lib/services/exa.ts - Exa search client
   - search(query, options) - semantic/keyword search
   - Returns: { urls: string[], titles: string[], snippets: string[] }

2. lib/services/firecrawl.ts - Firecrawl scraping client
   - scrape(url, options) - extract clean content
   - scrapeWithFallback(url) - with retry chain
   - Returns: { url, title, text, extractedAt }

3. lib/services/tavily.ts - Tavily search client (fallback)
   - search(query) - broader web search
   - Returns same shape as Exa

4. lib/services/apify.ts - Apify client (fallback)
   - runActor(url, actorId) - platform-specific scraping
   - Returns same shape as Firecrawl

5. lib/services/openai.ts - OpenAI client wrapper
   - complete(prompt, model) - text completion
   - stream(prompt, model) - streaming completion
   - Models: 'gpt-4o', 'gpt-4o-mini'

6. lib/services/cache.ts - Caching layer
   - get/set for URL content, query results, evidence cards
   - TTLs per LLM_ORCHESTRATION.md

Include rate limiting, error handling, and logging.
```

| Task | Acceptance Criteria | Tests | Status |
|------|---------------------|-------|--------|
| 💻 Exa client | Search works, returns URLs | Integration: mock Exa | |
| 💻 Firecrawl client | Scrape works, extracts clean text | Integration: mock Firecrawl | |
| 💻 Firecrawl fallback chain | Retries JS render → Apify → skip | Unit: fallback logic | |
| 💻 Tavily client | Fallback search works | Integration: mock Tavily | |
| 💻 Apify client | Actor execution works | Integration: mock Apify | |
| 💻 OpenAI client | Completion + streaming work | Integration: mock OpenAI | |
| 💻 Cache layer | URL + query caching with TTL | Unit: cache operations | |

---

## 2.3 Evidence Scan Pipeline (Week 4-5)

**Windsurf Prompt:**
```
Read docs/specs/LLM_ORCHESTRATION.md (Step 3: Evidence Scan).

Create the evidence scan pipeline:

1. lib/analysis/query-planner.ts (Step 3A)
   - Input: ResearchQuestions[], DecisionSchema
   - LLM call: Convert to 8-20 targeted search queries
   - Output: QueryPlan[] with query, intent, freshness, domain hints

2. lib/analysis/url-discovery.ts (Step 3B)
   - Input: QueryPlan[]
   - Tool calls: Exa (primary) + Tavily (fallback)
   - Processing: Deduplicate, score pre-scrape
   - Output: UrlShortlist[] (20-60 URLs)

3. lib/analysis/content-extractor.ts (Step 3C)
   - Input: UrlShortlist[] (top 25-35)
   - Tool calls: Firecrawl with fallback chain
   - Processing: Extract main content, enforce token limits
   - Output: ScrapedContent[]

4. lib/analysis/evidence-generator.ts (Step 3D)
   - Input: ScrapedContent[], DecisionSchema
   - LLM calls: 1 per page, extract 3-8 claims each
   - Output: EvidenceCard[] (25-40 cards)

5. lib/inngest/functions/evidence-scan.ts
   - Orchestrates Steps 3A-3D
   - Updates job progress after each sub-step
   - Handles partial failures gracefully

Use GPT-4o-mini for all Step 3 LLM calls (cost optimization).
```

| Task | Acceptance Criteria | Tests | Status |
|------|---------------------|-------|--------|
| 💻 Query planner | Generates 8-20 targeted queries | Unit: prompt output | |
| 💻 URL discovery | Searches Exa, deduplicates, scores | Integration: mock Exa | |
| 💻 URL fallback to Tavily | Uses Tavily when Exa fails | Integration: fallback | |
| 💻 Content extractor | Scrapes 25-35 URLs concurrently | Integration: mock Firecrawl | |
| 💻 Fallback chain | Firecrawl → JS → Apify → skip | Unit: fallback logic | |
| 💻 Evidence generator | Extracts claims with metadata | Unit: prompt output | |
| 💻 Evidence card schema | Matches EvidenceCardV1 | Unit: schema validation | |
| 💻 Inngest function | Orchestrates full scan | Integration: job flow | |
| 💻 Progress updates | UI shows scan progress | E2E: progress display | |

---

## 2.4 Option Generation (Week 5)

**Windsurf Prompt:**
```
Read docs/specs/LLM_ORCHESTRATION.md (Step 4: Option Generation).
Read docs/specs/CORE_JOURNEY.md (Step 4: Option Generation).

Create option generation:

1. lib/analysis/option-composer.ts
   - Input: DecisionSchema, Constraints[], EvidenceCards[] (top 30)
   - LLM call (GPT-4o): Generate 4-6 distinct options
   - Each option includes:
     - title, summary
     - commitsTo, deprioritizes
     - primaryUpside, primaryRisk
     - reversibility + explanation
     - groundedInEvidence (evidence card IDs)

2. lib/analysis/option-deduper.ts
   - Input: Options[] (raw)
   - LLM call (GPT-4o-mini): Merge cosmetically similar options
   - Output: Options[] (3-6 distinct)

3. lib/inngest/functions/generate-options.ts
   - Runs after evidence scan completes
   - Saves options to database
   - Updates job progress

Key principle: Options are COMMITMENTS, not ideas.
Each option must be grounded in specific evidence cards.
```

| Task | Acceptance Criteria | Tests | Status |
|------|---------------------|-------|--------|
| 💻 Option composer | Generates 4-6 options from evidence | Unit: prompt output | |
| 💻 Option grounding | Each option links to evidence IDs | Unit: grounding check | |
| 💻 Option deduper | Merges similar options | Unit: dedup logic | |
| 💻 Option schema | Matches OptionV1 | Unit: schema validation | |
| 💻 Inngest function | Saves options, updates progress | Integration: job flow | |

---

## 2.5 Evidence-to-Option Mapping (Week 5)

**Windsurf Prompt:**
```
Read docs/specs/LLM_ORCHESTRATION.md (Step 5: Evidence-to-Option Mapping).
Read docs/specs/CORE_JOURNEY.md (Step 5).

Create evidence mapping:

1. lib/analysis/evidence-mapper.ts
   - Input: Options[], EvidenceCards[], AssumptionsLedger
   - LLM call (GPT-4o): For each option, classify each evidence as:
     - Supporting (with relevance explanation + impact level)
     - Contradicting (with relevance explanation + impact level)
     - Unknown (information gaps)
   - Also extracts: Assumptions required for each option

2. lib/analysis/corroboration-planner.ts
   - Input: OptionEvidenceMap[]
   - LLM call (GPT-4o-mini): Identify high-impact unknowns
   - If unknowns are critical: trigger mini re-retrieval loop
     - 2-4 additional searches, scrape 5-10 pages max

3. lib/inngest/functions/map-evidence.ts
   - Runs after option generation
   - Optionally triggers re-retrieval
   - Saves mapping to database

Output schema:
- OptionEvidenceMap[] with supporting/contradicting/unknowns
- Updated AssumptionsLedger (linked to options)
```

| Task | Acceptance Criteria | Tests | Status |
|------|---------------------|-------|--------|
| 💻 Evidence mapper | Maps evidence to options | Unit: prompt output | |
| 💻 Supporting/contradicting | Each evidence classified per option | Unit: classification | |
| 💻 Unknowns detection | Identifies information gaps | Unit: gap detection | |
| 💻 Assumptions extraction | Links assumptions to options | Unit: assumption linking | |
| 💻 Corroboration planner | Detects need for re-retrieval | Unit: threshold check | |
| 💻 Re-retrieval loop | Optional mini-scan for unknowns | Integration: re-scan | |
| 💻 Inngest function | Orchestrates mapping + re-retrieval | Integration: job flow | |

---

## 2.6 Confidence Scoring (Week 5-6)

**Windsurf Prompt:**
```
Read docs/specs/LLM_ORCHESTRATION.md (Step 6: Confidence Scoring).
Read docs/specs/CORE_JOURNEY.md (Step 6).

Create confidence scoring:

1. lib/analysis/option-scorer.ts
   - Input: Options[], OptionEvidenceMap[], Constraints[]
   - Scoring factors (weighted):
     - Evidence strength: 25%
     - Evidence recency: 15%
     - Source reliability: 15%
     - Corroboration: 15%
     - Constraint fit: 15%
     - Assumption risk: 15%
   - LLM call (GPT-4o-mini): Generate rationale for each factor
   - Output: OptionScore[] with breakdown + rationale

2. lib/analysis/sensitivity-analyzer.ts
   - Input: OptionScores[], user knobs (risk, horizon, budget)
   - Calculates how scores change with different settings
   - Output: SensitivityKnobs for UI adjustment

3. lib/inngest/functions/score-options.ts
   - Runs after evidence mapping
   - Saves scores to database
   - Updates job progress

Key principle: TRANSPARENT scoring. No "AI magic numbers."
Each score explained in plain language.
```

| Task | Acceptance Criteria | Tests | Status |
|------|---------------------|-------|--------|
| 💻 Option scorer | Calculates 6-factor score | Unit: scoring math | |
| 💻 Score breakdown | Each factor scored 0-100 | Unit: factor scoring | |
| 💻 Score rationale | LLM explains each factor | Unit: prompt output | |
| 💻 Sensitivity analyzer | Shows score changes with knobs | Unit: sensitivity calc | |
| 💻 Inngest function | Saves scores, updates progress | Integration: job flow | |

---

## 2.7 Recommendation Generation (Week 6)

**Windsurf Prompt:**
```
Read docs/specs/LLM_ORCHESTRATION.md (Step 7: Recommendation).
Read docs/specs/CORE_JOURNEY.md (Step 7).

Create recommendation generation:

1. lib/analysis/recommender.ts
   - Input: OptionScores[], OptionEvidenceMap[], AssumptionsLedger
   - LLM call (GPT-4o): Generate recommendation
   - Output:
     - Primary option + confidence + rationale
     - Hedge option + condition (optional)
     - DecisionChangers[] (3-5 conditions that would flip recommendation)
     - MonitorTriggers[] (signals to track post-decision)

2. lib/inngest/functions/generate-recommendation.ts
   - Runs after scoring
   - Saves recommendation to database
   - Updates job progress

Decision changers format:
- Condition: "A major competitor announces full mid-market compliance"
- Would favor: Option A (or "reconsider")
- Likelihood: low/medium/high

Monitor triggers format:
- Signal: "Competitor Y mid-market pricing"
- Source: "Press releases, pricing pages"
- Threshold: "If lower than $X"
- Frequency: daily/weekly/monthly
```

| Task | Acceptance Criteria | Tests | Status |
|------|---------------------|-------|--------|
| 💻 Recommender | Generates primary + hedge | Unit: prompt output | |
| 💻 Decision changers | 3-5 explicit conditions | Unit: changers format | |
| 💻 Monitor triggers | Actionable monitoring signals | Unit: triggers format | |
| 💻 Recommendation schema | Matches RecommendationV1 | Unit: schema validation | |
| 💻 Inngest function | Saves recommendation | Integration: job flow | |

---

## 2.8 Brief Generation (Week 6)

**Windsurf Prompt:**
```
Read docs/specs/LLM_ORCHESTRATION.md (Step 8: Decision Artifact).
Read docs/specs/CORE_JOURNEY.md (Step 8).

Create brief generation:

1. lib/analysis/brief-writer.ts
   - Input: All previous outputs (frame, context, evidence, options, mapping, scores, recommendation)
   - LLM call (GPT-4o): Compose narrative brief
   - Sections:
     - Decision framing (question, constraints, stakes)
     - Options considered (all, including rejected + reasons)
     - Evidence summary (key evidence with citations)
     - Assumptions ledger (declared, implicit, status)
     - Recommendation (primary + hedge + confidence)
     - Open questions (unresolved unknowns)
     - Metadata (owner, stakeholders, date)

2. lib/analysis/citation-binder.ts
   - Input: Brief, EvidenceCards[]
   - LLM call (GPT-4o-mini): Link claims to sources
   - Output: Citations[] with URL, accessed_at, snippet_hash

3. lib/inngest/functions/generate-brief.ts
   - Final step in pipeline
   - Saves brief to database
   - Updates decision status to "analyzed"

Output formats: JSON (for rendering), Markdown (for export)
```

| Task | Acceptance Criteria | Tests | Status |
|------|---------------------|-------|--------|
| 💻 Brief writer | Composes full narrative | Unit: prompt output | |
| 💻 All sections included | 7 sections per spec | Unit: section check | |
| 💻 Citation binder | Links claims to sources | Unit: citation format | |
| 💻 Citation schema | URL + accessed_at + snippet_hash | Unit: schema validation | |
| 💻 Inngest function | Saves brief, updates status | Integration: job flow | |
| 💻 Brief display | Renders in results view | E2E: brief display | |

---

## 2.9 Main Orchestration Function (Week 6)

**Windsurf Prompt:**
```
Read docs/specs/LLM_ORCHESTRATION.md (Inngest Job Structure).

Create the main orchestration function:

1. lib/inngest/functions/analyze-decision.ts
   - Event: decision/analyze.requested
   - Steps (using Inngest step.run for durability):
     1. frame-decision
     2. anchor-context
     3. scan-evidence (longest)
     4. generate-options
     5. map-evidence
     6. score-options
     7. recommend
     8. generate-brief
     9. save-output

   - Each step updates job progress
   - Partial failures are handled gracefully
   - Full output saved to decision record

2. lib/inngest/functions/index.ts
   - Export all functions for registration

3. Update app/api/inngest/route.ts
   - Register all functions
```

| Task | Acceptance Criteria | Tests | Status |
|------|---------------------|-------|--------|
| 💻 Main orchestration | Runs all 9 steps in sequence | Integration: full flow | |
| 💻 Step durability | Each step resumable on failure | Unit: Inngest steps | |
| 💻 Progress tracking | Job progress updates per step | E2E: progress display | |
| 💻 Partial failure handling | Continues with available data | Unit: error handling | |
| 💻 Full pipeline test | End-to-end with mock services | E2E: full analysis | |

---

## 2.10 Error Handling & Monitoring (Week 6)

**Windsurf Prompt:**
```
Read docs/specs/LLM_ORCHESTRATION.md (Error Handling section).

Implement robust error handling:

1. lib/analysis/error-handler.ts
   - Scrape failures: Firecrawl → JS → Apify → skip
   - LLM failures: Retry 3x with exponential backoff
   - Rate limits: Queue and retry
   - Partial results: Never block user, show "[Still analyzing...]"

2. lib/analysis/cost-tracker.ts
   - Track API calls per decision
   - Log: queries, URLs, scrapes, tokens
   - Alert if approaching budget limits

3. lib/analysis/quality-checker.ts
   - Post-analysis validation:
     - Minimum 10 evidence cards
     - Minimum 2 options
     - All options grounded in evidence
   - Flag low-quality analyses for review

4. Sentry integration for all analysis errors
```

| Task | Acceptance Criteria | Tests | Status |
|------|---------------------|-------|--------|
| 💻 Scrape fallback chain | Full chain with graceful skip | Unit: fallback logic | |
| 💻 LLM retry logic | 3x retry with backoff | Unit: retry behavior | |
| 💻 Partial results handling | Shows available data | E2E: partial display | |
| 💻 Cost tracking | Logs all API usage | Unit: tracking accuracy | |
| 💻 Quality checks | Validates analysis completeness | Unit: validation rules | |
| 💻 Sentry integration | Errors logged with context | Manual: verify Sentry | |

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
- [ ] Error handling and monitoring in place
- [ ] Full end-to-end test passing

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
