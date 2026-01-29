# Evidence Engine Specification

## Overview

The Evidence Engine is Plinth's intelligence layer—it gathers, structures, and surfaces data that informs strategic decisions. Quality over speed. Background processing is acceptable.

---

## Evidence Categories

For strategic decisions, evidence falls into these categories:

| Category | What It Answers | Decision Relevance |
|----------|-----------------|-------------------|
| **Competitor Intel** | What are competitors doing? | Build vs Buy, Market Entry, Product Prioritization |
| **Market Context** | What's the market doing? | Market Entry, Investment |
| **Customer Signals** | What do customers want/hate? | Product Prioritization, Build vs Buy |
| **Financial Indicators** | Is this company healthy/growing? | Investment, Market Entry, Build vs Buy (vendor) |
| **Technology Signals** | What tech bets are being made? | Build vs Buy, Product Prioritization |
| **Talent Signals** | Where is talent flowing? | Market Entry, Investment |
| **Regulatory Context** | What legal constraints exist? | Market Entry, Investment |

---

## Data Sources by Category

### 1. Competitor Intelligence

| Source | Data Available | Quality | Cost | Method |
|--------|---------------|---------|------|--------|
| **Company Website** | Product features, pricing, positioning, team, customers | High | Low | Firecrawl |
| **G2/Capterra/TrustRadius** | Reviews, ratings, feature comparisons, pros/cons | High | Low-Med | Scrape or API |
| **Crunchbase** | Funding, employees, leadership, competitors | High | Med | API ($) |
| **LinkedIn Company** | Employee count, growth, job openings | Med | Med | Proxycurl API |
| **PitchBook** | Deep financials, valuations | High | High | Manual/API ($$$) |
| **Press/News** | Announcements, launches, partnerships | Med | Low | Exa Search |
| **Twitter/X** | Real-time signals, sentiment | Low-Med | Low | API |

**Recommended Stack:**
- Firecrawl for company websites (primary)
- Exa for news/press search
- Crunchbase API for funding/company data (if budget allows)
- G2 scraping for B2B SaaS reviews

---

### 2. Market Context

| Source | Data Available | Quality | Cost | Method |
|--------|---------------|---------|------|--------|
| **Industry Reports** (Gartner, Forrester, IBISWorld) | Market size, trends, forecasts | High | High | Manual excerpts |
| **News Aggregation** | Trends, sentiment, major moves | Med | Low | Exa Search |
| **Google Trends** | Relative interest over time | Med | Free | API |
| **Statista** | Market stats, charts | High | Med | Manual/scrape |
| **SEC Filings** | Public company data, industry commentary | High | Free | EDGAR API |
| **Reddit/Forums** | Ground-level sentiment | Med | Low | API + scrape |

**Recommended Stack:**
- Exa for semantic news search ("AI in healthcare market trends 2024")
- Google Trends API for interest tracking
- SEC EDGAR for public company filings
- Reddit API for sentiment mining

---

### 3. Customer Signals

| Source | Data Available | Quality | Cost | Method |
|--------|---------------|---------|------|--------|
| **G2/Capterra Reviews** | Feature requests, complaints, praise | High | Low | Scrape |
| **Reddit** | Unfiltered opinions, pain points | High | Low | API |
| **Twitter/X** | Real-time complaints, praise | Med | Low | API |
| **Product Hunt** | Launch reception, feature feedback | Med | Free | Scrape |
| **App Store Reviews** | Mobile app feedback | High | Free | Scrape |
| **Trustpilot** | Consumer service reviews | Med | Low | Scrape |
| **HackerNews** | Tech audience sentiment | Med | Free | API |

**Recommended Stack:**
- G2/Capterra for B2B product reviews (structured)
- Reddit API + Exa for unstructured sentiment
- Product Hunt for launch/positioning research

---

### 4. Financial Indicators

| Source | Data Available | Quality | Cost | Method |
|--------|---------------|---------|------|--------|
| **Crunchbase** | Funding rounds, investors, valuations | High | Med | API |
| **PitchBook** | Deep private company financials | High | High | Enterprise only |
| **SEC EDGAR** | Public filings (10-K, 10-Q, S-1) | High | Free | API |
| **Yahoo Finance** | Stock data, analyst estimates | High | Free | API |
| **OpenCorporates** | Company registration, status | Med | Low | API |
| **Import/Export Data** | Trade volumes, supply chain | Med | Med | Specialized APIs |

**Recommended Stack:**
- Crunchbase for private company funding
- SEC EDGAR for public companies
- Yahoo Finance for market data

---

### 5. Technology Signals

| Source | Data Available | Quality | Cost | Method |
|--------|---------------|---------|------|--------|
| **BuiltWith** | Tech stack, tools used | High | Med | API |
| **Wappalyzer** | Frontend/backend technologies | High | Low | API/Extension |
| **GitHub** | Open source activity, repos, contributors | High | Free | API |
| **StackShare** | Tech stack decisions, comparisons | Med | Free | Scrape |
| **Job Postings** | Tech requirements, stack bets | High | Low | Scrape/API |
| **Patents** | Innovation direction | Med | Free | USPTO/Google Patents |

**Recommended Stack:**
- BuiltWith or Wappalyzer for tech detection
- GitHub API for open source signals
- Job posting aggregation for tech stack inference

---

### 6. Talent Signals

| Source | Data Available | Quality | Cost | Method |
|--------|---------------|---------|------|--------|
| **LinkedIn Jobs** | Open roles, hiring velocity | High | Med | Proxycurl/scrape |
| **Indeed/Glassdoor** | Job postings, salary data, reviews | High | Low | Scrape |
| **Levels.fyi** | Compensation benchmarks | High | Free | Scrape |
| **Wellfound (AngelList)** | Startup jobs, team size | High | Free | API |
| **H1B Data** | Visa filings, salary data | High | Free | Public records |

**Recommended Stack:**
- LinkedIn via Proxycurl for professional data
- Indeed/Glassdoor scraping for job postings
- H1B data for compensation benchmarks

---

### 7. Regulatory Context

| Source | Data Available | Quality | Cost | Method |
|--------|---------------|---------|------|--------|
| **Regulations.gov** | Federal rules, comments | High | Free | API |
| **State Registries** | State-level regulations | Med | Free | Scrape |
| **Court Records (PACER)** | Litigation history | High | Low | API |
| **GDPR/Privacy Databases** | Compliance requirements | High | Free | Curated sources |
| **Industry Bodies** | Standards, certifications | High | Free | Manual |

**Recommended Stack:**
- Exa for regulatory news search
- Regulations.gov API for federal rules
- Manual curation for industry-specific compliance

---

## Recommended Tool Stack (MVP)

### Primary Tools

| Tool | Purpose | Cost | Why |
|------|---------|------|-----|
| **Firecrawl** | Web scraping, company sites | $50-100/mo | Best quality extraction, handles JS |
| **Exa** | Semantic web search | $50-100/mo | Finds relevant content by meaning, not just keywords |
| **Crunchbase Basic** | Company/funding data | $0-50/mo | Good enough for MVP, structured data |
| **Reddit API** | Customer sentiment | Free | Rich unfiltered opinions |
| **GitHub API** | Tech signals | Free | Open source activity |
| **Google Trends** | Interest tracking | Free | Simple but useful |

**Total: ~$100-250/mo for data sources**

### Secondary (Add Later)

| Tool | Purpose | When to Add |
|------|---------|-------------|
| Proxycurl | LinkedIn data | When talent signals matter |
| BuiltWith | Tech detection | When tech decisions are core |
| Crunchbase Pro | Deeper company data | When funding analysis is frequent |
| SerpAPI | Google search results | Backup to Exa |

---

## Data Collection Architecture

### Job-Based Processing

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         USER TRIGGERS                                    │
│                                                                          │
│  [Add Competitor]  [Research Market]  [Find Evidence]  [Auto-suggest]   │
│         │                 │                 │                │          │
└─────────┼─────────────────┼─────────────────┼────────────────┼──────────┘
          │                 │                 │                │
          ▼                 ▼                 ▼                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         JOB QUEUE (Inngest)                              │
│                                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌────────────┐  │
│  │ competitor/  │  │ market/      │  │ evidence/    │  │ refresh/   │  │
│  │ analyze      │  │ research     │  │ search       │  │ scheduled  │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  └────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
          │                 │                 │                │
          ▼                 ▼                 ▼                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      DATA COLLECTION WORKERS                             │
│                                                                          │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐        │
│  │ Firecrawl  │  │    Exa     │  │ Crunchbase │  │  Reddit    │        │
│  │  Worker    │  │  Worker    │  │  Worker    │  │  Worker    │        │
│  └────────────┘  └────────────┘  └────────────┘  └────────────┘        │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
          │                 │                 │                │
          ▼                 ▼                 ▼                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      DATA PROCESSING PIPELINE                            │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                     1. RAW DATA STORAGE                          │   │
│  │  Store raw scraped content with metadata (source, timestamp)     │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                              │                                          │
│                              ▼                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                     2. EXTRACTION (LLM)                          │   │
│  │  Extract structured data from raw content using GPT-4o-mini      │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                              │                                          │
│                              ▼                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                     3. SYNTHESIS (LLM)                           │   │
│  │  Combine extracted data into coherent profiles using GPT-4o      │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                              │                                          │
│                              ▼                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                     4. STRUCTURED STORAGE                        │   │
│  │  Store in typed tables (competitor_profiles, evidence, etc.)     │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         USER NOTIFICATION                                │
│                                                                          │
│  [Real-time update via Supabase Realtime]  →  [UI refreshes]            │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Job Types

#### 1. Competitor Analysis Job
```typescript
{
  type: "competitor/analyze",
  input: {
    companyName: string,
    companyUrl?: string,
    decisionId: string,
    decisionContext: string, // For relevance
    depth: "quick" | "standard" | "deep"
  },
  steps: [
    // Parallel data gathering
    { source: "firecrawl", target: "company_website", pages: ["about", "product", "pricing", "customers"] },
    { source: "exa", target: "news", query: "{companyName} news announcements" },
    { source: "crunchbase", target: "company_data" },
    { source: "g2", target: "reviews", if: "b2b_saas" },

    // Sequential processing
    { action: "extract", model: "gpt-4o-mini" },
    { action: "synthesize", model: "gpt-4o" },
    { action: "store", target: "competitor_profiles" }
  ],
  timeout: "5m",
  retries: 2
}
```

#### 2. Market Research Job
```typescript
{
  type: "market/research",
  input: {
    market: string, // "AI in healthcare"
    geography?: string,
    decisionId: string
  },
  steps: [
    { source: "exa", target: "market_news", query: "{market} market size growth trends 2024" },
    { source: "exa", target: "industry_reports", query: "{market} industry report analysis" },
    { source: "google_trends", target: "interest_data" },
    { source: "reddit", target: "sentiment", subreddits: ["inferred_from_market"] },

    { action: "extract", model: "gpt-4o-mini" },
    { action: "synthesize", model: "gpt-4o" },
    { action: "store", target: "market_context" }
  ],
  timeout: "3m",
  retries: 2
}
```

#### 3. Evidence Search Job
```typescript
{
  type: "evidence/search",
  input: {
    query: string, // User's evidence question
    decisionId: string,
    options: string[], // Option titles for relevance
    evidenceType: "supporting" | "challenging" | "both"
  },
  steps: [
    { source: "exa", target: "web_results", query: "{query}", count: 10 },
    { action: "filter_relevance", model: "gpt-4o-mini" },
    { action: "extract_claims", model: "gpt-4o-mini" },
    { action: "assess_strength", model: "gpt-4o-mini" },
    { action: "store", target: "evidence" }
  ],
  timeout: "2m",
  retries: 1
}
```

#### 4. Scheduled Refresh Job
```typescript
{
  type: "refresh/scheduled",
  trigger: "cron: 0 0 * * 0", // Weekly
  input: {
    scope: "active_decisions", // Only refresh for active decisions
    staleThreshold: "7d"
  },
  steps: [
    { action: "find_stale_profiles" },
    { action: "queue_refresh_jobs" }
  ]
}
```

---

## Collection Strategies by Source

### Firecrawl (Company Websites)

**Purpose**: Extract structured content from company websites

**Pages to Crawl**:
```typescript
const pagesToCrawl = [
  { path: "/", purpose: "homepage_positioning" },
  { path: "/about", purpose: "company_overview" },
  { path: "/product", purpose: "product_features" },
  { path: "/pricing", purpose: "pricing_model" },
  { path: "/customers", purpose: "customer_proof" },
  { path: "/blog", purpose: "content_strategy", limit: 5 },
  { path: "/careers", purpose: "hiring_signals" }
];
```

**Extraction Schema**:
```typescript
interface WebsiteExtraction {
  positioning: {
    tagline: string;
    valueProps: string[];
    targetAudience: string;
  };
  product: {
    name: string;
    description: string;
    features: string[];
    integrations: string[];
  };
  pricing: {
    model: "freemium" | "subscription" | "usage" | "enterprise" | "custom";
    tiers: { name: string; price?: string; features: string[] }[];
    freeTrialAvailable: boolean;
  };
  socialProof: {
    customerLogos: string[];
    testimonials: { quote: string; author: string; company?: string }[];
    metrics: string[]; // "10,000+ customers", "99.9% uptime"
  };
  team: {
    size?: string;
    keyPeople: { name: string; role: string }[];
    locations: string[];
  };
}
```

**Cost Optimization**:
- Cache crawled pages for 7 days
- Only re-crawl if user requests refresh
- Use sitemap.xml to find pages efficiently
- Limit blog posts to 5 most recent

---

### Exa (Semantic Search)

**Purpose**: Find relevant content across the web by meaning

**Query Patterns**:
```typescript
const exaQueries = {
  competitor_news: "{company} news announcements funding partnership",
  market_trends: "{market} market size growth trends 2024 2025",
  industry_analysis: "{industry} industry report analysis forecast",
  product_reviews: "{product} review comparison vs alternatives",
  regulatory: "{industry} regulation compliance requirements",
  thought_leadership: "{topic} best practices guide framework"
};
```

**Settings**:
```typescript
const exaConfig = {
  numResults: 10,
  type: "neural", // Semantic, not keyword
  useAutoprompt: true,
  contents: {
    text: { maxCharacters: 2000 }
  }
};
```

**Cost Optimization**:
- Cache search results for 24 hours
- Use specific queries (cheaper than broad)
- Limit to 10 results per query
- Batch related queries

---

### Crunchbase (Company Data)

**Purpose**: Structured company and funding data

**Data Points to Extract**:
```typescript
interface CrunchbaseData {
  overview: {
    name: string;
    shortDescription: string;
    foundedDate: string;
    numEmployees: string; // Range
    headquartersLocation: string;
    website: string;
    linkedinUrl: string;
  };
  funding: {
    totalRaised: number;
    lastFundingType: string;
    lastFundingDate: string;
    lastFundingAmount: number;
    investors: { name: string; leadInvestor: boolean }[];
  };
  people: {
    founders: { name: string; linkedinUrl: string }[];
    executives: { name: string; title: string }[];
  };
  signals: {
    trend_score?: number;
    similarCompanies: string[];
  };
}
```

**Cost Optimization**:
- Use Basic API (not Pro) for MVP
- Cache company data for 30 days (funding doesn't change often)
- Only pull detailed data for top 3 competitors per decision

---

### G2/Capterra (Reviews)

**Purpose**: Structured product reviews from verified users

**Data Points to Extract**:
```typescript
interface ReviewData {
  overall: {
    rating: number;
    reviewCount: number;
    satisfactionScore: number;
  };
  ratings: {
    easeOfUse: number;
    qualityOfSupport: number;
    easeOfSetup: number;
    valueForMoney: number;
  };
  reviews: {
    rating: number;
    title: string;
    pros: string;
    cons: string;
    useCase: string;
    companySize: string;
    industry: string;
    date: string;
  }[];
  competitors: {
    name: string;
    comparisonUrl: string;
  }[];
  features: {
    name: string;
    rating: number;
  }[];
}
```

**Scraping Approach**:
- Use Firecrawl with JS rendering
- Focus on review summary page first
- Pull top 20 reviews sorted by recency
- Extract comparison pages for side-by-side

**Cost Optimization**:
- Cache reviews for 14 days
- Only scrape if product is B2B SaaS (detect from website)
- Use review summary metrics, don't need every review

---

### Reddit (Sentiment)

**Purpose**: Unfiltered customer opinions and pain points

**Subreddit Mapping**:
```typescript
const subredditsByCategory = {
  saas: ["SaaS", "startups", "Entrepreneur"],
  enterprise_software: ["sysadmin", "ITManagers", "devops"],
  marketing: ["marketing", "digital_marketing", "PPC"],
  sales: ["sales", "salesforce"],
  hr: ["humanresources", "recruiting"],
  finance: ["fintech", "CFO"],
  healthcare: ["healthIT", "medicine"],
  // ... industry-specific mappings
};
```

**Search Strategy**:
```typescript
const redditSearch = {
  query: `"{productName}" OR "{companyName}"`,
  subreddits: inferredFromIndustry,
  sort: "relevance",
  timeFilter: "year",
  limit: 50
};
```

**Extraction**:
```typescript
interface RedditExtraction {
  sentiment: "positive" | "negative" | "neutral" | "mixed";
  themes: {
    theme: string;
    frequency: number;
    sentiment: string;
    exampleQuotes: string[];
  }[];
  painPoints: string[];
  praises: string[];
  alternatives_mentioned: string[];
}
```

**Cost Optimization**:
- Use official Reddit API (free tier generous)
- Cache results for 7 days
- Process with gpt-4o-mini (cheaper for extraction)

---

## LLM Processing Pipeline

### Stage 1: Extraction (gpt-4o-mini)

Convert raw content to structured data. Use cheaper model.

```typescript
const extractionPrompt = `
Extract structured data from this web content.

Source: {source_type}
URL: {url}
Content:
{raw_content}

Extract into this JSON schema:
{extraction_schema}

Rules:
- Only extract explicitly stated information
- Mark inferences with [inferred]
- Leave fields null if not found
- Include source quotes for key claims
`;
```

### Stage 2: Synthesis (gpt-4o)

Combine extracted data into coherent narratives. Use better model.

```typescript
const synthesisPrompt = `
You are a strategic analyst creating a competitor profile for executive decision-making.

Decision Context: {decision_context}
Company: {company_name}

Extracted Data:
- Website: {website_extraction}
- Funding: {crunchbase_data}
- Reviews: {review_data}
- News: {news_extraction}
- Sentiment: {reddit_extraction}

Create a comprehensive profile following this structure:
{profile_schema}

Rules:
- Be direct and specific, not generic
- Cite sources for every claim
- Note confidence level for inferences
- Focus on what matters for the decision context
- Identify potential biases in sources
`;
```

### Stage 3: Relevance Mapping

Connect evidence to decision options.

```typescript
const relevanceMappingPrompt = `
Given this evidence and the decision options, determine relevance.

Decision: {decision_frame}
Options:
${options.map((o, i) => `${i + 1}. ${o.title}: ${o.description}`).join('\n')}

Evidence:
{evidence_item}

For each option, assess:
1. Does this evidence support or challenge this option?
2. How strong is the connection? (strong/moderate/weak/none)
3. What's the specific implication?

Return JSON:
{
  "mappings": [
    {
      "optionIndex": number,
      "relationship": "supports" | "challenges" | "neutral",
      "strength": "strong" | "moderate" | "weak",
      "implication": "string"
    }
  ]
}
`;
```

---

## Caching Strategy

### Cache Layers

```
┌─────────────────────────────────────────────────────────────────┐
│                      CACHE HIERARCHY                             │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              L1: REQUEST CACHE (5 min)                   │   │
│  │  Same user, same query within session                    │   │
│  │  Storage: In-memory (Edge function)                      │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                   │
│                              ▼                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              L2: RESULT CACHE (varies)                   │   │
│  │  Processed/synthesized results                           │   │
│  │  Storage: Supabase (ai_cache table)                     │   │
│  │                                                          │   │
│  │  TTL by type:                                           │   │
│  │  - Competitor profile: 7 days                           │   │
│  │  - Company data (Crunchbase): 30 days                   │   │
│  │  - News search: 24 hours                                │   │
│  │  - Reviews: 14 days                                     │   │
│  │  - Market trends: 7 days                                │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                   │
│                              ▼                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              L3: RAW DATA CACHE (varies)                 │   │
│  │  Raw scraped content before processing                   │   │
│  │  Storage: Supabase Storage (blob)                       │   │
│  │                                                          │   │
│  │  TTL by source:                                         │   │
│  │  - Company website: 7 days                              │   │
│  │  - News articles: 30 days (content doesn't change)      │   │
│  │  - Reviews: 14 days                                     │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Cache Key Strategy

```typescript
const cacheKey = {
  competitor_profile: hash(`competitor:${companyName}:${companyUrl}:v1`),
  market_research: hash(`market:${market}:${geography}:v1`),
  evidence_search: hash(`evidence:${query}:${decisionId}:v1`),
  news_search: hash(`news:${query}:${date.toISOString().slice(0,10)}:v1`)
};
```

### Cache Invalidation

- **User-triggered**: "Refresh" button on profile
- **Time-based**: TTL expiration
- **Event-based**: Webhook from data source (if available)

---

## Cost Projections

### Per-Decision Costs

| Action | API Calls | Estimated Cost |
|--------|-----------|----------------|
| Add competitor (standard) | Firecrawl (5 pages) + Exa (2) + Crunchbase (1) | $0.50-0.80 |
| Add competitor (deep) | Above + G2 + Reddit | $0.80-1.20 |
| Market research | Exa (3) + Google Trends | $0.20-0.30 |
| Evidence search | Exa (1) | $0.05-0.10 |
| LLM extraction | gpt-4o-mini (~2k tokens × 5) | $0.01-0.02 |
| LLM synthesis | gpt-4o (~4k tokens) | $0.10-0.15 |
| **Total per decision** | ~3 competitors + market + evidence | **$2.50-4.00** |

### Monthly Projections

| Scale | Decisions/mo | Est. Data Cost | Est. LLM Cost | Total |
|-------|--------------|----------------|---------------|-------|
| Early (10 orgs) | 50 | $75 | $25 | $100 |
| Growth (50 orgs) | 250 | $350 | $100 | $450 |
| Scale (200 orgs) | 1000 | $1,200 | $400 | $1,600 |

*Note: Caching reduces repeat queries by ~40-60%*

---

## Quality Assurance

### Source Reliability Scoring

```typescript
const sourceReliability = {
  company_website: { reliability: 0.7, bias: "self-promotional" },
  crunchbase: { reliability: 0.9, bias: "none" },
  g2_reviews: { reliability: 0.8, bias: "verified_users" },
  news_major: { reliability: 0.8, bias: "editorial" },
  news_blog: { reliability: 0.5, bias: "varies" },
  reddit: { reliability: 0.6, bias: "vocal_minority" },
  press_release: { reliability: 0.5, bias: "promotional" }
};
```

### Evidence Quality Indicators

Display to users:
- **Source diversity**: How many different sources?
- **Source reliability**: Average reliability of sources
- **Recency**: How recent is the data?
- **Consistency**: Do sources agree or conflict?

### Conflict Detection

```typescript
const conflictDetection = {
  prompt: `
    Given these claims from different sources, identify conflicts:

    ${claims.map(c => `[${c.source}]: ${c.claim}`).join('\n')}

    Return any claims that contradict each other, with explanation.
  `,
  action: "flag_for_user_review"
};
```

---

## Data Model Additions

```sql
-- Raw data storage (before processing)
CREATE TABLE raw_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL, -- 'firecrawl', 'exa', 'crunchbase', etc.
  source_url TEXT,
  source_query TEXT,
  content JSONB NOT NULL,
  content_hash TEXT NOT NULL, -- For deduplication
  fetched_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

-- Job tracking
CREATE TABLE evidence_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  decision_id UUID REFERENCES decisions(id) ON DELETE CASCADE,
  job_type TEXT NOT NULL, -- 'competitor/analyze', 'market/research', etc.
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
  input JSONB NOT NULL,
  output JSONB,
  error TEXT,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Market context (research results)
CREATE TABLE market_context (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  decision_id UUID REFERENCES decisions(id) ON DELETE CASCADE NOT NULL,
  market TEXT NOT NULL,
  geography TEXT,
  size_estimate TEXT,
  growth_rate TEXT,
  key_trends JSONB,
  key_players JSONB,
  regulatory_notes TEXT,
  sources JSONB,
  generated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for efficient cache lookups
CREATE INDEX idx_raw_data_hash ON raw_data(content_hash);
CREATE INDEX idx_raw_data_source ON raw_data(source, source_url);
CREATE INDEX idx_evidence_jobs_decision ON evidence_jobs(decision_id, status);
```

---

## Implementation Priority

### Phase 1 (Week 5-6): Core Evidence

1. Firecrawl integration for company websites
2. Exa integration for news/search
3. Basic LLM extraction pipeline
4. Competitor profile generation (simplified)

### Phase 2 (Week 7-8): Depth

1. Crunchbase integration
2. G2/Capterra scraping
3. Full competitor profile synthesis
4. Market research capability

### Phase 3 (Post-MVP): Richness

1. Reddit sentiment analysis
2. Job posting analysis
3. Tech stack detection
4. Scheduled refresh jobs
5. Evidence quality scoring
