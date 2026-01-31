# Phase 1: Core Decision Engine (Weeks 2-4)

**Goal**: Full decision workflow functional without AI features.

**Status**: ⏳ Not Started

---

## 1.1 Decision CRUD (Week 2)

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

| Task | Acceptance Criteria | Tests | Status |
|------|---------------------|-------|--------|
| 💻 Decision list page | Shows user's decisions, pagination works | Component: list rendering | |
| 💻 Decision card component | Shows title, status, quality score, owner | Component: card states | |
| 💻 New decision modal | Template selection, title input | Component: modal flow | |
| 💻 Create decision API | POST creates decision with template | Integration: API validation | |
| 💻 Decision canvas page | Route `/decisions/[id]` works | E2E: navigate to decision | |
| 💻 Decision header | Edit title inline, status badge | Component: inline editing | |
| 💻 Delete decision | Soft delete with confirmation | E2E: delete flow | |

---

## 1.2 Template System (Week 2)

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

| Task | Acceptance Criteria | Tests | Status |
|------|---------------------|-------|--------|
| 💻 Template selector UI | 4 templates + custom displayed | Component: selector | |
| 💻 Template application | Selected template pre-populates content | Integration: template application | |
| 💻 Template context injection | AI context stored in decision metadata | Unit: template loading | |

---

## 1.3 Options Section (Week 2-3)

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

| Task | Acceptance Criteria | Tests | Status |
|------|---------------------|-------|--------|
| 💻 Options list UI | Displays options as cards | Component: list rendering | |
| 💻 Add option form | Title, description inputs | Component: form validation | |
| 💻 Create option API | POST creates option linked to decision | Integration: API + DB | |
| 💻 Edit option inline | Title/description editable | Component: inline editing | |
| 💻 Pros/cons editing | Add, edit, delete pros/cons | Component: list management | |
| 💻 Risks editing | Add, edit, delete risks | Component: list management | |
| 💻 Delete option | Remove with confirmation | E2E: delete flow | |
| 💻 Reorder options | Drag-drop reordering | Integration: order persistence | |

---

## 1.4 Evidence Section (Week 3)

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

| Task | Acceptance Criteria | Tests | Status |
|------|---------------------|-------|--------|
| 💻 Evidence list UI | Displays evidence items | Component: list rendering | |
| 💻 Add evidence form | Claim, source, type, strength fields | Component: form validation | |
| 💻 Create evidence API | POST creates evidence with option links | Integration: API + junction table | |
| 💻 Evidence-option linking UI | Select multiple options, set relationship | Component: multi-select | |
| 💻 Edit evidence | All fields editable | Component: editing | |
| 💻 Delete evidence | Remove (cascades links) | Integration: cascade delete | |
| 💻 Evidence strength indicator | Visual indicator for strength | Component: strength display | |

---

## 1.5 Constraints Section (Week 3)

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

| Task | Acceptance Criteria | Tests | Status |
|------|---------------------|-------|--------|
| 💻 Constraints list UI | Displays by category | Component: grouped list | |
| 💻 Add constraint form | Category, description, severity | Component: form | |
| 💻 Create constraint API | POST creates constraint | Integration: API | |
| 💻 Edit/delete constraint | CRUD complete | Integration: CRUD | |
| 💻 Hard vs soft visual | Different styling for severity | Component: styling | |

---

## 1.6 Tradeoffs Section (Week 3-4)

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

| Task | Acceptance Criteria | Tests | Status |
|------|---------------------|-------|--------|
| 💻 Tradeoffs list UI | Shows "give up X to get Y" | Component: list | |
| 💻 Add tradeoff form | Option selector, gives/gets fields | Component: form | |
| 💻 Create tradeoff API | POST creates linked to option | Integration: API | |
| 💻 Acknowledge tradeoff | Toggle acknowledgment | Component: toggle | |
| 💻 Tradeoff progress | Shows acknowledged vs total | Component: progress | |

---

## 1.7 Stakeholders Section (Week 4)

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

| Task | Acceptance Criteria | Tests | Status |
|------|---------------------|-------|--------|
| 💻 Stakeholders list UI | Name, role, stance display | Component: list | |
| 💻 Add stakeholder form | All fields | Component: form | |
| 💻 Stakeholder CRUD API | Full CRUD | Integration: API | |
| 💻 Stance indicator | Visual for supportive/neutral/skeptical | Component: styling | |

---

## 1.8 Recommendation Section (Week 4)

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

| Task | Acceptance Criteria | Tests | Status |
|------|---------------------|-------|--------|
| 💻 Recommendation selector | Pick from options | Component: selector | |
| 💻 Confidence slider | 0-100 with rationale | Component: slider | |
| 💻 Rationale input | Rich text for rationale | Component: input | |
| 💻 Reversal conditions | Input for conditions | Component: input | |
| 💻 Save recommendation API | PATCH decision with recommendation | Integration: API | |

---

## 1.9 Quality Score (Week 4)

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

| Task | Acceptance Criteria | Tests | Status |
|------|---------------------|-------|--------|
| 💻 Quality score calculation | Matches spec (weights above) | Unit: calculation logic | |
| 💻 Progress sidebar | Visual progress by section | Component: sidebar | |
| 💻 Section completion check | Checks per DECISION_FLOW.md | Unit: completion rules | |
| 💻 Quality score API | GET returns calculated score | Integration: API | |

---

## Phase 1 Milestone

**User can create decision, add all content, see quality score. No AI yet.**

### Checklist
- [ ] Decision list shows all user's decisions
- [ ] Can create new decision from template
- [ ] Can add/edit/delete options with pros/cons/risks
- [ ] Can add/edit/delete evidence linked to options
- [ ] Can add/edit/delete constraints by category
- [ ] Can add/edit/delete tradeoffs with acknowledgment
- [ ] Can add/edit/delete stakeholders with stance
- [ ] Can set recommendation with confidence
- [ ] Quality score calculates correctly
- [ ] Must reach 80% quality to proceed

---

## Debugging Notes

*Add notes here as you work through this phase:*

```
<!-- Example:
2024-01-20: Evidence-option linking not saving
- Issue: Junction table insert failing
- Fix: Added proper foreign key handling in API
-->
```

---

**Previous Phase:** [01-foundation.md](./01-foundation.md)
**Next Phase:** [03-ai-analysis.md](./03-ai-analysis.md)
