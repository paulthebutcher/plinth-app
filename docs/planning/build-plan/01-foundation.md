# Phase 0: Foundation (Week 1)

**Goal**: Infrastructure ready, authentication working, basic app shell deployed.

**Status**: ✅ Complete

---

## 0.1 Project Setup

**🔧 External Setup (do this first):**

1. **Create GitHub Repository:**
   - Go to github.com → New Repository
   - Name: `plinth-app` (or your preference)
   - Private repository
   - Initialize with README
   - Add `.gitignore` for Node

2. **Set up Vercel Project:**
   - Go to vercel.com → Add New Project
   - Import your GitHub repo
   - Framework Preset: Next.js
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (default)
   - Click Deploy (initial deploy will fail until code exists - that's okay)

3. **Clone and Open in Windsurf:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/plinth-app.git
   cd plinth-app
   ```

**Windsurf Prompt:**
```
Read docs/architecture/FOLDER_STRUCTURE.md and docs/architecture/TECHNICAL_ARCHITECTURE.md.

Initialize a new Next.js 14 project with:
- App Router
- TypeScript (strict mode)
- Tailwind CSS
- shadcn/ui (dark mode)
- ESLint + Prettier

Follow the folder structure in FOLDER_STRUCTURE.md exactly. Create the base directories.
```

| Task | Acceptance Criteria | Tests | Status |
|------|---------------------|-------|--------|
| 🔧 Create GitHub repo | Repo exists with `.gitignore`, `README.md` | N/A | |
| 💻 Initialize Next.js 14 (App Router) | `npm run dev` starts successfully | N/A | |
| 💻 Add TypeScript config | Strict mode, path aliases work | N/A | |
| 💻 Add Tailwind CSS + shadcn/ui | Button component renders correctly | N/A | |
| 💻 Add ESLint + Prettier | `npm run lint` passes | N/A | |
| 🔧 Set up Vercel project | Preview deploy on push works | N/A | |

---

## 0.2 Database Setup

**🔧 External Setup (do this first):**

1. **Create Supabase Project (Staging):**
   - Go to supabase.com → New Project
   - Organization: Create or select one
   - Project name: `plinth-staging`
   - Database password: Generate a strong password (save it!)
   - Region: Choose closest to your users
   - Click Create Project
   - Wait for project to initialize (~2 minutes)

2. **Get Supabase Credentials:**
   - Go to Project Settings → API
   - Copy and save:
     - Project URL (`https://xxxxx.supabase.co`)
     - `anon` public key
     - `service_role` secret key (keep this secure!)

3. **Create `.env.local` file in your project:**
   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
   ```

4. **Add Environment Variables to Vercel:**
   - Go to Vercel → Your Project → Settings → Environment Variables
   - Add each variable above for "Production", "Preview", and "Development"

5. **Install Supabase CLI (for migrations):**
   ```bash
   npm install supabase --save-dev
   npx supabase init
   npx supabase login
   npx supabase link --project-ref YOUR_PROJECT_REF
   ```

6. **Create Production Supabase Project (later, before launch):**
   - Repeat steps 1-4 with name `plinth-production`
   - Keep credentials separate

**Windsurf Prompt:**
```
Read docs/architecture/TECHNICAL_ARCHITECTURE.md, specifically the "Database Schema" section.

Create a Supabase migration file at supabase/migrations/001_initial_schema.sql that creates all tables:
- organizations
- users
- decisions
- options
- evidence
- evidence_options (junction table)
- constraints
- tradeoffs
- stakeholders
- outputs
- competitor_profiles
- jobs
- comments
- invitations

Include all RLS policies from the spec. Use the exact column names and types specified.
```

**🔧 After Windsurf creates the migration:**
```bash
# Push migration to Supabase
npx supabase db push
```

| Task | Acceptance Criteria | Tests | Status |
|------|---------------------|-------|--------|
| 🔧 Create Supabase project (staging) | Project accessible, API keys obtained | N/A | |
| 🔧 Create Supabase project (production) | Separate project for prod | N/A | |
| 💻 Run schema migrations | All tables exist per TECHNICAL_ARCHITECTURE.md | N/A | |
| 💻 Enable RLS on all tables | RLS enabled, policies created | Integration: verify org isolation | |
| 💻 Create test data seed script | Can populate dev database with sample data | N/A | |

---

## 0.3 Authentication

**🔧 External Setup (do this first):**

1. **Configure Supabase Auth Settings:**
   - Go to Supabase Dashboard → Authentication → Providers
   - Email provider should be enabled by default
   - Click on Email and configure:
     - Enable "Confirm email" (recommended for production)
     - For development, you can disable to skip email verification

2. **Configure Auth URLs:**
   - Go to Authentication → URL Configuration
   - Site URL: `http://localhost:3000` (dev) or `https://myplinth.com` (prod)
   - Redirect URLs: Add these:
     - `http://localhost:3000/**`
     - `https://your-app.vercel.app/**`
     - `https://myplinth.com/**` (add later)

3. **Customize Email Templates (optional but recommended):**
   - Go to Authentication → Email Templates
   - Customize: Confirm signup, Reset password, Magic link
   - Update branding to match Plinth

4. **Add Auth Environment Variables:**
   Your `.env.local` should now have:
   ```env
   # Supabase (already added)
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...

   # App
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

**Windsurf Prompt:**
```
Read docs/specs/AUTH_PERMISSIONS.md for the complete auth specification.
Read docs/specs/API_CONTRACTS.md for the auth-related API endpoints.

Create the authentication system:
1. app/(auth)/login/page.tsx - Login form with email/password
2. app/(auth)/signup/page.tsx - Signup form
3. app/(auth)/forgot-password/page.tsx - Password reset request
4. app/(auth)/reset-password/page.tsx - Password reset form
5. lib/supabase/client.ts - Supabase client setup
6. lib/supabase/server.ts - Server-side Supabase client
7. middleware.ts - Auth middleware for protected routes

Use Supabase Auth. After signup, automatically create an organization for the user.
Follow the flows described in AUTH_PERMISSIONS.md exactly.
```

| Task | Acceptance Criteria | Tests | Status |
|------|---------------------|-------|--------|
| 💻 Implement signup flow | User can register, lands on dashboard | E2E: complete signup | |
| 💻 Implement login flow | User can login, session persists | E2E: login with valid/invalid credentials | |
| 💻 Implement logout | Session cleared, redirect to login | E2E: logout flow | |
| 💻 Implement password reset | Email sent, password can be reset | Integration: reset token generation | |
| 💻 Create auth middleware | Protected routes redirect unauthenticated | Integration: auth middleware | |
| 💻 Create org creation trigger | New user gets org automatically | Integration: user + org creation | |

---

## Phase 0 Milestone

**User can sign up, log in, see empty dashboard.**

### Checklist
- [ ] GitHub repo created and connected to Vercel
- [ ] Next.js app running locally and on Vercel preview
- [ ] Supabase staging project created with all tables
- [ ] RLS policies active on all tables
- [ ] Auth flows working (signup, login, logout, password reset)
- [ ] Middleware protecting dashboard routes
- [ ] New users get organization created automatically

---

## Debugging Notes

*Add notes here as you work through this phase:*

```
<!-- Example:
2024-01-15: Auth callback not redirecting properly
- Issue: Supabase redirect URL not configured
- Fix: Added http://localhost:3000/** to Supabase Auth settings
-->
```

---

## ⚠️ Schema Corrections Required (Post-Completion)

**Phase 0 was completed with the v1 schema. The following migrations are needed for the v2 evidence-first architecture before starting Phase 1:**

> See [CORE_JOURNEY.md](../../specs/CORE_JOURNEY.md) and [LLM_ORCHESTRATION.md](../../specs/LLM_ORCHESTRATION.md) for the new architecture.

### Migration 002: Add Analysis Tracking to Decisions

```sql
-- Add analysis flow tracking columns
ALTER TABLE decisions
  ADD COLUMN IF NOT EXISTS analysis_status TEXT DEFAULT 'draft'
    CHECK (analysis_status IN ('draft', 'framing', 'context', 'scanning', 'options', 'mapping', 'scoring', 'recommending', 'complete')),
  ADD COLUMN IF NOT EXISTS analysis_started_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS analysis_completed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS decision_type TEXT
    CHECK (decision_type IN ('product_bet', 'market_entry', 'investment', 'platform', 'org_model')),
  ADD COLUMN IF NOT EXISTS time_horizon TEXT
    CHECK (time_horizon IN ('3-6_months', '6-12_months', '1-2_years', '2+_years')),
  ADD COLUMN IF NOT EXISTS reversibility INTEGER CHECK (reversibility BETWEEN 1 AND 5),
  ADD COLUMN IF NOT EXISTS stakes INTEGER CHECK (stakes BETWEEN 1 AND 5),
  ADD COLUMN IF NOT EXISTS scope INTEGER CHECK (scope BETWEEN 1 AND 5),
  ADD COLUMN IF NOT EXISTS company_context TEXT,
  ADD COLUMN IF NOT EXISTS falsification_criteria TEXT;

-- Remove old quality_score in favor of confidence
ALTER TABLE decisions DROP COLUMN IF EXISTS quality_score;
```

### Migration 003: Create Assumptions Ledger

```sql
CREATE TABLE IF NOT EXISTS assumptions_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  decision_id UUID REFERENCES decisions(id) ON DELETE CASCADE NOT NULL,
  statement TEXT NOT NULL,
  status TEXT DEFAULT 'declared'
    CHECK (status IN ('declared', 'implicit', 'verified', 'violated', 'unverified')),
  source TEXT, -- 'user', 'ai_inferred'
  linked_option_ids UUID[] DEFAULT '{}',
  verification_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE assumptions_ledger ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Org isolation" ON assumptions_ledger
  FOR ALL USING (decision_id IN (SELECT id FROM decisions WHERE org_id IN
    (SELECT org_id FROM users WHERE id = auth.uid())));
```

### Migration 004: Create Decision Changers

```sql
CREATE TABLE IF NOT EXISTS decision_changers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  decision_id UUID REFERENCES decisions(id) ON DELETE CASCADE NOT NULL,
  condition TEXT NOT NULL,
  would_favor TEXT NOT NULL, -- option ID or "reconsider"
  likelihood TEXT DEFAULT 'medium' CHECK (likelihood IN ('low', 'medium', 'high')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE decision_changers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Org isolation" ON decision_changers
  FOR ALL USING (decision_id IN (SELECT id FROM decisions WHERE org_id IN
    (SELECT org_id FROM users WHERE id = auth.uid())));
```

### Migration 005: Update Evidence for v2

```sql
ALTER TABLE evidence
  ADD COLUMN IF NOT EXISTS snippet TEXT,
  ADD COLUMN IF NOT EXISTS source_title TEXT,
  ADD COLUMN IF NOT EXISTS source_publisher TEXT,
  ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS accessed_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS snippet_hash TEXT,
  ADD COLUMN IF NOT EXISTS signal_type TEXT
    CHECK (signal_type IN ('market', 'competitor', 'technology', 'regulatory', 'customer', 'financial', 'operational')),
  ADD COLUMN IF NOT EXISTS confidence JSONB DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS interpretation TEXT,
  ADD COLUMN IF NOT EXISTS falsification_criteria TEXT,
  ADD COLUMN IF NOT EXISTS relevance_tags TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS entity_tags TEXT[] DEFAULT '{}';
```

### Migration 006: Update Options + Add Scores

```sql
ALTER TABLE options
  ADD COLUMN IF NOT EXISTS summary TEXT,
  ADD COLUMN IF NOT EXISTS commits_to TEXT,
  ADD COLUMN IF NOT EXISTS deprioritizes TEXT,
  ADD COLUMN IF NOT EXISTS primary_upside TEXT,
  ADD COLUMN IF NOT EXISTS primary_risk TEXT,
  ADD COLUMN IF NOT EXISTS reversibility_level TEXT
    CHECK (reversibility_level IN ('easily_reversible', 'reversible_with_cost', 'partially_reversible', 'irreversible')),
  ADD COLUMN IF NOT EXISTS reversibility_explanation TEXT,
  ADD COLUMN IF NOT EXISTS grounded_in_evidence UUID[] DEFAULT '{}';

CREATE TABLE IF NOT EXISTS option_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  decision_id UUID REFERENCES decisions(id) ON DELETE CASCADE NOT NULL,
  option_id UUID REFERENCES options(id) ON DELETE CASCADE NOT NULL,
  overall_score INTEGER CHECK (overall_score BETWEEN 0 AND 100),
  score_breakdown JSONB DEFAULT '{}',
  rationale TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(decision_id, option_id)
);

ALTER TABLE option_scores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Org isolation" ON option_scores
  FOR ALL USING (decision_id IN (SELECT id FROM decisions WHERE org_id IN
    (SELECT org_id FROM users WHERE id = auth.uid())));
```

### Migration 007: Create Recommendations Table

```sql
CREATE TABLE IF NOT EXISTS recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  decision_id UUID REFERENCES decisions(id) ON DELETE CASCADE NOT NULL UNIQUE,
  primary_option_id UUID REFERENCES options(id),
  hedge_option_id UUID REFERENCES options(id),
  confidence INTEGER CHECK (confidence BETWEEN 0 AND 100),
  rationale TEXT,
  hedge_condition TEXT,
  monitor_triggers JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Org isolation" ON recommendations
  FOR ALL USING (decision_id IN (SELECT id FROM decisions WHERE org_id IN
    (SELECT org_id FROM users WHERE id = auth.uid())));
```

### Apply Migrations

```bash
# Create migration files in supabase/migrations/
# Then push to Supabase
npx supabase db push

# Regenerate TypeScript types
npx supabase gen types typescript --local > src/types/database.ts
```

---

**Next Phase:** [02-decision-engine.md](./02-decision-engine.md)
