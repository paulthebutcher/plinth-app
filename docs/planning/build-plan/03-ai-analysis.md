# Phase 2: AI Analysis (Weeks 5-6)

**Goal**: Competitor profiles and option analysis working.

**Status**: ⏳ Not Started

---

## 2.1 Background Jobs Infrastructure (Week 5)

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

| Task | Acceptance Criteria | Tests | Status |
|------|---------------------|-------|--------|
| 🔧 Set up Inngest | Local dev working, events firing | Integration: event dispatch | |
| 💻 Jobs table + API | Create, read, poll jobs | Integration: CRUD | |
| 💻 Job progress polling | Frontend polls, updates UI | Component: polling hook | |
| 💻 Job cancellation | Cancel pending/running jobs | Integration: cancellation | |

---

## 2.2 Competitor Analysis (Week 5)

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

| Task | Acceptance Criteria | Tests | Status |
|------|---------------------|-------|--------|
| 💻 "Analyze Competitor" UI | Button, input for company name/URL | Component: form | |
| 💻 Create competitor job API | Triggers Inngest function | Integration: job creation | |
| 💻 Firecrawl integration | Scrapes company website | Integration: mock Firecrawl | |
| 💻 Exa integration | Searches for company news | Integration: mock Exa | |
| 💻 Competitor profile prompt | Generates structured profile | Unit: prompt formatting | |
| 💻 Save competitor profile | Stores in database | Integration: save flow | |
| 💻 Competitor profile view | Display all sections | Component: profile view | |
| 💻 Refresh stale profile | Re-run after 14+ days | Integration: refresh flow | |

---

## 2.3 Option Analysis (Week 5-6)

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

| Task | Acceptance Criteria | Tests | Status |
|------|---------------------|-------|--------|
| 💻 "Analyze" button on option | Triggers AI analysis | Component: button state | |
| 💻 Analyze option prompt | Generates pros/cons/risks | Unit: prompt | |
| 💻 Stream AI response | Real-time display during generation | Component: streaming | |
| 💻 Save AI analysis | Stores in option.ai_analysis | Integration: save | |
| 💻 Display AI analysis | Shows alongside manual content | Component: display | |
| 💻 Re-analyze option | Can trigger fresh analysis | Integration: re-run | |

---

## 2.4 Option Comparison (Week 6)

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

| Task | Acceptance Criteria | Tests | Status |
|------|---------------------|-------|--------|
| 💻 Compare options button | Available with 2+ options | Component: button | |
| 💻 Compare options prompt | Structured comparison output | Unit: prompt | |
| 💻 Comparison view modal | Side-by-side comparison | Component: modal | |

---

## 2.5 Suggest Options (Week 6)

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

| Task | Acceptance Criteria | Tests | Status |
|------|---------------------|-------|--------|
| 💻 "Suggest Options" button | Triggers AI suggestion | Component: button | |
| 💻 Suggest options prompt | Returns 1-3 suggestions | Unit: prompt | |
| 💻 Add suggested option | User can add to decision | Component: add flow | |

---

## 2.6 Other AI Features (Week 6)

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

| Task | Acceptance Criteria | Tests | Status |
|------|---------------------|-------|--------|
| 💻 Suggest constraints | AI suggests missing constraints | Integration: flow | |
| 💻 Suggest stakeholders | AI suggests missing stakeholders | Integration: flow | |
| 💻 Surface tradeoffs | AI identifies implicit tradeoffs | Integration: flow | |
| 💻 Identify gaps | AI shows what's missing | Integration: flow | |

---

## Phase 2 Milestone

**AI features fully functional. Competitor profiles generate. Options analyzable.**

### Checklist
- [ ] Inngest background jobs working locally and in production
- [ ] Can trigger competitor analysis job
- [ ] Firecrawl scrapes company websites
- [ ] Exa searches for company news
- [ ] Competitor profiles generate and display
- [ ] Can analyze individual options with AI
- [ ] Can compare options side-by-side
- [ ] AI can suggest new options
- [ ] AI can suggest constraints/stakeholders/tradeoffs
- [ ] AI can identify gaps in decision

---

## Debugging Notes

*Add notes here as you work through this phase:*

```
<!-- Example:
2024-02-01: Inngest jobs not triggering in production
- Issue: Signing key mismatch
- Fix: Updated INNGEST_SIGNING_KEY in Vercel
-->
```

---

**Previous Phase:** [02-decision-engine.md](./02-decision-engine.md)
**Next Phase:** [04-outputs.md](./04-outputs.md)
