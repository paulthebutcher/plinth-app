# Phase 0: Foundation (Week 1)

**Goal**: Infrastructure ready, authentication working, basic app shell deployed.

**Status**: 🚧 In Progress

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

**Next Phase:** [02-decision-engine.md](./02-decision-engine.md)
