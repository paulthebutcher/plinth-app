# Core Decision Flow Specification

## Overview

This document defines the end-to-end workflow from decision initiation to executive brief output. This is the core product loop.

---

## Design Principles

### Structured Rigor, Flexible Path
- All sections visible from start (no hidden wizard steps)
- Users can work in any order
- AI actively surfaces gaps and incomplete sections
- Output generation requires completeness threshold
- Quality score visible throughout

### AI as Thought Partner
- Proactive suggestions, not just reactive analysis
- "Have you considered..." prompts based on context
- Identifies missing perspectives and blind spots
- Helps articulate what user is thinking but hasn't written

### Artifact-First
- Every session produces something usable
- Even partial work has value (save state always)
- Output is the goal, process is the means

---

## Decision States

```
┌──────────┐     ┌───────────┐     ┌───────────┐     ┌──────────┐
│  DRAFT   │ ──▶ │ IN_REVIEW │ ──▶ │ COMMITTED │ ──▶ │ ARCHIVED │
└──────────┘     └───────────┘     └───────────┘     └──────────┘
     │                                    │
     │         (can reopen)               │
     └────────────────────────────────────┘
```

| State | Meaning | Actions Available |
|-------|---------|-------------------|
| **Draft** | Work in progress | Full editing, AI analysis, output preview |
| **In Review** | Shared for feedback | Comments, minor edits, no structural changes |
| **Committed** | Decision made | Read-only, generate final outputs |
| **Archived** | Historical record | Read-only, searchable |

---

## The Canvas

### Layout

```
┌─────────────────────────────────────────────────────────────────────────┐
│  HEADER: Decision Title | Status Badge | Quality Score | Actions       │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  DECISION FRAME (Section 1)                                      │   │
│  │  What specific question are we answering?                        │   │
│  │  ┌─────────────────────────────────────────────────────────┐    │   │
│  │  │  [Single clear question - editable]                      │    │   │
│  │  └─────────────────────────────────────────────────────────┘    │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  CONTEXT (Section 2)                                             │   │
│  │  Background, constraints, stakeholders, timeline                 │   │
│  │  ┌──────────────────────┐  ┌──────────────────────┐             │   │
│  │  │ Background           │  │ Constraints          │             │   │
│  │  │ [Rich text]          │  │ [Tagged list]        │             │   │
│  │  └──────────────────────┘  └──────────────────────┘             │   │
│  │  ┌──────────────────────┐  ┌──────────────────────┐             │   │
│  │  │ Stakeholders         │  │ Timeline             │             │   │
│  │  │ [List + roles]       │  │ [Date + urgency]     │             │   │
│  │  └──────────────────────┘  └──────────────────────┘             │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  OPTIONS (Section 3)                                   [+ Add]   │   │
│  │  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐    │   │
│  │  │ Option A        │ │ Option B        │ │ Option C        │    │   │
│  │  │ [Title]         │ │ [Title]         │ │ [Title]         │    │   │
│  │  │ [Description]   │ │ [Description]   │ │ [Description]   │    │   │
│  │  │ Pros: 3         │ │ Pros: 2         │ │ Pros: 4         │    │   │
│  │  │ Cons: 2         │ │ Cons: 4         │ │ Cons: 1         │    │   │
│  │  │ Evidence: 5     │ │ Evidence: 3     │ │ Evidence: 2     │    │   │
│  │  │ [⭐ Recommended]│ │                 │ │                 │    │   │
│  │  └─────────────────┘ └─────────────────┘ └─────────────────┘    │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  EVIDENCE (Section 4)                                  [+ Add]   │   │
│  │  Research, data, competitor intel that informs the decision      │   │
│  │  ┌─────────────────────────────────────────────────────────┐    │   │
│  │  │ [Evidence item] → supports Option A (Strong)            │    │   │
│  │  │ [Evidence item] → contradicts Option B (Moderate)       │    │   │
│  │  │ [Competitor Profile: Acme Co] → 3 items linked          │    │   │
│  │  └─────────────────────────────────────────────────────────┘    │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  TRADEOFFS (Section 5)                                 [+ Add]   │   │
│  │  What we're giving up with each path                             │   │
│  │  ┌─────────────────────────────────────────────────────────┐    │   │
│  │  │ Option A: "We give up [X] to get [Y]" ☑ Acknowledged    │    │   │
│  │  │ Option B: "We give up [X] to get [Y]" ☐ Not acknowledged│    │   │
│  │  └─────────────────────────────────────────────────────────┘    │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  RECOMMENDATION (Section 6)                                      │   │
│  │  ┌──────────────────────────────────────────────────────────┐   │   │
│  │  │ Recommended: [Option A dropdown]                          │   │   │
│  │  │ Confidence: [●●●●○ 80%] [Why this level?]                │   │   │
│  │  │ Rationale: [Rich text - why this option wins]             │   │   │
│  │  │ Conditions: [What would change this recommendation?]      │   │   │
│  │  └──────────────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  [Generate Decision Brief]  [Preview] [Share Draft]             │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Section Details

### 1. Decision Frame

**Purpose**: Force clarity on what we're actually deciding.

**Fields**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Question | Text (1-2 sentences) | Yes | The specific decision question |
| Type | Select | Yes | Build vs Buy / Market Entry / Investment / Product Prioritization / Custom |

**AI Assistance**:
- "Sharpen this question" - rewrites vague framing into specific, answerable form
- Suggests decision type based on question content

**Quality Criteria**:
- ✅ Single, specific question (not compound)
- ✅ Actionable (leads to concrete next steps)
- ✅ Bounded (clear scope)

**Example**:
- ❌ "What should we do about competitors?"
- ✅ "Should we build an in-house analytics platform or partner with Mixpanel for our enterprise tier?"

---

### 2. Context

**Purpose**: Capture everything that constrains or informs the decision.

**Subsections**:

#### Background
| Field | Type | Required |
|-------|------|----------|
| Background | Rich text | Yes |

What led to this decision? What's been tried before? Why now?

#### Constraints
| Field | Type | Required |
|-------|------|----------|
| Constraint | Text | - |
| Category | Select: Legal / Technical / Budget / Timeline / Brand / Org / Other | - |
| Severity | Hard (non-negotiable) / Soft (prefer to meet) | - |

#### Stakeholders
| Field | Type | Required |
|-------|------|----------|
| Name/Role | Text | - |
| Stance | Supportive / Neutral / Skeptical / Unknown | - |
| Concerns | Text | - |

#### Timeline
| Field | Type | Required |
|-------|------|----------|
| Decision needed by | Date | Yes |
| Implementation timeline | Text | - |
| Urgency level | Low / Medium / High / Critical | - |

**AI Assistance**:
- "What constraints might you be missing?" - suggests based on decision type
- "Who else should weigh in?" - stakeholder suggestions

---

### 3. Options

**Purpose**: Define the possible paths forward.

**Per Option**:
| Field | Type | Required |
|-------|------|----------|
| Title | Text (short) | Yes |
| Description | Rich text | Yes |
| Pros | List of text items | - |
| Cons | List of text items | - |
| Risks | List of text items | - |
| Estimated effort | Low / Medium / High | - |
| Estimated impact | Low / Medium / High | - |

**Rules**:
- Minimum 2 options required
- Maximum 5 options recommended (more = harder to compare)
- One option can be "Status quo / Do nothing"

**AI Assistance**:
- "Analyze this option" - generates pros/cons/risks
- "What options are you missing?" - suggests alternatives
- "Compare options" - side-by-side analysis

**Quality Criteria**:
- ✅ At least 2 distinct options
- ✅ Each option has description
- ✅ Pros/cons populated for each
- ✅ Options are mutually exclusive (not variations)

---

### 4. Evidence

**Purpose**: Ground the decision in data, research, and external input.

**Evidence Types**:
| Type | Description | Fields |
|------|-------------|--------|
| Research | Web research, reports, articles | URL, Summary, Key findings |
| Data | Internal metrics, analysis | Source, Key metrics, Interpretation |
| Interview | Stakeholder/customer input | Who, Summary, Key quotes |
| Competitor | From competitor profiles | Auto-linked from profile |
| Document | Uploaded files | File, Summary |

**Per Evidence Item**:
| Field | Type | Required |
|-------|------|----------|
| Claim | Text | Yes |
| Source | URL or description | Yes |
| Source type | Research / Data / Interview / Competitor / Document | Yes |
| Supports option | Select option(s) or "General" | - |
| Contradicts option | Select option(s) | - |
| Strength | Strong / Moderate / Weak | Yes |
| Notes | Text | - |

**AI Assistance**:
- "Generate competitor profile" - creates comprehensive competitor analysis
- "Find evidence for [option]" - web research to support/challenge
- "What evidence would change your mind?" - identifies gaps

**Quality Criteria**:
- ✅ At least 3 evidence items total
- ✅ Evidence linked to specific options
- ✅ Mix of supporting and challenging evidence
- ✅ Sources cited

---

### 5. Tradeoffs

**Purpose**: Make explicit what we're giving up with each path.

**Per Tradeoff**:
| Field | Type | Required |
|-------|------|----------|
| Option | Select | Yes |
| We give up | Text | Yes |
| We get | Text | Yes |
| Acknowledged | Checkbox | Yes |

**Rules**:
- Each option should have at least one acknowledged tradeoff
- "Acknowledged" = user explicitly accepts this tradeoff

**AI Assistance**:
- "Surface implicit tradeoffs" - identifies tradeoffs from pros/cons
- "What are you not saying?" - prompts for uncomfortable truths

**Quality Criteria**:
- ✅ At least one tradeoff per option
- ✅ All tradeoffs for recommended option acknowledged
- ✅ Tradeoffs are specific, not generic

**Example**:
- ❌ "We give up flexibility to get stability" (too vague)
- ✅ "We give up the ability to customize the UI to get 6 months faster time-to-market"

---

### 6. Recommendation

**Purpose**: State the decision and the reasoning behind it.

**Fields**:
| Field | Type | Required |
|-------|------|----------|
| Recommended option | Select from options | Yes |
| Confidence level | Slider 0-100% | Yes |
| Confidence rationale | Text | Yes |
| Recommendation rationale | Rich text | Yes |
| Reversal conditions | Text | Yes |

**Confidence Calibration**:
| Level | Meaning |
|-------|---------|
| 90-100% | Near certain - strong evidence, clear winner |
| 70-89% | High confidence - good evidence, acceptable risks |
| 50-69% | Moderate - reasonable case, significant uncertainties |
| 30-49% | Low - best available option, major unknowns |
| 0-29% | Guess - insufficient information, time-forced decision |

**AI Assistance**:
- "Is your confidence calibrated?" - checks reasoning against evidence
- "Draft rationale" - synthesizes inputs into coherent narrative
- "What would make this a 90%?" - identifies confidence gaps

**Quality Criteria**:
- ✅ Recommendation selected
- ✅ Confidence level set with rationale
- ✅ Rationale explains why this option over others
- ✅ Reversal conditions specified

---

## Quality Score

**Calculation**: Each section contributes to overall quality score (0-100%)

| Section | Weight | Criteria |
|---------|--------|----------|
| Frame | 15% | Clear question, type selected |
| Context | 15% | Background filled, ≥1 constraint, timeline set |
| Options | 20% | ≥2 options, each with description + pros/cons |
| Evidence | 20% | ≥3 items, linked to options, mixed strength |
| Tradeoffs | 15% | ≥1 per option, all acknowledged for recommended |
| Recommendation | 15% | Selected, confidence set, rationale written |

**Display**: Progress bar + percentage in header

**Minimum for Brief Generation**: 80% quality score

---

## Brief Generation Requirements

Before generating a decision brief, the system validates:

| Requirement | Check |
|-------------|-------|
| Decision frame complete | Question + type set |
| Context sufficient | Background + timeline present |
| Options defined | ≥2 options with descriptions |
| Evidence gathered | ≥3 evidence items linked |
| Tradeoffs explicit | ≥1 tradeoff per option, recommended option's acknowledged |
| Recommendation made | Option selected + confidence + rationale |
| Quality threshold | Score ≥80% |

If not met → Show checklist of missing items, block generation

---

## The Decision Brief (Output)

### Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                      DECISION BRIEF                              │
│                      [Decision Title]                            │
│                      [Date] | [Author] | [Status]                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  EXECUTIVE SUMMARY                                               │
│  ────────────────────────────────────────────────────────────   │
│  [2-3 sentence summary: what we decided, why, key tradeoff]     │
│                                                                  │
│  THE DECISION                                                    │
│  ────────────────────────────────────────────────────────────   │
│  Question: [Decision frame]                                      │
│  Recommendation: [Option name]                                   │
│  Confidence: [Level] - [Brief rationale]                        │
│                                                                  │
│  OPTIONS CONSIDERED                                              │
│  ────────────────────────────────────────────────────────────   │
│  [Option A] ⭐ Recommended                                       │
│    Summary | Key pros | Key cons                                 │
│                                                                  │
│  [Option B]                                                      │
│    Summary | Key pros | Key cons | Why not selected             │
│                                                                  │
│  [Option C]                                                      │
│    Summary | Key pros | Key cons | Why not selected             │
│                                                                  │
│  KEY EVIDENCE                                                    │
│  ────────────────────────────────────────────────────────────   │
│  • [Evidence point 1 - supporting]                               │
│  • [Evidence point 2 - supporting]                               │
│  • [Evidence point 3 - challenging + response]                   │
│                                                                  │
│  TRADEOFFS ACCEPTED                                              │
│  ────────────────────────────────────────────────────────────   │
│  • We give up [X] to get [Y]                                     │
│  • We give up [A] to get [B]                                     │
│                                                                  │
│  CONSTRAINTS & ASSUMPTIONS                                       │
│  ────────────────────────────────────────────────────────────   │
│  Constraints:                                                    │
│  • [Constraint 1]                                                │
│  • [Constraint 2]                                                │
│                                                                  │
│  Key Assumptions:                                                │
│  • [Assumption 1]                                                │
│  • [Assumption 2]                                                │
│                                                                  │
│  REVERSAL CONDITIONS                                             │
│  ────────────────────────────────────────────────────────────   │
│  We would revisit this decision if:                              │
│  • [Condition 1]                                                 │
│  • [Condition 2]                                                 │
│                                                                  │
│  ──────────────────────────────────────────────────────────────  │
│  Decision Owner: [Name]                                          │
│  Stakeholders: [Names]                                           │
│  Generated: [Date] via Plinth                                    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Generation Process

1. **Validate completeness** - Check all requirements met
2. **Synthesize with AI** - Generate executive summary + "why not" for rejected options
3. **Preview** - Show user the draft brief
4. **Edit** - User can modify any section
5. **Generate PDF** - Final export
6. **Share** - Optional shareable link

### PDF Styling

- Clean, professional typography
- Company logo placeholder (future: user upload)
- Page numbers
- "Generated via Plinth" footer
- ~2-4 pages typical length

---

## AI Touchpoints Summary

| Trigger | AI Action |
|---------|-----------|
| New decision created | Suggest decision type, prompt for frame sharpening |
| Option added | Offer to analyze pros/cons/risks |
| Evidence section opened | Offer competitor profile generation, web research |
| Tradeoffs section < complete | Surface implicit tradeoffs from pros/cons |
| Recommendation set | Check confidence calibration against evidence |
| Brief requested | Synthesize all inputs into narrative |
| Quality score < 80% | Identify specific gaps, suggest improvements |

---

## Template Variations

Each template pre-populates context fields and adjusts prompts:

### Build vs Buy
- Pre-filled constraint categories: Technical, Budget, Timeline
- Suggested options: Build in-house, Buy/license, Hybrid, Partner
- Evidence prompts: Vendor comparisons, TCO analysis, team capacity

### Market Entry
- Pre-filled constraint categories: Legal, Brand, Budget
- Suggested options: Direct entry, Partnership, Acquisition, Wait
- Evidence prompts: Market size, competitor landscape, regulatory

### Investment Decision
- Pre-filled constraint categories: Budget, Timeline, Org
- Suggested options: Full investment, Partial/phased, Defer, Decline
- Evidence prompts: ROI analysis, risk assessment, opportunity cost

### Product Prioritization
- Pre-filled constraint categories: Technical, Timeline, Org
- Suggested options: Prioritize A, Prioritize B, Parallel (reduced scope), Defer all
- Evidence prompts: Customer demand, competitive pressure, effort estimates

---

## Data Model Additions

```sql
-- Add to decisions table
ALTER TABLE decisions ADD COLUMN
  quality_score INTEGER DEFAULT 0 CHECK (quality_score BETWEEN 0 AND 100);

-- Stakeholders (new table)
CREATE TABLE stakeholders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  decision_id UUID REFERENCES decisions(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  role TEXT,
  stance TEXT CHECK (stance IN ('supportive', 'neutral', 'skeptical', 'unknown')),
  concerns TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add to constraints table
ALTER TABLE constraints ADD COLUMN
  notes TEXT;

-- Track completion state per section
CREATE TABLE decision_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  decision_id UUID REFERENCES decisions(id) ON DELETE CASCADE NOT NULL,
  section TEXT NOT NULL CHECK (section IN ('frame', 'context', 'options', 'evidence', 'tradeoffs', 'recommendation')),
  is_complete BOOLEAN DEFAULT FALSE,
  completion_data JSONB DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(decision_id, section)
);
```

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Time to first decision brief | <30 minutes |
| Quality score at brief generation | >85% average |
| Sections completed per decision | >90% complete all 6 |
| AI features used per decision | >4 touchpoints |
| Brief rated "useful" by recipient | >80% |
