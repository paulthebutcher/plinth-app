# Decision Templates Specification

## Overview

Templates pre-populate the decision canvas with relevant structure, constraints, and prompts tailored to common strategic decision types. They reduce time-to-value and ensure users capture the right information.

---

## Template Structure

Each template defines:

```typescript
interface DecisionTemplate {
  id: string;
  name: string;
  description: string;
  icon: string; // Lucide icon name

  // Pre-populated content
  framingPrompts: string[]; // Suggested ways to frame the decision
  suggestedOptions: SuggestedOption[];
  defaultConstraintCategories: ConstraintCategory[];
  stakeholderRoles: string[]; // Common stakeholder types

  // Tailored guidance
  evidencePrompts: string[]; // What evidence to gather
  tradeoffPrompts: string[]; // Common tradeoffs to consider
  riskCategories: string[]; // Risks specific to this decision type

  // AI customization
  contextForAI: string; // Injected into all AI prompts
  relevantEvidenceTypes: EvidenceType[];
}
```

---

## Template 1: Build vs Buy

### Metadata
```yaml
id: build_vs_buy
name: Build vs Buy
description: Decide whether to build a capability in-house, purchase/license an existing solution, or pursue a hybrid approach.
icon: hammer
```

### Framing Prompts
Help users articulate the decision clearly:

1. "Should we build [capability] in-house or buy/license [solution type]?"
2. "What is the best approach to acquire [capability]: build, buy, or partner?"
3. "Should we continue building [existing system] or migrate to [vendor solution]?"

### Suggested Options

| Option | Description | When Appropriate |
|--------|-------------|------------------|
| **Build In-House** | Develop the capability with internal team | Unique requirements, core differentiator, long-term strategic asset |
| **Buy / License** | Purchase or subscribe to existing solution | Commodity capability, time pressure, limited internal expertise |
| **Hybrid** | Build core, integrate vendor components | Need customization + speed, partial in-house expertise |
| **Partner / Outsource** | External team builds to your spec | Temporary need, specialized expertise, capacity constraints |
| **Do Nothing / Defer** | Delay the decision | Uncertainty too high, other priorities, market immature |

### Default Constraint Categories
```typescript
const constraints = [
  { category: "budget", prompt: "What is the available budget (one-time and ongoing)?" },
  { category: "timeline", prompt: "When must this capability be operational?" },
  { category: "technical", prompt: "What technical requirements or integrations are non-negotiable?" },
  { category: "team", prompt: "What internal expertise exists? What's the team's capacity?" },
  { category: "security", prompt: "What security/compliance requirements apply?" },
  { category: "vendor", prompt: "Are there approved vendor lists or procurement constraints?" }
];
```

### Stakeholder Roles
- Engineering Lead
- Product Owner
- Finance/Procurement
- Security/Compliance
- End Users (internal)
- Executive Sponsor

### Evidence Prompts
What to research:

1. **Vendor Landscape**: "What vendors offer [capability]? How do they compare?"
2. **Build Effort**: "What would it take to build this in-house? (time, team, cost)"
3. **TCO Analysis**: "What is the 3-year total cost of ownership for each option?"
4. **Integration Complexity**: "How would each option integrate with existing systems?"
5. **Switching Costs**: "What are the costs of switching later if we choose wrong?"
6. **Reference Checks**: "Who else has made this decision? What did they learn?"

### Tradeoff Prompts
Common tradeoffs to surface:

1. "Build gives us control but requires ongoing maintenance investment"
2. "Buy is faster but creates vendor dependency"
3. "Hybrid sounds ideal but may have integration complexity"
4. "In-house expertise is a long-term asset vs. vendor expertise we rent"

### Risk Categories
- Vendor lock-in
- Build overruns (time/cost)
- Integration failures
- Security/compliance gaps
- Team capacity constraints
- Technology obsolescence
- Vendor stability/continuity

### AI Context
```
This is a Build vs Buy decision. The user is evaluating whether to develop
a capability in-house or acquire it externally. Focus analysis on:
- Total cost of ownership (not just sticker price)
- Build effort realism (teams often underestimate)
- Vendor lock-in and switching costs
- Long-term maintainability
- Strategic differentiation value
```

### Relevant Evidence Types
- Competitor profiles (how do competitors solve this?)
- Vendor comparisons
- G2/Capterra reviews
- Build effort estimates
- TCO calculators
- Reference customer interviews

---

## Template 2: Market Entry

### Metadata
```yaml
id: market_entry
name: Market Entry
description: Decide whether and how to enter a new market, geography, or customer segment.
icon: globe
```

### Framing Prompts

1. "Should we enter the [market/geography] market?"
2. "What is the best approach to expand into [segment]?"
3. "Should we prioritize [Market A] or [Market B] for expansion?"

### Suggested Options

| Option | Description | When Appropriate |
|--------|-------------|------------------|
| **Direct Entry** | Enter market with own team/resources | Strong brand, sufficient capital, need for control |
| **Partnership / JV** | Enter via local partner | Local expertise needed, regulatory complexity, risk sharing |
| **Acquisition** | Buy existing player in market | Speed critical, established players available, integration capability |
| **Licensing / Franchise** | License brand/product to local operator | Asset-light expansion, local operational complexity |
| **Wait / Monitor** | Don't enter now, reassess later | Market immature, higher priority opportunities, insufficient resources |

### Default Constraint Categories
```typescript
const constraints = [
  { category: "budget", prompt: "What investment is available for market entry?" },
  { category: "timeline", prompt: "What is the target timeline for market presence?" },
  { category: "legal", prompt: "What regulatory/legal requirements exist in this market?" },
  { category: "brand", prompt: "How important is brand consistency vs. local adaptation?" },
  { category: "team", prompt: "Do we have or can we hire local expertise?" },
  { category: "competitive", prompt: "What is the competitive intensity in this market?" }
];
```

### Stakeholder Roles
- Regional/Market Lead
- Legal/Compliance
- Finance
- Marketing/Brand
- Operations
- Executive Sponsor

### Evidence Prompts

1. **Market Size**: "How big is [market]? What's the growth trajectory?"
2. **Competitive Landscape**: "Who are the major players? What's their positioning?"
3. **Regulatory Environment**: "What regulations govern entry and operation?"
4. **Customer Research**: "What do customers in this market need? How do they buy?"
5. **Entry Barriers**: "What barriers to entry exist? How have others overcome them?"
6. **Partner Landscape**: "Who are potential partners? What's their track record?"

### Tradeoff Prompts

1. "Direct entry gives us control but requires significant upfront investment"
2. "Partnership is faster but dilutes economics and brand control"
3. "Acquisition brings instant presence but integration is complex"
4. "Waiting reduces risk but competitors may establish dominance"

### Risk Categories
- Regulatory/compliance failure
- Cultural misalignment
- Competitive response
- Execution complexity
- Currency/economic risk
- Partner performance
- Brand dilution

### AI Context
```
This is a Market Entry decision. The user is evaluating expansion into a new
market, geography, or customer segment. Focus analysis on:
- Market attractiveness (size, growth, profitability)
- Competitive dynamics and defensibility
- Regulatory and operational complexity
- Entry mode tradeoffs (control vs. speed vs. risk)
- Resource requirements and opportunity cost
```

### Relevant Evidence Types
- Market research reports
- Competitor profiles (local players)
- Regulatory analysis
- Customer segment research
- Partner due diligence
- Case studies of similar market entries

---

## Template 3: Investment Decision

### Metadata
```yaml
id: investment
name: Investment Decision
description: Decide whether to invest resources (capital, people, time) in an initiative, project, or opportunity.
icon: trending-up
```

### Framing Prompts

1. "Should we invest in [initiative/project]?"
2. "What level of investment is appropriate for [opportunity]?"
3. "Should we prioritize investment in [A] vs [B] given limited resources?"

### Suggested Options

| Option | Description | When Appropriate |
|--------|-------------|------------------|
| **Full Investment** | Commit full requested resources | High confidence, strategic priority, clear ROI path |
| **Phased Investment** | Stage investment with gates | Uncertainty exists, want to validate before full commit |
| **Minimal / Pilot** | Small investment to test thesis | High uncertainty, need proof points before scaling |
| **Defer** | Don't invest now, revisit later | Timing not right, other priorities, need more information |
| **Decline** | Don't invest, redirect resources | Doesn't meet threshold, better alternatives exist |

### Default Constraint Categories
```typescript
const constraints = [
  { category: "budget", prompt: "What is the available investment budget?" },
  { category: "timeline", prompt: "What is the expected timeline to ROI?" },
  { category: "team", prompt: "What team capacity is required? Is it available?" },
  { category: "opportunity_cost", prompt: "What else could we do with these resources?" },
  { category: "strategic_fit", prompt: "How does this align with strategic priorities?" },
  { category: "risk_tolerance", prompt: "What level of risk is acceptable?" }
];
```

### Stakeholder Roles
- Project/Initiative Owner
- Finance
- Resource Owners (Engineering, etc.)
- Executive Sponsor
- Affected Teams

### Evidence Prompts

1. **Business Case**: "What is the expected ROI? What assumptions drive it?"
2. **Market Validation**: "What evidence exists that customers want this?"
3. **Competitive Context**: "What are competitors investing in? Are we behind?"
4. **Execution Risk**: "What could go wrong? How likely is each risk?"
5. **Resource Reality**: "Do we actually have the capacity to execute?"
6. **Alternatives**: "What else could we do with these resources?"

### Tradeoff Prompts

1. "Full investment maximizes speed but commits resources that can't be reallocated"
2. "Phased approach reduces risk but may slow momentum and competitive response"
3. "Pilot validates thesis but may not generate conclusive results"
4. "Deferring preserves optionality but competitors may move ahead"

### Risk Categories
- Execution failure
- Market timing
- Resource overcommitment
- Opportunity cost
- Technology risk
- Competitive response
- Organizational change risk

### AI Context
```
This is an Investment Decision. The user is evaluating whether to commit resources
to an initiative, project, or opportunity. Focus analysis on:
- Strength of business case and underlying assumptions
- Execution risk and organizational capacity
- Opportunity cost of alternatives
- Appropriate investment level given uncertainty
- Stage-gate criteria if phased approach
```

### Relevant Evidence Types
- Business case documents
- Market research
- Competitive analysis
- Financial projections
- Resource capacity analysis
- Risk assessments

---

## Template 4: Product Prioritization

### Metadata
```yaml
id: product_prioritization
name: Product Prioritization
description: Decide which product initiatives, features, or improvements to prioritize given limited resources.
icon: layers
```

### Framing Prompts

1. "Which initiatives should we prioritize for [quarter/half/year]?"
2. "Should we invest in [Feature A] or [Feature B] next?"
3. "How should we allocate product resources across [these initiatives]?"

### Suggested Options

| Option | Description | When Appropriate |
|--------|-------------|------------------|
| **Prioritize A** | Focus resources on initiative A | Clear winner on impact/effort, strong customer signal |
| **Prioritize B** | Focus resources on initiative B | Alternative has better strategic fit or timing |
| **Parallel (Reduced Scope)** | Do both with reduced scope | Both critical, can find efficiencies, acceptable MVPs |
| **Sequential A→B** | Do A first, then B | Dependencies exist, A unlocks B, need learnings from A |
| **Defer All** | Don't do either now | Higher priorities exist, resources needed elsewhere |

### Default Constraint Categories
```typescript
const constraints = [
  { category: "team", prompt: "What team capacity is available? Any key dependencies?" },
  { category: "timeline", prompt: "Are there deadlines or commitments driving timing?" },
  { category: "technical", prompt: "What technical dependencies or blockers exist?" },
  { category: "customer", prompt: "What customer commitments or expectations exist?" },
  { category: "competitive", prompt: "What competitive pressure affects timing?" },
  { category: "strategic", prompt: "How do these initiatives map to strategic goals?" }
];
```

### Stakeholder Roles
- Product Manager
- Engineering Lead
- Design Lead
- Customer Success
- Sales
- Executive Sponsor

### Evidence Prompts

1. **Customer Signal**: "What do customers say they need? What's the demand evidence?"
2. **Usage Data**: "What does product usage data tell us about priorities?"
3. **Competitive Gap**: "What are competitors doing? Where are we behind?"
4. **Effort Estimates**: "What's the realistic effort for each initiative?"
5. **Impact Modeling**: "What's the expected impact on key metrics?"
6. **Dependencies**: "What depends on what? What unlocks future work?"

### Tradeoff Prompts

1. "Prioritizing customer requests builds loyalty but may not be strategically optimal"
2. "Chasing competitors keeps parity but doesn't create differentiation"
3. "Big bets have higher upside but also higher risk of wasted effort"
4. "Quick wins show progress but may not move key metrics"

### Risk Categories
- Wrong priority (opportunity cost)
- Effort underestimation
- Customer churn from deprioritized items
- Competitive gap widening
- Team morale from context switching
- Technical debt accumulation

### AI Context
```
This is a Product Prioritization decision. The user is deciding how to allocate
limited product resources across competing initiatives. Focus analysis on:
- Strength of customer/market signal for each option
- Realistic effort estimates and team capacity
- Strategic alignment and sequencing
- Opportunity cost of deprioritized items
- Dependencies and unlock potential
```

### Relevant Evidence Types
- Customer feedback/interviews
- Product usage analytics
- Competitive feature comparisons
- Effort estimates
- Impact projections
- Strategic roadmap alignment

---

## Custom Template

For decisions that don't fit the predefined types:

### Metadata
```yaml
id: custom
name: Custom Decision
description: A flexible template for decisions that don't fit standard categories.
icon: file-question
```

### Framing Prompts
1. "What specific question needs to be answered?"
2. "What will be different after this decision is made?"

### Default Options
- Option A (user-defined)
- Option B (user-defined)
- Do Nothing / Status Quo

### Default Constraint Categories
```typescript
const constraints = [
  { category: "timeline", prompt: "When must this decision be made?" },
  { category: "budget", prompt: "What resources are available?" },
  { category: "other", prompt: "What other constraints apply?" }
];
```

---

## Template Selection UI

### Display
```
┌─────────────────────────────────────────────────────────────────┐
│  What type of decision are you making?                          │
│                                                                  │
│  ┌──────────────────┐  ┌──────────────────┐                    │
│  │  🔨 Build vs Buy │  │  🌍 Market Entry │                    │
│  │                  │  │                  │                    │
│  │  Build in-house  │  │  Enter a new     │                    │
│  │  or purchase a   │  │  market, geo, or │                    │
│  │  solution?       │  │  customer segment│                    │
│  └──────────────────┘  └──────────────────┘                    │
│                                                                  │
│  ┌──────────────────┐  ┌──────────────────┐                    │
│  │  📈 Investment   │  │  📊 Product      │                    │
│  │                  │  │  Prioritization  │                    │
│  │  Invest in an    │  │                  │                    │
│  │  initiative or   │  │  Which features  │                    │
│  │  opportunity?    │  │  or initiatives? │                    │
│  └──────────────────┘  └──────────────────┘                    │
│                                                                  │
│  ┌──────────────────────────────────────────┐                  │
│  │  📝 Custom - Something else              │                  │
│  └──────────────────────────────────────────┘                  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Selection Behavior
1. User selects template
2. Canvas pre-populates with template structure
3. User can still customize everything (template is starting point, not constraint)
4. AI prompts are tailored to selected template type

---

## Template Architecture

### Storage Strategy

**Templates are static configuration, NOT database entities.**

| Component | Storage | Rationale |
|-----------|---------|-----------|
| Template definitions | Code (`/lib/templates/*.ts`) | Static, versioned with code, no admin UI needed for MVP |
| Template content (prompts, suggested options) | Code | Same as above |
| Decision's template type | Database (`decisions.type`) | Track which template was used |
| Template-suggested content (options, constraints) | Database (regular tables) | User can modify after creation |

This approach means:
- No database migrations for template changes
- Templates can be A/B tested with feature flags
- Easy to add new templates (just add code)
- No admin UI complexity

### Template vs User Content

When a template creates content (e.g., suggested options):

```
Template: "Build In-House"
     │
     ▼
Database: options table
     │
     ├── id: uuid
     ├── title: "Build In-House"
     ├── is_template_suggested: true  ◀── Flag for UI display
     └── ... user can edit everything else
```

The `is_template_suggested` flag allows UI to:
- Show "Suggested by template" badge
- Optionally gray out or highlight differently
- Let user know this came from template (vs their own input)

### Future: Custom Templates (Post-MVP)

If we need user-defined templates later:

```sql
CREATE TABLE custom_templates (
  id UUID PRIMARY KEY,
  org_id UUID REFERENCES organizations(id),
  name TEXT NOT NULL,
  config JSONB NOT NULL,  -- Same structure as code templates
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

But this is NOT needed for MVP.

---

## Data Model

```sql
-- Templates are stored in code, not database
-- But we track which template was used per decision

-- Already in decisions table:
-- type TEXT -- 'build_vs_buy', 'market_entry', 'investment', 'product_prioritization', 'custom'

-- Template-suggested options (user can edit/delete)
-- Stored in options table with is_template_suggested flag
ALTER TABLE options ADD COLUMN is_template_suggested BOOLEAN DEFAULT FALSE;

-- Template-suggested constraints (user can edit/delete)
-- Stored in constraints table
-- category field already supports template categories
```

---

## Implementation Notes

### Template Loading
```typescript
// Templates defined in code
import { buildVsBuyTemplate } from '@/lib/templates/build-vs-buy';
import { marketEntryTemplate } from '@/lib/templates/market-entry';
// ... etc

const templates = {
  build_vs_buy: buildVsBuyTemplate,
  market_entry: marketEntryTemplate,
  investment: investmentTemplate,
  product_prioritization: productPrioritizationTemplate,
  custom: customTemplate
};

// Apply template to new decision
function applyTemplate(decision: Decision, templateId: string) {
  const template = templates[templateId];

  // Pre-populate options
  for (const opt of template.suggestedOptions) {
    createOption({
      decision_id: decision.id,
      title: opt.title,
      description: opt.description,
      is_template_suggested: true
    });
  }

  // Pre-populate constraints
  for (const constraint of template.defaultConstraintCategories) {
    createConstraint({
      decision_id: decision.id,
      category: constraint.category,
      description: constraint.prompt,
      severity: 'soft' // User can change
    });
  }

  // Set AI context
  decision.metadata.templateContext = template.contextForAI;
}
```

### AI Prompt Integration
```typescript
// When generating AI analysis, include template context
function buildAnalysisPrompt(decision: Decision, task: string) {
  const templateContext = decision.metadata.templateContext || '';

  return `
    ${templateContext}

    Decision: ${decision.decision_frame}
    Context: ${decision.context}

    Task: ${task}
  `;
}
```
