# Plinth MVP Build Plan

## Overview

This folder contains the complete build plan for Plinth MVP, split into phases for easier navigation and progress tracking.

> **Architecture Reference**: See [CORE_JOURNEY.md](../../specs/CORE_JOURNEY.md) for the 9-step user journey and [LLM_ORCHESTRATION.md](../../specs/LLM_ORCHESTRATION.md) for the AI pipeline architecture.

### Documents

| Document | Phase | Content |
|----------|-------|---------|
| [01-foundation.md](./01-foundation.md) | Phase 0 | Project setup, database, authentication |
| [02-decision-engine.md](./02-decision-engine.md) | Phase 1 | User input flow (framing, context, analysis trigger) |
| [03-ai-analysis.md](./03-ai-analysis.md) | Phase 2 | AI pipeline (evidence scan, options, mapping, scoring, recommendation) |
| [04-outputs.md](./04-outputs.md) | Phase 3 | Brief generation, editing, sharing, PDF export |
| [05-team-polish.md](./05-team-polish.md) | Phase 4 | Team management, comments, onboarding, UI polish |
| [06-launch.md](./06-launch.md) | Phase 5 | Launch prep, first customers |
| [99-reference.md](./99-reference.md) | Reference | Environment variables, test coverage, costs, post-MVP backlog |

---

## The Evidence-First Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     PLINTH DECISION FLOW                                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  USER INPUT (Phase 1)                                                    │
│  ├── 0. Entry: "I have a decision"                                       │
│  ├── 1. Frame: Lock decision parameters                                  │
│  └── 2. Context: Add constraints, assumptions (optional)                 │
│                                                                          │
│  AI ANALYSIS (Phase 2)                                                   │
│  ├── 3. Evidence Scan: Search + scrape + extract (30-90 sec)            │
│  ├── 4. Option Generation: 3-6 commitments from evidence                │
│  ├── 5. Evidence Mapping: Supporting / contradicting per option         │
│  ├── 6. Confidence Scoring: Transparent 6-factor scoring                │
│  └── 7. Recommendation: Primary + hedge + decision changers             │
│                                                                          │
│  OUTPUT (Phase 3)                                                        │
│  └── 8. Decision Artifact: Exportable brief with citations              │
│                                                                          │
│  POST-MVP                                                                │
│  └── 9. Tracking: Monitor assumptions, flag changes                     │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

**Key Principle**: Evidence is gathered BEFORE generating options to prevent narrative anchoring.

---

## Legend

- 🔧 = External setup required (outside codebase)
- 💻 = Code task (Windsurf handles this)
- ✅ = Completed
- 🚧 = In Progress
- ⏳ = Not Started

---

## Starting a New Windsurf Session

**Copy and paste this prompt at the beginning of each new Windsurf session:**

```
I'm building Plinth, a strategic decision-quality tool for executives.

Read these files to understand the project:
- docs/README.md (project overview)
- docs/specs/CORE_JOURNEY.md (9-step user journey)
- docs/specs/LLM_ORCHESTRATION.md (AI pipeline architecture)
- docs/planning/build-plan/00-overview.md (build plan index)
- docs/planning/build-plan/[CURRENT_PHASE].md (current phase details)

I'm currently on [PHASE X.X - SECTION NAME].
Last session I completed: [WHAT YOU FINISHED]
Next I need to: [WHAT YOU'RE WORKING ON]

Let me know when you've read the files and are ready to continue.
```

**Replace the bracketed sections with your actual progress.**

---

## Timeline Overview

| Phase | Duration | Goal |
|-------|----------|------|
| Phase 0 | Week 1 | Infrastructure ready, authentication working |
| Phase 1 | Weeks 2-3 | User can frame decision, add context, trigger analysis |
| Phase 2 | Weeks 4-6 | Full AI pipeline operational (~5-8 min per analysis) |
| Phase 3 | Week 7 | Decision briefs generate and can be shared |
| Phase 4 | Weeks 8-9 | Multi-user, polish, production ready |
| Phase 5 | Week 10 | Launch, first customers |

---

## Cost Model

| Per Decision | Amount |
|--------------|--------|
| Search queries (Exa) | 12 |
| Pages scraped (Firecrawl) | 25 |
| LLM tokens | ~40k |
| **Total cost** | **~$0.50** |
| **Analysis time** | **5-8 minutes** |

---

## Success Criteria

### Technical

- [ ] All E2E tests pass
- [ ] All integration tests pass
- [ ] Test coverage >50%
- [ ] Lighthouse score >80
- [ ] Zero P0 bugs
- [ ] Page load <3 seconds
- [ ] Analysis completes in <8 minutes

### Business

- [ ] 3-5 users complete first decision
- [ ] Average confidence score >60% on recommendations
- [ ] At least 1 decision brief shared
- [ ] User feedback NPS >7

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| AI response quality | Structured prompts, Zod validation, transparent scoring |
| Evidence quality | Multi-source corroboration, confidence indicators |
| Scraping failures | Fallback chain: Firecrawl → JS render → Apify → skip |
| Scope creep | Strict MVP scope (Steps 0-8), defer Step 9 tracking |
| Timeline slip | Weekly milestone check, cut scope if needed |
| Third-party outage | Graceful degradation, partial results display |
| Performance issues | Early Lighthouse audits, caching strategy |
| Cost overrun | Hard caps on queries/scrapes per decision |

---

## Current Status

| Phase | Status | Notes |
|-------|--------|-------|
| Phase 0: Foundation | ✅ Complete | Auth working |
| Phase 1: Decision Engine | 🎨 Design | UI in Figma/Pencil |
| Phase 2: AI Analysis | ⏳ Not Started | |
| Phase 3: Outputs | ⏳ Not Started | |
| Phase 4: Team & Polish | ⏳ Not Started | |
| Phase 5: Launch | ⏳ Not Started | |
