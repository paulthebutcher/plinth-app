# Plinth MVP Build Plan

## Overview

This document provides a detailed, task-level build plan with acceptance criteria, test requirements, and **copy-paste Windsurf prompts** for each section.

**Legend:**
- 🔧 = External setup required (outside codebase)
- 💻 = Code task (Windsurf handles this)

---

## Starting a New Windsurf Session

**Copy and paste this prompt at the beginning of each new Windsurf session:**

```
I'm building Plinth, a strategic decision-quality tool for executives.

Read these files to understand the project:
- docs/README.md (project overview)
- docs/architecture/TECHNICAL_ARCHITECTURE.md (tech stack, database schema)
- docs/planning/BUILD_PLAN.md (this build plan)

I'm currently on [PHASE X.X - SECTION NAME].
Last session I completed: [WHAT YOU FINISHED]
Next I need to: [WHAT YOU'RE WORKING ON]

Let me know when you've read the files and are ready to continue.
```

**Replace the bracketed sections with your actual progress.**

---

## Phase 0: Foundation (Week 1)

**Goal**: Infrastructure ready, authentication working, basic app shell deployed.

### 0.1 Project Setup

**🔧 External Setup (do this first):**

1. **Create GitHub Repository:**
   - Go to github.com → New Repository
   - Name: `plinth-app` (or your preference)
   - Private repository
   - Initialize with README
   - Add `.gitignore` for Node

2. **Set up Vercel Project:**
   - Go to vercel.com → Add New Project
   - Import your GitHub repo
   - Framework Preset: Next.js
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (default)
   - Click Deploy (initial deploy will fail until code exists - that's okay)

3. **Clone and Open in Windsurf:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/plinth-app.git
   cd plinth-app
   ```

**Windsurf Prompt:**
```
Read docs/architecture/FOLDER_STRUCTURE.md and docs/architecture/TECHNICAL_ARCHITECTURE.md.

Initialize a new Next.js 14 project with:
- App Router
- TypeScript (strict mode)
- Tailwind CSS
- shadcn/ui (dark mode)
- ESLint + Prettier

Follow the folder structure in FOLDER_STRUCTURE.md exactly. Create the base directories.
```

| Task | Acceptance Criteria | Tests |
|------|---------------------|-------|
| 🔧 Create GitHub repo | Repo exists with `.gitignore`, `README.md` | N/A |
| 💻 Initialize Next.js 14 (App Router) | `npm run dev` starts successfully | N/A |
| 💻 Add TypeScript config | Strict mode, path aliases work | N/A |
| 💻 Add Tailwind CSS + shadcn/ui | Button component renders correctly | N/A |
| 💻 Add ESLint + Prettier | `npm run lint` passes | N/A |
| 🔧 Set up Vercel project | Preview deploy on push works | N/A |

---

### 0.2 Database Setup

**🔧 External Setup (do this first):**

1. **Create Supabase Project (Staging):**
   - Go to supabase.com → New Project
   - Organization: Create or select one
   - Project name: `plinth-staging`
   - Database password: Generate a strong password (save it!)
   - Region: Choose closest to your users
   - Click Create Project
   - Wait for project to initialize (~2 minutes)

2. **Get Supabase Credentials:**
   - Go to Project Settings → API
   - Copy and save:
     - Project URL (`https://xxxxx.supabase.co`)
     - `anon` public key
     - `service_role` secret key (keep this secure!)

3. **Create `.env.local` file in your project:**
   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
   ```

4. **Add Environment Variables to Vercel:**
   - Go to Vercel → Your Project → Settings → Environment Variables
   - Add each variable above for "Production", "Preview", and "Development"

5. **Install Supabase CLI (for migrations):**
   ```bash
   npm install supabase --save-dev
   npx supabase init
   npx supabase login
   npx supabase link --project-ref YOUR_PROJECT_REF
   ```

6. **Create Production Supabase Project (later, before launch):**
   - Repeat steps 1-4 with name `plinth-production`
   - Keep credentials separate

**Windsurf Prompt:**
```
Read docs/architecture/TECHNICAL_ARCHITECTURE.md, specifically the "Database Schema" section.

Create a Supabase migration file at supabase/migrations/001_initial_schema.sql that creates all tables:
- organizations
- users
- decisions
- options
- evidence
- evidence_options (junction table)
- constraints
- tradeoffs
- stakeholders
- outputs
- competitor_profiles
- jobs
- comments
- invitations

Include all RLS policies from the spec. Use the exact column names and types specified.
```

**🔧 After Windsurf creates the migration:**
```bash
# Push migration to Supabase
npx supabase db push
```

| Task | Acceptance Criteria | Tests |
|------|---------------------|-------|
| 🔧 Create Supabase project (staging) | Project accessible, API keys obtained | N/A |
| 🔧 Create Supabase project (production) | Separate project for prod | N/A |
| 💻 Run schema migrations | All tables exist per TECHNICAL_ARCHITECTURE.md | N/A |
| 💻 Enable RLS on all tables | RLS enabled, policies created | Integration: verify org isolation |
| 💻 Create test data seed script | Can populate dev database with sample data | N/A |

---

### 0.3 Authentication

**🔧 External Setup (do this first):**

1. **Configure Supabase Auth Settings:**
   - Go to Supabase Dashboard → Authentication → Providers
   - Email provider should be enabled by default
   - Click on Email and configure:
     - Enable "Confirm email" (recommended for production)
     - For development, you can disable to skip email verification

2. **Configure Auth URLs:**
   - Go to Authentication → URL Configuration
   - Site URL: `http://localhost:3000` (dev) or `https://myplinth.com` (prod)
   - Redirect URLs: Add these:
     - `http://localhost:3000/**`
     - `https://your-app.vercel.app/**`
     - `https://myplinth.com/**` (add later)

3. **Customize Email Templates (optional but recommended):**
   - Go to Authentication → Email Templates
   - Customize: Confirm signup, Reset password, Magic link
   - Update branding to match Plinth

4. **Add Auth Environment Variables:**
   Your `.env.local` should now have:
   ```env
   # Supabase (already added)
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...

   # App
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

**Windsurf Prompt:**
```
Read docs/specs/AUTH_PERMISSIONS.md for the complete auth specification.
Read docs/specs/API_CONTRACTS.md for the auth-related API endpoints.

Create the authentication system:
1. app/(auth)/login/page.tsx - Login form with email/password
2. app/(auth)/signup/page.tsx - Signup form
3. app/(auth)/forgot-password/page.tsx - Password reset request
4. app/(auth)/reset-password/page.tsx - Password reset form
5. lib/supabase/client.ts - Supabase client setup
6. lib/supabase/server.ts - Server-side Supabase client
7. middleware.ts - Auth middleware for protected routes

Use Supabase Auth. After signup, automatically create an organization for the user.
Follow the flows described in AUTH_PERMISSIONS.md exactly.
```

| Task | Acceptance Criteria | Tests |
|------|---------------------|-------|
| 💻 Implement signup flow | User can register, lands on dashboard | E2E: complete signup |
| 💻 Implement login flow | User can login, session persists | E2E: login with valid/invalid credentials |
| 💻 Implement logout | Session cleared, redirect to login | E2E: logout flow |
| 💻 Implement password reset | Email sent, password can be reset | Integration: reset token generation |
| 💻 Create auth middleware | Protected routes redirect unauthenticated | Integration: auth middleware |
| 💻 Create org creation trigger | New user gets org automatically | Integration: user + org creation |

**Phase 0 Milestone**: User can sign up, log in, see empty dashboard.

---

## Phase 1: Core Decision Engine (Weeks 2-4)

**Goal**: Full decision workflow functional without AI features.

### 1.1 Decision CRUD (Week 2)

**Windsurf Prompt:**
```
Read these files:
- docs/specs/DECISION_FLOW.md (core decision workflow)
- docs/specs/API_CONTRACTS.md (Decisions API section)
- docs/specs/UI_PATTERNS.md (design system)

Create the decision list and creation flow:
1. app/(dashboard)/dashboard/page.tsx - Dashboard with decision list
2. components/decisions/decision-card.tsx - Card showing title, status, quality score
3. components/decisions/new-decision-modal.tsx - Modal for creating new decision
4. app/api/decisions/route.ts - GET (list) and POST (create) endpoints
5. app/(dashboard)/decisions/[id]/page.tsx - Decision canvas page (shell for now)

Follow the API contracts exactly. Use shadcn/ui components with dark theme.
```

| Task | Acceptance Criteria | Tests |
|------|---------------------|-------|
| 💻 Decision list page | Shows user's decisions, pagination works | Component: list rendering |
| 💻 Decision card component | Shows title, status, quality score, owner | Component: card states |
| 💻 New decision modal | Template selection, title input | Component: modal flow |
| 💻 Create decision API | POST creates decision with template | Integration: API validation |
| 💻 Decision canvas page | Route `/decisions/[id]` works | E2E: navigate to decision |
| 💻 Decision header | Edit title inline, status badge | Component: inline editing |
| 💻 Delete decision | Soft delete with confirmation | E2E: delete flow |

---

### 1.2 Template System (Week 2)

**Windsurf Prompt:**
```
Read docs/specs/DECISION_TEMPLATES.md for the complete template specification.

Create the template system:
1. lib/templates/index.ts - Export all templates
2. lib/templates/build-vs-buy.ts - Build vs Buy template
3. lib/templates/market-entry.ts - Market Entry template
4. lib/templates/investment.ts - Investment Decision template
5. lib/templates/product-prioritization.ts - Product Prioritization template
6. lib/templates/custom.ts - Custom template (minimal)
7. components/decisions/template-selector.tsx - UI for selecting template

Each template should match the structure in DECISION_TEMPLATES.md exactly, including:
- Framing prompts
- Suggested options
- Default constraints
- Stakeholder roles
- Evidence prompts
- AI context
```

| Task | Acceptance Criteria | Tests |
|------|---------------------|-------|
| 💻 Template selector UI | 4 templates + custom displayed | Component: selector |
| 💻 Template application | Selected template pre-populates content | Integration: template application |
| 💻 Template context injection | AI context stored in decision metadata | Unit: template loading |

---

### 1.3 Options Section (Week 2-3)

**Windsurf Prompt:**
```
Read these files:
- docs/specs/DECISION_FLOW.md (Options section)
- docs/specs/API_CONTRACTS.md (Options API)
- docs/architecture/TECHNICAL_ARCHITECTURE.md (options table schema)

Create the options section of the decision canvas:
1. components/canvas/options-section.tsx - Container for options
2. components/canvas/option-card.tsx - Individual option display
3. components/canvas/option-form.tsx - Add/edit option form
4. components/canvas/pros-cons-list.tsx - Editable pros/cons
5. components/canvas/risks-list.tsx - Editable risks
6. app/api/decisions/[id]/options/route.ts - CRUD endpoints
7. app/api/decisions/[id]/options/[optionId]/route.ts - Single option endpoints

Options should display as expandable cards. Pros/cons/risks are inline editable.
Use the exact API request/response shapes from API_CONTRACTS.md.
```

| Task | Acceptance Criteria | Tests |
|------|---------------------|-------|
| 💻 Options list UI | Displays options as cards | Component: list rendering |
| 💻 Add option form | Title, description inputs | Component: form validation |
| 💻 Create option API | POST creates option linked to decision | Integration: API + DB |
| 💻 Edit option inline | Title/description editable | Component: inline editing |
| 💻 Pros/cons editing | Add, edit, delete pros/cons | Component: list management |
| 💻 Risks editing | Add, edit, delete risks | Component: list management |
| 💻 Delete option | Remove with confirmation | E2E: delete flow |
| 💻 Reorder options | Drag-drop reordering | Integration: order persistence |

---

### 1.4 Evidence Section (Week 3)

**Windsurf Prompt:**
```
Read these files:
- docs/specs/DECISION_FLOW.md (Evidence section)
- docs/specs/EVIDENCE_ENGINE.md (evidence types and sources)
- docs/specs/API_CONTRACTS.md (Evidence API)
- docs/architecture/TECHNICAL_ARCHITECTURE.md (evidence + evidence_options tables)

Create the evidence section:
1. components/canvas/evidence-section.tsx - Container for evidence
2. components/canvas/evidence-card.tsx - Individual evidence display
3. components/canvas/evidence-form.tsx - Add evidence form with option linking
4. components/canvas/option-link-selector.tsx - Multi-select for linking to options
5. app/api/decisions/[id]/evidence/route.ts - CRUD endpoints
6. app/api/decisions/[id]/evidence/[evidenceId]/route.ts - Single evidence endpoints

IMPORTANT: Evidence can link to MULTIPLE options via the evidence_options junction table.
Each link has a relationship: "supports", "challenges", or "neutral".
Follow API_CONTRACTS.md for the exact request/response shapes.
```

| Task | Acceptance Criteria | Tests |
|------|---------------------|-------|
| 💻 Evidence list UI | Displays evidence items | Component: list rendering |
| 💻 Add evidence form | Claim, source, type, strength fields | Component: form validation |
| 💻 Create evidence API | POST creates evidence with option links | Integration: API + junction table |
| 💻 Evidence-option linking UI | Select multiple options, set relationship | Component: multi-select |
| 💻 Edit evidence | All fields editable | Component: editing |
| 💻 Delete evidence | Remove (cascades links) | Integration: cascade delete |
| 💻 Evidence strength indicator | Visual indicator for strength | Component: strength display |

---

### 1.5 Constraints Section (Week 3)

**Windsurf Prompt:**
```
Read these files:
- docs/specs/DECISION_FLOW.md (Constraints section)
- docs/specs/API_CONTRACTS.md (Constraints API)

Create the constraints section:
1. components/canvas/constraints-section.tsx - Container grouped by category
2. components/canvas/constraint-card.tsx - Individual constraint
3. components/canvas/constraint-form.tsx - Add/edit form
4. app/api/decisions/[id]/constraints/route.ts - CRUD endpoints

Categories: legal, technical, budget, timeline, brand, org, other
Severity: hard (must satisfy) or soft (prefer to satisfy)
Hard constraints should have distinct visual styling (e.g., red border).
```

| Task | Acceptance Criteria | Tests |
|------|---------------------|-------|
| 💻 Constraints list UI | Displays by category | Component: grouped list |
| 💻 Add constraint form | Category, description, severity | Component: form |
| 💻 Create constraint API | POST creates constraint | Integration: API |
| 💻 Edit/delete constraint | CRUD complete | Integration: CRUD |
| 💻 Hard vs soft visual | Different styling for severity | Component: styling |

---

### 1.6 Tradeoffs Section (Week 3-4)

**Windsurf Prompt:**
```
Read these files:
- docs/specs/DECISION_FLOW.md (Tradeoffs section)
- docs/specs/API_CONTRACTS.md (Tradeoffs API)

Create the tradeoffs section:
1. components/canvas/tradeoffs-section.tsx - Container with progress indicator
2. components/canvas/tradeoff-card.tsx - Shows "Give up X to get Y"
3. components/canvas/tradeoff-form.tsx - Form with option selector
4. app/api/decisions/[id]/tradeoffs/route.ts - CRUD endpoints

Each tradeoff must be acknowledged before generating a brief.
Show progress: "3 of 5 tradeoffs acknowledged"
```

| Task | Acceptance Criteria | Tests |
|------|---------------------|-------|
| 💻 Tradeoffs list UI | Shows "give up X to get Y" | Component: list |
| 💻 Add tradeoff form | Option selector, gives/gets fields | Component: form |
| 💻 Create tradeoff API | POST creates linked to option | Integration: API |
| 💻 Acknowledge tradeoff | Toggle acknowledgment | Component: toggle |
| 💻 Tradeoff progress | Shows acknowledged vs total | Component: progress |

---

### 1.7 Stakeholders Section (Week 4)

**Windsurf Prompt:**
```
Read these files:
- docs/specs/DECISION_FLOW.md (Stakeholders section)
- docs/specs/API_CONTRACTS.md (Stakeholders API)

Create the stakeholders section:
1. components/canvas/stakeholders-section.tsx - Container
2. components/canvas/stakeholder-card.tsx - Name, role, stance, concerns
3. components/canvas/stakeholder-form.tsx - Add/edit form
4. app/api/decisions/[id]/stakeholders/route.ts - CRUD endpoints

Stance should be visually distinct:
- supportive = green
- neutral = gray
- skeptical = orange
- unknown = gray dashed
```

| Task | Acceptance Criteria | Tests |
|------|---------------------|-------|
| 💻 Stakeholders list UI | Name, role, stance display | Component: list |
| 💻 Add stakeholder form | All fields | Component: form |
| 💻 Stakeholder CRUD API | Full CRUD | Integration: API |
| 💻 Stance indicator | Visual for supportive/neutral/skeptical | Component: styling |

---

### 1.8 Recommendation Section (Week 4)

**Windsurf Prompt:**
```
Read these files:
- docs/specs/DECISION_FLOW.md (Recommendation section)
- docs/specs/API_CONTRACTS.md (update decision endpoint)

Create the recommendation section:
1. components/canvas/recommendation-section.tsx - Full recommendation UI
2. components/canvas/option-selector.tsx - Select recommended option
3. components/canvas/confidence-slider.tsx - 0-100 with labels
4. Update app/api/decisions/[id]/route.ts - PATCH to save recommendation

Confidence levels per spec:
- 90-100: Very High
- 70-89: High
- 50-69: Moderate
- 30-49: Low
- 0-29: Very Low

Include fields: recommended_option_id, confidence_score, confidence_rationale,
recommendation_rationale, reversal_conditions
```

| Task | Acceptance Criteria | Tests |
|------|---------------------|-------|
| 💻 Recommendation selector | Pick from options | Component: selector |
| 💻 Confidence slider | 0-100 with rationale | Component: slider |
| 💻 Rationale input | Rich text for rationale | Component: input |
| 💻 Reversal conditions | Input for conditions | Component: input |
| 💻 Save recommendation API | PATCH decision with recommendation | Integration: API |

---

### 1.9 Quality Score (Week 4)

**Windsurf Prompt:**
```
Read docs/specs/DECISION_FLOW.md, specifically the "Quality Score" section.

Create the quality score system:
1. lib/utils/quality-score.ts - Calculation function
2. components/canvas/quality-sidebar.tsx - Visual progress by section
3. components/canvas/section-status.tsx - Completion indicator per section
4. app/api/decisions/[id]/quality/route.ts - GET endpoint

Scoring (total 100%):
- Decision Frame: 10%
- Options (2+ with pros/cons): 20%
- Evidence (3+ items): 20%
- Constraints (1+ defined): 15%
- Tradeoffs (all acknowledged): 20%
- Recommendation (with confidence + rationale): 15%

Must reach 80% to generate brief.
```

| Task | Acceptance Criteria | Tests |
|------|---------------------|-------|
| 💻 Quality score calculation | Matches spec (weights above) | Unit: calculation logic |
| 💻 Progress sidebar | Visual progress by section | Component: sidebar |
| 💻 Section completion check | Checks per DECISION_FLOW.md | Unit: completion rules |
| 💻 Quality score API | GET returns calculated score | Integration: API |

**Phase 1 Milestone**: User can create decision, add all content, see quality score. No AI yet.

---

## Phase 2: AI Analysis (Weeks 5-6)

**Goal**: Competitor profiles and option analysis working.

### 2.1 Background Jobs Infrastructure (Week 5)

**🔧 External Setup (do this first):**

1. **Create Inngest Account:**
   - Go to inngest.com → Sign up
   - Create a new app (e.g., "plinth-app")
   - Note your Event Key and Signing Key

2. **Add Inngest Environment Variables:**
   Add to `.env.local`:
   ```env
   INNGEST_EVENT_KEY=your-event-key
   INNGEST_SIGNING_KEY=your-signing-key
   ```

3. **Add to Vercel Environment Variables:**
   - Add both keys to Vercel for all environments

4. **Install Inngest Dev Server (for local development):**
   ```bash
   npm install inngest
   npx inngest-cli@latest dev
   ```
   This runs a local Inngest server at `http://localhost:8288`

**Windsurf Prompt:**
```
Read these files:
- docs/specs/ASYNC_JOBS.md (complete job system specification)
- docs/specs/API_CONTRACTS.md (Jobs API section)
- docs/architecture/TECHNICAL_ARCHITECTURE.md (jobs table)

Create the background job infrastructure:
1. lib/inngest/client.ts - Inngest client setup
2. lib/inngest/functions/index.ts - Export all functions
3. app/api/inngest/route.ts - Inngest webhook handler
4. app/api/jobs/route.ts - Create job endpoint
5. app/api/jobs/[jobId]/route.ts - Get/cancel job endpoints
6. hooks/use-job-polling.ts - React hook for polling job status
7. components/jobs/job-progress-modal.tsx - Progress display UI

Follow the polling strategy in ASYNC_JOBS.md (2-3 second intervals).
```

| Task | Acceptance Criteria | Tests |
|------|---------------------|-------|
| 🔧 Set up Inngest | Local dev working, events firing | Integration: event dispatch |
| 💻 Jobs table + API | Create, read, poll jobs | Integration: CRUD |
| 💻 Job progress polling | Frontend polls, updates UI | Component: polling hook |
| 💻 Job cancellation | Cancel pending/running jobs | Integration: cancellation |

---

### 2.2 Competitor Analysis (Week 5)

**🔧 External Setup (do this first):**

1. **Get OpenAI API Key:**
   - Go to platform.openai.com → API Keys
   - Create new secret key
   - Add to `.env.local`:
     ```env
     OPENAI_API_KEY=sk-...
     ```

2. **Get Firecrawl API Key:**
   - Go to firecrawl.dev → Sign up
   - Get API key from dashboard
   - Add to `.env.local`:
     ```env
     FIRECRAWL_API_KEY=fc-...
     ```

3. **Get Exa API Key:**
   - Go to exa.ai → Sign up
   - Get API key from dashboard
   - Add to `.env.local`:
     ```env
     EXA_API_KEY=...
     ```

4. **Add all to Vercel Environment Variables**

**Windsurf Prompt:**
```
Read these files:
- docs/specs/COMPETITOR_PROFILES.md (profile structure)
- docs/specs/EVIDENCE_ENGINE.md (Firecrawl, Exa integration)
- docs/specs/AI_PROMPTS.md (generate-competitor-profile prompt)
- docs/specs/ASYNC_JOBS.md (job flow)

Create competitor analysis feature:
1. components/canvas/analyze-competitor-form.tsx - Input company name/URL
2. lib/inngest/functions/competitor-analysis.ts - Background job
3. lib/services/firecrawl.ts - Website scraping
4. lib/services/exa.ts - News/content search
5. lib/ai/prompts/competitor-profile.ts - Prompt from AI_PROMPTS.md
6. components/competitors/competitor-profile-view.tsx - Display profile
7. app/api/decisions/[id]/competitors/route.ts - CRUD endpoints

Use the exact prompt and output schema from AI_PROMPTS.md.
Store generated profile in competitor_profiles table.
```

| Task | Acceptance Criteria | Tests |
|------|---------------------|-------|
| 💻 "Analyze Competitor" UI | Button, input for company name/URL | Component: form |
| 💻 Create competitor job API | Triggers Inngest function | Integration: job creation |
| 💻 Firecrawl integration | Scrapes company website | Integration: mock Firecrawl |
| 💻 Exa integration | Searches for company news | Integration: mock Exa |
| 💻 Competitor profile prompt | Generates structured profile | Unit: prompt formatting |
| 💻 Save competitor profile | Stores in database | Integration: save flow |
| 💻 Competitor profile view | Display all sections | Component: profile view |
| 💻 Refresh stale profile | Re-run after 14+ days | Integration: refresh flow |

---

### 2.3 Option Analysis (Week 5-6)

**Windsurf Prompt:**
```
Read these files:
- docs/specs/AI_PROMPTS.md (analyze-option prompt)
- docs/specs/API_CONTRACTS.md (AI API section)

Create option AI analysis:
1. components/canvas/analyze-option-button.tsx - Trigger analysis
2. lib/ai/prompts/analyze-option.ts - Prompt from AI_PROMPTS.md
3. app/api/ai/analyze-option/route.ts - Streaming endpoint
4. components/canvas/ai-analysis-display.tsx - Show AI-generated pros/cons/risks
5. hooks/use-ai-stream.ts - Hook for streaming responses

Use Vercel AI SDK for streaming. Store result in options.ai_analysis JSONB field.
Display AI analysis alongside (not replacing) user-entered content.
```

| Task | Acceptance Criteria | Tests |
|------|---------------------|-------|
| 💻 "Analyze" button on option | Triggers AI analysis | Component: button state |
| 💻 Analyze option prompt | Generates pros/cons/risks | Unit: prompt |
| 💻 Stream AI response | Real-time display during generation | Component: streaming |
| 💻 Save AI analysis | Stores in option.ai_analysis | Integration: save |
| 💻 Display AI analysis | Shows alongside manual content | Component: display |
| 💻 Re-analyze option | Can trigger fresh analysis | Integration: re-run |

---

### 2.4 Option Comparison (Week 6)

**Windsurf Prompt:**
```
Read docs/specs/AI_PROMPTS.md (compare-options prompt).

Create option comparison feature:
1. components/canvas/compare-options-button.tsx - Button (disabled if <2 options)
2. lib/ai/prompts/compare-options.ts - Prompt from AI_PROMPTS.md
3. app/api/ai/compare-options/route.ts - Streaming endpoint
4. components/canvas/comparison-modal.tsx - Side-by-side comparison view

Show comparison across dimensions from the prompt output schema.
```

| Task | Acceptance Criteria | Tests |
|------|---------------------|-------|
| 💻 Compare options button | Available with 2+ options | Component: button |
| 💻 Compare options prompt | Structured comparison output | Unit: prompt |
| 💻 Comparison view modal | Side-by-side comparison | Component: modal |

---

### 2.5 Suggest Options (Week 6)

**Windsurf Prompt:**
```
Read docs/specs/AI_PROMPTS.md (suggest-options prompt).

Create suggest options feature:
1. components/canvas/suggest-options-button.tsx - Button in options section
2. lib/ai/prompts/suggest-options.ts - Prompt from AI_PROMPTS.md
3. app/api/ai/suggest-options/route.ts - Endpoint
4. components/canvas/suggested-option-card.tsx - Preview with "Add" button

When user clicks "Add", create a real option from the suggestion.
```

| Task | Acceptance Criteria | Tests |
|------|---------------------|-------|
| 💻 "Suggest Options" button | Triggers AI suggestion | Component: button |
| 💻 Suggest options prompt | Returns 1-3 suggestions | Unit: prompt |
| 💻 Add suggested option | User can add to decision | Component: add flow |

---

### 2.6 Other AI Features (Week 6)

**Windsurf Prompt:**
```
Read docs/specs/AI_PROMPTS.md for these prompts:
- suggest-constraints (section 3.4)
- suggest-stakeholders (section 3.5)
- surface-tradeoffs (section 4.1)
- identify-gaps (section 7.1)

Create these AI assistance features:
1. components/canvas/suggest-constraints-button.tsx
2. components/canvas/suggest-stakeholders-button.tsx
3. components/canvas/surface-tradeoffs-button.tsx
4. components/canvas/identify-gaps-button.tsx
5. Corresponding API routes in app/api/ai/
6. lib/ai/prompts/ files for each

Each should show suggestions that user can accept/dismiss.
```

| Task | Acceptance Criteria | Tests |
|------|---------------------|-------|
| 💻 Suggest constraints | AI suggests missing constraints | Integration: flow |
| 💻 Suggest stakeholders | AI suggests missing stakeholders | Integration: flow |
| 💻 Surface tradeoffs | AI identifies implicit tradeoffs | Integration: flow |
| 💻 Identify gaps | AI shows what's missing | Integration: flow |

**Phase 2 Milestone**: AI features fully functional. Competitor profiles generate. Options analyzable.

---

## Phase 3: Outputs (Week 7)

**Goal**: Decision briefs generate and can be shared.

### 3.1 Brief Generation (Week 7)

**Windsurf Prompt:**
```
Read these files:
- docs/specs/DECISION_FLOW.md (Output Generation section)
- docs/specs/AI_PROMPTS.md (generate-brief prompt, section 6.1)
- docs/specs/API_CONTRACTS.md (Outputs API)
- docs/specs/ASYNC_JOBS.md (brief generation job)

Create brief generation:
1. components/canvas/generate-brief-button.tsx - Disabled if quality <80%
2. components/canvas/incomplete-decision-modal.tsx - Shows what's missing
3. lib/inngest/functions/brief-generation.ts - Background job
4. lib/ai/prompts/generate-brief.ts - Prompt from AI_PROMPTS.md
5. app/api/decisions/[id]/outputs/route.ts - Create/list outputs
6. components/outputs/brief-preview-modal.tsx - Render markdown preview

Store generated content in outputs table with status tracking.
```

| Task | Acceptance Criteria | Tests |
|------|---------------------|-------|
| 💻 "Generate Brief" button | Visible when quality ≥80% | Component: conditional |
| 💻 Block if incomplete | Modal showing missing items | Component: validation |
| 💻 Generate brief job | Creates output, runs AI | Integration: job flow |
| 💻 Brief generation prompt | Full prompt from AI_PROMPTS.md | Unit: prompt |
| 💻 Save brief content | Stores markdown in outputs table | Integration: save |
| 💻 Brief preview | Render markdown in modal | Component: preview |

---

### 3.2 Brief Editing (Week 7)

**Windsurf Prompt:**
```
Read docs/specs/API_CONTRACTS.md (Outputs API - PATCH endpoint).

Create brief editing:
1. components/outputs/brief-editor.tsx - Markdown editor
2. app/api/decisions/[id]/outputs/[outputId]/route.ts - PATCH endpoint

Track if brief has been edited (compare content with original).
Show "Edited" badge if modified.
```

| Task | Acceptance Criteria | Tests |
|------|---------------------|-------|
| 💻 Edit brief content | Rich text/markdown editor | Component: editor |
| 💻 Save edits | PATCH updates content | Integration: save |
| 💻 Version note | Shows "Edited" if modified | Component: indicator |

---

### 3.3 Brief Sharing (Week 7)

**Windsurf Prompt:**
```
Read docs/specs/API_CONTRACTS.md (Public Share API section).

Create sharing functionality:
1. components/outputs/share-toggle.tsx - Enable/disable sharing
2. components/outputs/copy-link-button.tsx - Copy share URL
3. app/api/decisions/[id]/outputs/[outputId]/share/route.ts - Toggle sharing
4. app/(public)/share/[key]/page.tsx - Public share page (no auth required)

Generate unique share_key when sharing is enabled.
Public page should be read-only, nicely formatted.
```

| Task | Acceptance Criteria | Tests |
|------|---------------------|-------|
| 💻 Share toggle | Enable/disable sharing | Component: toggle |
| 💻 Generate share URL | Creates unique share_key | Integration: key generation |
| 💻 Public share page | `/share/[key]` shows brief | E2E: share flow |
| 💻 Copy link button | Copies URL to clipboard | Component: copy |
| 💻 Revoke sharing | Removes share_key | Integration: revoke |

---

### 3.4 PDF Export (Week 7)

**Windsurf Prompt:**
```
Create PDF export functionality:
1. components/outputs/export-pdf-button.tsx - Trigger export
2. lib/pdf/generate-brief-pdf.ts - PDF generation using @react-pdf/renderer
3. app/api/decisions/[id]/outputs/[outputId]/pdf/route.ts - Generate and return PDF

PDF should be cleanly formatted, branded with Plinth logo.
Match the brief structure from the generate-brief prompt output.
```

| Task | Acceptance Criteria | Tests |
|------|---------------------|-------|
| 💻 Export to PDF button | Triggers PDF generation | Component: button |
| 💻 PDF generation | Clean, branded PDF output | Integration: PDF library |
| 💻 PDF download | Browser downloads file | E2E: download |

**Phase 3 Milestone**: Briefs generate, preview, edit, share, export to PDF.

---

## Phase 4: Team & Polish (Weeks 8-9)

**Goal**: Multi-user collaboration, UX refinement, production readiness.

### 4.1 Team Management (Week 8)

**🔧 External Setup (do this first):**

1. **Create Resend Account:**
   - Go to resend.com → Sign up
   - Get API key from dashboard
   - Add to `.env.local`:
     ```env
     RESEND_API_KEY=re_...
     ```

2. **Verify Email Domain (recommended for production):**
   - Go to Resend → Domains → Add Domain
   - Add your domain (e.g., `myplinth.com`)
   - Add the DNS records Resend provides
   - Wait for verification (can take a few hours)
   - For development, you can use Resend's test domain

3. **Add to Vercel Environment Variables**

**Windsurf Prompt:**
```
Read these files:
- docs/specs/AUTH_PERMISSIONS.md (invite flow, roles)
- docs/specs/API_CONTRACTS.md (Organizations API)

Create team management:
1. app/(dashboard)/settings/team/page.tsx - Team settings page
2. components/settings/member-list.tsx - List members with roles
3. components/settings/invite-member-modal.tsx - Invite form
4. lib/email/invitation.ts - Email template using Resend
5. app/(auth)/invite/[token]/page.tsx - Accept invitation page
6. app/api/organizations/members/route.ts - List/invite members
7. app/api/organizations/members/[id]/route.ts - Update/remove member
8. app/api/invitations/[token]/accept/route.ts - Accept invitation

Roles: admin, member, viewer (per AUTH_PERMISSIONS.md)
```

| Task | Acceptance Criteria | Tests |
|------|---------------------|-------|
| 💻 Team settings page | List members, roles | Component: list |
| 💻 Invite member flow | Email input, role select, send | E2E: invite flow |
| 💻 Invitation email | Sends via Resend | Integration: email |
| 💻 Accept invitation | Joins org, lands on dashboard | E2E: accept flow |
| 💻 Remove member | Admin can remove (not self) | Integration: removal |
| 💻 Change role | Admin can change member role | Integration: role change |

---

### 4.2 Comments (Week 8)

**Windsurf Prompt:**
```
Read docs/specs/API_CONTRACTS.md (Comments API section).

Create commenting system:
1. components/canvas/comments-panel.tsx - Collapsible sidebar
2. components/canvas/comment-thread.tsx - Threaded display
3. components/canvas/comment-form.tsx - Add comment input
4. components/canvas/comment-target-indicator.tsx - Show what comment targets
5. app/api/decisions/[id]/comments/route.ts - CRUD endpoints

Comments can target: decision, option, evidence, tradeoff, constraint
Support threaded replies via parent_id.
```

| Task | Acceptance Criteria | Tests |
|------|---------------------|-------|
| 💻 Comments panel | Collapsible sidebar/panel | Component: panel |
| 💻 Add comment | Text input, submit | Component: form |
| 💻 Reply to comment | Threaded replies | Component: threading |
| 💻 Delete comment | Author/admin can delete | Integration: delete |
| 💻 Comment on element | Target specific option/evidence | Component: targeting |

---

### 4.3 Onboarding (Week 8)

**Windsurf Prompt:**
```
Read docs/specs/ONBOARDING.md for the complete onboarding flow.

Create onboarding experience:
1. components/onboarding/welcome-screen.tsx - Post-signup welcome
2. components/onboarding/org-setup-form.tsx - Name org, select role
3. components/onboarding/first-decision-guide.tsx - Guided creation
4. components/onboarding/feature-tour.tsx - Tooltip tour
5. lib/utils/onboarding-state.ts - Track completion in user metadata

5 steps per spec:
1. Welcome
2. Organization setup
3. Select template
4. Add first option
5. Activation (complete first decision OR view example)
```

| Task | Acceptance Criteria | Tests |
|------|---------------------|-------|
| 💻 Welcome screen | Post-signup welcome | Component: screen |
| 💻 Org setup screen | Name org, select role | Component: form |
| 💻 First decision guided | Walk through creating first decision | E2E: onboarding flow |
| 💻 Feature tour | Tooltip tour of canvas | Component: tour |
| 💻 Track onboarding state | Store completion in user metadata | Integration: state |

---

### 4.4 UI Polish (Week 8-9)

**Windsurf Prompt:**
```
Read these files:
- docs/specs/ERROR_STATES.md (error handling patterns)
- docs/specs/UI_PATTERNS.md (design system)

Polish the UI across the app:
1. Add empty states to all list components (per ERROR_STATES.md)
2. Add skeleton loading states to all pages
3. Implement toast notifications for success/error
4. Verify dark mode works everywhere
5. Add keyboard shortcuts for common actions
6. Test and fix responsive layout for tablet

Create reusable components:
- components/ui/empty-state.tsx
- components/ui/skeleton-*.tsx (for each page type)
- components/ui/error-boundary.tsx
```

| Task | Acceptance Criteria | Tests |
|------|---------------------|-------|
| 💻 Empty states | All sections have helpful empty states | Component: empty states |
| 💻 Loading skeletons | All pages have skeleton loading | Component: skeletons |
| 💻 Error handling | User-friendly error messages | Component: error states |
| 💻 Responsive design | Works on tablet (mobile deprioritized) | Manual: responsive check |
| 💻 Keyboard navigation | Tab order, shortcuts | Manual: keyboard check |
| 💻 Dark mode native | Dark theme applied | Component: theme |

---

### 4.5 Performance & Monitoring (Week 9)

**🔧 External Setup (do this first):**

1. **Create Sentry Account:**
   - Go to sentry.io → Sign up
   - Create a new project (Next.js)
   - Get your DSN
   - Add to `.env.local`:
     ```env
     NEXT_PUBLIC_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
     SENTRY_AUTH_TOKEN=sntrys_...  # For source maps
     ```

2. **Enable Vercel Analytics:**
   - Go to Vercel → Your Project → Analytics tab
   - Click "Enable"
   - Analytics will start collecting automatically

3. **Add Sentry to Vercel Environment Variables**

**Windsurf Prompt:**
```
Read docs/specs/TESTING_STRATEGY.md for testing approach.

Set up monitoring and optimize performance:
1. Set up Sentry for error tracking (lib/sentry.ts)
2. Add Vercel Analytics
3. Review and optimize database queries (check for N+1)
4. Configure React Query caching appropriately
5. Run Lighthouse audit and fix issues

Create:
- lib/sentry.ts - Sentry initialization
- instrumentation.ts - Next.js instrumentation file
```

| Task | Acceptance Criteria | Tests |
|------|---------------------|-------|
| 🔧 Set up Sentry | Errors reported | Integration: error capture |
| 🔧 Set up Vercel Analytics | Page views tracked | N/A |
| 💻 Optimize queries | N+1 queries fixed | Integration: query count |
| 💻 Add caching | React Query caching tuned | Manual: cache behavior |
| 💻 Lighthouse audit | Score >80 on all categories | Manual: Lighthouse |

---

### 4.6 Production Readiness (Week 9)

**🔧 External Setup:**

1. **Enable Supabase Point-in-Time Recovery (PITR):**
   - Go to Supabase Dashboard → Database → Backups
   - Enable PITR (requires Pro plan - $25/month)
   - This enables recovery to any point in time

2. **Create Production Supabase Project (if not done):**
   - Create separate `plinth-production` project
   - Run migrations: `npx supabase db push`
   - Update Vercel production environment variables

3. **Configure Environment Variables in Vercel:**
   - Ensure all variables have correct values for each environment:
     - Development: Local/staging values
     - Preview: Staging values
     - Production: Production values

4. **Review API Key Permissions:**
   - OpenAI: Set spending limits
   - Firecrawl: Check usage limits
   - Resend: Verify sending limits

**Windsurf Prompt:**
```
Read docs/specs/SECURITY.md for security requirements.

Prepare for production:
1. Set up environment variables properly (staging vs prod)
2. Enable Supabase PITR (Point-in-Time Recovery)
3. Implement rate limiting per SECURITY.md
4. Add security headers (CSP, HSTS, etc.)
5. Create /privacy and /terms pages

Create:
- middleware.ts updates for security headers
- app/(public)/privacy/page.tsx
- app/(public)/terms/page.tsx
```

| Task | Acceptance Criteria | Tests |
|------|---------------------|-------|
| 🔧 Environment config | Staging vs prod separated | N/A |
| 🔧 Database backups | Supabase PITR enabled | N/A |
| 💻 Rate limiting | Implemented per SECURITY.md | Integration: rate limits |
| 💻 Security headers | CSP, HSTS, etc. configured | Manual: security check |
| 💻 Privacy policy page | `/privacy` exists | N/A |
| 💻 Terms of service page | `/terms` exists | N/A |

**Phase 4 Milestone**: App production-ready. Multi-user works. Polish complete.

---

## Phase 5: Launch (Week 10)

**Goal**: First customers onboarded, critical bugs fixed.

### 5.1 Launch Prep

**🔧 External Setup:**

1. **Configure Custom Domain in Vercel:**
   - Go to Vercel → Your Project → Settings → Domains
   - Add `myplinth.com`
   - Vercel will show required DNS records

2. **Update DNS Records (at your registrar):**
   - Add `A` record: `76.76.21.21` (or Vercel's current IP)
   - Add `CNAME` record: `cname.vercel-dns.com` for `www`
   - Wait for DNS propagation (up to 48 hours, usually minutes)

3. **Update Supabase Auth Redirect URLs:**
   - Go to Supabase → Authentication → URL Configuration
   - Add `https://myplinth.com/**` to Redirect URLs
   - Update Site URL to `https://myplinth.com`

4. **Update Environment Variables:**
   - Update `NEXT_PUBLIC_APP_URL` to `https://myplinth.com`

5. **Verify SSL Certificate:**
   - Vercel auto-provisions SSL
   - Visit `https://myplinth.com` to verify

6. **Test Email Delivery:**
   - Ensure Resend domain is verified
   - Send test invitation email

**Windsurf Prompt:**
```
Final launch preparations:
1. Run full E2E test suite
2. Set up domain (myplinth.com) in Vercel
3. Verify SSL certificate
4. Deploy main branch to production
5. Verify Sentry and analytics are receiving data
6. Create a demo account with seeded example decision

Test all critical paths manually:
- Signup → Dashboard
- Create decision → Add content → Generate brief
- Share brief → View public link
- Invite member → Accept → Access shared decision
```

| Task | Acceptance Criteria | Tests |
|------|---------------------|-------|
| 💻 Final QA pass | All P0 flows work | E2E: full regression |
| 🔧 Domain setup | myplinth.com points to Vercel | N/A |
| 🔧 SSL verified | HTTPS works, no warnings | Manual: SSL check |
| 🔧 Production deploy | `main` branch live | N/A |
| 🔧 Monitoring verified | Sentry receiving, analytics working | Manual: verify |

---

### 5.2 First Customers

| Task | Acceptance Criteria | Tests |
|------|---------------------|-------|
| 💻 Create demo account | seeded with example decision | N/A |
| 🔧 Onboard 3-5 users | Real users complete first decision | N/A |
| 🔧 Collect feedback | Document issues, improvements | N/A |
| 💻 Fix critical bugs | P0 bugs fixed within 24h | N/A |

**Launch Milestone**: App live, first customers using it.

---

## Environment Variables Summary

Here's a complete list of all environment variables needed:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000  # or https://myplinth.com

# AI Services
OPENAI_API_KEY=sk-...

# Research Services
FIRECRAWL_API_KEY=fc-...
EXA_API_KEY=...

# Background Jobs
INNGEST_EVENT_KEY=...
INNGEST_SIGNING_KEY=...

# Email
RESEND_API_KEY=re_...

# Monitoring
NEXT_PUBLIC_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
SENTRY_AUTH_TOKEN=sntrys_...
```

---

## Test Coverage Summary

### E2E Tests (Playwright)

| Test | Phase |
|------|-------|
| Signup flow | Phase 0 |
| Login/logout flow | Phase 0 |
| Create decision | Phase 1 |
| Add options/evidence/tradeoffs | Phase 1 |
| AI competitor analysis | Phase 2 |
| Generate and share brief | Phase 3 |
| Invite team member | Phase 4 |
| Full onboarding flow | Phase 4 |

### Integration Tests (Vitest)

| Test Area | Phase |
|-----------|-------|
| Auth middleware | Phase 0 |
| RLS org isolation | Phase 0 |
| Decision CRUD API | Phase 1 |
| Options CRUD API | Phase 1 |
| Evidence with option links | Phase 1 |
| Quality score calculation | Phase 1 |
| Job creation and polling | Phase 2 |
| AI prompt execution (mocked) | Phase 2 |
| Output generation | Phase 3 |
| Member invitation | Phase 4 |

### Unit Tests (Vitest)

| Test Area | Phase |
|-----------|-------|
| Quality score calculation | Phase 1 |
| Template loading | Phase 1 |
| Prompt formatting | Phase 2 |
| Date/format utilities | Throughout |

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| AI response quality | Structured prompts, Zod validation, fallback to manual |
| Scope creep | Strict MVP scope, document all "post-MVP" ideas |
| Timeline slip | Weekly milestone check, cut scope if needed |
| Third-party outage | Graceful degradation, error messaging |
| Performance issues | Early Lighthouse audits, caching strategy |

---

## Success Criteria

### Technical

- [ ] All E2E tests pass
- [ ] All integration tests pass
- [ ] Test coverage >50%
- [ ] Lighthouse score >80
- [ ] Zero P0 bugs
- [ ] Page load <3 seconds

### Business

- [ ] 3-5 users complete first decision
- [ ] Average quality score >70% on completed decisions
- [ ] At least 1 decision brief shared
- [ ] User feedback NPS >7

---

## Post-MVP Backlog

Features explicitly deferred:

1. SSO/SAML integration
2. Advanced audit logging
3. Custom templates
4. API access for integrations
5. Mobile-optimized experience
6. Advanced collaboration (real-time editing)
7. Decision history/versioning
8. Bulk import/export
9. Advanced analytics dashboard
10. Slack/Teams integration
