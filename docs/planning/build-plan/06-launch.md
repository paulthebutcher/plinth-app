# Phase 5: Launch (Week 8)

**Goal**: Single-user MVP deployed to production, ready for first customers.

**Status**: ⏳ Not Started

> **Note**: Phase 4 (Team & Polish) skipped - team features deferred until post-PMF.

---

## Pre-Phase Checklist

Before starting this phase, verify:

- [ ] Phase 3 (Outputs) complete - briefs display, edit, share, export
- [ ] Build succeeds with no TypeScript errors
- [ ] All API keys configured for AI services (OpenAI, Exa, Tavily, Firecrawl, Apify)
- [ ] Local end-to-end test: can create decision → run analysis → view results → see brief
- [ ] Git repo clean, all changes committed

---

## 5.1 Production Supabase Setup

**🔧 External Setup (do manually):**

1. **Create Production Supabase Project:**
   - Go to supabase.com → New Project
   - Name: `plinth-production`
   - Region: Choose closest to your users
   - Save the new project URL and anon key

2. **Run Migrations on Production:**
   ```bash
   # Link to production project
   supabase link --project-ref YOUR_PROJECT_REF

   # Push all migrations
   supabase db push
   ```

3. **Configure Auth Settings:**
   - Go to Authentication → URL Configuration
   - Site URL: `https://your-domain.com`
   - Redirect URLs: `https://your-domain.com/**`

4. **Enable Row Level Security:**
   - Verify RLS is enabled on all tables
   - Test that users can only see their org's data

| Task | Acceptance Criteria | Status |
|------|---------------------|--------|
| 🔧 Production project | Created in Supabase | |
| 🔧 Migrations applied | All tables exist | |
| 🔧 Auth configured | Redirect URLs set | |
| 🔧 RLS verified | Users isolated by org | |

---

## 5.2 Vercel Production Deployment

**🔧 External Setup (do manually):**

1. **Connect Repo to Vercel:**
   - Go to vercel.com → Import Project
   - Select your GitHub repo
   - Framework: Next.js (auto-detected)

2. **Configure Environment Variables:**
   ```
   # Supabase (production values)
   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   SUPABASE_SERVICE_ROLE_KEY=eyJ...

   # AI Services
   OPENAI_API_KEY=sk-...
   EXA_API_KEY=...
   TAVILY_API_KEY=tvly-...
   FIRECRAWL_API_KEY=fc-...
   APIFY_API_TOKEN=apify_api_...

   # Inngest
   INNGEST_SIGNING_KEY=signkey-...
   INNGEST_EVENT_KEY=...

   # App
   NEXT_PUBLIC_APP_URL=https://your-domain.com
   ```

3. **Deploy:**
   - Push to `main` branch
   - Vercel auto-deploys
   - Verify at `your-project.vercel.app`

| Task | Acceptance Criteria | Status |
|------|---------------------|--------|
| 🔧 Vercel project | Connected to repo | |
| 🔧 Env vars set | All production values | |
| 🔧 Initial deploy | App loads at Vercel URL | |

---

## 5.3 Custom Domain Setup

**🔧 External Setup (do manually):**

1. **Add Domain in Vercel:**
   - Go to Vercel → Project → Settings → Domains
   - Add your domain (e.g., `plinth.app` or `useplinth.com`)

2. **Configure DNS (at your registrar):**
   - For apex domain: Add `A` record → `76.76.21.21`
   - For www: Add `CNAME` record → `cname.vercel-dns.com`

3. **Wait for DNS Propagation:**
   - Usually 5-30 minutes
   - Vercel will show "Valid Configuration" when ready

4. **Verify SSL:**
   - Vercel auto-provisions SSL
   - Visit `https://your-domain.com` - should show green lock

5. **Update Supabase Redirect URLs:**
   - Add `https://your-domain.com/**` to allowed redirects
   - Update Site URL to `https://your-domain.com`

| Task | Acceptance Criteria | Status |
|------|---------------------|--------|
| 🔧 Domain added | Vercel shows domain | |
| 🔧 DNS configured | "Valid Configuration" in Vercel | |
| 🔧 SSL active | HTTPS works, green lock | |
| 🔧 Supabase updated | Redirects to new domain work | |

---

## 5.4 Inngest Production Setup

**🔧 External Setup (do manually):**

1. **Create Inngest Cloud Account:**
   - Go to inngest.com → Sign up
   - Create new app for production

2. **Get Production Keys:**
   - Copy Signing Key and Event Key
   - Add to Vercel environment variables

3. **Register Functions:**
   - Deploy triggers function registration
   - Verify all 7 functions appear in Inngest dashboard:
     - `decision/analyze`
     - `analysis/evidence-scan`
     - `analysis/generate-options`
     - `analysis/map-evidence`
     - `analysis/score-options`
     - `analysis/generate-recommendation`
     - `analysis/generate-brief`

4. **Test Event Flow:**
   - Create a test decision in production
   - Trigger analysis
   - Watch events flow in Inngest dashboard

| Task | Acceptance Criteria | Status |
|------|---------------------|--------|
| 🔧 Inngest account | Production app created | |
| 🔧 Keys configured | Added to Vercel env | |
| 🔧 Functions registered | All 7 visible in dashboard | |
| 🔧 Test event | Events flow correctly | |

---

## 5.5 Error Monitoring (Optional but Recommended)

**Windsurf Prompt:**
```
GOAL: Add Sentry for error tracking in production.

SETUP:
1. Create Sentry account at sentry.io
2. Create new Next.js project
3. Get DSN

FILES TO CREATE:
- sentry.client.config.ts
- sentry.server.config.ts
- sentry.edge.config.ts

INSTALL:
npm install @sentry/nextjs

BEHAVIOR:
1. Run Sentry wizard: npx @sentry/wizard@latest -i nextjs
2. Follow prompts to configure
3. Add SENTRY_DSN to Vercel env vars
4. Test by throwing a test error

CONSTRAINTS:
- Only capture errors in production
- Don't capture PII in error reports

ACCEPTANCE CRITERIA:
- Sentry dashboard receives test error
- Source maps uploaded for readable stack traces
- Build succeeds
```

| Task | Acceptance Criteria | Status |
|------|---------------------|--------|
| 🔧 Sentry account | Project created | |
| 💻 Sentry SDK | Installed and configured | |
| 🔧 Test error | Appears in Sentry dashboard | |

---

## 5.6 Demo Account & Seed Data

**Windsurf Prompt:**
```
GOAL: Create seed script for demo account with completed analysis.

FILES TO CREATE:
- scripts/seed-demo.ts

BEHAVIOR:

1. Create demo organization:
   - Name: "Demo Company"
   - Slug: "demo"

2. Create demo user:
   - Email: demo@plinth.app (or your domain)
   - This will be used for demos/screenshots

3. Create completed decision with all data:
   - Title: "Should we expand into the European market?"
   - Type: strategic
   - Full frame, context, constraints
   - 10-15 evidence cards (realistic examples)
   - 3-4 options with scores
   - Evidence mappings
   - Recommendation with decision changers
   - Generated brief

4. Run with: npx tsx scripts/seed-demo.ts

CONSTRAINTS:
- Use realistic but fictional data
- All evidence should have plausible sources
- Scores should be reasonable (not all 100s)

ACCEPTANCE CRITERIA:
- Script runs without error
- Demo account can log in
- Dashboard shows completed decision
- Brief page displays full content
```

| Task | Acceptance Criteria | Status |
|------|---------------------|--------|
| 💻 Seed script | Creates demo data | |
| 💻 Demo decision | Full analysis visible | |
| 💻 Demo brief | All sections populated | |

---

## 5.7 Pre-Launch Verification

### Manual Testing Checklist

**Authentication Flow:**
- [ ] Sign up with new email works
- [ ] Email verification (if enabled) works
- [ ] Login with existing account works
- [ ] Logout works
- [ ] Password reset works

**Decision Creation Flow:**
- [ ] Create new decision from dashboard
- [ ] Frame page: set title, type, horizon, stakes
- [ ] Context page: add constraints
- [ ] Start analysis button triggers Inngest

**Analysis Flow (requires API keys):**
- [ ] Evidence scan runs (check Inngest dashboard)
- [ ] Options generated
- [ ] Evidence mapped to options
- [ ] Scoring completes
- [ ] Recommendation generated
- [ ] Brief generated

**Results & Brief Flow:**
- [ ] Results page shows evidence, options, recommendation
- [ ] Brief page displays all sections
- [ ] Edit brief works
- [ ] Share toggle enables sharing
- [ ] Public share link works (logged out)
- [ ] PDF export downloads file

**Error Handling:**
- [ ] Invalid URLs show 404
- [ ] Unauthorized access redirects to login
- [ ] API errors show user-friendly messages

---

## 5.8 Launch Day

### Deploy to Production

```bash
# Ensure main branch is up to date
git checkout main
git pull

# Verify build passes locally
npm run build

# Push to trigger Vercel deploy
git push origin main
```

### Post-Deploy Verification

1. **Visit production URL** - app loads
2. **Sign up new account** - auth works
3. **Create decision** - database writes work
4. **Check Inngest dashboard** - events flowing
5. **Check Sentry** (if configured) - no errors

### Monitor First Hour

- Watch Vercel logs for errors
- Watch Inngest dashboard for failed events
- Watch Sentry for exceptions
- Keep rollback ready (see below)

---

## Critical Path: Single-User Flow

Test this complete flow in production:

1. Visit `https://your-domain.com`
2. Click "Sign Up"
3. Enter email/password
4. Verify email (if enabled)
5. Complete onboarding (name org)
6. Click "Analyze a Decision"
7. **Frame**: Enter decision question, set type/horizon/stakes
8. **Context**: Add constraints (optional), click "Start Analysis"
9. **Watch**: See progress as AI scans evidence
10. **Review**: Evidence → Options → Recommendation
11. **Brief**: View generated brief
12. **Share**: Enable sharing, copy link
13. **Verify**: Visit share link in incognito - should work

---

## Rollback Plan

If critical issues discovered:

1. **Immediate**: Revert Vercel deployment
   - Vercel Dashboard → Deployments → Previous → "Promote to Production"

2. **Database issues** (if needed):
   - Supabase Dashboard → Database → Backups
   - Use Point-in-Time Recovery to restore

3. **Document**:
   - What broke
   - When it broke
   - Steps to reproduce

---

## Emergency Contacts

| Service | Issue Type | Contact |
|---------|------------|---------|
| Vercel | Deployment, DNS | support@vercel.com |
| Supabase | Database, Auth | support@supabase.io |
| OpenAI | API limits | platform.openai.com/help |
| Exa | Search API | support@exa.ai |
| Firecrawl | Scraping API | support@firecrawl.dev |
| Inngest | Background jobs | support@inngest.com |

---

## Phase 5 Milestone

**Single-user MVP live in production.**

### Success Criteria
- [ ] App accessible at custom domain
- [ ] SSL working (green lock)
- [ ] Sign up → Analysis → Brief flow works end-to-end
- [ ] Public sharing works
- [ ] Demo account ready for showing prospects
- [ ] No P0 bugs in first 24 hours

### What CAN Be Tested
- [ ] All deployment configuration
- [ ] Auth flows
- [ ] UI rendering
- [ ] Database operations

### What REQUIRES Real Usage
- [ ] Full AI pipeline (needs API spend)
- [ ] Performance under load
- [ ] Edge cases in real decisions

---

## Debugging Notes

*Add notes here as you work through this phase:*

```
<!-- Example:
2024-02-20: Auth redirect failing
- Issue: Supabase Site URL still localhost
- Fix: Updated to https://plinth.app
-->
```

---

**Previous Phase:** [04-outputs.md](./04-outputs.md) (skipped 05-team-polish.md)
**Reference:** [99-reference.md](./99-reference.md)
