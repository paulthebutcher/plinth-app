# Phase 3: Outputs (Week 7)

**Goal**: Decision briefs generate and can be shared.

**Status**: ⏳ Not Started

> **Architecture Reference**: See [CORE_JOURNEY.md](../../specs/CORE_JOURNEY.md) Step 8 and [LLM_ORCHESTRATION.md](../../specs/LLM_ORCHESTRATION.md) for brief generation.

---

## Overview: Brief Generation in v2

In the evidence-first architecture, briefs are generated as the **final step of analysis** (Step 8), not as a separate action triggered by quality score. The brief synthesizes:

- Decision framing (question, constraints, stakes)
- Options considered (all options with rationale)
- Evidence summary (key evidence with citations)
- Assumptions ledger (declared, implicit, status)
- Recommendation (primary + hedge + confidence)
- Decision changers (conditions that would flip recommendation)
- Open questions (unresolved unknowns)

---

## 3.1 Brief Display (Week 7)

**Windsurf Prompt:**
```
Read these files:
- docs/specs/CORE_JOURNEY.md (Step 8: Decision Artifact)
- docs/specs/LLM_ORCHESTRATION.md (Step 8: Brief generation)
- docs/design/DESIGN_SPEC_V2.md (Brief page)

Create brief display components:
1. app/(dashboard)/decisions/[id]/brief/page.tsx - Brief page
2. components/outputs/brief-header.tsx - Title, status, meta
3. components/outputs/brief-section.tsx - Collapsible section
4. components/outputs/evidence-citation.tsx - Clickable citation link
5. components/outputs/decision-changers-list.tsx - Conditions that flip rec

Brief is READ-ONLY after generation.
Show all citations as clickable links to sources.
```

| Task | Acceptance Criteria | Tests | Status |
|------|---------------------|-------|--------|
| 💻 Brief page route | `/decisions/[id]/brief` works | E2E: navigation | |
| 💻 Brief header | Shows title, date, owner | Component: header | |
| 💻 Brief sections | 7 sections per spec | Component: sections | |
| 💻 Evidence citations | Clickable source links | Component: citations | |
| 💻 Decision changers | Listed with likelihood | Component: changers | |

---

## 3.2 Brief Editing (Week 7)

**Windsurf Prompt:**
```
Read docs/specs/LLM_ORCHESTRATION.md (Step 8 output format).

Create brief editing (limited):
1. components/outputs/brief-editor.tsx - Markdown editor
2. app/api/decisions/[id]/brief/route.ts - GET/PATCH endpoints

Users can edit the brief narrative but NOT the underlying data.
Track if brief has been manually edited.
Show "Edited" badge if modified from AI-generated version.
```

| Task | Acceptance Criteria | Tests | Status |
|------|---------------------|-------|--------|
| 💻 Edit brief content | Markdown editor | Component: editor | |
| 💻 Save edits | PATCH updates content | Integration: save | |
| 💻 Track edits | Shows "Edited" badge | Component: indicator | |
| 💻 Preserve citations | Citations remain clickable | Component: citations | |

---

## 3.3 Brief Sharing (Week 7)

**Windsurf Prompt:**
```
Read docs/design/DESIGN_SPEC_V2.md (Share page).

Create sharing functionality:
1. components/outputs/share-toggle.tsx - Enable/disable sharing
2. components/outputs/copy-link-button.tsx - Copy share URL
3. app/api/decisions/[id]/share/route.ts - Toggle sharing
4. app/(public)/share/[key]/page.tsx - Public share page

Generate unique share_key when sharing is enabled.
Public page is read-only, nicely formatted.
Include all sections EXCEPT internal notes/assumptions if marked private.
```

| Task | Acceptance Criteria | Tests | Status |
|------|---------------------|-------|--------|
| 💻 Share toggle | Enable/disable sharing | Component: toggle | |
| 💻 Generate share URL | Creates unique share_key | Integration: key | |
| 💻 Public share page | `/share/[key]` shows brief | E2E: share flow | |
| 💻 Copy link button | Copies URL to clipboard | Component: copy | |
| 💻 Revoke sharing | Removes share_key | Integration: revoke | |

---

## 3.4 PDF Export (Week 7)

**Windsurf Prompt:**
```
Create PDF export:
1. components/outputs/export-pdf-button.tsx - Trigger export
2. lib/pdf/generate-brief-pdf.ts - PDF generation
3. app/api/decisions/[id]/brief/pdf/route.ts - Generate PDF

PDF should include:
- All brief sections
- Citations as footnotes
- Decision changers section
- Confidence breakdown visualization
- Clean, professional formatting
```

| Task | Acceptance Criteria | Tests | Status |
|------|---------------------|-------|--------|
| 💻 Export PDF button | Triggers PDF generation | Component: button | |
| 💻 PDF generation | All sections included | Integration: PDF | |
| 💻 Citations as footnotes | Sources listed at end | Integration: format | |
| 💻 PDF download | Browser downloads file | E2E: download | |

---

## 3.5 Re-run Analysis (Week 7)

**Windsurf Prompt:**
```
Create re-run analysis flow:
1. components/outputs/rerun-analysis-button.tsx - Trigger re-analysis
2. app/api/decisions/[id]/rerun/route.ts - Start new analysis job

When user clicks "Re-run Analysis":
1. Confirm action (will replace current results)
2. Keep original frame + context
3. Trigger new evidence scan
4. Replace options, mapping, scoring, recommendation
5. Generate new brief

Show comparison with previous version if available.
```

| Task | Acceptance Criteria | Tests | Status |
|------|---------------------|-------|--------|
| 💻 Re-run button | Triggers new analysis | Component: button | |
| 💻 Confirmation modal | Warns about replacement | Component: modal | |
| 💻 New analysis job | Creates job, runs pipeline | Integration: job | |
| 💻 Version comparison | Shows diff if available | Component: diff | |

---

## Phase 3 Milestone

**Briefs display, edit, share, export to PDF.**

### Checklist
- [ ] Brief page displays all 7 sections
- [ ] Citations are clickable and link to sources
- [ ] Decision changers clearly visible
- [ ] Can edit brief narrative
- [ ] Shows "Edited" badge when modified
- [ ] Can enable/disable public sharing
- [ ] Public share page works without auth
- [ ] Can copy share link to clipboard
- [ ] Can export brief to PDF
- [ ] PDF includes all sections with citations
- [ ] Can re-run analysis to update brief

---

## Debugging Notes

*Add notes here as you work through this phase:*

```
<!-- Example:
2024-02-10: PDF generation failing on Vercel
- Issue: @react-pdf/renderer memory limits
- Fix: Switched to puppeteer-based generation
-->
```

---

**Previous Phase:** [03-ai-analysis.md](./03-ai-analysis.md)
**Next Phase:** [05-team-polish.md](./05-team-polish.md)
