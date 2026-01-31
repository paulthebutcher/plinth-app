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

## 1.1 Dashboard & Decision List

### 1.1a Dashboard Layout

**Windsurf Prompt:**
```
Create the dashboard layout:
1. app/(dashboard)/layout.tsx - Dashboard layout with sidebar
2. components/layout/sidebar.tsx - Navigation sidebar
3. components/layout/header.tsx - Top header with user menu

Use Supabase server client (from lib/supabase/server.ts) to get current user.
Redirect to /login if not authenticated.
Sidebar should have: Decisions (active), Settings links.
Keep it clean and minimal using Tailwind.
```

| Task | Acceptance Criteria | Status |
|------|---------------------|--------|
| 💻 Dashboard layout | Wraps all dashboard pages | |
| 💻 Sidebar component | Shows nav links | |
| 💻 Header component | Shows user email, logout | |

---

### 1.1b Decision List API

**Windsurf Prompt:**
```
Create the decisions API:
1. app/api/decisions/route.ts - GET and POST endpoints
2. src/types/decision.ts - TypeScript types for decisions

Use the database types from src/types/database.ts.

GET /api/decisions:
- Get current user from Supabase auth
- Return all decisions for user's org_id
- Order by updated_at desc
- Include analysis_status field

POST /api/decisions:
- Create new decision with title from body
- Set status='draft', analysis_status='draft'
- Return the created decision

Include proper error handling (401 if not auth, 500 for errors).
```

| Task | Acceptance Criteria | Status |
|------|---------------------|--------|
| 💻 GET /api/decisions | Returns user's decisions | |
| 💻 POST /api/decisions | Creates new decision | |
| 💻 Decision types file | TypeScript interfaces | |

---

### 1.1c Dashboard Page & Components

**Windsurf Prompt:**
```
Create the dashboard page and decision components:
1. app/(dashboard)/dashboard/page.tsx - Main dashboard
2. components/decisions/decision-card.tsx - Card for each decision
3. components/decisions/decision-list.tsx - List wrapper with loading state
4. components/decisions/new-decision-button.tsx - "Analyze a Decision" CTA

Dashboard page:
- Fetch decisions from /api/decisions
- Show DecisionList with cards
- Show NewDecisionButton prominently at top

DecisionCard shows:
- Title
- Status badge (draft, analyzing, analyzed)
- Analysis progress if analyzing
- Updated date
- Click navigates to appropriate page based on status

NewDecisionButton:
- Opens modal or inline form to enter decision title
- POSTs to /api/decisions
- On success, navigates to /analyze/[id]/frame

Show empty state if no decisions: "No decisions yet. Start by analyzing your first strategic decision."
```

| Task | Acceptance Criteria | Status |
|------|---------------------|--------|
| 💻 Dashboard page | Shows decision list | |
| 💻 Decision card | Displays decision info | |
| 💻 Decision list | Handles loading/empty | |
| 💻 New decision button | Creates and navigates | |

---

## 1.2 Decision Framing Page

### 1.2a Frame API

**Windsurf Prompt:**
```
Create the decision detail and frame APIs:
1. app/api/decisions/[id]/route.ts - GET single decision, PATCH to update, DELETE
2. app/api/decisions/[id]/frame/route.ts - PATCH to update frame fields only

GET /api/decisions/[id]:
- Verify user has access (same org)
- Return full decision record

PATCH /api/decisions/[id]:
- Update any provided fields
- Return updated decision

DELETE /api/decisions/[id]:
- Soft delete or hard delete
- Return success

PATCH /api/decisions/[id]/frame:
- Only update frame fields: title, decision_frame, decision_type, time_horizon, reversibility, stakes, scope
- Return updated decision

All endpoints must verify org ownership.
```

| Task | Acceptance Criteria | Status |
|------|---------------------|--------|
| 💻 GET /api/decisions/[id] | Returns single decision | |
| 💻 PATCH /api/decisions/[id] | Updates decision | |
| 💻 DELETE /api/decisions/[id] | Deletes decision | |
| 💻 PATCH frame endpoint | Updates frame fields | |

---

### 1.2b Analysis Layout & Frame Page

**Windsurf Prompt:**
```
Create the analyze layout and frame page:
1. app/(dashboard)/analyze/[id]/layout.tsx - Analysis flow layout
2. app/(dashboard)/analyze/[id]/frame/page.tsx - Framing page (Step 1)
3. components/analyze/analysis-progress.tsx - Step indicator

Analysis layout:
- Fetch decision by ID
- Show 404 if not found or not authorized
- Show AnalysisProgress at top
- Render children (the step pages)

AnalysisProgress component:
- Shows 7 steps as dots/pills: Frame, Context, Scan, Options, Map, Score, Recommend
- Highlight current step based on route
- Completed steps show checkmark
- Steps 3-7 disabled until analysis runs

Frame page:
- Load decision data
- Show form for framing (components built in next prompt)
- "Next: Context" button at bottom (disabled until required fields filled)
```

| Task | Acceptance Criteria | Status |
|------|---------------------|--------|
| 💻 Analysis layout | Wraps all /analyze/[id]/* pages | |
| 💻 Frame page | Shows framing form | |
| 💻 Progress indicator | Shows current step | |

---

### 1.2c Frame Form Components

**Windsurf Prompt:**
```
Install required shadcn components first:
npx shadcn@latest add slider radio-group textarea

Then create framing form components:
1. components/analyze/decision-statement-input.tsx - Textarea for decision question
2. components/analyze/decision-type-selector.tsx - Radio group for 5 types
3. components/analyze/frame-sliders.tsx - 4 sliders with labels
4. components/analyze/frame-form.tsx - Combines all into one form

DecisionStatementInput:
- Textarea with placeholder "What decision are you trying to make?"
- Character count indicator

DecisionTypeSelector:
- Radio group with 5 options:
  - product_bet: "Product Bet"
  - market_entry: "Market Entry"
  - investment: "Investment / Prioritization"
  - platform: "Platform / Architecture"
  - org_model: "Org / Operating Model"

FrameSliders - 4 sliders each 1-5:
- time_horizon: "3-6 months" ↔ "2+ years"
- reversibility: "Easily reversible" ↔ "Irreversible"
- stakes: "Low stakes (<$1M)" ↔ "High stakes ($10M+)"
- scope: "Team-level" ↔ "Exec-level"

FrameForm:
- Combines all components
- Auto-saves on change with 500ms debounce (PATCH to /api/decisions/[id]/frame)
- Shows save indicator ("Saved" / "Saving...")
- Validates required fields: statement and decision_type
```

| Task | Acceptance Criteria | Status |
|------|---------------------|--------|
| 💻 Statement input | Textarea with placeholder | |
| 💻 Type selector | 5 radio options | |
| 💻 Frame sliders | 4 sliders with labels | |
| 💻 Frame form | Auto-saves, validates | |

---

## 1.3 Context Anchoring Page

### 1.3a Context & Constraints API

**Windsurf Prompt:**
```
Create the context and constraints APIs:
1. app/api/decisions/[id]/context/route.ts - PATCH context fields
2. app/api/decisions/[id]/constraints/route.ts - GET, POST constraints
3. app/api/decisions/[id]/constraints/[constraintId]/route.ts - DELETE constraint

PATCH /api/decisions/[id]/context:
- Update: company_context, falsification_criteria
- Return updated decision

GET /api/decisions/[id]/constraints:
- Return all constraints for this decision

POST /api/decisions/[id]/constraints:
- Create constraint with: category, description, severity (hard/soft)
- Return created constraint

DELETE constraints/[constraintId]:
- Delete the constraint
- Verify it belongs to this decision
```

| Task | Acceptance Criteria | Status |
|------|---------------------|--------|
| 💻 PATCH context | Updates context fields | |
| 💻 GET constraints | Lists constraints | |
| 💻 POST constraints | Creates constraint | |
| 💻 DELETE constraint | Removes constraint | |

---

### 1.3b Context Page & Components

**Windsurf Prompt:**
```
Create the context page and components:
1. app/(dashboard)/analyze/[id]/context/page.tsx - Context page (Step 2)
2. components/analyze/company-context-input.tsx - Textarea for context
3. components/analyze/constraints-list.tsx - List with add/remove
4. components/analyze/constraint-form.tsx - Add constraint form
5. components/analyze/context-form.tsx - Combines all

Context page:
- Load decision and constraints
- Show context form
- Two buttons at bottom: "Skip for now" and "Start Analysis"
- Both navigate to /analyze/[id]/scanning

CompanyContextInput:
- Optional textarea
- Placeholder: "Any relevant company context? (market position, recent changes, etc.)"

ConstraintsList:
- Shows existing constraints as cards
- Each has category badge, description, delete button
- "Add Constraint" button opens form

ConstraintForm:
- Category dropdown: Technical, Budget, Timeline, Legal, Brand, Org, Other
- Description textarea
- Severity toggle: Hard (must meet) / Soft (prefer to meet)
- Save button POSTs to API

All fields are OPTIONAL. Show helper text: "Context helps reduce bias but isn't required."
```

| Task | Acceptance Criteria | Status |
|------|---------------------|--------|
| 💻 Context page | Shows form, nav buttons | |
| 💻 Context input | Optional textarea | |
| 💻 Constraints list | Add/remove constraints | |
| 💻 Constraint form | Category, description, severity | |

---

## 1.4 Analysis Trigger

### 1.4a Job & Analysis API

**Windsurf Prompt:**
```
Create the job and analysis APIs:
1. app/api/decisions/[id]/analyze/route.ts - POST to start analysis
2. app/api/jobs/[id]/route.ts - GET job status

POST /api/decisions/[id]/analyze:
- Verify decision exists and user has access
- Verify decision has required frame fields (decision_frame, decision_type)
- Create job record: type='decision_analysis', status='pending', decision_id
- Update decision: analysis_status='scanning', analysis_started_at=now
- Return { jobId, status: 'started' }

GET /api/jobs/[id]:
- Return job with: id, status, progress (0-100), error, output
- Status: pending, running, completed, failed

For now, the job won't actually run AI (that's Phase 2).
We'll simulate progress in the UI or create a mock job runner.
```

| Task | Acceptance Criteria | Status |
|------|---------------------|--------|
| 💻 POST analyze | Creates job, updates decision | |
| 💻 GET job status | Returns job progress | |

---

### 1.4b Scanning Page & Progress

**Windsurf Prompt:**
```
Create the scanning/progress page:
1. app/(dashboard)/analyze/[id]/scanning/page.tsx - Progress view (Step 3)
2. components/analyze/scanning-progress.tsx - Detailed progress display
3. hooks/use-job-polling.ts - Poll job status

Scanning page:
- On mount, POST to /api/decisions/[id]/analyze to start (if not already started)
- Show ScanningProgress component
- Poll job status every 2 seconds using useJobPolling hook
- When job.status === 'completed', redirect to /analyze/[id]/results
- If job.status === 'failed', show error with retry button

ScanningProgress shows steps:
- ✓ Planning research queries
- ✓ Searching for evidence (12/12 sources)
- ● Extracting insights... (18/25 pages)
- ○ Generating options
- ○ Mapping evidence to options
- ○ Scoring options
- ○ Generating recommendation

For MVP, simulate progress:
- Create a simple interval that updates UI progress
- After ~10 seconds, mark as complete
- This will be replaced with real Inngest jobs in Phase 2

useJobPolling hook:
- Takes jobId
- Polls GET /api/jobs/[id] every 2 seconds
- Returns { job, isLoading, error }
- Stops polling when status is completed or failed
```

| Task | Acceptance Criteria | Status |
|------|---------------------|--------|
| 💻 Scanning page | Shows progress, polls status | |
| 💻 Progress display | Step-by-step visualization | |
| 💻 Job polling hook | Reusable polling logic | |

---

## 1.5 Analysis Results Shell

### 1.5a Results Page & Tabs

**Windsurf Prompt:**
```
Install tabs component:
npx shadcn@latest add tabs

Create the results page:
1. app/(dashboard)/analyze/[id]/results/page.tsx - Results page (Steps 4-7)
2. components/analyze/results-tabs.tsx - Tab navigation

Results page:
- Load decision with related data (evidence, options, recommendations)
- Use Tabs for sections: Evidence, Options, Recommendation
- Show "View Brief" button that links to /decisions/[id]/brief
- Show "Re-run Analysis" button (for later)

ResultsTabs:
- Three tabs using shadcn Tabs component
- Evidence: shows evidence cards
- Options: shows generated options with scores
- Recommendation: shows primary recommendation

For now, these will show empty/placeholder states.
The actual data comes from Phase 2 AI pipeline.
```

| Task | Acceptance Criteria | Status |
|------|---------------------|--------|
| 💻 Results page | Shows tabbed results | |
| 💻 Results tabs | Three tab sections | |

---

### 1.5b Results Display Components

**Windsurf Prompt:**
```
Create results display components:
1. components/analyze/evidence-cards-view.tsx - List of evidence cards
2. components/analyze/evidence-card.tsx - Single evidence card
3. components/analyze/options-view.tsx - List of options
4. components/analyze/option-card.tsx - Single option with score
5. components/analyze/recommendation-view.tsx - Recommendation display

EvidenceCardsView:
- Takes evidence[] array
- Shows grid of EvidenceCard components
- Empty state: "Evidence will appear here after analysis"

EvidenceCard shows:
- Claim text
- Source link (clickable)
- Signal type badge
- Confidence indicator
- "Supports" / "Challenges" tag if mapped to option

OptionsView:
- Takes options[] array
- Shows list of OptionCard components
- Empty state: "Options will be generated from evidence"

OptionCard shows:
- Title, summary
- Score (if available) as progress bar
- "Primary upside" and "Primary risk"
- Grounded evidence count

RecommendationView:
- Takes recommendation object
- Shows primary option highlighted
- Shows hedge option if exists
- Shows decision changers list
- Empty state: "Recommendation will appear after scoring"
```

| Task | Acceptance Criteria | Status |
|------|---------------------|--------|
| 💻 Evidence cards view | Displays evidence list | |
| 💻 Evidence card | Single card component | |
| 💻 Options view | Displays options list | |
| 💻 Option card | Single option component | |
| 💻 Recommendation view | Shows recommendation | |

---

## 1.6 Polish & Navigation

### 1.6a Navigation Flow

**Windsurf Prompt:**
```
Ensure navigation flow works end-to-end:

1. Update middleware.ts if needed:
   - /dashboard, /analyze/*, /decisions/* require auth
   - Redirect to /login if not authenticated

2. Update components/layout/sidebar.tsx:
   - "Decisions" links to /dashboard
   - "Settings" links to /settings (placeholder page)
   - Show current decision title when on /analyze/[id]/* pages

3. Create placeholder settings page:
   - app/(dashboard)/settings/page.tsx - Simple "Settings coming soon"

4. Add navigation helpers:
   - "Back to Decisions" link on analyze pages
   - Breadcrumb or title showing decision name

Test the full flow:
1. Login → Dashboard
2. Create decision → Frame page
3. Fill frame → Context page
4. Start analysis → Scanning page
5. Complete → Results page
```

| Task | Acceptance Criteria | Status |
|------|---------------------|--------|
| 💻 Auth middleware | Protects dashboard routes | |
| 💻 Sidebar updates | Shows context-aware nav | |
| 💻 Settings placeholder | Basic page exists | |
| 💻 Navigation helpers | Back links, breadcrumbs | |

---

## Phase 1 Milestone

**User can create decision, frame it, add context, and trigger analysis.**

### Checklist
- [ ] Dashboard shows all user's decisions with status
- [ ] "Analyze a Decision" button creates new decision
- [ ] Framing page captures statement, type, sliders
- [ ] Auto-save works on frame and context pages
- [ ] Context page allows optional constraints
- [ ] "Start Analysis" creates job and shows progress
- [ ] Scanning page shows simulated progress
- [ ] Results page has tabs for evidence/options/recommendation
- [ ] Navigation flow works end-to-end
- [ ] All routes protected by auth

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
