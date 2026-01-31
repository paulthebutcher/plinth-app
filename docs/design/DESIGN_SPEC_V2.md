# Plinth Design Specification v2

> **Evidence-First Architecture**
> Based on CORE_JOURNEY.md - 9-step flow

---

## Design System

> **Design Inspiration**: [Firecrawl.dev](https://www.firecrawl.dev/)
> Clean, modern SaaS aesthetic with bold orange accents and confident typography.

### Brand Philosophy

- **Confident, not flashy** — Orange conveys energy and action without being aggressive
- **Paper & Graphite** — Light backgrounds with charcoal text for readability
- **Structured clarity** — Grid-based layouts that feel organized, not cramped
- **Professional warmth** — Trustworthy for executives, not cold or sterile

### Color Tokens

```css
/* ═══════════════════════════════════════════════════════════
   PRIMARY: Orange (Action, CTAs, Brand)
   ═══════════════════════════════════════════════════════════ */
--primary: #F97316;              /* orange-500 - main brand */
--primary-hover: #EA580C;        /* orange-600 - hover state */
--primary-active: #C2410C;       /* orange-700 - active/pressed */
--primary-soft: #FFF7ED;         /* orange-50 - subtle backgrounds */
--primary-foreground: #FFFFFF;   /* white text on orange */

/* ═══════════════════════════════════════════════════════════
   BACKGROUNDS: Paper & Graphite
   ═══════════════════════════════════════════════════════════ */
--background: #FFFFFF;           /* pure white - main bg */
--background-subtle: #F9FAFB;    /* gray-50 - cards, sections */
--background-muted: #F3F4F6;     /* gray-100 - hover states */
--background-dark: #18181B;      /* zinc-900 - dark mode bg */

/* ═══════════════════════════════════════════════════════════
   FOREGROUND: Graphite Text
   ═══════════════════════════════════════════════════════════ */
--foreground: #18181B;           /* zinc-900 - primary text */
--foreground-muted: #52525B;     /* zinc-600 - secondary text */
--foreground-subtle: #A1A1AA;    /* zinc-400 - placeholder, captions */
--foreground-inverse: #FAFAFA;   /* zinc-50 - text on dark */

/* ═══════════════════════════════════════════════════════════
   SEMANTIC: Status & Feedback
   ═══════════════════════════════════════════════════════════ */
--success: #10B981;              /* emerald-500 */
--success-soft: #ECFDF5;         /* emerald-50 */
--warning: #F59E0B;              /* amber-500 */
--warning-soft: #FFFBEB;         /* amber-50 */
--error: #EF4444;                /* red-500 */
--error-soft: #FEF2F2;           /* red-50 */
--info: #3B82F6;                 /* blue-500 */
--info-soft: #EFF6FF;            /* blue-50 */

/* ═══════════════════════════════════════════════════════════
   ANALYSIS STATUS (Evidence-First Flow)
   ═══════════════════════════════════════════════════════════ */
--status-draft: #71717A;         /* zinc-500 */
--status-scanning: #F97316;      /* orange-500 - in progress */
--status-complete: #10B981;      /* emerald-500 */
--status-tracking: #3B82F6;      /* blue-500 */

/* ═══════════════════════════════════════════════════════════
   EVIDENCE & CONFIDENCE
   ═══════════════════════════════════════════════════════════ */
--confidence-high: #10B981;      /* emerald-500 */
--confidence-medium: #F59E0B;    /* amber-500 */
--confidence-low: #EF4444;       /* red-500 */

--evidence-supporting: #10B981;  /* emerald-500 */
--evidence-contradicting: #EF4444; /* red-500 */
--evidence-unknown: #71717A;     /* zinc-500 */

/* ═══════════════════════════════════════════════════════════
   BORDERS & DIVIDERS
   ═══════════════════════════════════════════════════════════ */
--border: #E5E7EB;               /* gray-200 */
--border-strong: #D1D5DB;        /* gray-300 */
--border-focus: #F97316;         /* orange-500 - focus ring */
--border-dark: #27272A;          /* zinc-800 - dark mode */
```

### Typography Scale

> **Font Stack**: `'Inter', -apple-system, BlinkMacSystemFont, sans-serif`
> Matches Firecrawl's clean, geometric sans-serif feel.

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|-------|------|--------|-------------|----------------|-----|
| display | 60px | 700 | 1.1 | -0.02em | Hero headlines |
| h1 | 48px | 700 | 1.2 | -0.02em | Page titles |
| h2 | 36px | 600 | 1.25 | -0.01em | Section headers |
| h3 | 24px | 600 | 1.3 | 0 | Card titles |
| h4 | 20px | 600 | 1.4 | 0 | Subsection titles |
| body-lg | 18px | 400 | 1.6 | 0 | Emphasized paragraphs |
| body | 16px | 400 | 1.5 | 0 | Default text |
| body-sm | 14px | 400 | 1.5 | 0 | Secondary text |
| caption | 12px | 500 | 1.4 | 0.01em | Labels, badges |
| mono | 14px | 400 | 1.5 | 0 | Code, data |

**Font Files:**
```css
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
```

### Spacing Scale

| Token | Value | Use |
|-------|-------|-----|
| 0 | 0px | Reset |
| 1 | 4px | Tight icon gaps |
| 2 | 8px | Compact spacing |
| 3 | 12px | Button padding-x |
| 4 | 16px | Default gap |
| 5 | 20px | Card padding |
| 6 | 24px | Section gaps |
| 8 | 32px | Component spacing |
| 10 | 40px | Page sections |
| 12 | 48px | Major sections |
| 16 | 64px | Page margins |
| 20 | 80px | Hero spacing |

### Border Radius

| Token | Value | Use |
|-------|-------|-----|
| none | 0 | Square edges |
| sm | 4px | Badges, tags |
| md | 8px | Buttons, inputs |
| lg | 12px | Cards |
| xl | 16px | Modals, panels |
| 2xl | 24px | Large cards |
| full | 9999px | Pills, avatars |

### Shadows

```css
/* Subtle elevation - modern, soft shadows */
--shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06);
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05);
--shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.1), 0 8px 10px rgba(0, 0, 0, 0.04);

/* Orange glow for focus/active states */
--shadow-glow: 0 0 0 3px rgba(249, 115, 22, 0.3);
--shadow-glow-lg: 0 0 20px rgba(249, 115, 22, 0.2);
```

### Button Styles

**Primary (Orange CTA):**
```css
.btn-primary {
  background: var(--primary);
  color: white;
  font-weight: 600;
  padding: 12px 24px;
  border-radius: 8px;
  transition: all 150ms;
}
.btn-primary:hover {
  background: var(--primary-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}
.btn-primary:active {
  background: var(--primary-active);
  transform: translateY(0);
}
```

**Secondary (Outline):**
```css
.btn-secondary {
  background: transparent;
  color: var(--foreground);
  border: 1px solid var(--border-strong);
  font-weight: 500;
  padding: 12px 24px;
  border-radius: 8px;
}
.btn-secondary:hover {
  background: var(--background-muted);
  border-color: var(--foreground-muted);
}
```

**Ghost (Text only):**
```css
.btn-ghost {
  background: transparent;
  color: var(--foreground-muted);
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 8px;
}
.btn-ghost:hover {
  background: var(--background-muted);
  color: var(--foreground);
}
```

### Grid & Layout

**Container Widths:**
```css
--container-sm: 640px;   /* Tight content (auth pages) */
--container-md: 768px;   /* Default content */
--container-lg: 1024px;  /* Wide content */
--container-xl: 1280px;  /* Full dashboard */
--container-2xl: 1536px; /* Max width */
```

**Grid Pattern:**
- Use 12-column grid on desktop
- 4px baseline for vertical rhythm
- Consistent 24px (space-6) gaps between components
- Cards use 20px (space-5) internal padding

**Layout Structure:**
```
┌─────────────────────────────────────────────────────────────┐
│ Header (sticky, 64px height)                                │
├────────────┬────────────────────────────────────────────────┤
│            │                                                │
│  Sidebar   │  Main Content                                  │
│  (240px)   │  (flex-1, max-width: 1280px, centered)        │
│            │                                                │
│            │  ┌──────────────────────────────────────────┐ │
│            │  │ Page Header                              │ │
│            │  ├──────────────────────────────────────────┤ │
│            │  │                                          │ │
│            │  │ Content Area                             │ │
│            │  │ (space-y-6 for vertical sections)        │ │
│            │  │                                          │ │
│            │  └──────────────────────────────────────────┘ │
│            │                                                │
└────────────┴────────────────────────────────────────────────┘
```

### Dark Mode

Default is **light mode** (paper & graphite). Dark mode available via toggle.

**Dark Mode Token Overrides:**
```css
[data-theme="dark"] {
  --background: #09090B;           /* zinc-950 */
  --background-subtle: #18181B;    /* zinc-900 */
  --background-muted: #27272A;     /* zinc-800 */

  --foreground: #FAFAFA;           /* zinc-50 */
  --foreground-muted: #A1A1AA;     /* zinc-400 */
  --foreground-subtle: #71717A;    /* zinc-500 */

  --border: #27272A;               /* zinc-800 */
  --border-strong: #3F3F46;        /* zinc-700 */

  /* Primary stays orange - pops on dark */
  --primary: #FB923C;              /* orange-400 - slightly lighter */
  --primary-soft: #27272A;         /* dark subtle bg */
}
```

### Component Library

Uses **shadcn/ui** with customizations:

| Component | shadcn Name | Customization |
|-----------|-------------|---------------|
| Button | `button` | Orange primary, gray secondary |
| Input | `input` | Orange focus ring |
| Textarea | `textarea` | Larger padding, subtle border |
| Select | `select` | Consistent with inputs |
| Slider | `slider` | Orange thumb and track fill |
| Badge | `badge` | Semantic colors, sm radius |
| Card | `card` | White bg, lg radius, soft shadow |
| Dialog | `dialog` | Centered, xl radius |
| Sheet | `sheet` | Slide panel for mobile |
| Tabs | `tabs` | Orange active indicator |
| Progress | `progress` | Orange fill |
| Skeleton | `skeleton` | Subtle gray pulse |
| Toast | `sonner` | Bottom-right, with icons |

### Icons

Use **Lucide Icons** (same as shadcn default).

Key icons for Plinth:
| Use | Icon |
|-----|------|
| New analysis | `Sparkles` |
| Dashboard | `LayoutGrid` |
| Settings | `Settings` |
| Decision | `Target` |
| Evidence | `Search` or `FileText` |
| Options | `Layers` |
| Confidence | `TrendingUp` |
| Recommendation | `ThumbsUp` or `CheckCircle` |
| Tracking | `Activity` |
| Warning | `AlertTriangle` |
| Error | `XCircle` |
| Success | `CheckCircle` |

### Animation Guidelines

| Interaction | Animation | Duration | Easing |
|-------------|-----------|----------|--------|
| Button hover | Background + lift | 150ms | ease-out |
| Button press | Scale 0.98 | 100ms | ease-in |
| Card hover | Shadow + subtle lift | 200ms | ease-out |
| Modal open | Fade + scale | 200ms | ease-out |
| Modal close | Fade + scale | 150ms | ease-in |
| Slide panel | Slide from edge | 300ms | ease-out |
| Toast appear | Slide up + fade | 200ms | ease-out |
| Progress bar | Width | 300ms | ease-in-out |
| Skeleton | Pulse opacity | 1.5s | ease-in-out (loop) |

**Reduced Motion:**
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Sitemap (Updated)

```
plinth.app/
│
├── (public)
│   ├── /                           # Marketing landing
│   ├── /login                      # Login page
│   ├── /signup                     # Signup page
│   ├── /forgot-password            # Password reset request
│   ├── /reset-password             # Set new password
│   ├── /share/[key]                # Public decision brief view
│   ├── /privacy                    # Privacy policy
│   └── /terms                      # Terms of service
│
├── (onboarding)
│   ├── /onboarding/welcome         # Welcome screen
│   └── /onboarding/profile         # Org name & role setup
│
├── (dashboard) - requires auth
│   ├── /dashboard                  # Decision list (home)
│   │
│   ├── /analyze                    # NEW: Start new analysis
│   ├── /analyze/[id]               # NEW: Analysis in progress
│   ├── /analyze/[id]/frame         # Step 1: Decision framing
│   ├── /analyze/[id]/context       # Step 2: Context anchoring
│   ├── /analyze/[id]/scanning      # Step 3: Evidence scan (async)
│   ├── /analyze/[id]/options       # Step 4-5: Options + mapping
│   ├── /analyze/[id]/scoring       # Step 6: Confidence scoring
│   ├── /analyze/[id]/recommend     # Step 7: Recommendation
│   │
│   ├── /decisions/[id]             # Completed decision view
│   ├── /decisions/[id]/brief       # Decision brief
│   ├── /decisions/[id]/track       # Step 9: Tracking dashboard
│   │
│   ├── /settings/profile           # User profile
│   ├── /settings/team              # Team members
│   └── /settings/organization      # Org settings (admin)
│
└── (api)
    └── /api/...
```

### Key Changes from v1
- Removed `/decisions/[id]` canvas (replaced by `/analyze/[id]/*` flow)
- Added `/analyze/*` routes for the 9-step journey
- Added `/decisions/[id]/track` for post-decision monitoring
- Simplified: fewer user-editable sections, more AI-driven views

---

## Core UI Patterns

### The Analysis Flow

Unlike traditional apps where users fill out forms, Plinth's analysis flow is:
1. **User provides input** (Steps 1-2)
2. **AI works visibly** (Step 3)
3. **User validates AI output** (Steps 4-7)
4. **AI produces artifact** (Step 8)

### Progress Indicator

Always visible during analysis:

```
┌─────────────────────────────────────────────────────────────────┐
│  1        2        3        4        5        6        7        │
│  ●────────●────────◐────────○────────○────────○────────○        │
│ Frame  Context  Scanning Options  Score   Recommend  Brief     │
└─────────────────────────────────────────────────────────────────┘
```

- ● = Complete
- ◐ = In progress
- ○ = Not started

---

## Page-by-Page Specification

### Dashboard (`/dashboard`)

**Purpose:** View all analyses, start new one

**Components:**
| Component | Description |
|-----------|-------------|
| PageHeader | "Decisions" title |
| PrimaryCTA | "Analyze a Decision" (large, prominent) |
| DecisionGrid | Cards for each analysis |
| FilterBar | Status filter (Analyzing, Complete, Tracking) |
| EmptyState | When no decisions exist |

**DecisionCard (Updated):**
```
┌─────────────────────────────────────────────────────────────────┐
│ Mid-Market Entry Strategy                                       │
│                                                                 │
│ ┌─────────┐                                                     │
│ │Complete │  Recommendation: Option B                          │
│ └─────────┘  Confidence: 72%                                   │
│                                                                 │
│ 4 options · 38 evidence items · Updated 2 hours ago            │
│                                                                 │
│ [View Brief] [Track]                                  [···]    │
└─────────────────────────────────────────────────────────────────┘
```

---

### Analyze Entry (`/analyze`)

**Purpose:** Start a new analysis

**Layout:** Full-screen focused, no sidebar

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                     Analyze a Decision                          │
│                                                                 │
│        What strategic decision are you trying to make?          │
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │                                                             │ │
│ │ Should we enter the mid-market with a lighter compliance   │ │
│ │ SKU?                                                        │ │
│ │                                                             │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ Examples:                                                       │
│ • "Should we build or buy an analytics platform?"              │
│ • "Should we expand to the UK market this year?"               │
│ • "Which 3 features should we prioritize for Q2?"              │
│                                                                 │
│                    [Start Analysis →]                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

### Step 1: Decision Framing (`/analyze/[id]/frame`)

**Purpose:** Lock the decision frame before ideation

**Layout:** Card-based, focused input

```
┌─────────────────────────────────────────────────────────────────┐
│ ← Back                                Step 1 of 7: Frame        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ Decision Statement                                              │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ Should we enter the mid-market with a lighter compliance   │ │
│ │ SKU?                                                        │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ What type of decision is this?                                  │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐             │
│ │  Product     │ │  Market      │ │  Investment  │             │
│ │  Bet         │ │  Entry  ●    │ │              │             │
│ └──────────────┘ └──────────────┘ └──────────────┘             │
│ ┌──────────────┐ ┌──────────────┐                               │
│ │  Platform /  │ │  Org /       │                               │
│ │  Architecture│ │  Operating   │                               │
│ └──────────────┘ └──────────────┘                               │
│                                                                 │
│ Time Horizon                                                    │
│ ○ 3-6 months  ● 6-18 months  ○ 2+ years                        │
│                                                                 │
│ Decision Stakes                                                 │
│ Reversibility:  Reversible ○────────●────○ Irreversible        │
│ Investment:     <$1M ○────●────────○ $10M+                      │
│ Scope:          Team ○────────●────○ Exec-level                │
│                                                                 │
│                              [Continue →]                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Key UI Elements:**
- Decision type as visual cards (single select)
- Time horizon as segmented control
- Stakes as sliders with semantic labels

---

### Step 2: Context Anchoring (`/analyze/[id]/context`)

**Purpose:** Add constraints and assumptions (optional but valuable)

```
┌─────────────────────────────────────────────────────────────────┐
│ ← Back                              Step 2 of 7: Context        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ Add context to improve analysis (optional)                      │
│                                                                 │
│ ┌─ Company Context ─────────────────────────────────────────┐  │
│ │ Series B, 150 employees, B2B SaaS, US + EU markets        │  │
│ └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│ ┌─ Known Constraints ───────────────────────────────────────┐  │
│ │                                                           │  │
│ │ ┌─────────────────────────────────┐ ┌───────────────────┐ │  │
│ │ │ SOC2 compliance required        │ │ [Legal]           │ │  │
│ │ └─────────────────────────────────┘ └───────────────────┘ │  │
│ │                                                           │  │
│ │ ┌─────────────────────────────────┐ ┌───────────────────┐ │  │
│ │ │ Max $50k annual budget          │ │ [Budget]          │ │  │
│ │ └─────────────────────────────────┘ └───────────────────┘ │  │
│ │                                                           │  │
│ │ [+ Add constraint]                                        │  │
│ └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│ ┌─ Assumptions You Hold ────────────────────────────────────┐  │
│ │ Mid-market wants simpler pricing                          │  │
│ │ [+ Add assumption]                                        │  │
│ └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│ ┌─ What Would Make This Obviously Wrong? ───────────────────┐  │
│ │ If enterprise pipeline grows 50%+ this quarter            │  │
│ │ [+ Add condition]                                         │  │
│ └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│              [Skip for now]        [Continue →]                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

### Step 3: Evidence Scanning (`/analyze/[id]/scanning`)

**Purpose:** Show AI work in progress (NOT a spinner)

**Key UX Principle:** Make the work visible. Users should see exactly what the AI is doing.

```
┌─────────────────────────────────────────────────────────────────┐
│                               Step 3 of 7: Gathering Evidence   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│                  ✨ Analyzing signal landscape                  │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ ████████████████████████████░░░░░░░░░░░░░░░░  62%       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ✓ Planning research strategy                                   │
│    → 14 queries across market, competitor, regulatory          │
│                                                                 │
│  ✓ Discovering relevant sources                                 │
│    → Found 52 URLs from Exa search                             │
│                                                                 │
│  ● Extracting evidence from sources                             │
│    → Processing 18 of 28 pages...                              │
│                                                                 │
│  ○ Synthesizing evidence cards                                  │
│                                                                 │
│  ○ Generating strategic options                                 │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 📄 Live findings                                         │   │
│  │                                                          │   │
│  │ "Competitor X launched mid-market tier in Q4 2023,      │   │
│  │  seeing 40% of new ARR from this segment..."            │   │
│  │  — TechCrunch, Dec 2023                                 │   │
│  │                                                          │   │
│  │ "Mid-market buyers prioritize implementation speed      │   │
│  │  over feature completeness by 3:1 margin..."            │   │
│  │  — Gartner Survey, 2024                                 │   │
│  │                                                          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Estimated time remaining: ~45 seconds                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Animation Details:**
- Progress bar moves smoothly
- Checkmarks animate in as steps complete
- "Live findings" panel streams new evidence as found
- Each finding fades in with subtle animation

---

### Step 4-5: Options & Mapping (`/analyze/[id]/options`)

**Purpose:** Present AI-generated options with evidence mapping

**Layout:** Options on left, evidence mapping on right

```
┌─────────────────────────────────────────────────────────────────┐
│ ← Back                              Step 4 of 7: Options        │
├──────────────────────────────┬──────────────────────────────────┤
│                              │                                  │
│ AI generated 4 options       │ Evidence for Option B            │
│ based on 38 evidence items   │                                  │
│                              │ SUPPORTING (5)                   │
│ ┌──────────────────────────┐ │ ┌──────────────────────────────┐ │
│ │ A. Full Enterprise Focus │ │ │ "Competitor X saw 40% ARR    │ │
│ │    Score: 58             │ │ │  growth from mid-market"     │ │
│ └──────────────────────────┘ │ │  TechCrunch · High conf.     │ │
│                              │ └──────────────────────────────┘ │
│ ┌──────────────────────────┐ │ ┌──────────────────────────────┐ │
│ │ B. Mid-Market Entry  ●   │ │ │ "Mid-market prioritizes     │ │
│ │    Score: 72 ★           │ │ │  speed over features 3:1"   │ │
│ └──────────────────────────┘ │ │  Gartner · High conf.        │ │
│                              │ └──────────────────────────────┘ │
│ ┌──────────────────────────┐ │ + 3 more supporting...          │
│ │ C. Hybrid Approach       │ │                                  │
│ │    Score: 64             │ │ CONTRADICTING (2)               │
│ └──────────────────────────┘ │ ┌──────────────────────────────┐ │
│                              │ │ "Brand perception shows      │ │
│ ┌──────────────────────────┐ │ │  strong enterprise identity" │ │
│ │ D. Wait & Monitor        │ │ │  Internal Survey · Med conf. │ │
│ │    Score: 45             │ │ └──────────────────────────────┘ │
│ └──────────────────────────┘ │                                  │
│                              │ UNKNOWNS (3)                     │
│                              │ • Competitor Y pricing (hidden)  │
│                              │ • Customer acceptance of partial │
│                              │ • Sales team readiness           │
│                              │                                  │
│              [Continue →]    │ ASSUMPTIONS REQUIRED             │
│                              │ • Mid-market accepts 12mo roadmap│
│                              │ • Sales can reposition           │
└──────────────────────────────┴──────────────────────────────────┘
```

**Option Card (Expanded):**
```
┌─────────────────────────────────────────────────────────────────┐
│ B. Mid-Market Entry via Modular Compliance         Score: 72 ★  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ COMMITS TO                                                      │
│ Partial compliance coverage with clear roadmap signaling        │
│                                                                 │
│ DEPRIORITIZES                                                   │
│ Enterprise edge cases for 12-18 months                          │
│                                                                 │
│ PRIMARY UPSIDE                                                  │
│ Faster ARR capture, clearer ICP expansion                       │
│                                                                 │
│ PRIMARY RISK                                                    │
│ Brand dilution if expectations not managed                      │
│                                                                 │
│ REVERSIBILITY: Medium                                           │
│ Can add enterprise features later; harder to un-position        │
│                                                                 │
│ Evidence: 5 supporting · 2 contradicting · 3 unknowns           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

### Step 6: Confidence Scoring (`/analyze/[id]/scoring`)

**Purpose:** Show transparent scoring, allow adjustment

```
┌─────────────────────────────────────────────────────────────────┐
│ ← Back                              Step 5 of 7: Scoring        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ Confidence Scores                                               │
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ B. Mid-Market Entry                              72 ★       │ │
│ │ ████████████████████████████████████░░░░░░░░░░░░            │ │
│ │                                                             │ │
│ │ Evidence Strength    ████████████████░░░░  80%              │ │
│ │ Evidence Recency     ████████████░░░░░░░░  65%              │ │
│ │ Source Reliability   █████████████████░░░  85%              │ │
│ │ Corroboration        ████████████████░░░░  75%              │ │
│ │ Constraint Fit       █████████████░░░░░░░  70%              │ │
│ │ Assumption Risk      ██████████░░░░░░░░░░  55%              │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ A. Full Enterprise Focus                         58         │ │
│ │ ██████████████████████████░░░░░░░░░░░░░░░░░░░░░░            │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ C. Hybrid Approach                               64         │ │
│ │ ██████████████████████████████░░░░░░░░░░░░░░░░░░            │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ Adjust Your Preferences                                         │
│ ─────────────────────────────────────────                       │
│ Risk Tolerance:  Conservative ○───●───○ Aggressive             │
│ Time Horizon:    [6-18 months ▼]                                │
│                                                                 │
│ ℹ️ "Option B scores lower on assumption risk because it         │
│    requires mid-market acceptance of partial compliance,        │
│    which is unverified."                                        │
│                                                                 │
│                              [Continue →]                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

### Step 7: Recommendation (`/analyze/[id]/recommend`)

**Purpose:** Present recommendation with conditions

```
┌─────────────────────────────────────────────────────────────────┐
│ ← Back                          Step 6 of 7: Recommendation     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│                         RECOMMENDATION                          │
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │                                                             │ │
│ │  PRIMARY                                                    │ │
│ │  ───────────────────────────────────────────────────        │ │
│ │  Option B: Mid-Market Entry via Modular Compliance          │ │
│ │                                                             │ │
│ │  Confidence: 72%                                            │ │
│ │  ████████████████████████████████████░░░░░░░░░░░░           │ │
│ │                                                             │ │
│ │  WHY                                                        │ │
│ │  Strongest alignment between recent market signals and      │ │
│ │  reversibility within your stated risk tolerance. Evidence  │ │
│ │  shows competitors succeeding with similar moves.           │ │
│ │                                                             │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │  HEDGE                                                      │ │
│ │  ───────────────────────────────────────────────────        │ │
│ │  Option D: Wait & Monitor                                   │ │
│ │                                                             │ │
│ │  If primary assumptions prove false within 90 days          │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │  THIS CHANGES IF                                            │ │
│ │  ───────────────────────────────────────────────────        │ │
│ │  ⚠ Major competitor announces full mid-market compliance    │ │
│ │  ⚠ Customer research shows <30% acceptance of partial       │ │
│ │  ⚠ Q1 enterprise pipeline exceeds forecast by 50%+          │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│        [← Adjust Analysis]      [Generate Brief →]              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

### Decision Brief (`/decisions/[id]/brief`)

**Purpose:** Final exportable artifact

**Components:**
| Section | Content |
|---------|---------|
| Header | Title, status, share/export buttons |
| Executive Summary | 2-3 sentence overview |
| The Decision | Question, recommendation, confidence |
| Options Considered | Each with why/why not |
| Evidence Summary | Key signals with citations |
| Assumptions Ledger | Declared, implicit, status |
| Decision Changers | What would trigger reconsideration |
| Metadata | Owner, date, stakeholders |

**Citation Format:**
Every claim links to source with:
- Publication name
- URL
- Access date
- Confidence indicator

---

### Decision Tracking (`/decisions/[id]/track`)

**Purpose:** Post-decision monitoring (Step 9)

```
┌─────────────────────────────────────────────────────────────────┐
│ Mid-Market Entry Strategy                              [Pause]  │
│ Decision made 14 days ago                                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ Monitoring Status: Active ●                                     │
│                                                                 │
│ WATCHED ASSUMPTIONS                                             │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ ✓ "No major competitor mid-market launch"                   │ │
│ │   Last checked: 2 hours ago · No changes                    │ │
│ ├─────────────────────────────────────────────────────────────┤ │
│ │ ⚠ "Mid-market accepts partial compliance"                   │ │
│ │   New signal: Customer survey shows 45% hesitancy           │ │
│ │   [Review Signal]                                           │ │
│ ├─────────────────────────────────────────────────────────────┤ │
│ │ ✓ "Sales team can reposition"                               │ │
│ │   Last checked: 1 day ago · Training complete               │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ RECENT SIGNALS                                                  │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ Jan 28 · "Competitor Y announces enterprise focus"          │ │
│ │          Source: TechCrunch                                 │ │
│ │          Impact: Positive for our mid-market play          │ │
│ ├─────────────────────────────────────────────────────────────┤ │
│ │ Jan 25 · "Market report: mid-market SaaS up 30% YoY"       │ │
│ │          Source: Gartner                                   │ │
│ │          Impact: Confirms market timing                    │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ CONFIDENCE TREND                                                │
│ 72% ─────────────●──────────── 71%                             │
│     Jan 14       Jan 21        Today                           │
│                                                                 │
│        [Revisit Decision]      [Export Update]                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Component Library (Updated)

### New Components for v2

| Component | Purpose |
|-----------|---------|
| `AnalysisProgress` | 7-step progress indicator |
| `ScanningView` | Live evidence gathering display |
| `OptionCard` | Displays option with commit/deprioritize |
| `EvidenceMapping` | Supporting/contradicting/unknown |
| `ConfidenceBreakdown` | Transparent scoring factors |
| `RecommendationCard` | Primary + hedge + changers |
| `AssumptionTracker` | Declared/implicit/status |
| `SignalFeed` | Live findings during scan |
| `DecisionChanger` | Condition that would flip recommendation |
| `MonitoringDashboard` | Post-decision tracking |

### Removed from v1

| Component | Reason |
|-----------|--------|
| `ProConsList` | AI generates, user validates (not edits) |
| `RisksList` | Rolled into option card |
| `TradeoffCard` | Simplified to "deprioritizes" field |
| `StakeholderManager` | Optional in v2, not a core section |
| `QualityScore` | Replaced by confidence scoring |

---

## User Journey Comparison

### v1 (Old): User-Driven
```
User thinks of options
  → User adds pros/cons
    → User adds evidence
      → User acknowledges tradeoffs
        → AI helps generate brief
```

### v2 (New): AI-Driven
```
User frames decision
  → AI gathers evidence
    → AI generates options (grounded in evidence)
      → AI maps evidence to options
        → AI scores and recommends
          → User validates and adjusts
            → AI generates brief
```

**Key Difference:** Evidence before options prevents narrative anchoring.

---

## Timing & Interaction Model

| Step | Who Does Work | Duration |
|------|---------------|----------|
| 1. Frame | User (input) | 2-3 min |
| 2. Context | User (optional) | 1-2 min |
| 3. Scan | AI (visible) | 30-90 sec |
| 4-5. Options | AI → User validates | 2-3 min |
| 6. Scoring | AI → User adjusts | 1-2 min |
| 7. Recommend | AI → User confirms | 1 min |
| 8. Brief | AI (generates) | 15-30 sec |
| **Total** | | **8-12 min** |

---

## Responsive Considerations

### Mobile: Not Primary
This is a strategic decision tool. Desktop/tablet is primary.

### Tablet: Supported
- Single column layout for option + evidence
- Collapsible panels

### Desktop: Optimized
- Two-column for options + evidence mapping
- Progress always visible
- Keyboard shortcuts for power users
