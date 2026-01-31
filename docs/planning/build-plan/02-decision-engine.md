# Phase 1: Decision Engine — User Input Steps (Weeks 2-3)

**Goal**: User can frame a decision and provide context. AI analysis pipeline ready to trigger.

**Status**: ⏳ Not Started

> **Architecture Reference**: See [CORE_JOURNEY.md](../../specs/CORE_JOURNEY.md) for the full 9-step flow.

---

## Overview: The New Evidence-First Flow

```
User Input (This Phase)          AI Analysis (Phase 2)
┌─────────────────────┐          ┌─────────────────────┐
│ 0. Entry            │          │ 3. Evidence Scan    │
│ 1. Decision Frame   │    →     │ 4. Option Gen       │
│ 2. Context Anchor   │          │ 5. Evidence Map     │
└─────────────────────┘          │ 6. Confidence Score │
                                 │ 7. Recommendation   │
                                 │ 8. Brief Gen        │
                                 └─────────────────────┘
```

**Key Principle**: Evidence is gathered BEFORE generating options to prevent narrative anchoring.

---

## 1.1 Decision List & Dashboard (Week 2)

**Windsurf Prompt:**
```
Read these files:
- docs/specs/CORE_JOURNEY.md (Steps 0-2)
- docs/specs/LLM_ORCHESTRATION.md (Schemas section)
- docs/design/DESIGN_SPEC_V2.md (Dashboard page)

Create the decision list and entry point:
1. app/(dashboard)/dashboard/page.tsx - Dashboard with decision list
2. components/decisions/decision-card.tsx - Card showing title, status, analysis progress
3. components/decisions/new-decision-button.tsx - "Analyze a Decision" CTA
4. app/api/decisions/route.ts - GET (list) and POST (create) endpoints
5. types/decision.ts - DecisionSchemaV1 type definitions

Status values: draft, analyzing, analyzed, tracking
Show analysis progress indicator on cards (which step they're at).
```

| Task | Acceptance Criteria | Tests | Status |
|------|---------------------|-------|--------|
| 💻 Dashboard page | Shows user's decisions with status | Component: list rendering | |
| 💻 Decision card | Shows title, status, progress indicator | Component: card states | |
| 💻 "Analyze a Decision" CTA | Prominent button, navigates to framing | Component: button | |
| 💻 Decision list API | GET returns user's decisions | Integration: API | |
| 💻 Create decision API | POST creates new decision in draft | Integration: API + DB | |
| 💻 Decision types | TypeScript types matching schemas | Unit: type validation | |

---

## 1.2 Decision Framing Page (Week 2)

**Windsurf Prompt:**
```
Read these files:
- docs/specs/CORE_JOURNEY.md (Step 1: Decision Framing)
- docs/specs/LLM_ORCHESTRATION.md (Step 1: Decision Framing)
- docs/design/DESIGN_SPEC_V2.md (Framing page)

Create the decision framing page:
1. app/(dashboard)/analyze/[id]/frame/page.tsx - Framing page
2. components/analyze/decision-statement-input.tsx - Text input for decision
3. components/analyze/decision-type-selector.tsx - Type dropdown
4. components/analyze/frame-sliders.tsx - Time horizon, reversibility, stakes, scope
5. components/analyze/analysis-progress.tsx - Shows current step in flow
6. app/api/decisions/[id]/frame/route.ts - PATCH endpoint to save frame

Decision Types:
- Product bet
- Market entry
- Investment/prioritization
- Platform/architecture
- Org/operating model

Frame sliders should have clear labels at each end:
- Time horizon: 3-6 months ↔ 2+ years
- Reversibility: Reversible ↔ Irreversible
- Stakes: <$1M ↔ $10M+
- Scope: Team-level ↔ Exec-level

Save frame on change (debounced). Show "Next: Context" button when complete.
```

| Task | Acceptance Criteria | Tests | Status |
|------|---------------------|-------|--------|
| 💻 Framing page route | `/analyze/[id]/frame` works | E2E: navigation | |
| 💻 Decision statement input | Text input with placeholder | Component: input | |
| 💻 Decision type selector | 5 types, radio or select | Component: selector | |
| 💻 Frame sliders | 4 sliders with clear labels | Component: sliders | |
| 💻 Progress indicator | Shows "Step 1 of 9: Framing" | Component: progress | |
| 💻 Auto-save on change | Debounced PATCH to API | Integration: save | |
| 💻 Frame validation | All fields required to proceed | Component: validation | |
| 💻 Frame API | PATCH saves frame fields | Integration: API | |

---

## 1.3 Context Anchoring Page (Week 2-3)

**Windsurf Prompt:**
```
Read these files:
- docs/specs/CORE_JOURNEY.md (Step 2: Context Anchoring)
- docs/specs/LLM_ORCHESTRATION.md (Step 2: Context Anchoring)
- docs/design/DESIGN_SPEC_V2.md (Context page)

Create the context anchoring page:
1. app/(dashboard)/analyze/[id]/context/page.tsx - Context page
2. components/analyze/company-context-input.tsx - Textarea for company context
3. components/analyze/constraints-input.tsx - Add/remove constraints
4. components/analyze/assumptions-input.tsx - Add/remove known assumptions
5. components/analyze/falsification-input.tsx - "What would make this wrong?"
6. app/api/decisions/[id]/context/route.ts - PATCH endpoint

Context fields are OPTIONAL but powerful. Show:
- "Skip for now" option
- Explanation of why this helps: "Reduces hindsight bias later"

Constraints should be categorized:
- Technical, Budget, Timeline, Legal, Brand, Org, Other
```

| Task | Acceptance Criteria | Tests | Status |
|------|---------------------|-------|--------|
| 💻 Context page route | `/analyze/[id]/context` works | E2E: navigation | |
| 💻 Company context input | Optional textarea | Component: input | |
| 💻 Constraints input | Add/edit/remove with categories | Component: list | |
| 💻 Assumptions input | Add/edit/remove items | Component: list | |
| 💻 Falsification input | Optional text input | Component: input | |
| 💻 Skip option | Can proceed without filling | Component: skip button | |
| 💻 Context API | PATCH saves context fields | Integration: API | |
| 💻 Progress update | Shows "Step 2 of 9: Context" | Component: progress | |

---

## 1.4 Analysis Trigger (Week 3)

**Windsurf Prompt:**
```
Read these files:
- docs/specs/LLM_ORCHESTRATION.md (Full pipeline)
- docs/specs/CORE_JOURNEY.md (Steps 3-8)

Create the analysis trigger flow:
1. components/analyze/start-analysis-button.tsx - "Start Analysis" CTA
2. components/analyze/analysis-running-view.tsx - Shows live progress
3. app/api/decisions/[id]/analyze/route.ts - POST triggers Inngest job
4. lib/inngest/events.ts - Event type definitions

When user clicks "Start Analysis":
1. Validate frame is complete
2. POST to /api/decisions/[id]/analyze
3. Create job record in database
4. Trigger Inngest event: decision/analyze.requested
5. Navigate to progress view
6. Poll job status every 2-3 seconds

Progress view shows each step:
- ✓ Planning research queries
- ✓ Searching market signals
- ● Extracting evidence... (18/25)
- ○ Generating options
- ○ Mapping evidence
- ○ Scoring options
- ○ Generating recommendation
- ○ Creating brief
```

| Task | Acceptance Criteria | Tests | Status |
|------|---------------------|-------|--------|
| 💻 Start analysis button | Triggers job creation | Component: button | |
| 💻 Analysis running view | Shows live step progress | Component: progress | |
| 💻 Job creation API | Creates job, triggers Inngest | Integration: API | |
| 💻 Inngest event types | TypeScript-safe events | Unit: types | |
| 💻 Job polling hook | Polls status, updates UI | Component: polling | |
| 💻 Step progress display | Shows completed/current/pending | Component: progress | |
| 💻 Live findings preview | Shows snippet of latest finding | Component: preview | |

---

## 1.5 Analysis Results Shell (Week 3)

**Windsurf Prompt:**
```
Read these files:
- docs/specs/CORE_JOURNEY.md (Steps 4-7 outputs)
- docs/design/DESIGN_SPEC_V2.md (Results page)

Create the analysis results shell (AI content comes in Phase 2):
1. app/(dashboard)/analyze/[id]/results/page.tsx - Results page
2. components/analyze/results-layout.tsx - Tab/section layout
3. components/analyze/evidence-cards-view.tsx - Display evidence cards
4. components/analyze/options-view.tsx - Display AI-generated options
5. components/analyze/evidence-mapping-view.tsx - Show support/contradict
6. components/analyze/recommendation-view.tsx - Show recommendation

These are READ-ONLY views of AI-generated content.
User can:
- Expand/collapse sections
- Click through to source URLs
- See confidence breakdowns
- Navigate to brief generation
```

| Task | Acceptance Criteria | Tests | Status |
|------|---------------------|-------|--------|
| 💻 Results page route | `/analyze/[id]/results` works | E2E: navigation | |
| 💻 Results layout | Tabs or sections for each view | Component: layout | |
| 💻 Evidence cards view | Displays EvidenceCard[] | Component: cards | |
| 💻 Options view | Displays Option[] with details | Component: options | |
| 💻 Evidence mapping view | Shows support/contradict per option | Component: mapping | |
| 💻 Recommendation view | Shows primary + hedge + changers | Component: recommendation | |
| 💻 Source links | Clicking evidence opens source URL | Component: links | |

---

## 1.6 Database Schema (Week 2)

**Windsurf Prompt:**
```
Read docs/specs/LLM_ORCHESTRATION.md (Schemas section) for all type definitions.

Create database migrations for the new schema:
1. supabase/migrations/004_decision_v2.sql

Tables needed:
- decisions (update for new fields)
  - statement, normalized_statement
  - type, time_horizon, reversibility, stakes, scope
  - inferred_risk_tolerance, inferred_freshness, inferred_confidence_threshold
  - retrieval_budget (JSONB)
  - status: draft, analyzing, analyzed, tracking

- decision_context
  - company_context
  - falsification_criteria

- constraints (linked to decision)
  - category, description, is_hard

- assumptions_ledger
  - statement, status (declared/implicit/unverified)
  - linked_options, verification_status

- evidence_cards
  - claim, snippet, source (JSONB)
  - signal_type, confidence (JSONB)
  - interpretation, falsification_criteria
  - relevance_tags, entity_tags

- options
  - title, summary, commits_to, deprioritizes
  - primary_upside, primary_risk
  - reversibility, reversibility_explanation
  - grounded_in_evidence (array of evidence_card IDs)

- option_evidence_map
  - option_id, evidence_card_id
  - relationship: supporting, contradicting
  - relevance_explanation, impact_level

- option_scores
  - option_id, overall_score
  - score_breakdown (JSONB)
  - rationale, risk_profile, time_to_feedback, blast_radius

- recommendations
  - decision_id, primary_option_id, hedge_option_id
  - confidence, rationale, hedge_condition
  - decision_changers (JSONB)
  - monitor_triggers (JSONB)

All tables need RLS policies for org isolation.
```

| Task | Acceptance Criteria | Tests | Status |
|------|---------------------|-------|--------|
| 💻 Decision table updates | New columns added | DB: migration | |
| 💻 decision_context table | Created with RLS | DB: migration | |
| 💻 constraints table | Created with RLS | DB: migration | |
| 💻 assumptions_ledger table | Created with RLS | DB: migration | |
| 💻 evidence_cards table | Created with RLS | DB: migration | |
| 💻 options table | Created with RLS | DB: migration | |
| 💻 option_evidence_map table | Created with RLS | DB: migration | |
| 💻 option_scores table | Created with RLS | DB: migration | |
| 💻 recommendations table | Created with RLS | DB: migration | |
| 💻 RLS policies | All tables isolated by org | Integration: RLS test | |
| 💻 TypeScript types | Generated from schema | Unit: types | |

---

## Phase 1 Milestone

**User can create decision, frame it, add context, and trigger analysis.**

### Checklist
- [ ] Dashboard shows all user's decisions with status
- [ ] "Analyze a Decision" button starts new analysis
- [ ] Framing page captures all required fields
- [ ] Context page allows optional constraints/assumptions
- [ ] "Start Analysis" triggers Inngest job
- [ ] Progress view shows live analysis status
- [ ] Results shell ready for AI content
- [ ] All database tables created with RLS
- [ ] TypeScript types match schemas

---

## Debugging Notes

*Add notes here as you work through this phase:*

```
<!-- Example:
2024-01-20: Slider values not saving
- Issue: Debounce too aggressive
- Fix: Reduced debounce to 500ms
-->
```

---

**Previous Phase:** [01-foundation.md](./01-foundation.md)
**Next Phase:** [03-ai-analysis.md](./03-ai-analysis.md)
