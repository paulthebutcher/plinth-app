# Plinth Documentation

**Plinth** is an AI-powered strategic decision-quality tool for executives. It helps leaders make better decisions by gathering evidence before generating options, preventing narrative anchoring and hindsight bias.

---

## Quick Links

### Core Architecture (Start Here)

| Document | Description |
|----------|-------------|
| [CORE_JOURNEY.md](./specs/CORE_JOURNEY.md) | **The 9-step evidence-first user journey** — canonical flow |
| [LLM_ORCHESTRATION.md](./specs/LLM_ORCHESTRATION.md) | **AI pipeline architecture** — services, costs, schemas |

### Design

| Document | Description |
|----------|-------------|
| [DESIGN_SPEC_V2.md](./design/DESIGN_SPEC_V2.md) | Pages, components, sample data for UI implementation |
| [NAVIGATION_AND_AI.md](./design/NAVIGATION_AND_AI.md) | Navigation patterns, AI UX, keyboard shortcuts |

### Implementation

| Document | Description |
|----------|-------------|
| [BUILD_PLAN.md](./planning/BUILD_PLAN.md) | Build plan index — jump to current phase |
| [00-overview.md](./planning/build-plan/00-overview.md) | Full timeline, milestones, success criteria |

### Technical

| Document | Description |
|----------|-------------|
| [TECHNICAL_ARCHITECTURE.md](./architecture/TECHNICAL_ARCHITECTURE.md) | Tech stack, database schema, security |
| [FOLDER_STRUCTURE.md](./architecture/FOLDER_STRUCTURE.md) | File organization and conventions |

---

## The Evidence-First Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     PLINTH DECISION ANALYSIS                             │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  USER INPUT                                                              │
│  ├── 0. Entry: "I have a decision"                                       │
│  ├── 1. Frame: Lock decision parameters (type, horizon, stakes)          │
│  └── 2. Context: Add constraints, assumptions (optional)                 │
│                                                                          │
│  AI ANALYSIS (evidence gathered BEFORE options)                          │
│  ├── 3. Evidence Scan: Search + scrape + extract (30-90 sec)            │
│  ├── 4. Option Generation: 3-6 commitments from evidence                │
│  ├── 5. Evidence Mapping: Supporting / contradicting per option         │
│  ├── 6. Confidence Scoring: Transparent 6-factor scoring                │
│  └── 7. Recommendation: Primary + hedge + decision changers             │
│                                                                          │
│  OUTPUT                                                                  │
│  └── 8. Decision Brief: Exportable artifact with citations              │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

**Key Principle**: Evidence is gathered BEFORE generating options to prevent narrative anchoring.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15, React 19, TypeScript, Tailwind, shadcn/ui |
| Backend | Supabase (Postgres + Auth + RLS), Inngest (background jobs) |
| AI | OpenAI GPT-4o/4o-mini, Exa (search), Firecrawl (scraping) |
| Deployment | Vercel |

---

## Cost Model

| Per Decision | Amount |
|--------------|--------|
| Search queries (Exa) | ~12 |
| Pages scraped (Firecrawl) | ~25 |
| LLM tokens | ~40k |
| **Total cost** | **~$0.50** |
| **Analysis time** | **5-8 minutes** |

---

## Current Status

| Phase | Status |
|-------|--------|
| Phase 0: Foundation | ✅ Complete |
| Phase 1: Decision Engine | 🎨 Design in progress |
| Phase 2: AI Analysis | ⏳ Not started |
| Phase 3: Outputs | ⏳ Not started |
| Phase 4: Team & Polish | ⏳ Not started |
| Phase 5: Launch | ⏳ Not started |

---

## Deprecated Documents

| Document | Replaced By |
|----------|-------------|
| [DESIGN_SPEC.md](./design/DESIGN_SPEC.md) (v1) | [DESIGN_SPEC_V2.md](./design/DESIGN_SPEC_V2.md) |

---

*Last updated: January 2026*
