# Plinth MVP Scope Definition

## Executive Summary

Plinth is a decision-quality system for senior leaders operating in complex environments. The MVP focuses on three proven value drivers: **structured decision framing**, **AI-generated analysis**, and **executive-ready outputs**.

**Target**: Sellable product in 2-3 months
**First customers**: Warm leads from Paul's network (product/strategy leaders in B2B)
**Price point target**: $500-2,000/month (enterprise SaaS)

---

## Core Value Proposition

> "Make better decisions faster—with explicit tradeoffs, grounded analysis, and artifacts you can defend months later."

Plinth helps executives answer:
- What decision are we actually making?
- What are our options and their tradeoffs?
- What evidence supports each path?
- How confident are we—and why?

---

## MVP Feature Scope

### Tier 1: Must Have (Launch Blockers)

#### 1. Decision Workspace
- Create and manage decision projects
- Structured decision canvas: Frame → Options → Evidence → Constraints → Tradeoffs → Recommendation
- Progress indicator showing decision completeness
- Save/resume workflow state

#### 2. AI-Powered Analysis Engine
- **Competitive Intelligence**: Analyze competitors from URL/name input
  - Auto-generate company profiles
  - Positioning analysis
  - Strengths/weaknesses
  - Market signals
- **Market Context**: Surface relevant trends, threats, opportunities
- **Option Analysis**: Generate pros/cons/risks for each decision option
- **Synthesis**: Combine inputs into coherent recommendation scaffolds

#### 3. Executive Outputs
- **Decision Brief**: 1-2 page summary suitable for exec review
  - Decision frame
  - Options considered
  - Recommendation with confidence level
  - Key tradeoffs acknowledged
  - Evidence summary
- **Export formats**: PDF, copy-to-clipboard (for slides/docs)
- **Shareable view**: Read-only link for stakeholders

#### 4. Authentication & Multi-tenancy
- Email/password + OAuth (Google) authentication
- Organization-level data isolation
- User roles: Admin, Member, Viewer
- Invite flow for team members

#### 5. Core UX
- Clean, serious, professional aesthetic
- Mobile-responsive (but desktop-primary)
- Fast load times (<2s to interactive)
- Clear information hierarchy

---

### Tier 2: Should Have (Week 6-10)

#### 6. Evidence Management
- Add evidence items (links, quotes, data points)
- Tag evidence to specific options
- Confidence weighting (strong/moderate/weak)
- Source attribution

#### 7. Decision Templates
- Pre-built templates for common decision types:
  - Build vs Buy
  - Market Entry
  - Product Investment
  - Organizational Change
- Custom template creation

#### 8. Collaboration (Light)
- Comments on decision elements
- @mention team members
- Activity feed per decision

#### 9. Dashboard
- Active decisions overview
- Recent activity
- Quick-start new decision

---

### Tier 3: Nice to Have (Post-Launch)

#### 10. Portfolio View
- See all decisions across org
- Filter by status, type, date
- Identify decision conflicts

#### 11. Assumption Tracking
- Log assumptions explicitly
- Set review triggers
- Decay/staleness indicators

#### 12. Integrations
- Slack notifications
- Calendar reminders for decision reviews
- Notion/Confluence export

#### 13. Advanced AI
- Scenario stress-testing
- Counter-argument generation
- Decision quality scoring

---

## Out of Scope for MVP

- SSO/SAML (enterprise auth)
- Audit logging
- API access
- White-labeling
- Custom LLM fine-tuning
- Real-time collaboration (Google Docs-style)
- Version history/diff views
- Mobile native apps

---

## User Personas (MVP)

### Primary: Strategic Product Leader
- **Role**: VP/Director of Product, Head of Strategy, Chief of Staff
- **Context**: B2B company, $50M-$1B revenue, complex product decisions
- **Pain**: Decisions take too long, rationale gets lost, revisiting settled decisions
- **Goal**: Move faster with more confidence, create artifacts that stick

### Secondary: Founder/CEO (Growth Stage)
- **Role**: Technical or product-oriented founder
- **Context**: Series A-C, scaling team, more stakeholders
- **Pain**: Can't be in every decision, needs scalable decision-making
- **Goal**: Establish decision discipline across leadership team

---

## Success Metrics (MVP)

### Activation
- User completes first decision brief within 7 days: >60%
- User invites team member within 14 days: >30%

### Engagement
- Weekly active decisions per organization: >2
- AI analysis features used per decision: >3

### Revenue
- Conversion from trial to paid: >15%
- First 10 paying customers within 60 days of launch

### Quality
- Decision brief rated "useful" or better: >80%
- NPS from beta users: >40

---

## Competitive Positioning

| Competitor | Positioning | Plinth Differentiation |
|------------|-------------|------------------------|
| Notion/Confluence | General workspace | Decision-specific structure, AI analysis |
| Coda/Airtable | Flexible databases | Opinionated decision framework |
| ChatGPT/Claude | General AI | Structured output, persistence, collaboration |
| Productboard | Feature prioritization | Strategic decisions, not feature backlog |
| Strategyzer | Business model canvas | Ongoing decisions, not one-time planning |

**Plinth's unique position**: The only tool that treats *the decision itself* as the primary object—not the research, not the document, not the meeting.

---

## Pricing Strategy (Initial)

### Recommended: Value-Based Tiers

**Starter**: $0/month (limited)
- 1 user
- 3 active decisions
- Basic AI analysis
- No team features

**Team**: $99/user/month
- Unlimited decisions
- Full AI analysis suite
- Team collaboration
- Executive outputs
- Priority support

**Enterprise**: Custom ($500+ base)
- SSO/SAML
- Advanced security
- Dedicated support
- Custom integrations

*Note: Start with Team tier only. Free tier for virality, Enterprise for later.*

---

## Decisions Locked

1. **Decision templates**: Build vs Buy, Market Entry, Investment Decision, Product Prioritization
2. **AI competitor profiles**: Comprehensive multi-section reports with ability to add evidence
3. **Output format**: PDF only for MVP
4. **Domain**: myplinth.com (secured)
5. **Legal**: Clean build, Paul owns 100%, not targeting Mastercard as customer
