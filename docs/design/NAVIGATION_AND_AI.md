# Navigation & AI Experience Design

## 1. Navigation Architecture

### Global Navigation States

| State | Nav Type | Content |
|-------|----------|---------|
| Logged Out | Minimal | Logo only, auth links in content |
| Onboarding | Progress | Logo + progress dots, no sidebar |
| Logged In | Full Sidebar | Logo, primary nav, recents, user menu |
| Public Share | Branded | "Powered by Plinth" badge, CTA |

---

### Page-by-Page Navigation

#### Auth Pages (`/login`, `/signup`, `/forgot-password`, `/reset-password`)

```
┌─────────────────────────────────────────┐
│  [Logo]                                 │
│                                         │
│         ┌─────────────────┐             │
│         │   Auth Card     │             │
│         │                 │             │
│         │   [Form]        │             │
│         │                 │             │
│         │   [Links]       │←── Switch between auth pages
│         └─────────────────┘             │
│                                         │
└─────────────────────────────────────────┘
```

**Navigation Elements:**
- Logo (links to marketing site or login)
- In-card links: "Forgot password?", "Sign up", "Log in"
- No sidebar, no global nav

---

#### Onboarding Pages (`/onboarding/*`)

```
┌─────────────────────────────────────────┐
│  [Logo]                                 │
│                                         │
│         ┌─────────────────┐             │
│         │   Content       │             │
│         │                 │             │
│         │   [CTA Button]  │             │
│         │                 │             │
│         │   ○ ● ○         │←── Progress dots (clickable to go back)
│         └─────────────────┘             │
│                                         │
│         [Skip link]       │←── Escape hatch
└─────────────────────────────────────────┘
```

**Navigation Elements:**
- Logo (non-clickable during onboarding)
- Progress dots: 3 steps, can click previous to go back
- Skip link on final step: "I'll explore on my own"
- No back button (use progress dots)

---

#### Dashboard (`/dashboard`)

```
┌──────────┬──────────────────────────────┐
│          │  Decisions            [+ New]│←── Page title + primary CTA
│  [Logo]  ├──────────────────────────────┤
│          │  [Search]                    │←── Search decisions
│  ────────│  [All] [Draft] [Review] [...]│←── Filter tabs
│          ├──────────────────────────────┤
│ Decisions│                              │
│  ★       │  Decision Cards              │
│          │                              │
│ ──────── │                              │
│          │                              │
│ Recent   │                              │
│  • CRM   │←── Quick access              │
│  • UK    │                              │
│          │                              │
│ ──────── │                              │
│          │                              │
│ Settings │←── Secondary nav             │
│          │                              │
│ ──────── │                              │
│ [Avatar] │←── User menu                 │
│ Sarah    │                              │
└──────────┴──────────────────────────────┘
```

**Sidebar Navigation:**
| Item | Icon | Action |
|------|------|--------|
| Decisions | LayoutGrid | Navigate to /dashboard |
| Recent (3 max) | Clock | Quick links to recent decisions |
| Settings | Settings | Navigate to /settings/profile |
| User Menu | Avatar | Dropdown: Profile, Team, Org, Logout |

**Main Content Navigation:**
- Search bar: Filters decision list in real-time
- Filter tabs: All / Draft / In Review / Committed / Archived
- Sort dropdown: Updated (default), Created, Title, Quality
- Decision cards: Click anywhere to open decision

---

#### Analysis Flow (`/analyze/[id]/*`)

> **Architecture**: See [CORE_JOURNEY.md](../specs/CORE_JOURNEY.md) for the 9-step flow.
> Evidence is gathered BEFORE options to prevent narrative anchoring.

```
┌──────────┬──────────────────────────────────────────┐
│          │ ← Decisions   Decision Title             │
│  [Logo]  │                                          │
│          ├──────────────────────────────────────────┤
│  ────────│                                          │
│          │  ┌─────────────────────────────────────┐ │
│ Decisions│  │  Analysis Progress                  │ │
│  ★       │  │  ○─○─●─○─○─○─○                       │ │
│          │  │  1 2 3 4 5 6 7                       │ │
│ ──────── │  │  Frame → Context → Scan → Options   │ │
│          │  │         → Map → Score → Recommend   │ │
│ Recent   │  └─────────────────────────────────────┘ │
│  • CRM   │                                          │
│  • UK    │  ┌─────────────────────────────────────┐ │
│          │  │                                     │ │
│ ──────── │  │    Step Content                     │ │
│          │  │    (varies by step)                 │ │
│ Settings │  │                                     │ │
│          │  └─────────────────────────────────────┘ │
│          │                                          │
│          │         [Continue →] or [Start Analysis] │
└──────────┴──────────────────────────────────────────┘
```

**Analysis Flow Routes:**
| Step | Route | User Action |
|------|-------|-------------|
| 1. Frame | `/analyze/[id]/frame` | Enter decision, set type/horizon/stakes |
| 2. Context | `/analyze/[id]/context` | Add constraints, assumptions (optional) |
| 3. Scan | `/analyze/[id]/scanning` | Watch AI gather evidence (30-90 sec) |
| 4. Options | `/analyze/[id]/options` | Review AI-generated options |
| 5. Map | `/analyze/[id]/mapping` | See evidence supporting/contradicting |
| 6. Score | `/analyze/[id]/scoring` | Review confidence breakdown |
| 7. Recommend | `/analyze/[id]/recommend` | See recommendation + decision changers |

**Progress Indicator:**
- 7 dots connected by line
- Completed steps: filled circle ●
- Current step: pulsing/highlighted
- Future steps: empty circle ○
- Click previous steps to review (read-only after analysis starts)

**Step Navigation:**
| Element | Action |
|---------|--------|
| ← Decisions | Back to dashboard (with confirmation if in progress) |
| Progress dots | Click to review previous steps |
| Continue → | Proceed to next step |
| Start Analysis | Triggers AI pipeline (Step 2 → 3) |

**AI Progress View (Step 3):**
- Live progress indicator showing sub-steps
- "Searching for evidence... (12/12 queries)"
- "Extracting insights... (18/25 pages)"
- Live findings preview panel
- Estimated time remaining

**Results Navigation (Steps 4-7):**
- Expand/collapse sections
- Click evidence cards to view source
- Hover for quick details
- "View Brief" button at Step 7

---

#### Brief Preview (`/decisions/[id]/brief`)

```
┌──────────┬──────────────────────────────────────────┐
│          │ ← Back to Decision    [Edit] [Share▾]   │
│  Sidebar │                      [Copy Link] [PDF]  │
│          ├──────────────────────────────────────────┤
│          │                                          │
│          │  ┌────────────────────────────────────┐  │
│          │  │                                    │  │
│          │  │      Brief Document                │  │
│          │  │      (Rendered Markdown)           │  │
│          │  │                                    │  │
│          │  │                                    │  │
│          │  └────────────────────────────────────┘  │
│          │                                          │
└──────────┴──────────────────────────────────────────┘
```

**Header Navigation:**
| Element | Action |
|---------|--------|
| ← Back to Decision | Return to canvas |
| Edit toggle | Enable/disable markdown editing |
| Share dropdown | Toggle public, copy link |
| Export PDF | Download |

---

#### Settings Pages (`/settings/*`)

```
┌──────────┬──────────────────────────────┐
│          │  Settings                    │
│  Sidebar │  ────────────────────────    │
│  (same)  │  [Profile] [Team] [Org]      │←── Settings sub-nav
│          ├──────────────────────────────┤
│          │                              │
│          │  Settings Content            │
│          │                              │
└──────────┴──────────────────────────────┘
```

**Settings Sub-navigation:**
| Tab | Route | Access |
|-----|-------|--------|
| Profile | /settings/profile | All users |
| Team | /settings/team | All users (invite = admin only) |
| Organization | /settings/organization | Admin only |

---

#### Public Share (`/share/[key]`)

```
┌─────────────────────────────────────────────────────┐
│                              [Powered by Plinth →] │←── Branded CTA
├─────────────────────────────────────────────────────┤
│                                                     │
│     ┌─────────────────────────────────────────┐     │
│     │                                         │     │
│     │      Brief Document (Read Only)         │     │
│     │                                         │     │
│     └─────────────────────────────────────────┘     │
│                                                     │
├─────────────────────────────────────────────────────┤
│  Make better decisions → Try Plinth Free            │←── CTA banner
└─────────────────────────────────────────────────────┘
```

**Navigation:**
- No sidebar (public page)
- "Powered by Plinth" links to marketing site
- Bottom CTA banner for conversion

---

## 2. AI Touchpoints Map

### Overview: Where AI Adds Value

```
Decision Flow with AI Integration:

FRAME ──────────────────────────────────────────────────────────────►
  │
  ├─► [AI] Suggest decision type based on question
  └─► [AI] Improve framing (clarity, specificity)

CONTEXT ────────────────────────────────────────────────────────────►
  │
  ├─► [AI] Suggest constraints from decision type + industry
  ├─► [AI] Suggest stakeholders based on decision type
  └─► [AI] Research company context (if URL provided)

OPTIONS ────────────────────────────────────────────────────────────►
  │
  ├─► [AI] Suggest 2-3 options based on frame + context ⭐ KEY
  ├─► [AI] Analyze each option → generate pros/cons/risks ⭐ KEY
  └─► [AI] Compare options side-by-side

EVIDENCE ───────────────────────────────────────────────────────────►
  │
  ├─► [AI] Research competitors → generate profiles ⭐ KEY
  ├─► [AI] Web research for supporting evidence ⭐ KEY
  ├─► [AI] Analyze uploaded documents for evidence
  └─► [AI] Auto-link evidence to relevant options

TRADEOFFS ──────────────────────────────────────────────────────────►
  │
  └─► [AI] Surface implicit tradeoffs from options ⭐ KEY

RECOMMENDATION ─────────────────────────────────────────────────────►
  │
  ├─► [AI] Suggest recommendation based on evidence weight
  ├─► [AI] Calibrate confidence level
  └─► [AI] Identify gaps before brief generation

BRIEF ──────────────────────────────────────────────────────────────►
  │
  └─► [AI] Generate complete executive brief ⭐ KEY
```

---

### Detailed AI Experience by Section

#### 2.1 Frame Section

**AI Trigger:** User finishes typing question (debounced 2 seconds)

**AI Actions:**
| Action | Trigger | Output |
|--------|---------|--------|
| Suggest Type | Question entered | "This sounds like a Build vs Buy decision" chip |
| Improve Frame | Click "✨ Improve" | Rewrites question to be more specific |

**UX Pattern:**
```
┌─────────────────────────────────────────────────────┐
│ What question are you trying to answer?             │
│ ┌─────────────────────────────────────────────────┐ │
│ │ Should we use Mixpanel or build our own?        │ │
│ └─────────────────────────────────────────────────┘ │
│                                                     │
│ ┌─────────────────────────────────────────────────┐ │
│ │ ✨ AI Suggestion                                │ │
│ │                                                 │ │
│ │ "Should we build an in-house analytics         │ │
│ │ platform or partner with Mixpanel for our      │ │
│ │ enterprise tier by Q2 2024?"                   │ │
│ │                                                 │ │
│ │ [Use This] [Dismiss]                           │ │
│ └─────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

---

#### 2.2 Context Section

**AI Triggers:**
- Decision type selected → Suggest constraints
- Decision type selected → Suggest stakeholder roles

**AI Actions:**
| Action | Trigger | Output |
|--------|---------|--------|
| Suggest Constraints | Type selected | 3-5 common constraints for this type |
| Suggest Stakeholders | Type selected | 3-4 typical roles involved |
| Company Research | Company URL entered | Background context |

**UX Pattern - Constraint Suggestions:**
```
┌─────────────────────────────────────────────────────┐
│ Constraints                           [+ Add]       │
│                                                     │
│ ┌─────────────────────────────────────────────────┐ │
│ │ ✨ Suggested for Build vs Buy decisions:        │ │
│ │                                                 │ │
│ │ ┌────────────────┐ ┌────────────────┐          │ │
│ │ │ Budget limit   │ │ Timeline       │          │ │
│ │ │ [+ Add]        │ │ [+ Add]        │          │ │
│ │ └────────────────┘ └────────────────┘          │ │
│ │ ┌────────────────┐ ┌────────────────┐          │ │
│ │ │ Team capacity  │ │ Compliance req │          │ │
│ │ │ [+ Add]        │ │ [+ Add]        │          │ │
│ │ └────────────────┘ └────────────────┘          │ │
│ │                                                 │ │
│ │ [Dismiss suggestions]                          │ │
│ └─────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

---

#### 2.3 Options Section ⭐ KEY AI MOMENT

**AI Triggers:**
- Frame + Context complete → Enable "Suggest Options"
- Option saved → Enable "Analyze with AI"
- 2+ options exist → Enable "Compare Options"

**AI Actions:**
| Action | Trigger | Output |
|--------|---------|--------|
| Suggest Options | Click button | 2-3 option suggestions with descriptions |
| Analyze Option | Click per-option | Pros, cons, risks for that option |
| Compare Options | Click button | Side-by-side comparison matrix |

**UX Pattern - Suggest Options (MAGICAL MOMENT):**
```
┌─────────────────────────────────────────────────────┐
│ Options                    [+ Add] [✨ Suggest]     │
│                                                     │
│ No options yet. Let AI suggest some based on your  │
│ decision frame.                                     │
│                                                     │
│           [✨ Suggest Options]                      │
│                                                     │
└─────────────────────────────────────────────────────┘

        ↓ After clicking ↓

┌─────────────────────────────────────────────────────┐
│ ✨ AI is analyzing your decision...                │
│                                                     │
│ ┌─────────────────────────────────────────────────┐ │
│ │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░            │ │
│ └─────────────────────────────────────────────────┘ │
│                                                     │
│ Considering your constraints, stakeholders, and    │
│ timeline to suggest relevant options...            │
└─────────────────────────────────────────────────────┘

        ↓ Streams in (typing effect) ↓

┌─────────────────────────────────────────────────────┐
│ ✨ Suggested Options                               │
│                                                     │
│ ┌─────────────────────────────────────────────────┐ │
│ │ Option 1: Build In-House                       │ │
│ │ Develop a custom analytics platform using      │ │
│ │ your existing data infrastructure...           │ │
│ │                                  [+ Add This]  │ │
│ └─────────────────────────────────────────────────┘ │
│                                                     │
│ ┌─────────────────────────────────────────────────┐ │
│ │ Option 2: Partner with Mixpanel               │ │
│ │ Implement Mixpanel Enterprise with their      │ │
│ │ managed analytics solution...                  │ │
│ │                                  [+ Add This]  │ │
│ └─────────────────────────────────────────────────┘ │
│                                                     │
│ ┌─────────────────────────────────────────────────┐ │
│ │ Option 3: Hybrid Approach                     │ │
│ │ Use Mixpanel for user analytics while         │ │
│ │ building custom data warehouse integration... │ │
│ │                                  [+ Add This]  │ │
│ └─────────────────────────────────────────────────┘ │
│                                                     │
│ [Add All] [Dismiss]                                │
└─────────────────────────────────────────────────────┘
```

**UX Pattern - Analyze Option:**
```
┌─────────────────────────────────────────────────────┐
│ ▼ Build In-House                    [✨ Analyze]   │
├─────────────────────────────────────────────────────┤
│ Description: Develop a custom analytics...         │
│                                                     │
│ ┌─ Pros ─────────────────────────────────────────┐ │
│ │ (empty - click Analyze to generate)            │ │
│ └────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘

        ↓ After Analyze (streams in) ↓

┌─────────────────────────────────────────────────────┐
│ ▼ Build In-House                   ✨ AI Analyzed  │
├─────────────────────────────────────────────────────┤
│ Description: Develop a custom analytics...         │
│                                                     │
│ ┌─ Pros ─────────────────────────── ✨ Generated ─┐│
│ │ ✓ Full control over features and roadmap       ││
│ │ ✓ No per-seat licensing costs at scale         ││
│ │ ✓ Deep integration with your data warehouse    ││
│ │                                        [+ Add] ││
│ └────────────────────────────────────────────────┘│
│                                                     │
│ ┌─ Cons ─────────────────────────── ✨ Generated ─┐│
│ │ ✗ 6-9 month development timeline               ││
│ │ ✗ Requires hiring 2 data engineers             ││
│ │ ✗ Ongoing maintenance burden                   ││
│ │                                        [+ Add] ││
│ └────────────────────────────────────────────────┘│
│                                                     │
│ ┌─ Risks ────────────────────────── ✨ Generated ─┐│
│ │ ⚠ Team has no prior experience with this type  ││
│ │ ⚠ Could impact Q2 product roadmap              ││
│ │                                        [+ Add] ││
│ └────────────────────────────────────────────────┘│
│                                                     │
│ You can edit or add to these AI-generated items.   │
└─────────────────────────────────────────────────────┘
```

---

#### 2.4 Evidence Section ⭐ KEY AI MOMENT

**AI Triggers:**
- Options exist → Enable "Research Competitors"
- Options exist → Enable "Find Evidence"
- Document uploaded → Auto-extract evidence

**AI Actions:**
| Action | Trigger | Output |
|--------|---------|--------|
| Research Competitor | Enter company name | Full competitor profile |
| Find Evidence | Click button | Web research for claims |
| Extract from Doc | Upload PDF/doc | Evidence items extracted |
| Auto-link | Evidence created | Suggest which options it supports/challenges |

**UX Pattern - Research Competitors (MAGICAL MOMENT):**
```
┌─────────────────────────────────────────────────────┐
│ Evidence                [+ Add] [✨ Research]       │
│                                                     │
│       [✨ Research Competitors]                     │
│                                                     │
└─────────────────────────────────────────────────────┘

        ↓ Modal opens ↓

┌─────────────────────────────────────────────────────┐
│ ✨ Research Competitor                        [X]  │
├─────────────────────────────────────────────────────┤
│                                                     │
│ Company name or URL:                               │
│ ┌─────────────────────────────────────────────────┐│
│ │ Mixpanel                                        ││
│ └─────────────────────────────────────────────────┘│
│                                                     │
│         [Research]                                 │
│                                                     │
└─────────────────────────────────────────────────────┘

        ↓ Progress (with live updates) ↓

┌─────────────────────────────────────────────────────┐
│ ✨ Researching Mixpanel...                    [X]  │
├─────────────────────────────────────────────────────┤
│                                                     │
│ ✓ Found company website                            │
│ ✓ Scraping mixpanel.com...                        │
│ ● Searching for recent news...                     │
│ ○ Analyzing pricing information                    │
│ ○ Generating competitive profile                   │
│                                                     │
│ ┌─────────────────────────────────────────────────┐│
│ │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░              ││
│ └─────────────────────────────────────────────────┘│
│                                                     │
│ Finding: "Mixpanel raised $200M Series C in 2023" │
│                                                     │
└─────────────────────────────────────────────────────┘

        ↓ Complete ↓

┌─────────────────────────────────────────────────────┐
│ ✨ Competitor Profile: Mixpanel              [X]   │
├─────────────────────────────────────────────────────┤
│                                                     │
│ ┌─ Overview ─────────────────────────────────────┐ │
│ │ Product analytics platform for mobile & web.   │ │
│ │ Founded 2009. 8,000+ customers including...    │ │
│ └────────────────────────────────────────────────┘ │
│                                                     │
│ ┌─ Key Evidence Found ────────────────────────────┐│
│ │                                                 ││
│ │ ┌───────────────────────────────────────────┐  ││
│ │ │ "Enterprise plan starts at $1,500/month"  │  ││
│ │ │ Source: mixpanel.com/pricing              │  ││
│ │ │ [Add as Evidence]                         │  ││
│ │ └───────────────────────────────────────────┘  ││
│ │                                                 ││
│ │ ┌───────────────────────────────────────────┐  ││
│ │ │ "SOC2 Type II certified, GDPR compliant"  │  ││
│ │ │ Source: mixpanel.com/security             │  ││
│ │ │ [Add as Evidence]                         │  ││
│ │ └───────────────────────────────────────────┘  ││
│ │                                                 ││
│ │ ┌───────────────────────────────────────────┐  ││
│ │ │ "Typical implementation takes 2-4 weeks"  │  ││
│ │ │ Source: G2 Reviews                        │  ││
│ │ │ [Add as Evidence]                         │  ││
│ │ └───────────────────────────────────────────┘  ││
│ │                                                 ││
│ └─────────────────────────────────────────────────┘│
│                                                     │
│ [Add All Evidence] [Save Profile] [Dismiss]        │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**UX Pattern - Auto-Link Evidence:**
When adding evidence, AI suggests which options it relates to:

```
┌─────────────────────────────────────────────────────┐
│ Add Evidence                                   [X] │
├─────────────────────────────────────────────────────┤
│                                                     │
│ Claim:                                             │
│ ┌─────────────────────────────────────────────────┐│
│ │ Mixpanel reduces time-to-insight by 40%        ││
│ └─────────────────────────────────────────────────┘│
│                                                     │
│ ┌─ ✨ AI Suggestion ─────────────────────────────┐ │
│ │ This evidence appears to:                      │ │
│ │                                                │ │
│ │ ● Support "Partner with Mixpanel"             │ │
│ │ ○ Challenge "Build In-House" (time comparison)│ │
│ │                                                │ │
│ │ [Apply Suggestions] [I'll link manually]      │ │
│ └────────────────────────────────────────────────┘ │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

#### 2.5 Tradeoffs Section ⭐ KEY AI MOMENT

**AI Triggers:**
- Options with pros/cons exist → Enable "Surface Tradeoffs"

**AI Actions:**
| Action | Trigger | Output |
|--------|---------|--------|
| Surface Tradeoffs | Click button | Identify implicit tradeoffs from pros/cons |

**UX Pattern - Surface Tradeoffs (MAGICAL MOMENT):**
```
┌─────────────────────────────────────────────────────┐
│ Tradeoffs                  [+ Add] [✨ Surface]     │
│                                                     │
│ No tradeoffs yet. AI can identify implicit         │
│ tradeoffs from your options' pros and cons.        │
│                                                     │
│       [✨ Surface Tradeoffs]                        │
│                                                     │
└─────────────────────────────────────────────────────┘

        ↓ After clicking (streams in) ↓

┌─────────────────────────────────────────────────────┐
│ ✨ AI found 3 implicit tradeoffs                   │
│                                                     │
│ ┌─────────────────────────────────────────────────┐│
│ │ Tradeoff 1                          [+ Accept] ││
│ │ For: Partner with Mixpanel                     ││
│ │                                                ││
│ │ We give up: Customization flexibility and     ││
│ │ $45k/year in licensing costs                  ││
│ │                                                ││
│ │ To get: 2-week implementation and proven      ││
│ │ enterprise-grade features                      ││
│ └─────────────────────────────────────────────────┘│
│                                                     │
│ ┌─────────────────────────────────────────────────┐│
│ │ Tradeoff 2                          [+ Accept] ││
│ │ For: Build In-House                            ││
│ │                                                ││
│ │ We give up: 6 months of dev time and $200k    ││
│ │ in engineering costs                           ││
│ │                                                ││
│ │ To get: Full control and zero per-seat fees   ││
│ └─────────────────────────────────────────────────┘│
│                                                     │
│ [Accept All] [Dismiss]                             │
└─────────────────────────────────────────────────────┘
```

---

#### 2.6 Recommendation Section

**AI Triggers:**
- All tradeoffs acknowledged → Enable "Suggest Recommendation"
- Quality < 80% → Show "Identify Gaps"

**AI Actions:**
| Action | Trigger | Output |
|--------|---------|--------|
| Suggest Recommendation | Click button | Recommended option + rationale |
| Calibrate Confidence | Confidence set | Suggest adjustment based on evidence |
| Identify Gaps | Quality < 80% | What's missing to generate brief |

**UX Pattern - Suggest Recommendation:**
```
┌─────────────────────────────────────────────────────┐
│ Recommendation                                      │
│                                                     │
│ Based on your evidence and tradeoffs, AI can       │
│ suggest a recommendation.                          │
│                                                     │
│       [✨ Suggest Recommendation]                   │
│                                                     │
└─────────────────────────────────────────────────────┘

        ↓ After clicking ↓

┌─────────────────────────────────────────────────────┐
│ ✨ AI Recommendation                               │
│                                                     │
│ Based on your evidence (3 supporting, 1 against)   │
│ and acknowledged tradeoffs, I recommend:           │
│                                                     │
│ ┌─────────────────────────────────────────────────┐│
│ │ Partner with Mixpanel                          ││
│ │                                                ││
│ │ Confidence: 75% (High)                         ││
│ │                                                ││
│ │ Rationale: The 2-week implementation timeline  ││
│ │ aligns with your Q2 constraint, and the SOC2   ││
│ │ compliance satisfies your legal requirements.  ││
│ │ While the $45k annual cost is significant,     ││
│ │ it's offset by saved engineering time...       ││
│ └─────────────────────────────────────────────────┘│
│                                                     │
│ [Use This Recommendation] [I'll decide myself]     │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

#### 2.7 Brief Generation ⭐ KEY AI MOMENT

**AI Triggers:**
- Quality ≥ 80% → Enable "Generate Brief"

**UX Pattern - Brief Generation (MAGICAL MOMENT):**
```
┌─────────────────────────────────────────────────────┐
│                                                     │
│           ✨ Generating Your Decision Brief         │
│                                                     │
│ ┌─────────────────────────────────────────────────┐│
│ │ ████████████████████████░░░░░░░░░░░  67%       ││
│ └─────────────────────────────────────────────────┘│
│                                                     │
│ ✓ Analyzing decision frame                         │
│ ✓ Summarizing 3 options with pros and cons        │
│ ✓ Synthesizing 4 evidence items                   │
│ ✓ Incorporating 3 acknowledged tradeoffs          │
│ ● Writing executive summary...                     │
│ ○ Formatting brief document                        │
│                                                     │
│ ┌─────────────────────────────────────────────────┐│
│ │ Preview:                                        ││
│ │                                                 ││
│ │ "After evaluating three options for our        ││
│ │ analytics needs, we recommend partnering       ││
│ │ with Mixpanel for our enterprise tier..."      ││
│ │ ▌                                              ││
│ └─────────────────────────────────────────────────┘│
│                                                     │
│                [Cancel]                            │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 3. Making AI Moments Magical

### Design Principles

| Principle | Implementation |
|-----------|----------------|
| **Anticipate, don't interrupt** | Show AI suggestions inline, not in blocking modals |
| **Stream, don't block** | Show AI output as it generates (typing effect) |
| **Explain, don't mystify** | Show what AI is doing: "Analyzing your constraints..." |
| **Augment, don't replace** | AI generates drafts; user always edits/approves |
| **Celebrate completion** | Subtle confetti or glow when brief generates |

### Visual Language for AI

```
✨ = AI feature (consistent sparkle icon)
Purple/gradient accent = AI-generated content
"AI Analyzed" badge = Human can trust this was reviewed
Typing cursor = Content is streaming
Pulse animation = AI is thinking
```

### Loading States That Inform

Instead of generic spinners, show what AI is doing:

```
Bad:  [Loading...]

Good: ✓ Scraping competitor website
      ✓ Searching recent news (found 12 articles)
      ● Analyzing pricing page...
      ○ Generating competitive insights
```

### AI Confidence Indicators

Show users how confident the AI is:

```
┌────────────────────────────────────┐
│ ✨ AI Suggestion           High ●●●○ │
│                                    │
│ "Partner with Mixpanel"            │
│                                    │
│ Based on: 3 supporting evidence,   │
│ timeline constraint match          │
└────────────────────────────────────┘
```

### Error Handling for AI

When AI fails, be helpful:

```
┌────────────────────────────────────┐
│ ⚠ Couldn't research this company   │
│                                    │
│ We couldn't find enough public     │
│ information about "Acme Stealth".  │
│                                    │
│ Try:                               │
│ • Adding their website URL         │
│ • Using a different company name   │
│ • Adding evidence manually         │
│                                    │
│ [Try Again] [Add Manually]         │
└────────────────────────────────────┘
```

---

## 4. AI-First Flow (Recommended Default)

For the most magical experience, guide users through an AI-assisted flow:

```
1. USER ENTERS FRAME
   └──► AI immediately suggests decision type + improves question

2. AI SUGGESTS CONTEXT
   └──► Based on type, show suggested constraints + stakeholders
   └──► User accepts/modifies/adds

3. AI GENERATES OPTIONS
   └──► Based on frame + context, suggest 2-3 options
   └──► User accepts, then AI analyzes each one

4. AI RESEARCHES EVIDENCE
   └──► If competitors mentioned, auto-offer research
   └──► AI finds web evidence, user curates
   └──► Auto-links to options

5. AI SURFACES TRADEOFFS
   └──► Extracts from pros/cons automatically
   └──► User acknowledges

6. AI SUGGESTS RECOMMENDATION
   └──► Based on evidence weight
   └──► User adjusts confidence + adds rationale

7. AI GENERATES BRIEF
   └──► Full document in 30 seconds
   └──► User reviews, edits, shares
```

### First-Time User: AI-Guided Mode

For new users, default to maximum AI assistance:

```
┌─────────────────────────────────────────────────────┐
│ ✨ AI-Guided Mode                          [Turn off]│
│                                                     │
│ I'll help you build this decision step by step.    │
│ You can always edit or override my suggestions.    │
│                                                     │
│ Let's start with your decision question...         │
└─────────────────────────────────────────────────────┘
```

### Power User: AI-On-Demand Mode

Experienced users can toggle to manual with AI buttons:

```
Settings > Preferences > AI Assistance: [On-Demand ▾]

Options:
• Full (AI guides each step)
• On-Demand (AI buttons, no auto-suggestions)  ← Power users
• Minimal (AI only for brief generation)
```

---

## 5. AI Button Placement Summary

| Location | Button | Action |
|----------|--------|--------|
| Frame section | "✨ Improve" | Rewrite question for clarity |
| Context section | "✨ Suggest" | Add constraints/stakeholders |
| Options header | "✨ Suggest Options" | Generate 2-3 options |
| Option card | "✨ Analyze" | Generate pros/cons/risks |
| Options header | "✨ Compare" | Side-by-side matrix |
| Evidence header | "✨ Research" | Competitor profiles |
| Evidence header | "✨ Find Evidence" | Web research |
| Tradeoffs header | "✨ Surface" | Extract from options |
| Recommendation | "✨ Suggest" | AI recommendation |
| Quality sidebar | "✨ Identify Gaps" | What's missing |
| Brief button | "Generate Brief" | Full AI generation |

---

## 6. Keyboard Shortcuts for AI

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + G` | Generate (context-aware: suggest options, research, etc.) |
| `Cmd/Ctrl + Enter` | Accept AI suggestion |
| `Escape` | Dismiss AI suggestion |
| `Tab` | Cycle through AI suggestions |
