# Plinth Implementation Roadmap

## Overview

**Duration**: 10 weeks (2.5 months)
**Target Launch**: Sellable MVP with first paying customers
**Development Approach**: Vibe coding with Cursor/Claude + human review

---

## Phase 0: Foundation (Week 1)
*Setup the infrastructure and development environment*

### Objectives
- [ ] Project scaffolding complete
- [ ] All accounts and services provisioned
- [ ] Development environment working
- [ ] CI/CD pipeline operational

### Tasks

#### Day 1-2: Project Setup
- [ ] Create GitHub repository
- [ ] Initialize Next.js 14 project with App Router
- [ ] Configure TypeScript, ESLint, Prettier
- [ ] Install core dependencies (Tailwind, shadcn/ui, Zustand, TanStack Query)
- [ ] Set up project folder structure (see FOLDER_STRUCTURE.md)

#### Day 3-4: Infrastructure
- [ ] Create Supabase project (production)
- [ ] Create Supabase project (staging)
- [ ] Run initial database migrations
- [ ] Configure Supabase Auth (email + Google OAuth)
- [ ] Set up Vercel project, connect GitHub
- [ ] Configure environment variables (dev, staging, prod)

#### Day 5: DevOps & Tooling
- [ ] Set up Sentry error tracking
- [ ] Configure Vercel Analytics
- [ ] Create seed data scripts
- [ ] Document local development setup
- [ ] Test full deploy pipeline

### Deliverables
- ✅ Running app on Vercel (empty shell)
- ✅ Database with schema deployed
- ✅ Auth working (signup/login)
- ✅ Development docs for ongoing work

---

## Phase 1: Core Decision Engine (Weeks 2-4)
*Build the heart of the product—structured decision capture*

### Objectives
- [ ] Users can create, edit, save decisions
- [ ] Full decision canvas workflow functional
- [ ] Data persists correctly with org isolation

### Week 2: Decision CRUD + Basic UI

#### Tasks
- [ ] Implement organization setup flow (post-signup)
- [ ] Build dashboard layout (sidebar, header, main area)
- [ ] Create decision list view
- [ ] Build "New Decision" modal/flow
- [ ] Implement decision detail page structure
- [ ] Create decision context/framing editor
- [ ] Add decision status management

#### Components to Build
- `DashboardLayout` - Main app shell
- `DecisionList` - Grid/list of decisions
- `DecisionCard` - Summary card component
- `NewDecisionModal` - Creation flow
- `DecisionHeader` - Title, status, actions
- `ContextEditor` - Rich text for decision framing

### Week 3: Options & Evidence

#### Tasks
- [ ] Build options section UI
- [ ] Implement add/edit/remove options
- [ ] Create option detail panel (pros/cons/risks)
- [ ] Build evidence section UI
- [ ] Implement evidence CRUD
- [ ] Link evidence to options
- [ ] Add confidence/strength indicators

#### Components to Build
- `OptionsPanel` - List of decision options
- `OptionCard` - Individual option display
- `OptionEditor` - Edit option details
- `ProsConsList` - Structured pros/cons
- `EvidencePanel` - Evidence list
- `EvidenceCard` - Individual evidence item
- `EvidenceEditor` - Add/edit evidence
- `StrengthBadge` - Visual strength indicator

### Week 4: Constraints, Tradeoffs & Workflow

#### Tasks
- [ ] Build constraints section
- [ ] Implement constraint CRUD
- [ ] Build tradeoffs section
- [ ] Implement tradeoff capture
- [ ] Create decision progress indicator
- [ ] Add decision workflow states
- [ ] Implement autosave
- [ ] Build recommendation selection UI

#### Components to Build
- `ConstraintsPanel` - List constraints
- `ConstraintEditor` - Add/edit constraints
- `TradeoffsPanel` - Tradeoff list
- `TradeoffEditor` - Capture tradeoffs
- `DecisionProgress` - Visual progress bar
- `StatusTransition` - Change decision status
- `RecommendationPicker` - Select recommended option

### Phase 1 Deliverables
- ✅ Complete decision capture workflow
- ✅ All core entities functional (options, evidence, constraints, tradeoffs)
- ✅ Data persistence working
- ✅ Multi-user org isolation verified

---

## Phase 2: AI Analysis Engine (Weeks 5-6)
*Add the AI-powered intelligence layer*

### Objectives
- [ ] Competitor analysis generates useful profiles
- [ ] AI can analyze/enhance options
- [ ] Synthesis produces coherent summaries

### Week 5: Competitor Intelligence

#### Tasks
- [ ] Set up OpenAI API integration
- [ ] Set up Firecrawl/Exa for web research
- [ ] Build competitor input UI (name/URL)
- [ ] Implement competitor analysis prompt
- [ ] Create competitor profile schema
- [ ] Build competitor display component
- [ ] Add "Add as Evidence" flow from competitor data
- [ ] Implement caching layer

#### AI Prompts to Build
- `competitor-profile.ts` - Generate company profile
- `competitor-comparison.ts` - Compare multiple competitors
- `market-signals.ts` - Extract market trends

#### Components to Build
- `CompetitorInput` - Add competitor
- `CompetitorProfile` - Display analysis
- `CompetitorComparison` - Side-by-side view
- `AILoadingState` - Streaming indicator

### Week 6: Option Analysis & Synthesis

#### Tasks
- [ ] Build option analysis prompt
- [ ] Implement "Analyze this option" feature
- [ ] Create synthesis prompt (all data → narrative)
- [ ] Build synthesis display
- [ ] Add "Suggest tradeoffs" feature
- [ ] Implement confidence scoring assistance
- [ ] Add AI suggestions panel

#### AI Prompts to Build
- `option-analysis.ts` - Deep dive on single option
- `options-comparison.ts` - Compare all options
- `decision-synthesis.ts` - Full narrative summary
- `tradeoff-suggestions.ts` - Identify implicit tradeoffs
- `confidence-assessment.ts` - Evaluate decision confidence

#### Components to Build
- `AnalyzeButton` - Trigger AI analysis
- `SynthesisPanel` - Show AI synthesis
- `SuggestionsList` - AI recommendations
- `ConfidenceHelper` - AI-assisted scoring

### Phase 2 Deliverables
- ✅ Competitor analysis working end-to-end
- ✅ Option enhancement via AI
- ✅ Synthesis generation functional
- ✅ AI costs within budget expectations

---

## Phase 3: Executive Outputs (Week 7)
*Generate polished artifacts for sharing*

### Objectives
- [ ] Decision brief generates clean document
- [ ] Export to PDF works
- [ ] Shareable links functional

### Tasks

#### Output Generation
- [ ] Build decision brief template
- [ ] Implement brief generation prompt
- [ ] Create brief preview component
- [ ] Add brief editing/customization
- [ ] Implement PDF export (using react-pdf or similar)
- [ ] Add copy-to-clipboard (markdown/plain text)

#### Sharing
- [ ] Implement share key generation
- [ ] Build public output view page
- [ ] Add share toggle UI
- [ ] Create shareable link copy button
- [ ] Style public view (read-only, branded)

#### Templates
- [ ] Create "Build vs Buy" template
- [ ] Create "Market Entry" template
- [ ] Create "Investment Decision" template
- [ ] Create "Product Prioritization" template
- [ ] Build template selection UI

#### Components to Build
- `OutputGenerator` - Create new output
- `BriefPreview` - Preview before export
- `BriefEditor` - Customize output
- `ExportMenu` - PDF/clipboard options
- `ShareToggle` - Enable/disable sharing
- `PublicOutputView` - Read-only display
- `TemplateSelector` - Choose decision template

### Phase 3 Deliverables
- ✅ Decision briefs look professional
- ✅ PDF export functional
- ✅ Shareable links working
- ✅ At least 3 templates available

---

## Phase 4: Team & Polish (Weeks 8-9)
*Add collaboration and refine the experience*

### Objectives
- [ ] Team invitations working
- [ ] Comments functional
- [ ] UX polish complete
- [ ] Performance optimized

### Week 8: Team Features

#### Tasks
- [ ] Build team settings page
- [ ] Implement invitation flow (email)
- [ ] Create invitation acceptance page
- [ ] Add role management UI
- [ ] Build member removal flow
- [ ] Implement basic comments on decisions
- [ ] Add @mention functionality
- [ ] Build activity feed

#### Components to Build
- `TeamSettings` - Org settings page
- `InviteMember` - Send invitation
- `MemberList` - Show team members
- `RolePicker` - Assign roles
- `InviteAccept` - Accept invitation page
- `CommentThread` - Comments list
- `CommentInput` - Add comment
- `MentionPicker` - @mention typeahead
- `ActivityFeed` - Recent activity

### Week 9: UX Polish & Performance

#### Tasks
- [ ] Comprehensive UI review
- [ ] Fix responsive issues
- [ ] Add loading states everywhere
- [ ] Implement error boundaries
- [ ] Add empty states
- [ ] Optimize bundle size
- [ ] Add page transitions
- [ ] Implement keyboard shortcuts
- [ ] Accessibility audit (basic)
- [ ] Performance profiling

#### Polish Items
- [ ] Consistent spacing/typography
- [ ] Hover states and transitions
- [ ] Form validation feedback
- [ ] Toast notifications
- [ ] Confirmation dialogs
- [ ] Breadcrumbs/navigation
- [ ] Help tooltips

### Phase 4 Deliverables
- ✅ Team collaboration functional
- ✅ Comments working
- ✅ App feels polished and professional
- ✅ No major bugs or UX issues

---

## Phase 5: Launch Prep (Week 10)
*Final testing, docs, and go-to-market*

### Objectives
- [ ] Production environment stable
- [ ] Documentation complete
- [ ] Payment ready (or clear path)
- [ ] First customers onboarded

### Tasks

#### Quality Assurance
- [ ] Full feature walkthrough
- [ ] Cross-browser testing (Chrome, Safari, Firefox)
- [ ] Mobile responsiveness check
- [ ] Load testing (basic)
- [ ] Security review (auth, data isolation)
- [ ] Fix all critical bugs

#### Documentation
- [ ] User onboarding guide
- [ ] Feature documentation
- [ ] FAQ/troubleshooting
- [ ] Terms of service (template)
- [ ] Privacy policy (template)

#### Payment & Business
- [ ] Stripe account setup
- [ ] Pricing page design
- [ ] Implement trial limitations (if needed)
- [ ] Set up customer support channel (email/Intercom)

#### Launch
- [ ] Soft launch to 5-10 beta users from network
- [ ] Gather feedback, iterate
- [ ] Announce to broader network
- [ ] Monitor for issues

### Phase 5 Deliverables
- ✅ App ready for paying customers
- ✅ First 3-5 beta users onboarded
- ✅ Feedback loop established
- ✅ Path to payment clear

---

## Weekly Rhythm

### Each Week Includes
- **Monday**: Plan week, review previous progress
- **Tue-Thu**: Build features
- **Friday**: Integration, testing, documentation
- **Weekend**: Optional polish or catch-up

### Checkpoints
- **End of Week 1**: Can deploy and auth works
- **End of Week 4**: Can complete full decision workflow
- **End of Week 6**: AI features functional
- **End of Week 7**: Can generate and share outputs
- **End of Week 9**: Team features + polish complete
- **End of Week 10**: Ready for customers

---

## Risk Mitigations

| Risk | Mitigation |
|------|------------|
| Scope creep | Strict adherence to Tier 1 features only |
| AI quality issues | Manual review of prompts, user feedback loop |
| Technical blockers | Keep stack simple, use proven patterns |
| Timeline slip | Cut Tier 2 features if needed, launch Tier 1 |
| Low initial adoption | Focus on warm leads, iterate based on feedback |

---

## Success Criteria

### MVP is "done" when:
1. ✅ User can sign up and create organization
2. ✅ User can create decision with all elements
3. ✅ AI generates useful competitor analysis
4. ✅ User can generate and share decision brief
5. ✅ Team can collaborate on decisions
6. ✅ App is stable and performant
7. ✅ At least 3 users have completed a real decision

### Ready for revenue when:
1. ✅ Stripe integration working
2. ✅ Trial/paid distinction functional
3. ✅ Terms and privacy policy in place
4. ✅ Support channel available
