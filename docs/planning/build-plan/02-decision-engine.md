# Phase 1: Decision Engine — User Input Steps (Weeks 2-3)

**Goal**: User can frame a decision and provide context. AI analysis pipeline ready to trigger.

**Status**: ⏳ Not Started

> **Architecture Reference**: See [CORE_JOURNEY.md](../../specs/CORE_JOURNEY.md) for the full 9-step flow.
> **API Reference**: See [API_CONTRACTS.md](../../specs/API_CONTRACTS.md) for endpoint specifications.
> **Database Reference**: See `src/types/database.ts` for exact column names and types.

---

## ⚠️ Pre-Phase Checklist

Before starting ANY prompt in this phase, verify:

- [ ] Phase 0 is complete and auth flows work
- [ ] Migrations 002-007 from Phase 0 have been applied (`npx supabase db push`)
- [ ] TypeScript types regenerated (`npx supabase gen types typescript --local > src/types/database.ts`)
- [ ] You can log in and see the empty dashboard at `/dashboard`

---

## SYSTEMIC NOTES FOR ALL PROMPTS

### Existing Files (DO NOT RECREATE)
These files already exist from Phase 0. Prompts should EXTEND, not recreate:
- `src/app/(dashboard)/layout.tsx` — Dashboard layout wrapper
- `src/app/(dashboard)/dashboard/page.tsx` — Dashboard page
- `src/components/layout/sidebar.tsx` — Navigation sidebar
- `src/components/layout/header.tsx` — Top header
- `src/components/decisions/decision-card.tsx` — Decision card component
- `src/components/decisions/decision-list.tsx` — Decision list wrapper
- `src/components/decisions/new-decision-button.tsx` — New decision CTA
- `src/app/api/decisions/route.ts` — Decisions API (GET/POST)
- `src/lib/supabase/client.ts` — Browser Supabase client
- `src/lib/supabase/server.ts` — Server Supabase client
- `src/types/database.ts` — Auto-generated DB types
- `src/types/decision.ts` — Decision-specific types

### Database Column Reference (from `decisions` table)
```
analysis_status: 'draft' | 'framing' | 'context' | 'scanning' | 'options' | 'mapping' | 'scoring' | 'recommending' | 'complete'
decision_type: 'product_bet' | 'market_entry' | 'investment' | 'platform' | 'org_model'
time_horizon: '3-6_months' | '6-12_months' | '1-2_years' | '2+_years'
reversibility: 1-5 (integer)
stakes: 1-5 (integer)
scope: 1-5 (integer)
decision_frame: text (the main decision question)
company_context: text
falsification_criteria: text
```

### Standard Patterns
- **Error handling**: Return `{ error: { code, message } }` per API_CONTRACTS.md
- **Auth check**: Use `createClient()` from `@/lib/supabase/server`, call `.auth.getUser()`
- **Org access**: Join through user's `org_id` for all queries
- **Loading states**: Use Suspense boundaries or isLoading state from hooks
- **Styling**: Use Tailwind + shadcn/ui components, follow DESIGN_SPEC_V2.md

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

### 1.1a Verify Dashboard Components Exist

> **ANNOTATION**: Original prompt would have recreated existing files. This prompt now AUDITS and EXTENDS.

**Goal**: Verify existing dashboard components work and extend if needed.

**Windsurf Prompt:**
```
GOAL: Verify dashboard layout exists and works correctly.

FILES TO CHECK (read, do not recreate):
- src/app/(dashboard)/layout.tsx
- src/app/(dashboard)/dashboard/page.tsx
- src/components/layout/sidebar.tsx
- src/components/layout/header.tsx

BEHAVIOR:
1. Read each file above and verify they exist
2. Verify layout.tsx:
   - Uses createClient() from '@/lib/supabase/server'
   - Calls supabase.auth.getUser()
   - Redirects to /login if no user
   - Renders Sidebar, Header, and children
3. Verify sidebar.tsx has links to: /dashboard (Decisions), /settings
4. Verify header.tsx shows user email and has logout functionality

IF ANY FILE IS MISSING OR INCOMPLETE:
- Create/fix ONLY the missing pieces
- Follow existing patterns from other files in the project

CONSTRAINTS:
- DO NOT recreate files that already exist and work
- DO NOT change working authentication logic
- DO NOT add new features beyond what's specified

ACCEPTANCE CRITERIA:
- `npm run dev` starts without errors
- Navigate to /dashboard while logged in → see layout with sidebar/header
- Navigate to /dashboard while logged out → redirect to /login
```

| Task | Acceptance Criteria | Status |
|------|---------------------|--------|
| ✅ Audit existing layout | Files exist and work | |
| 🔧 Fix if broken | Auth redirect works | |

---

### 1.1b Extend Decisions API

> **ANNOTATION**: Original prompt didn't reference existing route.ts. Now explicitly extends it.

**Goal**: Ensure GET/POST decisions API uses correct v2 schema columns.

**Windsurf Prompt:**
```
GOAL: Update existing decisions API to use v2 schema fields.

FILES:
- src/app/api/decisions/route.ts (EXISTS - extend it)
- src/types/decision.ts (EXISTS - extend it)

BEHAVIOR - GET /api/decisions:
1. Get authenticated user: const { data: { user } } = await supabase.auth.getUser()
2. If no user, return 401: { error: { code: 'unauthorized', message: 'Not authenticated' } }
3. Get user's org_id from users table
4. Query decisions where org_id matches
5. Select columns: id, title, decision_frame, status, analysis_status, decision_type,
   time_horizon, updated_at, created_at
6. Order by updated_at DESC
7. Return: { data: decisions[] }

BEHAVIOR - POST /api/decisions:
1. Auth check same as above
2. Parse body: { title: string }
3. Validate title exists and is non-empty
4. Insert decision with:
   - title: from body
   - org_id: from user lookup
   - owner_id: user.id
   - status: 'draft'
   - analysis_status: 'draft'
5. Return: { data: decision }

ERROR HANDLING:
- 401 for unauthenticated
- 400 for validation errors: { error: { code: 'validation_error', message: '...' } }
- 500 for database errors: { error: { code: 'internal_error', message: '...' } }

CONSTRAINTS:
- Use existing createClient() from '@/lib/supabase/server'
- Use Database types from src/types/database.ts
- DO NOT add pagination yet (Phase 5)
- DO NOT add filtering yet

ACCEPTANCE CRITERIA:
- curl GET /api/decisions with valid session returns user's decisions
- curl POST /api/decisions with { "title": "Test" } creates decision with status='draft', analysis_status='draft'
- TypeScript compiles without errors
```

| Task | Acceptance Criteria | Status |
|------|---------------------|--------|
| 💻 Update GET /api/decisions | Returns v2 schema fields | |
| 💻 Update POST /api/decisions | Sets analysis_status='draft' | |

---

### 1.1c Update Dashboard Page & Components

> **ANNOTATION**: Original prompt would recreate existing components. Now explicitly extends.

**Goal**: Update existing dashboard components to display v2 fields.

**Windsurf Prompt:**
```
GOAL: Update existing dashboard components to show analysis_status.

FILES TO UPDATE (not recreate):
- src/app/(dashboard)/dashboard/page.tsx
- src/components/decisions/decision-card.tsx
- src/components/decisions/decision-list.tsx
- src/components/decisions/new-decision-button.tsx

DECISION CARD UPDATES (decision-card.tsx):
1. Accept Decision type with fields: id, title, decision_frame, status, analysis_status,
   decision_type, time_horizon, updated_at
2. Display:
   - title (required)
   - decision_frame truncated to 100 chars if exists
   - Status badge based on analysis_status:
     - 'draft' → gray badge "Draft"
     - 'framing'|'context' → blue badge "Setup"
     - 'scanning'|'options'|'mapping'|'scoring'|'recommending' → yellow badge "Analyzing"
     - 'complete' → green badge "Complete"
   - time_horizon as small text if exists
   - "Updated X ago" using relative date
3. On click: navigate based on analysis_status:
   - 'draft'|'framing' → /analyze/[id]/frame
   - 'context' → /analyze/[id]/context
   - 'scanning' → /analyze/[id]/scanning
   - 'complete' → /analyze/[id]/results
   - default → /analyze/[id]/frame

NEW DECISION BUTTON (new-decision-button.tsx):
1. Show as prominent button: "Analyze a Decision"
2. On click: POST to /api/decisions with title "Untitled Decision"
3. On success: router.push(`/analyze/${decision.id}/frame`)
4. Show loading state while creating

DECISION LIST (decision-list.tsx):
1. Accept decisions[] prop
2. If empty: show message "No decisions yet. Start by analyzing your first strategic decision."
3. If loading: show skeleton cards (3 placeholder cards)
4. Map decisions to DecisionCard components

DASHBOARD PAGE (dashboard/page.tsx):
1. Fetch decisions from /api/decisions using fetch() or useSWR
2. Show NewDecisionButton at top
3. Show DecisionList below

CONSTRAINTS:
- Keep existing file structure
- Use existing shadcn Badge component (install if needed: npx shadcn@latest add badge)
- DO NOT change authentication logic
- DO NOT add sorting/filtering UI

ACCEPTANCE CRITERIA:
- Dashboard shows "Analyze a Decision" button
- Empty state shows when no decisions
- Clicking "Analyze a Decision" creates decision and navigates to /analyze/[id]/frame
- Cards show correct status badges
- Clicking card navigates to correct page based on status
```

| Task | Acceptance Criteria | Status |
|------|---------------------|--------|
| 💻 Update decision-card | Shows analysis_status badge | |
| 💻 Update new-decision-button | Creates and navigates | |
| 💻 Update decision-list | Handles empty/loading | |
| 💻 Update dashboard page | Fetches and displays | |

---

## 1.2 Decision Framing Page

### 1.2a Frame API Endpoints

> **ANNOTATION**: Original prompt didn't specify exact DB column names. Now includes complete schema reference.

**Goal**: Create API endpoints for single decision operations and frame updates.

**Windsurf Prompt:**
```
GOAL: Create decision detail and frame update APIs.

FILES TO CREATE:
- src/app/api/decisions/[id]/route.ts
- src/app/api/decisions/[id]/frame/route.ts

SHARED AUTH PATTERN (use in both files):
```typescript
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// At start of each handler:
const supabase = await createClient()
const { data: { user } } = await supabase.auth.getUser()
if (!user) {
  return NextResponse.json(
    { error: { code: 'unauthorized', message: 'Not authenticated' } },
    { status: 401 }
  )
}

// Get user's org_id:
const { data: userData } = await supabase
  .from('users')
  .select('org_id')
  .eq('id', user.id)
  .single()

// Verify decision belongs to user's org:
const { data: decision } = await supabase
  .from('decisions')
  .select('*')
  .eq('id', params.id)
  .eq('org_id', userData.org_id)
  .single()

if (!decision) {
  return NextResponse.json(
    { error: { code: 'not_found', message: 'Decision not found' } },
    { status: 404 }
  )
}
```

FILE: /api/decisions/[id]/route.ts

GET handler:
- Auth check + org verification (pattern above)
- Return: { data: decision }

PATCH handler:
- Auth check + org verification
- Parse body, allow these fields only: title, decision_frame, context, status, deadline, urgency
- Update decision with provided fields
- Return: { data: updatedDecision }

DELETE handler:
- Auth check + org verification
- Delete decision: await supabase.from('decisions').delete().eq('id', params.id)
- Return: { data: { success: true } }

FILE: /api/decisions/[id]/frame/route.ts

PATCH handler:
- Auth check + org verification
- Parse body, allow ONLY these frame fields:
  - title (string)
  - decision_frame (string) - the main decision question
  - decision_type (enum: 'product_bet' | 'market_entry' | 'investment' | 'platform' | 'org_model')
  - time_horizon (enum: '3-6_months' | '6-12_months' | '1-2_years' | '2+_years')
  - reversibility (integer 1-5)
  - stakes (integer 1-5)
  - scope (integer 1-5)
- Validate:
  - If decision_type provided, must be one of the enum values
  - If time_horizon provided, must be one of the enum values
  - If reversibility/stakes/scope provided, must be integers 1-5
- Update only provided fields
- If this is first frame update, set analysis_status to 'framing'
- Return: { data: updatedDecision }

CONSTRAINTS:
- Use exact column names from database.ts
- DO NOT allow updating org_id or owner_id
- DO NOT cascade delete related records (DB handles this)

ACCEPTANCE CRITERIA:
- GET /api/decisions/[id] returns decision for authorized user
- GET /api/decisions/[id] returns 404 for other org's decision
- PATCH /api/decisions/[id]/frame updates frame fields only
- PATCH validates enum values and returns 400 for invalid
- DELETE removes decision
```

| Task | Acceptance Criteria | Status |
|------|---------------------|--------|
| 💻 GET /api/decisions/[id] | Returns single decision | |
| 💻 PATCH /api/decisions/[id] | Updates allowed fields | |
| 💻 DELETE /api/decisions/[id] | Deletes decision | |
| 💻 PATCH /api/decisions/[id]/frame | Updates frame fields with validation | |

---

### 1.2b Analysis Layout & Progress Component

> **ANNOTATION**: Original had wrong step count. Now matches CORE_JOURNEY.md exactly.

**Goal**: Create the analysis flow layout with accurate step progress.

**Windsurf Prompt:**
```
GOAL: Create analysis layout wrapper with step progress indicator.

FILES TO CREATE:
- src/app/(dashboard)/analyze/[id]/layout.tsx
- src/components/analyze/analysis-progress.tsx

ANALYSIS PROGRESS COMPONENT (analysis-progress.tsx):

Props:
- currentStep: 'frame' | 'context' | 'scanning' | 'options' | 'mapping' | 'scoring' | 'recommendation' | 'results'
- analysisStatus: string (from decision.analysis_status)

Steps to display (matches CORE_JOURNEY.md):
1. Frame (user step)
2. Context (user step)
3. Scan (AI step)
4. Options (AI step)
5. Map (AI step)
6. Score (AI step)
7. Recommend (AI step)

Visual:
- Horizontal row of 7 circles/pills with labels
- Completed steps: filled circle with checkmark, clickable
- Current step: filled circle, highlighted
- Future steps: empty circle, not clickable
- Steps 3-7 disabled/grayed until analysis_status indicates they're reachable

Step clickability:
- Frame: always clickable if analysis_status in ['draft', 'framing', 'context', ...]
- Context: clickable if analysis_status not 'draft'
- Scan-Recommend: only clickable if analysis_status indicates completion
- Results: only if analysis_status === 'complete'

ANALYSIS LAYOUT (analyze/[id]/layout.tsx):

```typescript
import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { AnalysisProgress } from '@/components/analyze/analysis-progress'

export default async function AnalyzeLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { id: string }
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Get user's org
  const { data: userData } = await supabase
    .from('users')
    .select('org_id')
    .eq('id', user.id)
    .single()

  // Fetch decision with org check
  const { data: decision } = await supabase
    .from('decisions')
    .select('id, title, analysis_status')
    .eq('id', params.id)
    .eq('org_id', userData?.org_id)
    .single()

  if (!decision) notFound()

  // Determine current step from URL
  // This will be passed to AnalysisProgress

  return (
    <div className="flex flex-col h-full">
      <div className="border-b px-6 py-4">
        <h1 className="text-lg font-medium">{decision.title}</h1>
        <AnalysisProgress
          analysisStatus={decision.analysis_status || 'draft'}
          decisionId={decision.id}
        />
      </div>
      <div className="flex-1 overflow-auto p-6">
        {children}
      </div>
    </div>
  )
}
```

CONSTRAINTS:
- Server component for layout (async data fetching)
- Client component for AnalysisProgress (interactivity)
- Use 'use client' directive in progress component
- Follow existing layout patterns in the project
- DO NOT add back button (sidebar handles navigation)

ACCEPTANCE CRITERIA:
- /analyze/[valid-id]/frame shows layout with progress
- /analyze/[invalid-id]/frame shows 404
- /analyze/[other-org-id]/frame shows 404 (org isolation)
- Progress shows 7 steps
- Current step highlighted based on URL
- AI steps (3-7) appear disabled when analysis not started
```

| Task | Acceptance Criteria | Status |
|------|---------------------|--------|
| 💻 Analysis layout | Fetches decision, shows progress | |
| 💻 Progress component | 7 steps, correct states | |

---

### 1.2c Frame Page

> **ANNOTATION**: Split from form components for smaller scope. Page only, no form.

**Goal**: Create the frame page shell that loads decision and renders form.

**Windsurf Prompt:**
```
GOAL: Create frame page that loads decision data and prepares for form.

FILES TO CREATE:
- src/app/(dashboard)/analyze/[id]/frame/page.tsx

FRAME PAGE:

```typescript
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { FrameForm } from '@/components/analyze/frame-form'

export default async function FramePage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = await createClient()

  // Fetch decision with frame fields
  const { data: decision } = await supabase
    .from('decisions')
    .select(`
      id,
      title,
      decision_frame,
      decision_type,
      time_horizon,
      reversibility,
      stakes,
      scope
    `)
    .eq('id', params.id)
    .single()

  if (!decision) notFound()

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Frame Your Decision</h2>
        <p className="text-muted-foreground mt-1">
          Define the decision clearly before exploring options.
        </p>
      </div>

      <FrameForm
        decisionId={decision.id}
        initialData={{
          title: decision.title,
          decision_frame: decision.decision_frame || '',
          decision_type: decision.decision_type || null,
          time_horizon: decision.time_horizon || null,
          reversibility: decision.reversibility || 3,
          stakes: decision.stakes || 3,
          scope: decision.scope || 3,
        }}
      />

      {/* Navigation handled in FrameForm component */}
    </div>
  )
}
```

CONSTRAINTS:
- Server component for initial data fetch
- Pass data to client FrameForm component
- DO NOT implement form logic here (next prompt)
- Org check happens in layout, not needed here

ACCEPTANCE CRITERIA:
- /analyze/[id]/frame loads without error
- Page title shows "Frame Your Decision"
- Decision data passed to FrameForm
- Defaults applied for null values
```

| Task | Acceptance Criteria | Status |
|------|---------------------|--------|
| 💻 Frame page | Loads decision, renders form shell | |

---

### 1.2d Frame Form Components

> **ANNOTATION**: Original combined too much. Now split: install deps first, then components.

**Goal**: Install shadcn dependencies, then create form components.

**Windsurf Prompt (Part 1 - Dependencies):**
```
GOAL: Install required shadcn components for frame form.

RUN THESE COMMANDS (in order):
npx shadcn@latest add slider
npx shadcn@latest add radio-group
npx shadcn@latest add textarea
npx shadcn@latest add label

VERIFY after each:
- File created in src/components/ui/
- No TypeScript errors

ACCEPTANCE CRITERIA:
- src/components/ui/slider.tsx exists
- src/components/ui/radio-group.tsx exists
- src/components/ui/textarea.tsx exists
- src/components/ui/label.tsx exists
- npm run build passes
```

**Windsurf Prompt (Part 2 - Form Components):**
```
GOAL: Create frame form with auto-save functionality.

FILES TO CREATE:
- src/components/analyze/frame-form.tsx
- src/components/analyze/decision-statement-input.tsx
- src/components/analyze/decision-type-selector.tsx
- src/components/analyze/frame-sliders.tsx

DECISION STATEMENT INPUT (decision-statement-input.tsx):
Props: value: string, onChange: (value: string) => void

- Textarea with placeholder: "What decision are you trying to make?"
- Label: "Decision Statement" (required indicator)
- Character count: "X / 500 characters"
- Max length: 500 characters
- Minimum height: 100px

DECISION TYPE SELECTOR (decision-type-selector.tsx):
Props: value: string | null, onChange: (value: string) => void

- Label: "Decision Type" (required indicator)
- RadioGroup with 5 options, each with label and description:
  1. value: 'product_bet', label: "Product Bet"
     description: "New features, product direction, roadmap choices"
  2. value: 'market_entry', label: "Market Entry"
     description: "New markets, segments, geographies"
  3. value: 'investment', label: "Investment / Prioritization"
     description: "Resource allocation, budget decisions"
  4. value: 'platform', label: "Platform / Architecture"
     description: "Technical infrastructure, build vs buy"
  5. value: 'org_model', label: "Org / Operating Model"
     description: "Team structure, processes, partnerships"

FRAME SLIDERS (frame-sliders.tsx):
Props:
  values: { reversibility: number, stakes: number, scope: number, time_horizon: string | null }
  onChange: (field: string, value: number | string) => void

4 inputs:

1. Time Horizon (RadioGroup, not slider):
   - Label: "Time Horizon"
   - Options:
     - '3-6_months': "3-6 months"
     - '6-12_months': "6-12 months"
     - '1-2_years': "1-2 years"
     - '2+_years': "2+ years"

2. Reversibility (Slider):
   - Label: "Reversibility"
   - Range: 1-5
   - Left label: "Easily reversible"
   - Right label: "Irreversible"

3. Stakes (Slider):
   - Label: "Stakes"
   - Range: 1-5
   - Left label: "Low (<$1M)"
   - Right label: "High ($10M+)"

4. Scope (Slider):
   - Label: "Scope"
   - Range: 1-5
   - Left label: "Team-level"
   - Right label: "Exec-level"

FRAME FORM (frame-form.tsx):
Props:
  decisionId: string
  initialData: { title, decision_frame, decision_type, time_horizon, reversibility, stakes, scope }

State:
- formData: copy of initialData
- isSaving: boolean
- lastSaved: Date | null

Behavior:
1. On any field change:
   - Update local state immediately
   - Debounce 800ms, then PATCH to /api/decisions/[id]/frame
   - Show "Saving..." during request
   - Show "Saved" with timestamp after success
   - Show "Error saving" if fails (don't lose data)

2. "Next: Add Context" button at bottom:
   - Disabled until: decision_frame has content AND decision_type selected
   - On click: router.push(`/analyze/${decisionId}/context`)

3. Title field:
   - Input at top for editing title
   - Same auto-save behavior

USE 'use client' directive.

CONSTRAINTS:
- DO NOT add form validation library (keep it simple)
- DO NOT block navigation on unsaved changes (auto-save handles it)
- Use fetch() for API calls, not axios
- Debounce implementation: use setTimeout/clearTimeout pattern

ACCEPTANCE CRITERIA:
- Form loads with existing data
- Changing any field triggers save after 800ms
- "Saving..." shows during API call
- "Saved at X:XX" shows after successful save
- "Next" button disabled until required fields filled
- "Next" navigates to context page
- No TypeScript errors
```

| Task | Acceptance Criteria | Status |
|------|---------------------|--------|
| 💻 Install shadcn deps | slider, radio-group, textarea, label | |
| 💻 Statement input | Textarea with char count | |
| 💻 Type selector | 5 radio options | |
| 💻 Frame sliders | 3 sliders + time horizon | |
| 💻 Frame form | Auto-save, validation, navigation | |

---

## 1.3 Context Anchoring Page

### 1.3a Context & Constraints API

> **ANNOTATION**: Added explicit column names and constraint categories from spec.

**Goal**: Create APIs for context and constraints management.

**Windsurf Prompt:**
```
GOAL: Create context update and constraints CRUD APIs.

FILES TO CREATE:
- src/app/api/decisions/[id]/context/route.ts
- src/app/api/decisions/[id]/constraints/route.ts
- src/app/api/decisions/[id]/constraints/[constraintId]/route.ts

AUTH PATTERN: Same as 1.2a (copy the auth + org verification code)

FILE: /api/decisions/[id]/context/route.ts

PATCH handler:
- Auth + org check
- Allow ONLY these fields:
  - company_context (string, optional)
  - falsification_criteria (string, optional)
- Update decision
- If first context save, set analysis_status to 'context'
- Return: { data: updatedDecision }

FILE: /api/decisions/[id]/constraints/route.ts

GET handler:
- Auth + org check (verify decision belongs to org)
- Query constraints table where decision_id = params.id
- Return: { data: constraints[] }

POST handler:
- Auth + org check
- Parse body:
  - category: required, must be one of: 'technical', 'budget', 'timeline', 'legal', 'brand', 'org', 'other'
  - description: required, string
  - severity: required, must be: 'hard' | 'soft'
- Validate all fields present
- Insert into constraints table with decision_id
- Return: { data: constraint }

FILE: /api/decisions/[id]/constraints/[constraintId]/route.ts

DELETE handler:
- Auth + org check
- Verify constraint belongs to this decision:
  ```typescript
  const { data: constraint } = await supabase
    .from('constraints')
    .select('id, decision_id')
    .eq('id', params.constraintId)
    .single()

  if (!constraint || constraint.decision_id !== params.id) {
    return NextResponse.json(
      { error: { code: 'not_found', message: 'Constraint not found' } },
      { status: 404 }
    )
  }
  ```
- Delete constraint
- Return: { data: { success: true } }

CONSTRAINTS:
- Use exact column names from database.ts
- Validate category enum on server
- DO NOT implement PATCH for constraints (not needed in MVP)

ACCEPTANCE CRITERIA:
- PATCH /api/decisions/[id]/context updates context fields
- GET /api/decisions/[id]/constraints returns array
- POST /api/decisions/[id]/constraints creates with validation
- POST returns 400 for invalid category
- DELETE removes constraint
- DELETE returns 404 for constraint from different decision
```

| Task | Acceptance Criteria | Status |
|------|---------------------|--------|
| 💻 PATCH context | Updates context fields | |
| 💻 GET constraints | Lists constraints | |
| 💻 POST constraints | Creates with validation | |
| 💻 DELETE constraint | Removes, verifies ownership | |

---

### 1.3b Context Page & Components

> **ANNOTATION**: Added explicit component responsibilities and states.

**Goal**: Create context page with optional inputs and constraints list.

**Windsurf Prompt:**
```
GOAL: Create context page with company context, constraints, and navigation.

FILES TO CREATE:
- src/app/(dashboard)/analyze/[id]/context/page.tsx
- src/components/analyze/context-form.tsx
- src/components/analyze/company-context-input.tsx
- src/components/analyze/constraints-list.tsx
- src/components/analyze/constraint-form.tsx

CONTEXT PAGE (context/page.tsx):
Server component that fetches decision and constraints.

```typescript
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { ContextForm } from '@/components/analyze/context-form'

export default async function ContextPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = await createClient()

  const { data: decision } = await supabase
    .from('decisions')
    .select('id, company_context, falsification_criteria')
    .eq('id', params.id)
    .single()

  if (!decision) notFound()

  const { data: constraints } = await supabase
    .from('constraints')
    .select('*')
    .eq('decision_id', params.id)
    .order('created_at', { ascending: true })

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Add Context</h2>
        <p className="text-muted-foreground mt-1">
          Optional: Provide context to reduce bias and improve analysis.
        </p>
      </div>

      <ContextForm
        decisionId={decision.id}
        initialContext={{
          company_context: decision.company_context || '',
          falsification_criteria: decision.falsification_criteria || '',
        }}
        initialConstraints={constraints || []}
      />
    </div>
  )
}
```

COMPANY CONTEXT INPUT (company-context-input.tsx):
Props: value: string, onChange: (value: string) => void

- Textarea with label: "Company Context (Optional)"
- Placeholder: "Relevant company context: market position, recent changes, team situation..."
- Helper text below: "This helps the AI understand your specific situation."

CONSTRAINTS LIST (constraints-list.tsx):
Props:
  constraints: Constraint[]
  onDelete: (id: string) => void
  onAdd: () => void

- If empty: show "No constraints added"
- Map constraints to cards showing:
  - Category as colored badge (different color per category)
  - Description text
  - Severity badge: "Must have" (hard) or "Nice to have" (soft)
  - Delete button (trash icon)
- "Add Constraint" button at bottom

CONSTRAINT FORM (constraint-form.tsx):
Props:
  onSubmit: (constraint: { category, description, severity }) => void
  onCancel: () => void

- Shown in modal or inline expansion when "Add Constraint" clicked
- Fields:
  - Category: Select dropdown with options:
    - technical: "Technical"
    - budget: "Budget"
    - timeline: "Timeline"
    - legal: "Legal / Compliance"
    - brand: "Brand / Reputation"
    - org: "Organizational"
    - other: "Other"
  - Description: Textarea, required
  - Severity: RadioGroup
    - hard: "Hard constraint (must meet)"
    - soft: "Soft constraint (prefer to meet)"
- "Add" and "Cancel" buttons

CONTEXT FORM (context-form.tsx):
Props:
  decisionId: string
  initialContext: { company_context, falsification_criteria }
  initialConstraints: Constraint[]

State:
- context: copy of initialContext
- constraints: copy of initialConstraints
- isSaving: boolean
- showConstraintForm: boolean

Behavior:
1. Auto-save context fields with 800ms debounce (same as frame form)
2. Constraints: immediate save on add, immediate delete
3. Two navigation buttons at bottom:
   - "Skip for now" → router.push(`/analyze/${decisionId}/scanning`)
   - "Continue to Analysis" → router.push(`/analyze/${decisionId}/scanning`)

CONSTRAINTS:
- All fields are OPTIONAL
- DO NOT require any fields to navigate
- Use fetch() for all API calls
- Show toast or inline message on save success/error

ACCEPTANCE CRITERIA:
- Page loads with existing context and constraints
- Context auto-saves on change
- Can add constraint with all fields
- Can delete constraint
- Both buttons navigate to scanning page
- Empty state shows when no constraints
```

| Task | Acceptance Criteria | Status |
|------|---------------------|--------|
| 💻 Context page | Loads data, renders form | |
| 💻 Company context input | Optional textarea | |
| 💻 Constraints list | Shows list, add/delete | |
| 💻 Constraint form | Category, description, severity | |
| 💻 Context form | Auto-save, navigation | |

---

## 1.4 Analysis Trigger & Progress

### 1.4a Job & Analysis API

> **ANNOTATION**: Added explicit org_id requirement and job type validation.

**Goal**: Create API to trigger analysis and check job status.

**Windsurf Prompt:**
```
GOAL: Create APIs to start analysis job and check job status.

FILES TO CREATE:
- src/app/api/decisions/[id]/analyze/route.ts
- src/app/api/jobs/[id]/route.ts

FILE: /api/decisions/[id]/analyze/route.ts

POST handler - Start Analysis:
1. Auth + org check (same pattern)
2. Fetch decision with required fields:
   ```typescript
   const { data: decision } = await supabase
     .from('decisions')
     .select('id, decision_frame, decision_type, analysis_status, org_id')
     .eq('id', params.id)
     .eq('org_id', userData.org_id)
     .single()
   ```
3. Validate decision is ready:
   - decision_frame must not be empty
   - decision_type must be set
   - If validation fails: return 400 { error: { code: 'validation_error', message: 'Decision frame and type required' } }
4. Check if already analyzing:
   - If analysis_status not in ['draft', 'framing', 'context', 'complete']:
     return 400 { error: { code: 'conflict', message: 'Analysis already in progress' } }
5. Create job:
   ```typescript
   const { data: job } = await supabase
     .from('jobs')
     .insert({
       org_id: decision.org_id,
       decision_id: decision.id,
       type: 'decision_analysis',
       status: 'pending',
       progress: 0,
       input: {
         decision_id: decision.id,
         decision_type: decision.decision_type,
       }
     })
     .select()
     .single()
   ```
6. Update decision:
   ```typescript
   await supabase
     .from('decisions')
     .update({
       analysis_status: 'scanning',
       analysis_started_at: new Date().toISOString()
     })
     .eq('id', decision.id)
   ```
7. Return: { data: { jobId: job.id, status: 'started' } }

FILE: /api/jobs/[id]/route.ts

GET handler - Check Job Status:
1. Auth + org check
2. Fetch job:
   ```typescript
   const { data: job } = await supabase
     .from('jobs')
     .select('*')
     .eq('id', params.id)
     .eq('org_id', userData.org_id)
     .single()
   ```
3. If not found: return 404
4. Return: { data: job }
   - Job includes: id, status, progress (0-100), error, output, type

NOTE: Job won't actually run AI yet (Phase 2). We'll simulate progress.

CONSTRAINTS:
- jobs.org_id is REQUIRED (not nullable in schema)
- type must be 'decision_analysis' for this endpoint
- DO NOT implement actual job runner (Phase 2)

ACCEPTANCE CRITERIA:
- POST /api/decisions/[id]/analyze creates job with org_id
- POST returns 400 if decision_frame empty
- POST returns 400 if analysis already running
- GET /api/jobs/[id] returns job status
- GET returns 404 for other org's job
```

| Task | Acceptance Criteria | Status |
|------|---------------------|--------|
| 💻 POST analyze | Creates job, validates, updates status | |
| 💻 GET job status | Returns job with progress | |

---

### 1.4b Scanning Page with Simulated Progress

> **ANNOTATION**: Clarified this uses simulated progress for MVP, not real job runner.

**Goal**: Create scanning page with progress visualization and polling.

**Windsurf Prompt:**
```
GOAL: Create scanning page with progress display and job polling.

FILES TO CREATE:
- src/app/(dashboard)/analyze/[id]/scanning/page.tsx
- src/components/analyze/scanning-progress.tsx
- src/hooks/use-job-polling.ts

USE JOB POLLING HOOK (use-job-polling.ts):
```typescript
'use client'
import { useState, useEffect, useCallback } from 'react'

interface Job {
  id: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  progress: number
  error: string | null
  output: any
}

export function useJobPolling(jobId: string | null) {
  const [job, setJob] = useState<Job | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchJob = useCallback(async () => {
    if (!jobId) return

    try {
      const res = await fetch(`/api/jobs/${jobId}`)
      if (!res.ok) throw new Error('Failed to fetch job')
      const { data } = await res.json()
      setJob(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsLoading(false)
    }
  }, [jobId])

  useEffect(() => {
    if (!jobId) return

    fetchJob()

    // Poll every 2 seconds while job is pending/running
    const interval = setInterval(() => {
      if (job?.status === 'completed' || job?.status === 'failed') {
        clearInterval(interval)
        return
      }
      fetchJob()
    }, 2000)

    return () => clearInterval(interval)
  }, [jobId, job?.status, fetchJob])

  return { job, isLoading, error, refetch: fetchJob }
}
```

SCANNING PROGRESS COMPONENT (scanning-progress.tsx):
Props: progress: number (0-100), status: string

Display 7 analysis steps with current progress:
```
const STEPS = [
  { key: 'planning', label: 'Planning research queries', threshold: 5 },
  { key: 'searching', label: 'Searching for evidence', threshold: 20 },
  { key: 'extracting', label: 'Extracting insights', threshold: 40 },
  { key: 'options', label: 'Generating options', threshold: 55 },
  { key: 'mapping', label: 'Mapping evidence to options', threshold: 70 },
  { key: 'scoring', label: 'Scoring options', threshold: 85 },
  { key: 'recommending', label: 'Generating recommendation', threshold: 95 },
]
```

For each step, show:
- ✓ if progress >= step.threshold
- ● (spinner) if progress is in this step's range
- ○ if not yet reached

SCANNING PAGE (scanning/page.tsx):
```typescript
'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useJobPolling } from '@/hooks/use-job-polling'
import { ScanningProgress } from '@/components/analyze/scanning-progress'

export default function ScanningPage({
  params,
}: {
  params: { id: string }
}) {
  const router = useRouter()
  const [jobId, setJobId] = useState<string | null>(null)
  const [startError, setStartError] = useState<string | null>(null)
  const { job, isLoading, error } = useJobPolling(jobId)

  // FOR MVP: Simulate progress
  const [simulatedProgress, setSimulatedProgress] = useState(0)

  // Start analysis on mount
  useEffect(() => {
    const startAnalysis = async () => {
      try {
        const res = await fetch(`/api/decisions/${params.id}/analyze`, {
          method: 'POST',
        })

        if (!res.ok) {
          const { error } = await res.json()
          // If already analyzing, that's okay
          if (error?.code === 'conflict') {
            // Could fetch existing job here, for now simulate
            setSimulatedProgress(10)
          } else {
            setStartError(error?.message || 'Failed to start analysis')
          }
          return
        }

        const { data } = await res.json()
        setJobId(data.jobId)
      } catch (err) {
        setStartError('Failed to start analysis')
      }
    }

    startAnalysis()
  }, [params.id])

  // MVP: Simulate progress (remove in Phase 2)
  useEffect(() => {
    const interval = setInterval(() => {
      setSimulatedProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Redirect when complete
  useEffect(() => {
    if (simulatedProgress >= 100 || job?.status === 'completed') {
      setTimeout(() => {
        router.push(`/analyze/${params.id}/results`)
      }, 500)
    }
  }, [simulatedProgress, job?.status, params.id, router])

  if (startError) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{startError}</p>
        <button
          onClick={() => router.push(`/analyze/${params.id}/frame`)}
          className="text-primary underline"
        >
          Return to frame
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto py-12">
      <div className="text-center mb-8">
        <h2 className="text-xl font-semibold">Analyzing Decision</h2>
        <p className="text-muted-foreground mt-1">
          This typically takes 30-90 seconds
        </p>
      </div>

      <ScanningProgress
        progress={job?.progress || simulatedProgress}
        status={job?.status || 'running'}
      />

      {job?.status === 'failed' && (
        <div className="mt-8 text-center">
          <p className="text-red-500 mb-4">{job.error || 'Analysis failed'}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-primary underline"
          >
            Retry
          </button>
        </div>
      )}
    </div>
  )
}
```

CONSTRAINTS:
- Client component (needs state and effects)
- FOR MVP: Use simulated progress (real job runner in Phase 2)
- Auto-redirect when progress hits 100%
- Handle "already analyzing" gracefully

ACCEPTANCE CRITERIA:
- Page starts analysis on mount
- Progress bar animates through steps
- Steps show correct icons based on progress
- Redirects to /analyze/[id]/results when complete
- Shows error if analysis fails
- Shows retry button on failure
```

| Task | Acceptance Criteria | Status |
|------|---------------------|--------|
| 💻 Job polling hook | Polls every 2s, stops when done | |
| 💻 Scanning progress | Shows 7 steps with progress | |
| 💻 Scanning page | Starts analysis, shows progress, redirects | |

---

## 1.5 Results Shell (Placeholder)

### 1.5a Results Page with Tabs

> **ANNOTATION**: Simplified to placeholder that Phase 2 will populate.

**Goal**: Create results page shell with tabs for evidence/options/recommendation.

**Windsurf Prompt:**
```
GOAL: Create results page shell with tabs (data populated in Phase 2).

INSTALL FIRST:
npx shadcn@latest add tabs

FILES TO CREATE:
- src/app/(dashboard)/analyze/[id]/results/page.tsx
- src/components/analyze/results-tabs.tsx
- src/components/analyze/evidence-placeholder.tsx
- src/components/analyze/options-placeholder.tsx
- src/components/analyze/recommendation-placeholder.tsx

RESULTS PAGE (results/page.tsx):
```typescript
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { ResultsTabs } from '@/components/analyze/results-tabs'

export default async function ResultsPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = await createClient()

  const { data: decision } = await supabase
    .from('decisions')
    .select(`
      id,
      title,
      analysis_status,
      confidence_score,
      recommendation_rationale
    `)
    .eq('id', params.id)
    .single()

  if (!decision) notFound()

  // In Phase 2, we'll also fetch:
  // - evidence
  // - options with scores
  // - recommendation

  return (
    <div className="max-w-4xl">
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h2 className="text-xl font-semibold">Analysis Results</h2>
          <p className="text-muted-foreground mt-1">
            Review evidence, options, and recommendation
          </p>
        </div>
        <div className="flex gap-2">
          <button className="text-sm text-muted-foreground hover:text-foreground">
            Re-run Analysis
          </button>
          <button className="text-sm text-primary hover:underline">
            View Brief →
          </button>
        </div>
      </div>

      <ResultsTabs decisionId={decision.id} />
    </div>
  )
}
```

RESULTS TABS (results-tabs.tsx):
```typescript
'use client'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { EvidencePlaceholder } from './evidence-placeholder'
import { OptionsPlaceholder } from './options-placeholder'
import { RecommendationPlaceholder } from './recommendation-placeholder'

export function ResultsTabs({ decisionId }: { decisionId: string }) {
  return (
    <Tabs defaultValue="recommendation" className="w-full">
      <TabsList>
        <TabsTrigger value="recommendation">Recommendation</TabsTrigger>
        <TabsTrigger value="evidence">Evidence</TabsTrigger>
        <TabsTrigger value="options">Options</TabsTrigger>
      </TabsList>

      <TabsContent value="recommendation" className="mt-6">
        <RecommendationPlaceholder />
      </TabsContent>

      <TabsContent value="evidence" className="mt-6">
        <EvidencePlaceholder />
      </TabsContent>

      <TabsContent value="options" className="mt-6">
        <OptionsPlaceholder />
      </TabsContent>
    </Tabs>
  )
}
```

PLACEHOLDER COMPONENTS:
Each placeholder shows:
- Empty state message
- "Coming in next phase" note
- Skeleton/preview of what will be shown

EvidencePlaceholder: "Evidence cards will appear here after AI analysis completes."
OptionsPlaceholder: "Generated options with scores will appear here."
RecommendationPlaceholder: "The AI recommendation will appear here with confidence score and conditions."

CONSTRAINTS:
- Server component for page (fetches data)
- Client component for tabs (interactivity)
- Placeholder components are simple - real ones built in Phase 2
- Default to "Recommendation" tab

ACCEPTANCE CRITERIA:
- /analyze/[id]/results loads without error
- Three tabs visible and clickable
- Each tab shows placeholder content
- "View Brief" and "Re-run" buttons present (non-functional for now)
```

| Task | Acceptance Criteria | Status |
|------|---------------------|--------|
| 💻 Install tabs | shadcn tabs component | |
| 💻 Results page | Loads, shows tabs | |
| 💻 Results tabs | Three tabs switch content | |
| 💻 Placeholders | Show empty state messages | |

---

## 1.6 Navigation & Polish

### 1.6a Verify Navigation Flow

> **ANNOTATION**: Audit-focused instead of creation-focused. Verify existing, fix gaps.

**Goal**: Verify end-to-end navigation works, fix any gaps.

**Windsurf Prompt:**
```
GOAL: Verify and fix navigation flow through entire decision journey.

TEST SEQUENCE (manual or automated):
1. Start logged out → navigate to /dashboard → should redirect to /login
2. Sign up / log in → should land on /dashboard
3. Click "Analyze a Decision" → should create decision and go to /analyze/[id]/frame
4. Fill frame form (statement + type) → "Next" should enable
5. Click "Next" → should go to /analyze/[id]/context
6. Click "Continue to Analysis" → should go to /analyze/[id]/scanning
7. Wait for progress to complete → should redirect to /analyze/[id]/results
8. All pages show progress indicator with correct step highlighted

FILES TO CHECK/UPDATE:
- src/middleware.ts — verify protects /dashboard/*, /analyze/*
- src/components/layout/sidebar.tsx — verify links work
- src/components/analyze/analysis-progress.tsx — verify step highlighting

FIX: Sidebar context awareness
Update sidebar.tsx to show decision context when on /analyze/* pages:
- Parse pathname to get decision ID
- If on /analyze/[id]/*, show decision title and "← Back to Decisions" link
- Keep existing nav links

FIX: Create settings placeholder
Create src/app/(dashboard)/settings/page.tsx:
```typescript
export default function SettingsPage() {
  return (
    <div className="max-w-2xl">
      <h2 className="text-xl font-semibold">Settings</h2>
      <p className="text-muted-foreground mt-4">
        Account and organization settings coming soon.
      </p>
    </div>
  )
}
```

VERIFY MIDDLEWARE:
```typescript
// middleware.ts should have:
export const config = {
  matcher: ['/dashboard/:path*', '/analyze/:path*', '/settings/:path*']
}
```

CONSTRAINTS:
- DO NOT change auth logic that already works
- DO NOT add features beyond navigation fixes
- Keep changes minimal and targeted

ACCEPTANCE CRITERIA:
- Full flow works: login → dashboard → create → frame → context → scanning → results
- Unauthorized access to /dashboard redirects to /login
- Sidebar shows "Back to Decisions" on analyze pages
- Settings page exists (placeholder)
- No broken links in navigation
- Progress indicator shows correct step on each page
```

| Task | Acceptance Criteria | Status |
|------|---------------------|--------|
| 🔍 Test full flow | All navigation works | |
| 💻 Fix sidebar context | Shows decision title on analyze | |
| 💻 Settings placeholder | Page exists | |
| 🔍 Verify middleware | Auth protects routes | |

---

## Phase 1 Milestone

**User can create decision, frame it, add context, and trigger analysis.**

### Checklist
- [ ] Dashboard shows all user's decisions with analysis_status badges
- [ ] "Analyze a Decision" button creates new decision with status='draft'
- [ ] Framing page captures: statement, type, time_horizon, reversibility, stakes, scope
- [ ] Auto-save works on frame and context pages (800ms debounce)
- [ ] Context page allows optional company_context and constraints
- [ ] "Continue to Analysis" creates job and shows progress
- [ ] Scanning page shows animated progress through 7 steps
- [ ] Results page has tabs (placeholders for Phase 2)
- [ ] Navigation flow works end-to-end
- [ ] All routes protected by auth middleware
- [ ] TypeScript compiles without errors
- [ ] No console errors in browser

### Known Limitations (Fixed in Later Phases)
- Analysis is simulated (real AI in Phase 2)
- Results tabs show placeholders (real data in Phase 2)
- No pagination on dashboard (Phase 5)
- No search/filter (Phase 5)
- Settings is placeholder (Phase 5)

---

## Debugging Notes

*Add notes here as you work through this phase:*

```
<!-- Example:
2024-01-20: Slider values not saving
- Issue: Debounce too aggressive
- Fix: Reduced debounce to 800ms

2024-01-21: Progress component not updating
- Issue: useEffect dependency array missing job.status
- Fix: Added job?.status to dependencies
-->
```

---

**Previous Phase:** [01-foundation.md](./01-foundation.md)
**Next Phase:** [03-ai-analysis.md](./03-ai-analysis.md)
