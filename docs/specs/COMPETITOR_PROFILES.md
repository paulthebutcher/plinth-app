# Competitor Profile Specification

## Overview

Competitor profiles are a core AI-powered feature in Plinth. They provide comprehensive, multi-section analysis of competitors that can be used as evidence in decision-making.

---

## Profile Structure

### Input
- Company name (required)
- Company URL (optional, improves accuracy)
- Industry context (inherited from decision)
- Specific focus areas (optional)

### Output: Multi-Section Profile

```
┌─────────────────────────────────────────────────────────────────┐
│                    COMPETITOR PROFILE                            │
│                    [Company Name]                                │
│                    Generated: [Date]                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. COMPANY OVERVIEW                                            │
│     • What they do (1-2 sentences)                              │
│     • Founded / Headquarters / Size                             │
│     • Funding status / Revenue (if public)                      │
│     • Key leadership                                            │
│                                                                  │
│  2. PRODUCT & POSITIONING                                       │
│     • Core product/service offering                             │
│     • Target customer segments                                  │
│     • Pricing model (if discoverable)                           │
│     • Key differentiators (their claimed)                       │
│     • Technology/platform notes                                 │
│                                                                  │
│  3. MARKET POSITION                                             │
│     • Market share / competitive rank                           │
│     • Key customers (if public)                                 │
│     • Geographic presence                                       │
│     • Recent growth trajectory                                  │
│                                                                  │
│  4. STRENGTHS                                                   │
│     • [Strength 1 with evidence]                                │
│     • [Strength 2 with evidence]                                │
│     • [Strength 3 with evidence]                                │
│                                                                  │
│  5. WEAKNESSES                                                  │
│     • [Weakness 1 with evidence]                                │
│     • [Weakness 2 with evidence]                                │
│     • [Weakness 3 with evidence]                                │
│                                                                  │
│  6. RECENT ACTIVITY                                             │
│     • Product launches / updates                                │
│     • Partnerships / acquisitions                               │
│     • Leadership changes                                        │
│     • Press / media coverage                                    │
│                                                                  │
│  7. STRATEGIC SIGNALS                                           │
│     • Where they seem to be heading                             │
│     • Investment areas                                          │
│     • Potential threats to your position                        │
│     • Opportunities they might miss                             │
│                                                                  │
│  8. SOURCES                                                     │
│     • [List of URLs/sources used]                               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## User Interactions

### Generate Profile
1. User clicks "Add Competitor" in decision context
2. Enters company name (+ optional URL)
3. System generates profile (streaming, 15-30 seconds)
4. Profile appears in decision's competitor panel

### Add Evidence from Profile
1. User views generated profile
2. Highlights any section/claim
3. Clicks "Add as Evidence"
4. System creates evidence item linked to:
   - The specific claim
   - The competitor profile as source
   - Relevant option (if selected)

### Manual Evidence Addition
1. User can add their own evidence to any profile section
2. Evidence types:
   - URL (with auto-extraction)
   - Text note
   - Document upload (future)
3. User-added evidence marked distinctly from AI-generated

### Refresh Profile
1. User can request profile refresh
2. System re-runs analysis with latest data
3. Changes highlighted (diff view, optional)
4. Previous version archived (viewable)

---

## Data Model

```sql
-- Competitor profiles
CREATE TABLE competitor_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  decision_id UUID REFERENCES decisions(id) ON DELETE CASCADE NOT NULL,
  company_name TEXT NOT NULL,
  company_url TEXT,

  -- Generated content (structured JSON)
  overview JSONB,          -- {description, founded, hq, size, funding, leadership}
  product JSONB,           -- {offering, segments, pricing, differentiators, tech}
  market_position JSONB,   -- {share, customers, geography, growth}
  strengths JSONB,         -- [{point, evidence, source}]
  weaknesses JSONB,        -- [{point, evidence, source}]
  recent_activity JSONB,   -- [{event, date, source}]
  strategic_signals JSONB, -- [{signal, implication}]
  sources JSONB,           -- [{url, title, accessed}]

  -- Metadata
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  model_used TEXT,
  tokens_used INTEGER,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User-added evidence on competitor profiles
CREATE TABLE competitor_evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES competitor_profiles(id) ON DELETE CASCADE NOT NULL,
  section TEXT NOT NULL,   -- 'strengths', 'weaknesses', 'market_position', etc.

  claim TEXT NOT NULL,
  source_url TEXT,
  source_type TEXT,        -- 'url', 'note', 'document'
  notes TEXT,

  added_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Archive of previous profile versions
CREATE TABLE competitor_profile_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES competitor_profiles(id) ON DELETE CASCADE NOT NULL,
  version_number INTEGER NOT NULL,
  content JSONB NOT NULL,  -- Full snapshot of profile at that time
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## AI Implementation

### Prompt Strategy

**Step 1: Web Research**
```
Using Firecrawl/Exa, gather:
- Company website (about, product, pricing pages)
- Recent news articles (last 12 months)
- LinkedIn company page
- Crunchbase/PitchBook data (if available)
- G2/Capterra reviews (if B2B SaaS)
```

**Step 2: Profile Generation**
```
System: You are a strategic analyst creating a competitor profile for
executive decision-making. Be factual, cite sources, distinguish between
verified facts and inferences.

Context: {decision_context}
Company: {company_name}
URL: {company_url}
Research data: {web_research_results}

Generate a comprehensive competitor profile following this structure:
{profile_schema}

Rules:
- Every claim should have a source
- Mark inferences with "[Inferred]"
- Be direct and actionable, not generic
- Focus on what matters for the decision context
- If data is unavailable, say so explicitly
```

**Step 3: Validation**
- Parse output against Zod schema
- Flag any missing sections
- Calculate confidence score per section

### Caching Strategy

- Cache web research results: 24 hours
- Cache generated profiles: 7 days (unless refresh requested)
- Cache key: hash(company_name + company_url + decision_context_summary)

### Cost Estimate

Per competitor profile:
- Firecrawl: ~$0.10-0.30 (3-10 pages)
- GPT-4o: ~$0.10-0.20 (2-4k tokens in, 1-2k out)
- **Total: ~$0.20-0.50 per profile**

At 50 orgs × 5 decisions/month × 3 competitors = 750 profiles/month = $150-375/month

---

## UI Components

### CompetitorInput
```tsx
// Add competitor modal/form
- Company name input (with autocomplete from previous)
- Company URL input (optional)
- Focus areas selector (checkboxes)
- "Generate Profile" button
```

### CompetitorProfile
```tsx
// Full profile display
- Collapsible sections
- "Add as Evidence" button on each section
- "Refresh" button in header
- "Delete" button
- Timestamp and source count
```

### CompetitorList
```tsx
// List of competitors for a decision
- Cards showing company name + key stats
- Quick actions (view, refresh, delete)
- "Add Competitor" button
```

### EvidenceFromProfile
```tsx
// When adding evidence from profile
- Shows selected text
- Option selector (which option does this support/contradict?)
- Strength selector
- Additional notes field
```

---

## Edge Cases

| Scenario | Handling |
|----------|----------|
| Company not found | Show "Limited data available" with partial profile |
| Private company | Mark funding/revenue as "Private" |
| Very new company | Note recency, focus on available signals |
| Competitor is huge (Google, Microsoft) | Focus on relevant division/product only |
| URL is wrong company | Allow user to correct and regenerate |
| Duplicate competitor | Warn and allow merge or keep separate |

---

## Success Metrics

- **Generation success rate**: >95% produce usable profile
- **User satisfaction**: >80% rate profile as "useful" or better
- **Evidence conversion**: >50% of profiles have at least one evidence item added
- **Refresh rate**: Track how often users request updates (indicates value)
