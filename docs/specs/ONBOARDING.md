# Onboarding Flow Specification

## Overview

First-time user experience that activates users quickly. Goal: User completes their first decision brief within 30 minutes of signup.

---

## Onboarding Principles

1. **Value first** - Show the product working before asking for setup
2. **Progressive disclosure** - Don't overwhelm; reveal complexity as needed
3. **Skippable but encouraged** - Let power users skip, but make the guided path attractive
4. **Contextual help** - Tooltips and hints appear when relevant

---

## Flow Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                      ONBOARDING FLOW                             │
│                                                                  │
│   Sign Up Complete                                               │
│         │                                                        │
│         ▼                                                        │
│   ┌───────────────┐                                             │
│   │  1. Welcome   │  "Welcome to Plinth"                        │
│   │     Screen    │  Quick value prop, what to expect           │
│   └───────┬───────┘                                             │
│           │                                                      │
│           ▼                                                      │
│   ┌───────────────┐                                             │
│   │  2. Org Setup │  Name your organization                     │
│   └───────┬───────┘                                             │
│           │                                                      │
│           ▼                                                      │
│   ┌───────────────┐                                             │
│   │ 3. First      │  Start their first decision                 │
│   │    Decision   │  (guided, with template)                    │
│   └───────┬───────┘                                             │
│           │                                                      │
│           ▼                                                      │
│   ┌───────────────┐                                             │
│   │ 4. Quick Tour │  Highlight key features                     │
│   │   (optional)  │  (can dismiss)                              │
│   └───────┬───────┘                                             │
│           │                                                      │
│           ▼                                                      │
│   ┌───────────────┐                                             │
│   │  5. Dashboard │  Full product access                        │
│   └───────────────┘                                             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Step 1: Welcome Screen

**URL:** `/onboarding/welcome`

**Purpose:** Set expectations, build excitement

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│                          🎯                                      │
│                                                                  │
│              Welcome to Plinth, [First Name]                    │
│                                                                  │
│     Make better decisions with structured analysis,             │
│     AI-powered research, and executive-ready outputs.           │
│                                                                  │
│                                                                  │
│     What you'll be able to do:                                  │
│                                                                  │
│     ✓ Frame decisions clearly                                   │
│     ✓ Analyze competitors and options with AI                   │
│     ✓ Generate decision briefs to share with stakeholders       │
│                                                                  │
│                                                                  │
│     ┌─────────────────────────────────────────────────────┐    │
│     │                  Let's get started                   │    │
│     └─────────────────────────────────────────────────────┘    │
│                                                                  │
│                      Takes about 5 minutes                       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Duration:** ~5 seconds (just a click-through)

---

## Step 2: Organization Setup

**URL:** `/onboarding/organization`

**Purpose:** Create the organization context

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│                   Set up your workspace                          │
│                                                                  │
│     Organization name                                            │
│     ┌─────────────────────────────────────────────────────┐    │
│     │ Acme Corp                                            │    │
│     └─────────────────────────────────────────────────────┘    │
│     Your team will see this name                                │
│                                                                  │
│                                                                  │
│     What best describes your role?                               │
│     ┌─────────────────────────────────────────────────────┐    │
│     │ ▼ Select one                                         │    │
│     └─────────────────────────────────────────────────────┘    │
│                                                                  │
│     • Product / Strategy Leader                                  │
│     • Executive (C-level, VP)                                    │
│     • Chief of Staff / Operations                                │
│     • Founder / CEO                                              │
│     • Consultant / Advisor                                       │
│     • Other                                                      │
│                                                                  │
│                                                                  │
│     ┌─────────────────────────────────────────────────────┐    │
│     │                     Continue                         │    │
│     └─────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Data Captured:**
- Organization name
- User role (for personalization, analytics)

**Backend Actions:**
```typescript
await supabase.from('organizations').update({
  name: orgName
}).eq('id', orgId);

await supabase.from('users').update({
  metadata: { role_type: roleType }
}).eq('id', userId);
```

---

## Step 3: First Decision (Guided)

**URL:** `/onboarding/first-decision`

**Purpose:** Get user to experience the core value immediately

### 3a. Choose Decision Type

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│              Let's create your first decision                    │
│                                                                  │
│     What kind of decision are you working on?                    │
│     (You can change this later)                                  │
│                                                                  │
│     ┌──────────────────────┐  ┌──────────────────────┐         │
│     │  🔨 Build vs Buy     │  │  🌍 Market Entry     │         │
│     │                      │  │                      │         │
│     │  Should we build     │  │  Should we enter     │         │
│     │  or purchase?        │  │  a new market?       │         │
│     └──────────────────────┘  └──────────────────────┘         │
│                                                                  │
│     ┌──────────────────────┐  ┌──────────────────────┐         │
│     │  📈 Investment       │  │  📊 Prioritization   │         │
│     │                      │  │                      │         │
│     │  Should we invest    │  │  Which initiative    │         │
│     │  in this initiative? │  │  should we focus on? │         │
│     └──────────────────────┘  └──────────────────────┘         │
│                                                                  │
│     ┌─────────────────────────────────────────────────────┐    │
│     │  📝 Something else (custom)                          │    │
│     └─────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 3b. Name the Decision

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│                 Great! Let's frame it.                          │
│                                                                  │
│     What's this decision about?                                  │
│     ┌─────────────────────────────────────────────────────┐    │
│     │ CRM platform selection                               │    │
│     └─────────────────────────────────────────────────────┘    │
│     A short title for your decision                             │
│                                                                  │
│                                                                  │
│     What specific question are you trying to answer?             │
│     ┌─────────────────────────────────────────────────────┐    │
│     │ Should we build a custom CRM or purchase Salesforce │    │
│     │ for our enterprise sales team?                       │    │
│     │                                                      │    │
│     └─────────────────────────────────────────────────────┘    │
│                                                                  │
│     💡 Tip: Good decision questions are specific and            │
│        lead to clear action.                                    │
│                                                                  │
│     ┌─────────────────────────────────────────────────────┐    │
│     │               Create Decision                        │    │
│     └─────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 3c. Redirect to Decision Canvas

After creation, redirect to the decision canvas (`/decisions/[id]`) with:
- Template pre-populated (options, constraints)
- First-time hints enabled
- Progress indicator visible

---

## Step 4: Quick Tour (Optional)

**Triggered:** On first visit to decision canvas

**Implementation:** Tooltip-based tour using a library like `driver.js` or `intro.js`

### Tour Steps

**Step 1: Decision Frame**
```
┌────────────────────────────────────┐
│ 💡 Decision Frame                  │
│                                    │
│ This is your decision question.    │
│ Keep it specific and actionable.   │
│                                    │
│ [1/6]              [Next →]        │
└────────────────────────────────────┘
         ▼
   [Decision frame section highlighted]
```

**Step 2: Options**
```
┌────────────────────────────────────┐
│ 💡 Options                         │
│                                    │
│ Add the paths you're considering.  │
│ We've pre-filled some based on     │
│ your decision type.                │
│                                    │
│ [2/6]       [← Back] [Next →]      │
└────────────────────────────────────┘
```

**Step 3: AI Analysis**
```
┌────────────────────────────────────┐
│ 💡 AI-Powered Analysis             │
│                                    │
│ Click "Analyze" on any option to   │
│ get AI-generated pros, cons, and   │
│ risks.                             │
│                                    │
│ [3/6]       [← Back] [Next →]      │
└────────────────────────────────────┘
```

**Step 4: Evidence**
```
┌────────────────────────────────────┐
│ 💡 Evidence & Research             │
│                                    │
│ Add competitor profiles, market    │
│ research, or any data that         │
│ informs your decision.             │
│                                    │
│ [4/6]       [← Back] [Next →]      │
└────────────────────────────────────┘
```

**Step 5: Quality Score**
```
┌────────────────────────────────────┐
│ 💡 Quality Score                   │
│                                    │
│ This shows how complete your       │
│ decision is. Aim for 80%+ before   │
│ generating your brief.             │
│                                    │
│ [5/6]       [← Back] [Next →]      │
└────────────────────────────────────┘
```

**Step 6: Generate Brief**
```
┌────────────────────────────────────┐
│ 💡 Decision Brief                  │
│                                    │
│ When you're ready, generate an     │
│ executive brief to share with      │
│ stakeholders.                       │
│                                    │
│ [6/6]       [← Back] [Done ✓]      │
└────────────────────────────────────┘
```

### Tour State Management

```typescript
// Store tour completion in user metadata
const tourState = {
  completed: boolean,
  dismissed: boolean,
  steps_seen: string[]
};

// Check on page load
if (!user.metadata.tour_completed && !user.metadata.tour_dismissed) {
  showTour();
}
```

---

## Contextual Help (Ongoing)

### Empty States with Guidance

Each section shows helpful prompts when empty:

**Options (empty)**
```
┌─────────────────────────────────────────────────────────────────┐
│  No options yet                                                  │
│                                                                  │
│  Options are the paths you're considering. Add at least 2       │
│  to compare.                                                    │
│                                                                  │
│  [+ Add Option]    [✨ Suggest Options]                         │
└─────────────────────────────────────────────────────────────────┘
```

**Evidence (empty)**
```
┌─────────────────────────────────────────────────────────────────┐
│  No evidence yet                                                 │
│                                                                  │
│  Evidence grounds your decision in data. Add research,          │
│  competitor intel, or customer feedback.                        │
│                                                                  │
│  [+ Add Evidence]    [🔍 Research Competitor]                   │
└─────────────────────────────────────────────────────────────────┘
```

### First-Time Hints

Show once per feature, then dismiss:

```typescript
const hints = {
  first_option_analysis: "💡 Try clicking 'Analyze' to get AI-generated insights",
  first_competitor: "💡 Add a competitor to get comprehensive market intelligence",
  first_tradeoff: "💡 Tradeoffs make your reasoning explicit and defensible",
  ready_for_brief: "🎉 You've reached 80%! You can now generate your decision brief."
};
```

---

## Activation Metrics

### Key Milestones

| Milestone | Target | Measurement |
|-----------|--------|-------------|
| Complete onboarding | 90% | Reach dashboard |
| Create first decision | 80% | Decision created |
| Add 2+ options | 70% | Options count |
| Use AI feature | 60% | Any AI action |
| Generate first brief | 50% | Brief generated |
| Invite team member | 30% | Invite sent |

### Tracking Events

```typescript
const onboardingEvents = [
  'onboarding_started',
  'onboarding_org_named',
  'onboarding_role_selected',
  'onboarding_decision_type_selected',
  'onboarding_first_decision_created',
  'onboarding_tour_started',
  'onboarding_tour_completed',
  'onboarding_tour_skipped',
  'onboarding_completed'
];
```

---

## Re-engagement

### Incomplete Onboarding

If user leaves during onboarding:
- Show banner on next login: "Continue setting up Plinth"
- Don't block access to dashboard
- Track drop-off points for optimization

### Dormant Users

If user hasn't completed a decision in 7 days:
- Send email: "Your decision is waiting"
- Show in-app prompt on next login

---

## Implementation Checklist

- [ ] Welcome screen page
- [ ] Organization setup page
- [ ] First decision guided flow
- [ ] Template selection UI
- [ ] Decision frame input with tips
- [ ] Tour library integration
- [ ] Tour step components
- [ ] Tour state management
- [ ] Empty state components
- [ ] First-time hint system
- [ ] Analytics event tracking
- [ ] Re-engagement email templates
