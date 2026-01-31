# Reference

This document contains environment variables, test coverage plans, and other reference material.

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
# AI SERVICES
# ===========================================
OPENAI_API_KEY=sk-...

# ===========================================
# RESEARCH SERVICES
# ===========================================
FIRECRAWL_API_KEY=fc-...
EXA_API_KEY=...

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
```

### Environment Variable Checklist

| Variable | Local | Vercel Dev | Vercel Preview | Vercel Prod |
|----------|-------|------------|----------------|-------------|
| NEXT_PUBLIC_SUPABASE_URL | staging | staging | staging | production |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | staging | staging | staging | production |
| SUPABASE_SERVICE_ROLE_KEY | staging | staging | staging | production |
| NEXT_PUBLIC_APP_URL | localhost | staging | preview URL | myplinth.com |
| OPENAI_API_KEY | same | same | same | same |
| FIRECRAWL_API_KEY | same | same | same | same |
| EXA_API_KEY | same | same | same | same |
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
| Create decision | Phase 1 | P0 |
| Add options/evidence/tradeoffs | Phase 1 | P0 |
| AI competitor analysis | Phase 2 | P1 |
| Generate and share brief | Phase 3 | P0 |
| Invite team member | Phase 4 | P1 |
| Full onboarding flow | Phase 4 | P1 |

### Integration Tests (Vitest)

| Test Area | Phase | Priority |
|-----------|-------|----------|
| Auth middleware | Phase 0 | P0 |
| RLS org isolation | Phase 0 | P0 |
| Decision CRUD API | Phase 1 | P0 |
| Options CRUD API | Phase 1 | P0 |
| Evidence with option links | Phase 1 | P1 |
| Quality score calculation | Phase 1 | P1 |
| Job creation and polling | Phase 2 | P1 |
| AI prompt execution (mocked) | Phase 2 | P2 |
| Output generation | Phase 3 | P1 |
| Member invitation | Phase 4 | P1 |

### Unit Tests (Vitest)

| Test Area | Phase | Priority |
|-----------|-------|----------|
| Quality score calculation | Phase 1 | P0 |
| Template loading | Phase 1 | P1 |
| Prompt formatting | Phase 2 | P1 |
| Date/format utilities | Throughout | P2 |

---

## API Rate Limits

| Endpoint Pattern | Limit | Window |
|------------------|-------|--------|
| `/api/auth/*` | 10 | 1 minute |
| `/api/ai/*` | 20 | 1 minute |
| `/api/jobs` (POST) | 10 | 1 minute |
| All other APIs | 100 | 1 minute |

---

## Database Indexes

Created in `003_indexes.sql`:

| Table | Index | Purpose |
|-------|-------|---------|
| decisions | (org_id, updated_at DESC) | List queries |
| decisions | (org_id, status) | Filtered lists |
| options | (decision_id) | Loading with options |
| evidence | (decision_id) | Loading with evidence |
| evidence_options | (evidence_id) | Junction lookups |
| evidence_options | (option_id) | Junction lookups |
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

## Post-MVP Backlog

Features explicitly deferred:

| # | Feature | Effort | Impact | Notes |
|---|---------|--------|--------|-------|
| 1 | SSO/SAML integration | High | High | Enterprise feature |
| 2 | Advanced audit logging | Medium | Medium | Compliance |
| 3 | Custom templates | Medium | High | User request |
| 4 | API access for integrations | High | Medium | Developer feature |
| 5 | Mobile-optimized experience | High | Medium | Tablet is MVP |
| 6 | Advanced collaboration (real-time) | Very High | High | Complex |
| 7 | Decision history/versioning | Medium | Medium | Nice to have |
| 8 | Bulk import/export | Medium | Low | Power user |
| 9 | Advanced analytics dashboard | High | Medium | Data insights |
| 10 | Slack/Teams integration | Medium | High | Workflow |

---

## Third-Party Service Limits

| Service | Free Tier | Paid Tier | Our Usage |
|---------|-----------|-----------|-----------|
| Supabase | 500MB DB, 50K MAU | $25/mo Pro | Staging: Free, Prod: Pro |
| Vercel | 100GB bandwidth | $20/mo Pro | Pro recommended |
| OpenAI | Pay per token | Pay per token | ~$0.01-0.05 per decision |
| Firecrawl | 500 pages/mo | $49/mo | Monitor usage |
| Exa | 1000 searches/mo | Custom | Monitor usage |
| Inngest | 5K events/mo | $50/mo | Upgrade if needed |
| Resend | 3K emails/mo | $20/mo | Should be sufficient |
| Sentry | 5K errors/mo | $26/mo | Free initially |

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
│   │   ├── (public)/            # Public pages (share, privacy, terms)
│   │   └── api/                 # API routes
│   ├── components/
│   │   ├── canvas/              # Decision canvas components
│   │   ├── decisions/           # Decision list/card components
│   │   ├── onboarding/          # Onboarding flow
│   │   ├── outputs/             # Brief preview/edit
│   │   ├── settings/            # Settings pages
│   │   └── ui/                  # shadcn/ui components
│   ├── lib/
│   │   ├── ai/                  # AI prompts and utilities
│   │   ├── api/                 # API response helpers
│   │   ├── auth/                # Auth utilities
│   │   ├── email/               # Email templates
│   │   ├── inngest/             # Background job functions
│   │   ├── services/            # External service clients
│   │   ├── supabase/            # Supabase clients
│   │   ├── templates/           # Decision templates
│   │   └── utils/               # General utilities
│   ├── hooks/                   # React hooks
│   └── types/                   # TypeScript types
├── supabase/
│   ├── migrations/              # Database migrations
│   └── seed.sql                 # Development seed data
├── docs/
│   ├── architecture/            # Technical architecture docs
│   ├── planning/                # Build plans
│   └── specs/                   # Feature specifications
└── e2e/                         # Playwright E2E tests
```

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
