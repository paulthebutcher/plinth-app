# Plinth Core User Journey

> **Version:** 2.0 — Evidence-First Architecture
> **Philosophy:** Plinth is a decision-quality engine, not an ideation toy.

---

## The Journey in One Sentence

Plinth takes a vague, high-stakes decision and turns it into a structured, evidence-backed commitment—while making uncertainty explicit instead of hiding it.

---

## Journey Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                     PLINTH DECISION FLOW                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  0. ENTRY                                                           │
│     "I have a decision"                                             │
│           │                                                         │
│           ▼                                                         │
│  1. DECISION FRAMING ◄─── Constraint-first, not ideation           │
│     Lock the frame before exploring                                 │
│           │                                                         │
│           ▼                                                         │
│  2. CONTEXT ANCHORING ◄─── Optional but powerful                   │
│     Reduce hindsight bias                                           │
│           │                                                         │
│           ▼                                                         │
│  3. EVIDENCE SCAN ◄─────── BEFORE options (prevents anchoring)     │
│     Gather decision-relevant signals                                │
│           │                                                         │
│           ▼                                                         │
│  4. OPTION GENERATION ◄─── Constrained by evidence                 │
│     3-6 distinct commitments                                        │
│           │                                                         │
│           ▼                                                         │
│  5. EVIDENCE-TO-OPTION MAPPING                                      │
│     Supporting / Contradicting / Unknown                            │
│           │                                                         │
│           ▼                                                         │
│  6. CONFIDENCE SCORING                                              │
│     Tradeoff surface with explanations                              │
│           │                                                         │
│           ▼                                                         │
│  7. RECOMMENDATION                                                  │
│     Explicit, defensible, with conditions                           │
│           │                                                         │
│           ▼                                                         │
│  8. DECISION ARTIFACT                                               │
│     Exportable brief with citations                                 │
│           │                                                         │
│           ▼                                                         │
│  9. POST-DECISION TRACKING ◄─── Optional but sticky                │
│     Monitor assumptions, flag changes                               │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Critical Design Principle

> **Evidence is gathered BEFORE generating options to avoid narrative anchoring.**

Old approach: User thinks of options → AI analyzes each
New approach: AI gathers evidence → AI generates options grounded in evidence

This prevents the common failure mode where decision-makers anchor on their first idea and then seek confirming evidence.

---

## Step 0: Entry Point — "I Have a Decision"

### User Intent
"I need to decide what to do, and I don't trust my intuition alone."

### System Posture
Plinth positions itself as a decision-quality engine, not an ideation toy.

### Primary CTA
```
┌─────────────────────────────────────────┐
│                                         │
│        [Analyze a Decision]             │
│                                         │
└─────────────────────────────────────────┘
```

---

## Step 1: Decision Framing (Constraint First)

### Goal
Lock the frame before exploring solutions.

### User Inputs (Structured, Fast)

| Field | Type | Example |
|-------|------|---------|
| Decision statement | Text | "Should we enter the mid-market with a lighter compliance SKU?" |
| Decision type | Select | Product bet, Market entry, Investment/prioritization, Platform/architecture, Org/operating model |
| Time horizon | Select | 3-6 months, 6-18 months, 2+ years |
| Reversibility | Slider | Reversible ↔ Irreversible |
| Stakes | Slider | <$1M ↔ $10M+ |
| Scope | Slider | Team-level ↔ Exec-level |

### What Plinth Does Silently

1. Normalizes decision into `DecisionSchemaV1`
2. Infers:
   - Risk tolerance
   - Evidence freshness requirements
   - Competitive scope
   - Required confidence threshold
3. Sets retrieval budget based on stakes

### Key Principle
**Do not ask for goals, solutions, or ideas yet. Lock the frame first.**

### Output Schema
```typescript
interface DecisionFrame {
  id: string;
  statement: string;
  type: 'product_bet' | 'market_entry' | 'investment' | 'platform' | 'org_model';
  timeHorizon: '3_6_months' | '6_18_months' | '2_plus_years';
  reversibility: number; // 0-100
  stakes: number; // 0-100
  scope: 'team' | 'department' | 'company' | 'exec';

  // Inferred
  riskTolerance: 'low' | 'medium' | 'high';
  freshnessRequirement: number; // days
  confidenceThreshold: number; // 0-100
  retrievalBudget: RetrievalBudget;
}
```

---

## Step 2: Context Anchoring (Optional but Powerful)

### Goal
Attach constraints and internal facts without polluting external evidence.

### User Adds (Optional)

| Field | Example |
|-------|---------|
| Company context | "Series B, 150 employees, B2B SaaS, US + EU" |
| Known constraints | "SOC2 required, $50k budget max, no Go expertise" |
| Known assumptions | "Mid-market wants simpler pricing" |
| Falsification test | "What would make this decision obviously wrong?" |

### System Action

1. **Tags assumptions as:**
   - `declared` — User explicitly stated
   - `implicit` — Inferred from context
   - `unverified` — Needs external validation

2. **Creates Assumptions Ledger** that persists throughout analysis

### Why This Matters
This step reduces hindsight bias later. When the decision plays out, you can trace back which assumptions held and which didn't.

### Output Schema
```typescript
interface ContextAnchor {
  companyContext?: string;
  constraints: Constraint[];
  declaredAssumptions: Assumption[];
  falsificationCriteria: string[];
}

interface Assumption {
  id: string;
  statement: string;
  status: 'declared' | 'implicit' | 'unverified';
  linkedToOptions?: string[]; // Added in Step 5
  verificationStatus?: 'confirmed' | 'challenged' | 'unknown';
}
```

---

## Step 3: Evidence Scan (Asynchronous, Visible Progress)

### Goal
Gather decision-relevant signals, not generic research.

### User Experience
A short "Analyzing signal landscape…" state with concrete sub-steps (not a spinner):

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  ✨ Analyzing signal landscape...                               │
│                                                                 │
│  ✓ Planning research queries (12 queries)                      │
│  ✓ Searching market signals                                    │
│  ✓ Discovering relevant sources (47 URLs)                      │
│  ● Extracting evidence from top sources... (18/25)             │
│  ○ Synthesizing evidence cards                                  │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Finding: "Competitor X launched mid-market tier Q4..."  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### What Plinth Gathers

| Signal Type | Examples |
|-------------|----------|
| Market moves | Pricing changes, positioning shifts, feature launches |
| Competitor actions | Product launches, M&A, partnerships, funding |
| Customer signals | Public complaints, demand shifts, usage patterns |
| Regulatory/ecosystem | Policy changes, platform shifts, standards |
| Analogous decisions | Similar decisions in adjacent markets |

### Evidence Card Properties

Each piece of evidence includes:
- **Claim**: The specific assertion
- **Source**: URL + publication name
- **Timestamp**: When published/updated
- **Confidence factors**: Source type, recency, corroboration potential
- **Relevance tags**: Which aspects of the decision this relates to
- **What this suggests**: Interpretation
- **What would falsify it**: Counter-evidence to watch for

### Output Schema
```typescript
interface EvidenceCard {
  id: string;
  claim: string;
  snippet: string; // Original quote
  source: {
    url: string;
    title: string;
    publisher: string;
    publishedAt: Date;
    accessedAt: Date;
  };
  signalType: 'market' | 'competitor' | 'customer' | 'regulatory' | 'analogous';
  confidence: {
    sourceReliability: 'high' | 'medium' | 'low';
    recency: 'fresh' | 'recent' | 'dated';
    corroboration: 'corroborated' | 'single_source' | 'contradicted';
  };
  interpretation: string;
  falsificationCriteria: string;
  relevanceTags: string[];
}
```

---

## Step 4: Option Generation (Constrained, Not Exhaustive)

### Goal
Generate 3-6 distinct strategic options, framed as **commitments, not ideas**.

### Critical: Options Are Evidence-Grounded
Options are generated AFTER evidence is gathered. Each option must be supported or informed by the evidence corpus.

### Option Structure

Each option includes:

| Field | Description |
|-------|-------------|
| What this commits us to | Primary strategic direction |
| What this explicitly deprioritizes | Opportunity cost |
| Primary upside | Best-case outcome |
| Primary risk | Worst-case outcome |
| Reversibility profile | How easy to unwind |

### Example Option
```
┌─────────────────────────────────────────────────────────────────┐
│ Option B: Mid-Market Entry via Modular Compliance               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ Commits to:                                                     │
│   Partial compliance coverage + roadmap signaling               │
│                                                                 │
│ Deprioritizes:                                                  │
│   Enterprise edge cases for 12-18 months                        │
│                                                                 │
│ Primary upside:                                                 │
│   Faster ARR capture, clearer ICP expansion                     │
│                                                                 │
│ Primary risk:                                                   │
│   Brand dilution if expectations aren't managed                 │
│                                                                 │
│ Reversibility: Medium                                           │
│   Can add enterprise features later, harder to un-position      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### System Rule
**If two options differ only cosmetically, collapse them.**

### Output Schema
```typescript
interface Option {
  id: string;
  title: string;
  summary: string;
  commitsTo: string;
  deprioritizes: string;
  primaryUpside: string;
  primaryRisk: string;
  reversibility: 'high' | 'medium' | 'low';
  reversibilityExplanation: string;
  groundedInEvidence: string[]; // EvidenceCard IDs
}
```

---

## Step 5: Evidence-to-Option Mapping

### Goal
For each option, show supporting vs contradicting evidence + unknowns.

### This Is Where Users Start Trusting The System

For each option, Plinth shows:

| Category | Content |
|----------|---------|
| Supporting signals | Evidence that strengthens this option |
| Contradicting signals | Evidence that weakens this option |
| Unknowns | Information gaps that matter |
| Assumptions required | What must be true for this to work |

### Presentation

Two views:
1. **Readable narrative summary** — For quick understanding
2. **Structured breakdown** — For scrutiny and drilling down

### Example Mapping
```
┌─────────────────────────────────────────────────────────────────┐
│ Option B: Mid-Market Entry via Modular Compliance               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ SUPPORTING (3 signals)                                          │
│ ├─ "Competitor X saw 40% ARR growth after mid-market launch"   │
│ │   Source: TechCrunch, Dec 2023 | Confidence: High            │
│ │                                                               │
│ ├─ "Mid-market buyers prioritize speed over features"          │
│ │   Source: Gartner Survey | Confidence: High                  │
│ │                                                               │
│ └─ "Modular compliance approach gaining traction in fintech"   │
│     Source: Industry Report | Confidence: Medium               │
│                                                                 │
│ CONTRADICTING (1 signal)                                        │
│ └─ "Brand perception study shows enterprise association"        │
│     Source: Internal Survey | Confidence: Medium               │
│     → Risk: Mid-market may see us as "too expensive"           │
│                                                                 │
│ UNKNOWNS (2 gaps)                                               │
│ ├─ Competitor Y's mid-market pricing (not public)              │
│ └─ Customer willingness to accept partial compliance           │
│                                                                 │
│ ASSUMPTIONS REQUIRED                                            │
│ ├─ Mid-market will accept 12-month roadmap for full compliance │
│ └─ Sales team can effectively reposition without confusion     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Output Schema
```typescript
interface OptionEvidenceMap {
  optionId: string;
  supporting: MappedEvidence[];
  contradicting: MappedEvidence[];
  unknowns: Unknown[];
  assumptionsRequired: Assumption[];
}

interface MappedEvidence {
  evidenceCardId: string;
  relevanceExplanation: string;
  impactLevel: 'high' | 'medium' | 'low';
}

interface Unknown {
  id: string;
  description: string;
  impactIfResolved: string;
  possibleSources: string[];
}
```

---

## Step 6: Confidence Scoring & Tradeoff Surface

### Goal
Quantify decision quality without "magic numbers."

### Each Option Receives

| Metric | Description |
|--------|-------------|
| Confidence score | With explanation, not magic number |
| Risk profile | Categorized risk factors |
| Time-to-feedback | How quickly we'll know if it's working |
| Blast radius if wrong | Impact of failure |

### Critical UX Principle

Plinth explicitly states:

> "This option scores lower not because it's bad, but because evidence is thinner / older / less direct."

### User Interaction

- Adjust risk tolerance or time horizon
- See scores re-balance in real time
- **Nothing is hidden behind "AI judgment"**

### Scoring Factors (Transparent)

| Factor | Weight | Description |
|--------|--------|-------------|
| Evidence strength | 25% | Quality and quantity of supporting evidence |
| Evidence recency | 15% | How fresh the evidence is |
| Source reliability | 15% | Credibility of sources |
| Corroboration | 15% | Multiple independent sources |
| Constraint fit | 15% | Alignment with stated constraints |
| Assumption risk | 15% | How many unverified assumptions required |

### Output Schema
```typescript
interface OptionScore {
  optionId: string;
  overallScore: number; // 0-100
  scoreBreakdown: {
    evidenceStrength: number;
    evidenceRecency: number;
    sourceReliability: number;
    corroboration: number;
    constraintFit: number;
    assumptionRisk: number;
  };
  rationale: string;
  riskProfile: RiskFactor[];
  timeToFeedback: string;
  blastRadiusIfWrong: 'contained' | 'department' | 'company' | 'existential';
}
```

---

## Step 7: Recommendation (Explicit, Defensible)

### Goal
Provide a recommendation that is traceable and conditional.

### Plinth Provides

1. **Primary recommendation**
2. **Secondary / hedge option**
3. **What would change this recommendation**

### Example Output
```
┌─────────────────────────────────────────────────────────────────┐
│ RECOMMENDATION                                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ Primary: Option B — Mid-Market Entry via Modular Compliance     │
│                                                                 │
│ Confidence: 72%                                                 │
│                                                                 │
│ Why:                                                            │
│   Strongest alignment between recent market signals and         │
│   reversibility within your stated risk tolerance.              │
│                                                                 │
│ Hedge: Option A — Wait and monitor                              │
│   If primary assumptions prove false within 90 days             │
│                                                                 │
│ This changes if:                                                │
│   • A major competitor announces full mid-market compliance     │
│     coverage in the next 90 days                                │
│   • Customer research shows <30% acceptance of partial          │
│     compliance                                                  │
│   • Q1 enterprise pipeline exceeds forecast by 50%+             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Key Principle
**This is not "the answer." It's a decision with conditions.**

### Output Schema
```typescript
interface Recommendation {
  primaryOptionId: string;
  confidence: number;
  rationale: string;
  hedgeOptionId?: string;
  hedgeCondition?: string;
  decisionChangers: DecisionChanger[];
  monitorTriggers: MonitorTrigger[];
}

interface DecisionChanger {
  condition: string;
  wouldFavor: string; // Option ID or "reconsider"
  likelihood: 'low' | 'medium' | 'high';
}

interface MonitorTrigger {
  signal: string;
  source: string;
  threshold: string;
  checkFrequency: 'daily' | 'weekly' | 'monthly';
}
```

---

## Step 8: Decision Artifact (Exportable, Reusable)

### Goal
Produce a shareable, auditable brief with full provenance.

### Brief Contents

| Section | Content |
|---------|---------|
| Decision framing | The question, constraints, stakes |
| Options considered | All options, including rejected ones with reasons |
| Evidence summary | Key evidence with sources and citations |
| Assumptions ledger | Declared, implicit, verification status |
| Recommendation | Primary + hedge + confidence |
| Open questions | Unresolved unknowns to monitor |
| Metadata | Owner, stakeholders, generated date |

### Formats

| Format | Use Case |
|--------|----------|
| Web (default) | Interactive, linked to evidence |
| PDF / slide-ready | For board decks, email |
| Shareable link | With optional comment mode |

### Citation Requirements

Every major claim in the brief links to:
- Original evidence card
- Source URL
- Access timestamp
- Snippet hash (for verification)

---

## Step 9: Post-Decision Tracking (Optional but Sticky)

### Goal
Build long-term trust via decision memory.

### Prompt
```
"Do you want to track this decision?"
```

### If Yes, Plinth:

1. **Monitors key signals** tied to assumptions
2. **Flags when confidence meaningfully changes**
3. **Builds decision history** for organizational learning

### Monitoring Approach

- Daily/weekly: Search-only (cheap)
- Scrape only: New URLs or changed content
- Alert only: When material change detected

### Example Alert
```
┌─────────────────────────────────────────────────────────────────┐
│ 🔔 Decision Alert: Mid-Market Entry Strategy                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ A monitored assumption may have changed:                        │
│                                                                 │
│ "No major competitor will launch mid-market compliance"         │
│                                                                 │
│ New signal detected:                                            │
│ "Competitor Y announces 'Starter' tier targeting mid-market"   │
│ Source: TechCrunch, 2 hours ago                                │
│                                                                 │
│ This was flagged as a decision-changer in your original brief. │
│                                                                 │
│ [Review Decision] [Dismiss] [Snooze 7 days]                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Key Differences from Traditional Decision Tools

| Traditional | Plinth |
|-------------|--------|
| User brainstorms options first | Evidence gathered first, options generated from evidence |
| AI assists with analysis | AI drives analysis, user validates |
| Generic research | Decision-specific signal gathering |
| Single recommendation | Recommendation with explicit conditions |
| Decision = done | Decision = monitored commitment |
| Confidence as number | Confidence with transparent scoring factors |
| Assumptions implicit | Assumptions ledger tracked throughout |

---

## Timing Expectations

| Step | Typical Duration |
|------|------------------|
| 0. Entry | Instant |
| 1. Decision Framing | 2-3 minutes (user input) |
| 2. Context Anchoring | 1-2 minutes (optional) |
| 3. Evidence Scan | 30-90 seconds (AI async) |
| 4. Option Generation | 10-20 seconds (AI) |
| 5. Evidence Mapping | 10-15 seconds (AI) |
| 6. Confidence Scoring | 5-10 seconds (AI) |
| 7. Recommendation | 10-15 seconds (AI) |
| 8. Brief Generation | 15-30 seconds (AI) |
| **Total** | **5-8 minutes** to complete brief |

This is dramatically faster than traditional strategic decision-making while being more rigorous.
