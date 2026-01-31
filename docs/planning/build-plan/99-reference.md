# Reference

This document contains environment variables, test coverage plans, and other reference material.

> **Architecture Reference**: See [LLM_ORCHESTRATION.md](../../specs/LLM_ORCHESTRATION.md) for the complete AI pipeline.

---

## Environment Variables Summary

Here's a complete list of all environment variables needed:

```env
# ===========================================
# SUPABASE
# ===========================================
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...

# ===========================================
# APP
# ===========================================
NEXT_PUBLIC_APP_URL=http://localhost:3000  # or https://myplinth.com

# ===========================================
# AI SERVICES (LLM)
# ===========================================
OPENAI_API_KEY=sk-...

# ===========================================
# SEARCH SERVICES
# ===========================================
EXA_API_KEY=...                    # Primary: semantic/keyword search
TAVILY_API_KEY=tvly-...            # Fallback: broader web search

# ===========================================
# SCRAPING SERVICES
# ===========================================
FIRECRAWL_API_KEY=fc-...           # Primary: clean content extraction
APIFY_API_TOKEN=apify_api_...      # Fallback: platform-specific scrapers

# ===========================================
# BACKGROUND JOBS
# ===========================================
INNGEST_EVENT_KEY=...
INNGEST_SIGNING_KEY=...

# ===========================================
# EMAIL
# ===========================================
RESEND_API_KEY=re_...

# ===========================================
# MONITORING
# ===========================================
NEXT_PUBLIC_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
SENTRY_AUTH_TOKEN=sntrys_...

# ===========================================
# CACHE (Optional - uses Supabase by default)
# ===========================================
# REDIS_URL=redis://...            # For hot cache if needed
```

### Environment Variable Checklist

| Variable | Local | Vercel Dev | Vercel Preview | Vercel Prod |
|----------|-------|------------|----------------|-------------|
| NEXT_PUBLIC_SUPABASE_URL | staging | staging | staging | production |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | staging | staging | staging | production |
| SUPABASE_SERVICE_ROLE_KEY | staging | staging | staging | production |
| NEXT_PUBLIC_APP_URL | localhost | staging | preview URL | myplinth.com |
| OPENAI_API_KEY | same | same | same | same |
| EXA_API_KEY | same | same | same | same |
| FIRECRAWL_API_KEY | same | same | same | same |
| TAVILY_API_KEY | same | same | same | same |
| APIFY_API_TOKEN | same | same | same | same |
| INNGEST_EVENT_KEY | dev | staging | staging | production |
| INNGEST_SIGNING_KEY | dev | staging | staging | production |
| RESEND_API_KEY | same | same | same | same |
| SENTRY_DSN | same | same | same | same |

---

## Test Coverage Summary

### E2E Tests (Playwright)

| Test | Phase | Priority |
|------|-------|----------|
| Signup flow | Phase 0 | P0 |
| Login/logout flow | Phase 0 | P0 |
| Create decision (framing) | Phase 1 | P0 |
| Context anchoring | Phase 1 | P1 |
| Start analysis | Phase 1 | P0 |
| View analysis progress | Phase 2 | P0 |
| View analysis results | Phase 2 | P0 |
| Generate and share brief | Phase 3 | P0 |
| Invite team member | Phase 4 | P1 |
| Full onboarding flow | Phase 4 | P1 |

### Integration Tests (Vitest)

| Test Area | Phase | Priority |
|-----------|-------|----------|
| Auth middleware | Phase 0 | P0 |
| RLS org isolation | Phase 0 | P0 |
| Decision CRUD API | Phase 1 | P0 |
| Frame PATCH API | Phase 1 | P0 |
| Context PATCH API | Phase 1 | P1 |
| Job creation + polling | Phase 1 | P0 |
| Exa search client | Phase 2 | P1 |
| Firecrawl scrape client | Phase 2 | P1 |
| Evidence scan pipeline | Phase 2 | P0 |
| Option generation | Phase 2 | P1 |
| Evidence mapping | Phase 2 | P1 |
| Recommendation generation | Phase 2 | P1 |
| Brief generation | Phase 3 | P1 |
| Member invitation | Phase 4 | P1 |

### Unit Tests (Vitest)

| Test Area | Phase | Priority |
|-----------|-------|----------|
| Query planner prompt | Phase 2 | P1 |
| Evidence extractor prompt | Phase 2 | P1 |
| Option composer prompt | Phase 2 | P1 |
| Confidence scoring math | Phase 2 | P0 |
| Fallback chain logic | Phase 2 | P1 |
| Cache TTL handling | Phase 2 | P2 |
| Date/format utilities | Throughout | P2 |

---

## API Rate Limits

| Endpoint Pattern | Limit | Window |
|------------------|-------|--------|
| `/api/auth/*` | 10 | 1 minute |
| `/api/decisions/*/analyze` | 5 | 1 minute |
| `/api/ai/*` | 20 | 1 minute |
| `/api/jobs` (POST) | 10 | 1 minute |
| All other APIs | 100 | 1 minute |

---

## Database Indexes

Created in migrations:

| Table | Index | Purpose |
|-------|-------|---------|
| decisions | (org_id, updated_at DESC) | List queries |
| decisions | (org_id, status) | Filtered lists |
| evidence_cards | (decision_id) | Load with decision |
| evidence_cards | (decision_id, signal_type) | Filter by type |
| options | (decision_id) | Load with decision |
| option_evidence_map | (option_id) | Evidence per option |
| option_evidence_map | (evidence_card_id) | Options per evidence |
| option_scores | (decision_id) | Load with decision |
| recommendations | (decision_id) | Load with decision |
| assumptions_ledger | (decision_id) | Load with decision |
| constraints | (decision_id) | Load with decision |
| jobs | (org_id, status) | Job polling |
| jobs | (decision_id, status) | Decision jobs |
| users | (org_id) | Team queries |
| invitations | (org_id, expires_at) | Pending invites |

---

## Security Headers

Configured in `middleware.ts`:

```typescript
const securityHeaders = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  // CSP configured separately for flexibility
};
```

---

## Third-Party Service Limits & Costs

### Per-Decision Budget

| Resource | Default | Max | Notes |
|----------|---------|-----|-------|
| Search queries | 12 | 20 | Exa primary, Tavily fallback |
| URLs discovered | 40 | 60 | Deduplicated |
| Pages scraped | 25 | 35 | Firecrawl primary |
| Deep reads | 6 | 10 | Second-pass extraction |
| Evidence cards | 25-40 | 50 | Generated from content |
| LLM calls (mini) | ~30 | 50 | GPT-4o-mini |
| LLM calls (mid) | 4-6 | 10 | GPT-4o |

### Cost Per Decision

| Service | Usage | Est. Cost |
|---------|-------|-----------|
| GPT-4o-mini | ~25k tokens | ~$0.01 |
| GPT-4o | ~15k tokens | ~$0.15 |
| Exa | 12 requests | ~$0.10 |
| Firecrawl | 25 pages | ~$0.25 |
| **Total** | | **~$0.50** |

### Service Pricing Tiers

| Service | Free Tier | Paid Tier | Our Usage |
|---------|-----------|-----------|-----------|
| Supabase | 500MB DB, 50K MAU | $25/mo Pro | Staging: Free, Prod: Pro |
| Vercel | 100GB bandwidth | $20/mo Pro | Pro recommended |
| OpenAI | Pay per token | Pay per token | ~$0.16 per decision |
| Exa | 1000 searches/mo | Custom | ~$0.10 per decision |
| Firecrawl | 500 pages/mo | $49/mo | ~25 pages per decision |
| Tavily | 1000 searches/mo | $100/mo | Fallback only |
| Apify | Free tier | Usage-based | Fallback only |
| Inngest | 5K events/mo | $50/mo | Upgrade if needed |
| Resend | 3K emails/mo | $20/mo | Should be sufficient |
| Sentry | 5K errors/mo | $26/mo | Free initially |

---

## Post-MVP Backlog

Features explicitly deferred:

| # | Feature | Effort | Impact | Notes |
|---|---------|--------|--------|-------|
| 1 | Post-decision tracking (Step 9) | Medium | High | Monitor assumptions, flag changes |
| 2 | SSO/SAML integration | High | High | Enterprise feature |
| 3 | Advanced audit logging | Medium | Medium | Compliance |
| 4 | Custom templates | Medium | High | User request |
| 5 | API access for integrations | High | Medium | Developer feature |
| 6 | Mobile-optimized experience | High | Medium | Tablet is MVP |
| 7 | Advanced collaboration (real-time) | Very High | High | Complex |
| 8 | Decision history/versioning | Medium | Medium | Nice to have |
| 9 | Bulk import/export | Medium | Low | Power user |
| 10 | Advanced analytics dashboard | High | Medium | Data insights |
| 11 | Slack/Teams integration | Medium | High | Workflow |

---

## Useful Commands

```bash
# Development
npm run dev                    # Start dev server
npm run verify                 # Full verification (lint + type-check + build)

# Database
npx supabase start             # Start local Supabase
npx supabase db push           # Apply migrations
npx supabase db diff           # Check for drift
npx supabase gen types typescript --local > src/types/database.ts

# Testing
npm run test                   # Unit tests
npm run test:watch             # Watch mode
npm run test:e2e               # E2E tests

# Inngest (background jobs)
npx inngest-cli@latest dev     # Start local Inngest

# Troubleshooting
rm -rf .next && npm run dev    # Clear Next.js cache
npx supabase db reset          # Reset database
npm run type-check             # Check for type errors
```

---

## File Structure Reference

```
plinth-app/
├── src/
│   ├── app/
│   │   ├── (auth)/              # Auth pages (login, signup, etc.)
│   │   ├── (dashboard)/         # Protected dashboard pages
│   │   │   ├── analyze/         # Analysis flow pages
│   │   │   │   └── [id]/        # Decision-specific pages
│   │   │   │       ├── frame/   # Step 1: Framing
│   │   │   │       ├── context/ # Step 2: Context
│   │   │   │       ├── results/ # Steps 3-8: Results
│   │   │   │       └── brief/   # Generated brief
│   │   │   └── dashboard/       # Main dashboard
│   │   ├── (public)/            # Public pages (share, privacy, terms)
│   │   └── api/                 # API routes
│   │       ├── decisions/       # Decision CRUD
│   │       ├── jobs/            # Job management
│   │       └── inngest/         # Inngest webhook
│   ├── components/
│   │   ├── analyze/             # Analysis flow components
│   │   ├── decisions/           # Decision list/card components
│   │   ├── onboarding/          # Onboarding flow
│   │   ├── outputs/             # Brief preview/edit
│   │   ├── settings/            # Settings pages
│   │   └── ui/                  # shadcn/ui components
│   ├── lib/
│   │   ├── analysis/            # Analysis pipeline functions
│   │   │   ├── query-planner.ts
│   │   │   ├── url-discovery.ts
│   │   │   ├── content-extractor.ts
│   │   │   ├── evidence-generator.ts
│   │   │   ├── option-composer.ts
│   │   │   ├── evidence-mapper.ts
│   │   │   ├── option-scorer.ts
│   │   │   ├── recommender.ts
│   │   │   └── brief-writer.ts
│   │   ├── services/            # External service clients
│   │   │   ├── exa.ts
│   │   │   ├── firecrawl.ts
│   │   │   ├── tavily.ts
│   │   │   ├── apify.ts
│   │   │   ├── openai.ts
│   │   │   └── cache.ts
│   │   ├── inngest/             # Background job functions
│   │   │   ├── client.ts
│   │   │   ├── events.ts
│   │   │   └── functions/
│   │   │       ├── analyze-decision.ts
│   │   │       ├── evidence-scan.ts
│   │   │       ├── generate-options.ts
│   │   │       ├── map-evidence.ts
│   │   │       ├── score-options.ts
│   │   │       ├── generate-recommendation.ts
│   │   │       └── generate-brief.ts
│   │   ├── api/                 # API response helpers
│   │   ├── auth/                # Auth utilities
│   │   ├── email/               # Email templates
│   │   ├── supabase/            # Supabase clients
│   │   └── utils/               # General utilities
│   ├── hooks/                   # React hooks
│   └── types/                   # TypeScript types
├── supabase/
│   ├── migrations/              # Database migrations
│   └── seed.sql                 # Development seed data
├── docs/
│   ├── specs/                   # Feature specifications
│   │   ├── CORE_JOURNEY.md      # 9-step user journey
│   │   └── LLM_ORCHESTRATION.md # AI pipeline architecture
│   ├── design/                  # Design documentation
│   │   └── DESIGN_SPEC_V2.md    # Updated pages/components
│   └── planning/                # Build plans
│       └── build-plan/          # Phase documents
└── e2e/                         # Playwright E2E tests
```

---

## Caching Strategy

| Cache Key | Value | TTL | Storage |
|-----------|-------|-----|---------|
| `url:{hash}` | Clean extracted text | 24 hours | Supabase |
| `url:{hash}:fingerprint` | Content hash | 7 days | Supabase |
| `query:{hash}` | SERP results | 1 hour | Redis (if available) |
| `evidence_card:{hash}` | Extracted evidence | 24 hours | Supabase |
| `decision:{id}:step:{n}` | Step output | Session | Supabase |

---

## Contact & Resources

| Resource | URL |
|----------|-----|
| Next.js Docs | nextjs.org/docs |
| Supabase Docs | supabase.com/docs |
| shadcn/ui | ui.shadcn.com |
| Inngest Docs | inngest.com/docs |
| Vercel AI SDK | sdk.vercel.ai |
| Resend Docs | resend.com/docs |
| Exa Docs | docs.exa.ai |
| Firecrawl Docs | docs.firecrawl.dev |
| Tavily Docs | docs.tavily.com |
| Apify Docs | docs.apify.com |
