# Plinth Design Specification (v1 - DEPRECATED)

> # ⛔ DEPRECATED - DO NOT USE
>
> **This document is DEPRECATED.** Do not reference this file for any design or implementation decisions.
>
> ## Use [DESIGN_SPEC_V2.md](./DESIGN_SPEC_V2.md) instead
>
> ### Key Differences (v1 → v2):
>
> | Aspect | v1 (DEPRECATED) | v2 (CURRENT) |
> |--------|-----------------|--------------|
> | **Primary Color** | Blue (#3B82F6) | **Orange (#F97316)** |
> | **Background** | Dark zinc (#09090B) | **Light paper (#FFFFFF)** |
> | **User Flow** | User adds options/evidence | AI generates, user validates |
> | **Routes** | `/decisions/[id]` canvas | `/analyze/[id]/*` flow |
> | **Scoring** | Quality percentage | Confidence scoring |
> | **Design Inspiration** | Generic dark SaaS | **Firecrawl.dev** |
>
> ### ⚠️ If you're building UI:
> 1. **DO NOT** use blue as primary color
> 2. **DO NOT** use dark zinc backgrounds by default
> 3. **DO** use orange (#F97316) as primary
> 4. **DO** use light backgrounds with graphite text
> 5. **DO** follow the Design System in DESIGN_SPEC_V2.md

---

> ~~For use in Figma / Pencil.dev~~ (see v2 for current spec)

---

## 1. Sitemap

```
plinth.app/
│
├── (public)
│   ├── /                           # Marketing landing (future)
│   ├── /login                      # Login page
│   ├── /signup                     # Signup page
│   ├── /forgot-password            # Request password reset
│   ├── /reset-password             # Set new password
│   ├── /invite/[token]             # Accept team invitation
│   ├── /share/[key]                # Public decision brief view
│   ├── /privacy                    # Privacy policy
│   └── /terms                      # Terms of service
│
├── (onboarding)
│   ├── /onboarding/welcome         # Welcome screen
│   ├── /onboarding/organization    # Set org name & role
│   └── /onboarding/first-decision  # Guided first decision
│
├── (dashboard) - requires auth
│   ├── /dashboard                  # Decision list (home)
│   ├── /decisions/[id]             # Decision canvas (main workspace)
│   ├── /decisions/[id]/brief       # Brief preview/edit
│   ├── /settings/profile           # User profile settings
│   ├── /settings/team              # Team members & invites
│   └── /settings/organization      # Org settings (admin)
│
└── (api) - not visible
    └── /api/...
```

### Page Count Summary
- **Auth pages**: 5
- **Onboarding pages**: 3
- **Dashboard pages**: 6
- **Public pages**: 3
- **Total unique page designs**: 17

---

## 2. Design System

### Recommended Setup for Figma/Pencil

**Install these Figma resources:**
1. **shadcn/ui Figma Kit** - Search "shadcn figma" (community file)
2. **Lucide Icons** - Icon library (matches shadcn)
3. **Inter Font** - Primary typeface

### Color Tokens

```css
/* Background */
--background: #09090B;           /* zinc-950 - main bg */
--background-subtle: #18181B;    /* zinc-900 - cards */
--background-muted: #27272A;     /* zinc-800 - hover states */

/* Foreground */
--foreground: #FAFAFA;           /* zinc-50 - primary text */
--foreground-muted: #A1A1AA;     /* zinc-400 - secondary text */
--foreground-subtle: #71717A;    /* zinc-500 - placeholder */

/* Primary (Blue) */
--primary: #3B82F6;              /* blue-500 */
--primary-hover: #2563EB;        /* blue-600 */
--primary-foreground: #FFFFFF;

/* Semantic */
--success: #10B981;              /* emerald-500 */
--warning: #F59E0B;              /* amber-500 */
--error: #EF4444;                /* red-500 */
--info: #3B82F6;                 /* blue-500 */

/* Decision Status */
--status-draft: #71717A;         /* zinc-500 */
--status-review: #F59E0B;        /* amber-500 */
--status-committed: #10B981;     /* emerald-500 */
--status-archived: #52525B;      /* zinc-600 */

/* Evidence Strength */
--strength-strong: #10B981;
--strength-moderate: #F59E0B;
--strength-weak: #EF4444;

/* Borders */
--border: #27272A;               /* zinc-800 */
--border-focus: #3B82F6;         /* blue-500 */
```

### Typography Scale

| Name | Size | Weight | Line Height | Use |
|------|------|--------|-------------|-----|
| h1 | 36px | 700 | 40px | Page titles |
| h2 | 30px | 600 | 36px | Section headers |
| h3 | 24px | 600 | 32px | Card titles |
| h4 | 20px | 600 | 28px | Subsection titles |
| body | 16px | 400 | 24px | Default text |
| body-sm | 14px | 400 | 20px | Secondary text |
| caption | 12px | 500 | 16px | Labels, badges |
| mono | 14px | 400 | 20px | Code, data |

**Font Stack:**
```css
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

### Spacing Scale

| Token | Value | Use |
|-------|-------|-----|
| xs | 4px | Icon gaps |
| sm | 8px | Tight spacing |
| md | 16px | Default padding |
| lg | 24px | Section gaps |
| xl | 32px | Page padding |
| 2xl | 48px | Major sections |
| 3xl | 64px | Page margins |

### Border Radius

| Token | Value | Use |
|-------|-------|-----|
| sm | 4px | Badges, small elements |
| md | 6px | Buttons, inputs |
| lg | 8px | Cards |
| xl | 12px | Modals, large cards |
| full | 9999px | Pills, avatars |

### Shadows

```css
--shadow-sm: 0 1px 2px rgba(0,0,0,0.5);
--shadow-md: 0 4px 6px rgba(0,0,0,0.5);
--shadow-lg: 0 10px 15px rgba(0,0,0,0.5);
--shadow-glow: 0 0 20px rgba(59,130,246,0.3); /* for focus states */
```

---

## 3. Component Library

### Global Components

| Component | shadcn Name | Notes |
|-----------|-------------|-------|
| Button | `button` | Variants: default, secondary, ghost, destructive |
| Input | `input` | With label wrapper |
| Textarea | `textarea` | Auto-resize for rich content |
| Select | `select` | Dropdown menus |
| Checkbox | `checkbox` | For acknowledgments |
| Slider | `slider` | Confidence score |
| Badge | `badge` | Status, categories |
| Card | `card` | Content containers |
| Dialog | `dialog` | Modals |
| Sheet | `sheet` | Slide-out panels |
| Tabs | `tabs` | Section navigation |
| Avatar | `avatar` | User photos |
| Tooltip | `tooltip` | Help text |
| Toast | `sonner` | Notifications |
| Skeleton | `skeleton` | Loading states |
| Progress | `progress` | Quality score bar |
| Separator | `separator` | Dividers |
| DropdownMenu | `dropdown-menu` | Action menus |
| Command | `command` | Command palette (future) |

---

## 4. Page-by-Page Components

### 4.1 Login Page (`/login`)

**Layout:** Centered card, dark background

**Components:**
| Component | Props/Content |
|-----------|---------------|
| Logo | Plinth wordmark |
| Heading | "Welcome back" |
| GoogleOAuthButton | "Continue with Google" |
| Divider | "or" |
| EmailInput | placeholder: "work@company.com" |
| PasswordInput | placeholder: "••••••••" |
| Button (primary) | "Log in" |
| Link | "Forgot password?" |
| Link | "Don't have an account? Sign up" |

**Sample Data:**
```
Email: sarah@acme.com
```

---

### 4.2 Signup Page (`/signup`)

**Layout:** Centered card, dark background

**Components:**
| Component | Props/Content |
|-----------|---------------|
| Logo | Plinth wordmark |
| Heading | "Create your account" |
| GoogleOAuthButton | "Continue with Google" |
| Divider | "or" |
| FullNameInput | placeholder: "Sarah Chen" |
| EmailInput | placeholder: "work@company.com" |
| PasswordInput | placeholder: "8+ characters" |
| Button (primary) | "Create account" |
| Caption | "By signing up, you agree to our Terms and Privacy Policy" |
| Link | "Already have an account? Log in" |

---

### 4.3 Forgot Password (`/forgot-password`)

**Components:**
| Component | Props/Content |
|-----------|---------------|
| Heading | "Reset your password" |
| Description | "Enter your email and we'll send you a reset link" |
| EmailInput | placeholder: "work@company.com" |
| Button (primary) | "Send reset link" |
| Link | "Back to login" |

**Success State:**
| Component | Props/Content |
|-----------|---------------|
| Icon | Mail (Lucide) |
| Heading | "Check your email" |
| Description | "We've sent a password reset link to sarah@acme.com" |

---

### 4.4 Onboarding: Welcome (`/onboarding/welcome`)

**Layout:** Full screen, centered content

**Components:**
| Component | Props/Content |
|-----------|---------------|
| Logo | Large Plinth logo |
| Heading | "Welcome to Plinth" |
| Subheading | "Make better decisions, faster" |
| ValueProps | 3 bullet points with icons |
| Button (primary, large) | "Get started" |
| ProgressDots | 1 of 3 active |

**Value Props Sample:**
```
✓ Frame decisions clearly with proven templates
✓ Analyze options with AI-powered research
✓ Generate executive-ready briefs in minutes
```

---

### 4.5 Onboarding: Organization (`/onboarding/organization`)

**Components:**
| Component | Props/Content |
|-----------|---------------|
| Heading | "Set up your workspace" |
| OrgNameInput | label: "Organization name", placeholder: "Acme Corp" |
| RoleSelect | label: "Your role" |
| Button (primary) | "Continue" |
| ProgressDots | 2 of 3 active |

**Role Options:**
```
- Product / Strategy Leader
- Executive (C-suite, VP)
- Chief of Staff
- Founder / Entrepreneur
- Consultant / Advisor
- Other
```

---

### 4.6 Onboarding: First Decision (`/onboarding/first-decision`)

**Components:**
| Component | Props/Content |
|-----------|---------------|
| Heading | "Create your first decision" |
| Subheading | "Pick a template to get started" |
| TemplateCards | 4 cards in 2x2 grid |
| SkipLink | "I'll explore on my own" |
| ProgressDots | 3 of 3 active |

**Template Cards:**
| Template | Icon | Description |
|----------|------|-------------|
| Build vs Buy | Hammer | Evaluate building in-house vs purchasing |
| Market Entry | Globe | Assess entering a new market or segment |
| Investment Decision | TrendingUp | Evaluate funding or resource allocation |
| Product Prioritization | ListOrdered | Rank features or initiatives |

---

### 4.7 Dashboard (`/dashboard`)

**Layout:** Sidebar + main content

**Sidebar Components:**
| Component | Content |
|-----------|---------|
| Logo | Plinth wordmark |
| NavItem (active) | "Decisions" icon: LayoutGrid |
| NavItem | "Settings" icon: Settings |
| Separator | --- |
| RecentDecisions | 3 most recent links |
| Separator | --- |
| UserMenu | Avatar + name dropdown |
| NewDecisionButton | "+ New Decision" (CTA) |

**Main Content Components:**
| Component | Props/Content |
|-----------|---------------|
| PageHeader | "Decisions" + NewDecisionButton |
| SearchInput | placeholder: "Search decisions..." |
| FilterTabs | All / Draft / In Review / Committed |
| DecisionCardList | List of DecisionCard components |
| EmptyState | (when no decisions) |

**DecisionCard Component:**
| Element | Sample Data |
|---------|-------------|
| Title | "CRM Platform Selection" |
| StatusBadge | "Draft" (gray) |
| QualityBar | 45% (orange) |
| Owner | Avatar + "Sarah Chen" |
| UpdatedAt | "Updated 2 hours ago" |
| OptionsCount | "3 options" |
| DropdownMenu | Edit, Duplicate, Delete |

**Sample Decision Cards:**
```
1. CRM Platform Selection
   Status: Draft | Quality: 45% | 3 options | Updated 2h ago

2. UK Market Entry Strategy
   Status: In Review | Quality: 82% | 2 options | Updated 1d ago

3. Q4 Feature Prioritization
   Status: Committed | Quality: 91% | 4 options | Updated 3d ago
```

**EmptyState Component:**
| Element | Content |
|---------|---------|
| Icon | FileQuestion |
| Heading | "No decisions yet" |
| Description | "Create your first decision to get started" |
| Button | "Create Decision" |

---

### 4.8 New Decision Modal

**Trigger:** "+ New Decision" button

**Components:**
| Component | Props/Content |
|-----------|---------------|
| DialogHeader | "Create new decision" |
| TemplateSelector | 5 visual cards |
| TitleInput | placeholder: "e.g., CRM Platform Selection" |
| FramingInput | placeholder: "What specific question are you trying to answer?" |
| Button (secondary) | "Cancel" |
| Button (primary) | "Create Decision" |

**Template Options:**
```
1. Build vs Buy - "Should we build or purchase a solution?"
2. Market Entry - "Should we enter this market or segment?"
3. Investment - "Should we invest in this opportunity?"
4. Prioritization - "How should we prioritize these items?"
5. Custom - "Start with a blank canvas"
```

---

### 4.9 Decision Canvas (`/decisions/[id]`)

**Layout:** Sidebar + Canvas + QualityPanel

**Header Components:**
| Component | Props/Content |
|-----------|---------------|
| BackLink | "← Decisions" |
| TitleEditable | "CRM Platform Selection" |
| StatusBadge | "Draft" with dropdown to change |
| QualityScore | "45%" with circular progress |
| ShareButton | icon: Share2 |
| MoreMenu | Duplicate, Export, Delete |

**Canvas Navigation (Tabs or Sidebar):**
| Section | Icon | Status |
|---------|------|--------|
| Frame | Target | ✓ Complete |
| Context | FileText | ⚠ Incomplete |
| Options | Layers | ✓ Complete |
| Evidence | Search | ✗ Missing |
| Tradeoffs | Scale | ✗ Missing |
| Recommendation | ThumbsUp | ✗ Missing |

**Quality Sidebar (Right):**
| Element | Content |
|---------|---------|
| Heading | "Decision Quality" |
| ScoreCircle | 45% (large) |
| SectionChecklist | 6 sections with status |
| GenerateButton | "Generate Brief" (disabled until 80%) |
| MissingItems | List of what's needed |

---

### 4.10 Canvas: Frame Section

**Components:**
| Component | Props/Content |
|-----------|---------------|
| SectionHeader | "Decision Frame" |
| DecisionTypeSelect | Current: "Build vs Buy" |
| QuestionTextarea | "Should we build an in-house analytics platform or partner with Mixpanel for our enterprise tier?" |
| HelpText | "A good decision frame is specific, actionable, and time-bounded" |
| ExampleToggle | Show good/bad examples |

**Sample Data:**
```
Type: Build vs Buy
Question: Should we build an in-house analytics platform or partner
with Mixpanel for our enterprise tier by Q2 2024?
```

---

### 4.11 Canvas: Context Section

**Subsections:** Background, Constraints, Stakeholders, Timeline

**Background:**
| Component | Content |
|-----------|---------|
| RichTextEditor | "Our current analytics setup uses a combination of..." |

**Constraints List:**
| Constraint | Category | Severity |
|------------|----------|----------|
| "Must comply with SOC2" | Legal | Hard |
| "Budget max $50k/year" | Budget | Hard |
| "Team has no Go experience" | Technical | Soft |

**Constraint Card:**
| Element | Sample |
|---------|--------|
| Description | "Must comply with SOC2 Type II" |
| CategoryBadge | "Legal" (purple) |
| SeverityBadge | "Hard" (red outline) |
| EditButton | Pencil icon |
| DeleteButton | Trash icon |

**Stakeholders List:**
| Name | Role | Stance | Concerns |
|------|------|--------|----------|
| Jane Smith | VP Product | Supportive | Timeline |
| Mike Johnson | CTO | Skeptical | Technical debt |
| Lisa Wang | CFO | Neutral | ROI clarity |

**Stakeholder Card:**
| Element | Sample |
|---------|--------|
| Avatar | Initials "JS" |
| Name | "Jane Smith" |
| Role | "VP Product" |
| StanceBadge | "Supportive" (green) |
| Concerns | "Worried about timeline and resource allocation" |

**Stance Badge Colors:**
```
Supportive: green (emerald-500)
Neutral: gray (zinc-500)
Skeptical: orange (amber-500)
Unknown: gray dashed border
```

**Timeline:**
| Field | Sample |
|-------|--------|
| DecisionDate | "March 15, 2024" |
| ImplementationTimeline | "Q2 2024" |
| UrgencySelect | "High - blocking other work" |

---

### 4.12 Canvas: Options Section

**Components:**
| Component | Props/Content |
|-----------|---------------|
| SectionHeader | "Options" + AddButton |
| OptionCardList | Expandable cards |
| SuggestButton | "✨ Suggest Options" (AI) |

**OptionCard (Collapsed):**
| Element | Sample |
|---------|--------|
| DragHandle | ⋮⋮ |
| Title | "Build In-House" |
| Description | "Develop custom analytics platform..." |
| ProConSummary | "3 pros, 2 cons, 1 risk" |
| ExpandButton | Chevron |
| AIBadge | "✨ Analyzed" (if AI ran) |

**OptionCard (Expanded):**
| Element | Sample |
|---------|--------|
| TitleEditable | "Build In-House" |
| DescriptionEditable | Rich text area |
| ProsSection | Editable list with + button |
| ConsSection | Editable list with + button |
| RisksSection | Editable list with + button |
| EffortEstimate | "High" dropdown |
| ImpactEstimate | "High" dropdown |
| AnalyzeButton | "✨ Analyze with AI" |
| DeleteButton | "Delete Option" |

**Sample Options:**
```
Option 1: Build In-House
├── Description: Develop a custom analytics platform using our existing
│   data infrastructure...
├── Pros:
│   • Full control over features and roadmap
│   • No per-seat licensing costs at scale
│   • Deeper integration with our data warehouse
├── Cons:
│   • 6-9 month development timeline
│   • Requires hiring 2 data engineers
├── Risks:
│   • Team has no experience with this type of project
├── Effort: High
└── Impact: High

Option 2: Partner with Mixpanel
├── Description: Implement Mixpanel Enterprise for product analytics...
├── Pros:
│   • 2-week implementation time
│   • Proven enterprise features
│   • Dedicated support team
├── Cons:
│   • $45k/year licensing cost
│   • Limited customization options
├── Risks:
│   • Vendor lock-in concerns
├── Effort: Low
└── Impact: Medium

Option 3: Status Quo
├── Description: Continue with current Google Analytics + custom dashboards...
├── Pros:
│   • No additional cost
│   • Team already knows the tools
├── Cons:
│   • Missing enterprise features
│   • Manual reporting required
├── Risks:
│   • May not scale with growth
├── Effort: None
└── Impact: Low
```

---

### 4.13 Canvas: Evidence Section

**Components:**
| Component | Props/Content |
|-----------|---------------|
| SectionHeader | "Evidence" + AddButton |
| EvidenceFilters | Type filter, Strength filter |
| EvidenceCardList | Cards with option links |
| ResearchButton | "✨ Research Competitors" (AI) |

**EvidenceCard:**
| Element | Sample |
|---------|--------|
| TypeBadge | "Research" (blue) |
| StrengthBadge | "Strong" (green) |
| Claim | "Mixpanel reduced time-to-insight by 40% for similar companies" |
| Source | "Mixpanel Case Study - Acme Corp" |
| SourceLink | External link icon |
| LinkedOptions | Pills showing which options this supports/challenges |
| EditButton | Pencil |
| DeleteButton | Trash |

**Evidence Type Badges:**
```
Research: blue
Data: purple
Interview: green
Competitor: orange
Document: gray
```

**Linked Options Display:**
```
Supports: "Build In-House" (green pill)
Challenges: "Partner with Mixpanel" (red pill)
Neutral: "Status Quo" (gray pill)
```

**Sample Evidence:**
```
1. [Research | Strong]
   "Mixpanel reduced time-to-insight by 40% for similar companies"
   Source: Mixpanel Enterprise Case Study
   → Supports: Partner with Mixpanel

2. [Data | Moderate]
   "Our data team spends 15 hours/week on manual reporting"
   Source: Internal time tracking Q4 2023
   → Supports: Build In-House, Partner with Mixpanel
   → Challenges: Status Quo

3. [Interview | Strong]
   "CTO believes custom solution would take 9+ months"
   Source: Interview with Mike Johnson, CTO
   → Challenges: Build In-House
   → Supports: Partner with Mixpanel

4. [Competitor | Moderate]
   "Competitor X switched to Amplitude and saw 30% faster feature iteration"
   Source: Competitor analysis report
   → Supports: Partner with Mixpanel
```

---

### 4.14 Canvas: Tradeoffs Section

**Components:**
| Component | Props/Content |
|-----------|---------------|
| SectionHeader | "Tradeoffs" + AddButton |
| ProgressIndicator | "2 of 3 acknowledged" |
| TradeoffCardList | Cards with acknowledgment |
| SurfaceButton | "✨ Surface Tradeoffs" (AI) |

**TradeoffCard:**
| Element | Sample |
|---------|--------|
| OptionPill | "Build In-House" |
| GiveUp | "We give up: 6 months of time and $200k in dev costs" |
| ToGet | "To get: Full control and no licensing fees at scale" |
| AcknowledgeCheckbox | ☑ "I acknowledge this tradeoff" |

**Sample Tradeoffs:**
```
1. [Build In-House] ☑ Acknowledged
   We give up: 6 months of development time and $200k in engineering costs
   To get: Full control over the roadmap and zero per-seat licensing costs

2. [Partner with Mixpanel] ☑ Acknowledged
   We give up: Customization flexibility and $45k/year in licensing
   To get: 2-week implementation and proven enterprise features

3. [Partner with Mixpanel] ☐ Not acknowledged
   We give up: Data ownership (data lives on Mixpanel servers)
   To get: Enterprise-grade security and compliance (SOC2)
```

---

### 4.15 Canvas: Recommendation Section

**Components:**
| Component | Props/Content |
|-----------|---------------|
| SectionHeader | "Recommendation" |
| OptionSelect | "Select recommended option" |
| ConfidenceSlider | 0-100 with labels |
| ConfidenceRationale | Textarea |
| RecommendationRationale | Rich text editor |
| ReversalConditions | Textarea |
| GenerateBriefButton | "Generate Brief" (enabled at 80%+) |

**Confidence Slider Labels:**
```
0-29: Very Low - "Best guess given limited information"
30-49: Low - "Significant unknowns remain"
50-69: Moderate - "Reasonable case, some uncertainties"
70-89: High - "Good evidence, acceptable risks"
90-100: Very High - "Strong evidence, clear winner"
```

**Sample Recommendation:**
```
Recommended Option: Partner with Mixpanel
Confidence: 75% (High)

Confidence Rationale:
"Strong evidence from similar companies, clear ROI case,
but some uncertainty around long-term vendor relationship"

Recommendation Rationale:
"Given our Q2 deadline and limited data engineering capacity,
partnering with Mixpanel provides the fastest path to enterprise-
grade analytics. While building in-house offers more control,
the 6-9 month timeline is incompatible with our product roadmap.

The $45k/year cost is offset by:
- 2 FTE-months of saved engineering time (~$50k)
- Faster time-to-market for enterprise features
- Reduced maintenance burden

Mixpanel's SOC2 compliance also satisfies our legal constraint."

Reversal Conditions:
"We would reconsider this decision if:
- Mixpanel pricing increases >30% at renewal
- We hire 2+ data engineers with analytics platform experience
- Our enterprise customer count exceeds 500 (cost scaling concern)"
```

---

### 4.16 Brief Preview (`/decisions/[id]/brief`)

**Layout:** Full-width document view

**Components:**
| Component | Props/Content |
|-----------|---------------|
| BackLink | "← Back to Decision" |
| BriefHeader | Title, status, actions |
| ShareToggle | "Public link" on/off |
| CopyLinkButton | Copy share URL |
| ExportPDFButton | Download PDF |
| EditToggle | Enable/disable editing |
| BriefContent | Rendered markdown |

**Brief Content Structure:**
```
# CRM Platform Selection
## Decision Brief

### Executive Summary
After evaluating three options for our analytics needs, we recommend
partnering with Mixpanel for our enterprise tier. This decision
balances our Q2 timeline constraints with the need for enterprise-
grade analytics capabilities.

### The Decision
**Question:** Should we build an in-house analytics platform or
partner with Mixpanel for our enterprise tier?

**Recommendation:** Partner with Mixpanel
**Confidence:** 75% (High)

### Options Considered

#### ✓ Partner with Mixpanel (Recommended)
Implement Mixpanel Enterprise for product analytics with 2-week
implementation timeline.
- **Why chosen:** Fastest path to enterprise features, proven platform
- **Key tradeoff:** $45k/year licensing vs. development costs

#### ✗ Build In-House
Develop custom analytics platform using existing data infrastructure.
- **Why not chosen:** 6-9 month timeline incompatible with Q2 deadline
- **Would reconsider if:** We hire 2+ data engineers with relevant experience

#### ✗ Status Quo
Continue with current Google Analytics + custom dashboards.
- **Why not chosen:** Missing enterprise features, won't scale

### Key Evidence
• Mixpanel reduced time-to-insight by 40% for similar companies (Strong)
• CTO estimates custom solution would take 9+ months (Strong)
• Current team spends 15 hrs/week on manual reporting (Moderate)

### Tradeoffs Accepted
1. We give up customization flexibility to get 2-week implementation
2. We give up data ownership to get enterprise-grade security

### Constraints Satisfied
✓ SOC2 compliance (Mixpanel is SOC2 Type II certified)
✓ Budget max $50k/year ($45k licensing)
✓ Q2 timeline (2-week implementation)

### Reversal Conditions
- Mixpanel pricing increases >30% at renewal
- We hire 2+ data engineers with analytics platform experience
- Enterprise customer count exceeds 500

---
**Decision Owner:** Sarah Chen
**Stakeholders:** Jane Smith (VP Product), Mike Johnson (CTO), Lisa Wang (CFO)
**Generated:** January 28, 2024
```

---

### 4.17 Team Settings (`/settings/team`)

**Components:**
| Component | Props/Content |
|-----------|---------------|
| PageHeader | "Team" |
| InviteButton | "+ Invite Member" |
| MemberTable | Name, email, role, actions |
| PendingInvites | Separate section |

**MemberRow:**
| Element | Sample |
|---------|--------|
| Avatar | User photo or initials |
| Name | "Sarah Chen" |
| Email | "sarah@acme.com" |
| RoleBadge | "Admin" |
| RoleDropdown | Change role (admin only) |
| RemoveButton | "Remove" (admin only) |

**Sample Members:**
```
1. Sarah Chen | sarah@acme.com | Admin | (you)
2. Mike Johnson | mike@acme.com | Member | [Change role ▾] [Remove]
3. Lisa Wang | lisa@acme.com | Viewer | [Change role ▾] [Remove]
```

**PendingInviteRow:**
| Element | Sample |
|---------|--------|
| Email | "alex@acme.com" |
| RoleBadge | "Member" |
| SentAt | "Sent 2 days ago" |
| ResendButton | "Resend" |
| CancelButton | "Cancel" |

**Invite Modal:**
| Component | Content |
|-----------|---------|
| Heading | "Invite team member" |
| EmailInput | placeholder: "colleague@company.com" |
| RoleSelect | Admin / Member / Viewer |
| RoleDescriptions | Explain each role |
| CancelButton | "Cancel" |
| InviteButton | "Send Invitation" |

---

### 4.18 Public Share Page (`/share/[key]`)

**Layout:** Clean, read-only brief view

**Components:**
| Component | Props/Content |
|-----------|---------------|
| PlinthBadge | "Powered by Plinth" (top right) |
| BriefContent | Same as brief preview |
| CTABanner | "Make better decisions → Try Plinth" |

**Note:** No edit controls, no auth required

---

## 5. User Journeys

### Journey 1: New User → First Brief (Happy Path)

```
1. DISCOVER
   └── User lands on /signup

2. SIGN UP (30 sec)
   ├── Enter name, email, password
   ├── Click "Create account"
   └── Verify email (or skip in dev)

3. ONBOARDING (2 min)
   ├── Welcome screen → "Get started"
   ├── Enter org name "Acme Corp"
   ├── Select role "Product Leader"
   └── Pick template "Build vs Buy"

4. FRAME DECISION (2 min)
   ├── Land on decision canvas
   ├── Edit title: "CRM Platform Selection"
   ├── Write framing question
   └── Quality: 15% ✓

5. ADD CONTEXT (3 min)
   ├── Write background
   ├── Add 2 constraints
   ├── Add 2 stakeholders
   ├── Set timeline
   └── Quality: 30% ✓

6. ADD OPTIONS (5 min)
   ├── Add "Build In-House"
   ├── Add pros/cons/risks
   ├── Add "Partner with Mixpanel"
   ├── Add pros/cons/risks
   ├── Click "✨ Analyze" on each
   └── Quality: 50% ✓

7. ADD EVIDENCE (5 min)
   ├── Add 3 evidence items
   ├── Link to options
   ├── Set strength levels
   ├── Click "✨ Research Competitors"
   └── Quality: 70% ✓

8. ACKNOWLEDGE TRADEOFFS (3 min)
   ├── Click "✨ Surface Tradeoffs"
   ├── Review AI suggestions
   ├── Check acknowledgment boxes
   └── Quality: 85% ✓

9. SET RECOMMENDATION (5 min)
   ├── Select recommended option
   ├── Set confidence to 75%
   ├── Write rationale
   ├── Add reversal conditions
   └── Quality: 100% ✓

10. GENERATE BRIEF (1 min)
    ├── Click "Generate Brief"
    ├── Wait for AI generation
    ├── Review brief preview
    └── Click "Share" → Copy link

TOTAL TIME: ~25 minutes
```

### Journey 2: Returning User → Quick Decision

```
1. LOGIN (10 sec)
   └── /login → enter credentials → /dashboard

2. CREATE DECISION (30 sec)
   ├── Click "+ New Decision"
   ├── Select "Product Prioritization"
   └── Enter title

3. RAPID INPUT (10 min)
   ├── Frame already suggested by template
   ├── Add 4 options from backlog
   ├── Use AI to analyze each
   ├── Add evidence from docs
   └── Acknowledge auto-surfaced tradeoffs

4. RECOMMEND & GENERATE (5 min)
   ├── Select top priority
   ├── Set confidence
   └── Generate brief

TOTAL TIME: ~15 minutes (experienced user)
```

### Journey 3: Team Collaboration

```
1. ADMIN INVITES MEMBER
   ├── /settings/team
   ├── Click "Invite"
   ├── Enter mike@acme.com
   └── Select role "Member"

2. MEMBER RECEIVES EMAIL
   ├── Opens invitation email
   ├── Clicks "Accept Invitation"
   └── Lands on /invite/[token]

3. MEMBER JOINS
   ├── Creates password
   ├── Lands on dashboard
   └── Sees shared decisions

4. MEMBER CONTRIBUTES
   ├── Opens "CRM Platform Selection"
   ├── Adds evidence item
   ├── Adds comment on Option 2
   └── Changes saved automatically

5. ADMIN REVIEWS
   ├── Sees notification of changes
   ├── Reviews new evidence
   ├── Responds to comment
   └── Updates recommendation
```

### Journey 4: Share Brief with Executive

```
1. DECISION OWNER
   ├── Opens completed decision
   ├── Clicks "Generate Brief"
   └── Reviews generated content

2. ENABLE SHARING
   ├── Clicks "Share" button
   ├── Toggles "Public link" ON
   └── Copies share URL

3. EXECUTIVE RECEIVES
   ├── Opens link in email
   ├── Views brief (no login required)
   ├── Reads recommendation
   └── Reviews tradeoffs

4. OPTIONAL: EXPORT
   ├── Owner clicks "Export PDF"
   ├── Downloads formatted PDF
   └── Attaches to board deck
```

### Journey 5: AI-Assisted Research

```
1. USER NEEDS COMPETITOR INTEL
   ├── Working on Market Entry decision
   └── Clicks "✨ Research Competitors"

2. ENTER COMPETITOR
   ├── Modal opens
   ├── Enter "Competitor Inc"
   ├── Optionally add URL
   └── Click "Analyze"

3. AI RESEARCHES (30-60 sec)
   ├── Progress modal shows
   ├── "Scraping website..."
   ├── "Searching news..."
   └── "Generating profile..."

4. REVIEW PROFILE
   ├── Competitor profile card appears
   ├── Overview, products, pricing
   ├── Recent news, strengths/weaknesses
   └── Click "Add as Evidence" on insights

5. USE IN DECISION
   ├── Evidence auto-linked to options
   ├── Supports/challenges relationships set
   └── Quality score improves
```

---

## 6. Empty & Error States

### Empty States

| Page/Section | Icon | Heading | Description | CTA |
|--------------|------|---------|-------------|-----|
| Dashboard (no decisions) | FileQuestion | "No decisions yet" | "Create your first decision to get started" | "Create Decision" |
| Options (none) | Layers | "No options yet" | "Add options you're considering" | "Add Option" |
| Evidence (none) | Search | "No evidence yet" | "Add research, data, or insights" | "Add Evidence" |
| Constraints (none) | Lock | "No constraints yet" | "Define boundaries for your decision" | "Add Constraint" |
| Tradeoffs (none) | Scale | "No tradeoffs yet" | "Document what you're giving up" | "Add Tradeoff" |
| Stakeholders (none) | Users | "No stakeholders yet" | "Add people involved in this decision" | "Add Stakeholder" |
| Team (just you) | UserPlus | "You're the only one here" | "Invite colleagues to collaborate" | "Invite Member" |

### Error States

| Error | Heading | Description | Actions |
|-------|---------|-------------|---------|
| 404 Page | "Page not found" | "This page doesn't exist or you don't have access" | "Go to Dashboard" |
| 404 Decision | "Decision not found" | "This decision may have been deleted" | "Go to Dashboard" |
| 404 Share | "Brief not found" | "This link may have expired or been revoked" | "Learn about Plinth" |
| 500 Error | "Something went wrong" | "We're looking into it. Try refreshing." | "Refresh", "Contact Support" |
| Network Error | "Connection lost" | "Check your internet and try again" | "Retry" |
| Auth Error | "Session expired" | "Please log in again to continue" | "Log In" |

### Loading States

| Component | Loading UI |
|-----------|------------|
| Dashboard | Skeleton cards (3-4) |
| Decision Canvas | Skeleton sections |
| Brief Generation | Progress modal with steps |
| AI Analysis | Pulsing "Analyzing..." text |
| Save | Subtle spinner in header |

---

## 7. Responsive Breakpoints

| Breakpoint | Width | Layout Changes |
|------------|-------|----------------|
| Mobile | < 640px | Single column, bottom nav, full-width modals |
| Tablet | 640-1024px | Collapsible sidebar, 2-column grids |
| Desktop | 1024-1280px | Fixed sidebar, main + quality panel |
| Wide | > 1280px | Extra whitespace, max-width containers |

**Key Responsive Changes:**

1. **Sidebar**
   - Desktop: Fixed 240px
   - Tablet: Toggle button, slides over
   - Mobile: Bottom navigation bar

2. **Decision Canvas**
   - Desktop: Sections + Quality panel side-by-side
   - Tablet/Mobile: Quality panel becomes top bar or sheet

3. **Cards**
   - Desktop: Horizontal layout with inline actions
   - Mobile: Stacked layout, actions in dropdown

4. **Tables**
   - Desktop: Full table
   - Mobile: Card-based list

---

## 8. Animation Guidelines

| Interaction | Animation | Duration |
|-------------|-----------|----------|
| Button hover | Background fade | 150ms |
| Button press | Scale down 0.98 | 100ms |
| Modal open | Fade in + scale up | 200ms |
| Modal close | Fade out + scale down | 150ms |
| Sheet slide | Slide from edge | 300ms |
| Card expand | Height + opacity | 200ms |
| Toast appear | Slide up + fade | 200ms |
| Toast dismiss | Slide down + fade | 150ms |
| Skeleton pulse | Opacity 0.5-1 | 1500ms loop |
| Progress bar | Width transition | 300ms |

**Motion Preferences:**
```css
@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition: none !important; }
}
```

---

## 9. Accessibility Checklist

- [ ] All interactive elements have visible focus states
- [ ] Color contrast ≥ 4.5:1 for text
- [ ] Color contrast ≥ 3:1 for UI elements
- [ ] No information conveyed by color alone
- [ ] All images have alt text
- [ ] All form inputs have labels
- [ ] Error messages are associated with inputs
- [ ] Modals trap focus
- [ ] Escape key closes modals
- [ ] Tab order is logical
- [ ] Skip link to main content
- [ ] ARIA labels on icon-only buttons
- [ ] Status changes announced to screen readers
