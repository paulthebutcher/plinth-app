# Plinth MVP Build Plan

## Overview

This folder contains the complete build plan for Plinth MVP, split into phases for easier navigation and progress tracking.

### Documents

| Document | Phase | Content |
|----------|-------|---------|
| [01-foundation.md](./01-foundation.md) | Phase 0 | Project setup, database, authentication |
| [02-decision-engine.md](./02-decision-engine.md) | Phase 1 | Core decision workflow (CRUD, templates, options, evidence, etc.) |
| [03-ai-analysis.md](./03-ai-analysis.md) | Phase 2 | AI features (competitor analysis, option analysis, suggestions) |
| [04-outputs.md](./04-outputs.md) | Phase 3 | Brief generation, editing, sharing, PDF export |
| [05-team-polish.md](./05-team-polish.md) | Phase 4 | Team management, comments, onboarding, UI polish |
| [06-launch.md](./06-launch.md) | Phase 5 | Launch prep, first customers |
| [99-reference.md](./99-reference.md) | Reference | Environment variables, test coverage, risks, post-MVP backlog |

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
- docs/architecture/TECHNICAL_ARCHITECTURE.md (tech stack, database schema)
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
| Phase 1 | Weeks 2-4 | Full decision workflow functional (no AI) |
| Phase 2 | Weeks 5-6 | AI analysis features working |
| Phase 3 | Week 7 | Decision briefs generate and can be shared |
| Phase 4 | Weeks 8-9 | Multi-user, polish, production ready |
| Phase 5 | Week 10 | Launch, first customers |

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

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| AI response quality | Structured prompts, Zod validation, fallback to manual |
| Scope creep | Strict MVP scope, document all "post-MVP" ideas |
| Timeline slip | Weekly milestone check, cut scope if needed |
| Third-party outage | Graceful degradation, error messaging |
| Performance issues | Early Lighthouse audits, caching strategy |
