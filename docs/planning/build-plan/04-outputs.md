# Phase 3: Outputs (Week 7)

**Goal**: Decision briefs generate and can be shared.

**Status**: ⏳ Not Started

---

## 3.1 Brief Generation (Week 7)

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

| Task | Acceptance Criteria | Tests | Status |
|------|---------------------|-------|--------|
| 💻 "Generate Brief" button | Visible when quality ≥80% | Component: conditional | |
| 💻 Block if incomplete | Modal showing missing items | Component: validation | |
| 💻 Generate brief job | Creates output, runs AI | Integration: job flow | |
| 💻 Brief generation prompt | Full prompt from AI_PROMPTS.md | Unit: prompt | |
| 💻 Save brief content | Stores markdown in outputs table | Integration: save | |
| 💻 Brief preview | Render markdown in modal | Component: preview | |

---

## 3.2 Brief Editing (Week 7)

**Windsurf Prompt:**
```
Read docs/specs/API_CONTRACTS.md (Outputs API - PATCH endpoint).

Create brief editing:
1. components/outputs/brief-editor.tsx - Markdown editor
2. app/api/decisions/[id]/outputs/[outputId]/route.ts - PATCH endpoint

Track if brief has been edited (compare content with original).
Show "Edited" badge if modified.
```

| Task | Acceptance Criteria | Tests | Status |
|------|---------------------|-------|--------|
| 💻 Edit brief content | Rich text/markdown editor | Component: editor | |
| 💻 Save edits | PATCH updates content | Integration: save | |
| 💻 Version note | Shows "Edited" if modified | Component: indicator | |

---

## 3.3 Brief Sharing (Week 7)

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

| Task | Acceptance Criteria | Tests | Status |
|------|---------------------|-------|--------|
| 💻 Share toggle | Enable/disable sharing | Component: toggle | |
| 💻 Generate share URL | Creates unique share_key | Integration: key generation | |
| 💻 Public share page | `/share/[key]` shows brief | E2E: share flow | |
| 💻 Copy link button | Copies URL to clipboard | Component: copy | |
| 💻 Revoke sharing | Removes share_key | Integration: revoke | |

---

## 3.4 PDF Export (Week 7)

**Windsurf Prompt:**
```
Create PDF export functionality:
1. components/outputs/export-pdf-button.tsx - Trigger export
2. lib/pdf/generate-brief-pdf.ts - PDF generation using @react-pdf/renderer
3. app/api/decisions/[id]/outputs/[outputId]/pdf/route.ts - Generate and return PDF

PDF should be cleanly formatted, branded with Plinth logo.
Match the brief structure from the generate-brief prompt output.
```

| Task | Acceptance Criteria | Tests | Status |
|------|---------------------|-------|--------|
| 💻 Export to PDF button | Triggers PDF generation | Component: button | |
| 💻 PDF generation | Clean, branded PDF output | Integration: PDF library | |
| 💻 PDF download | Browser downloads file | E2E: download | |

---

## Phase 3 Milestone

**Briefs generate, preview, edit, share, export to PDF.**

### Checklist
- [ ] "Generate Brief" button appears when quality ≥80%
- [ ] Shows what's missing if quality <80%
- [ ] Brief generation job runs successfully
- [ ] Generated brief displays in preview modal
- [ ] Can edit brief content with markdown editor
- [ ] Shows "Edited" badge when modified
- [ ] Can enable/disable public sharing
- [ ] Public share page works without auth
- [ ] Can copy share link to clipboard
- [ ] Can export brief to PDF
- [ ] PDF is cleanly formatted and branded

---

## Debugging Notes

*Add notes here as you work through this phase:*

```
<!-- Example:
2024-02-10: PDF generation failing on Vercel
- Issue: @react-pdf/renderer not working in serverless
- Fix: Used different PDF library or client-side generation
-->
```

---

**Previous Phase:** [03-ai-analysis.md](./03-ai-analysis.md)
**Next Phase:** [05-team-polish.md](./05-team-polish.md)
