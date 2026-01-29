# Plinth Development Workflow

## Overview

This document describes how to work effectively on Plinth using vibe coding tools (Cursor, Claude) with Vercel hosting.

---

## Development Environment Setup

### Prerequisites

- Node.js 18+ (recommend using nvm)
- pnpm (recommended) or npm
- Git
- VS Code or Cursor IDE
- Supabase CLI (optional, for local development)

### Initial Setup

```bash
# Clone the repository
git clone https://github.com/[your-username]/plinth.git
cd plinth

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env.local

# Fill in your environment variables (see below)

# Run development server
pnpm dev
```

### Environment Variables

Create `.env.local` with:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://[project].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[anon-key]
SUPABASE_SERVICE_ROLE_KEY=[service-role-key]

# OpenAI
OPENAI_API_KEY=sk-...

# Firecrawl (competitor research)
FIRECRAWL_API_KEY=fc-...

# Resend (email)
RESEND_API_KEY=re_...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Sentry (optional for local)
SENTRY_DSN=https://...
```

---

## Working with Vibe Coding Tools

### Cursor IDE Setup

1. Install Cursor from [cursor.sh](https://cursor.sh)
2. Open the Plinth project folder
3. Configure AI settings:
   - Enable "Codebase" indexing
   - Set model to Claude 3.5 Sonnet or GPT-4
4. Add project context:
   - Index the `docs/` folder
   - Index `src/types/` for type awareness

### Effective Prompting Patterns

#### Starting a New Feature

```
I need to implement [feature name].

Context:
- This is for the Plinth decision-quality app
- We're using Next.js 14 App Router, Supabase, TypeScript
- Component should go in src/components/[category]/

Requirements:
- [Specific requirement 1]
- [Specific requirement 2]

Related files:
- src/types/decision.ts (for types)
- src/lib/supabase/client.ts (for data)

Please create:
1. The component file
2. Any necessary hooks
3. Update types if needed
```

#### Debugging

```
I'm getting this error: [paste error]

In file: [filename]
On line: [line number]

The expected behavior is: [what should happen]
The actual behavior is: [what's happening]

Relevant context:
- [Any recent changes]
- [Related code]
```

#### Code Review

```
Please review this code for:
1. TypeScript issues
2. React best practices
3. Performance concerns
4. Security issues

[paste code]
```

### Best Practices

1. **One file at a time**: Ask for specific files, not entire features
2. **Provide context**: Reference existing patterns in the codebase
3. **Be specific about location**: "Create at src/components/decisions/..."
4. **Include types**: Always ask for TypeScript with strict typing
5. **Review output**: Don't blindly accept—read and understand
6. **Test incrementally**: Test each component before building more

---

## Git Workflow

### Branch Strategy

```
main                    # Production-ready code
├── staging            # Pre-production testing
└── feature/[name]     # Feature development
```

### Branch Naming

```
feature/decision-crud       # New feature
fix/auth-redirect          # Bug fix
refactor/ai-prompts        # Code improvement
docs/api-documentation     # Documentation
```

### Commit Messages

Use conventional commits:

```
feat: add decision brief generation
fix: resolve auth redirect loop
refactor: simplify options panel state
docs: update API documentation
chore: upgrade dependencies
```

### Typical Workflow

```bash
# Start new feature
git checkout staging
git pull origin staging
git checkout -b feature/my-feature

# Work on feature
# ... make changes ...
git add .
git commit -m "feat: implement feature"

# Push and create PR
git push -u origin feature/my-feature
# Create PR in GitHub targeting staging

# After PR approval and merge
git checkout staging
git pull origin staging
```

---

## Vercel Deployment

### Automatic Deployments

| Branch | Environment | URL |
|--------|-------------|-----|
| `main` | Production | plinth.app |
| `staging` | Staging | staging.plinth.app |
| `feature/*` | Preview | [auto-generated].vercel.app |

### Preview Deployments

Every PR gets a preview deployment automatically:
- URL in PR comments
- Isolated environment
- Uses staging Supabase

### Manual Deployment

If needed:
```bash
# Install Vercel CLI
pnpm i -g vercel

# Deploy to preview
vercel

# Deploy to production (use sparingly)
vercel --prod
```

### Environment Variables in Vercel

1. Go to Vercel Dashboard → Project Settings → Environment Variables
2. Add variables for each environment (Production, Preview, Development)
3. For sensitive keys, use Vercel's encrypted storage

---

## Database Migrations

### Creating Migrations

```bash
# Create new migration file
touch supabase/migrations/$(date +%Y%m%d%H%M%S)_description.sql

# Write your SQL
```

### Migration Template

```sql
-- Migration: description
-- Created: YYYY-MM-DD

-- Up migration
CREATE TABLE IF NOT EXISTS new_table (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    -- ... columns
);

-- RLS policies
ALTER TABLE new_table ENABLE ROW LEVEL SECURITY;

CREATE POLICY "policy_name" ON new_table
    FOR ALL USING (/* condition */);

-- Down migration (in comments for reference)
-- DROP TABLE IF EXISTS new_table;
```

### Applying Migrations

**Remote (Supabase Dashboard):**
1. Go to SQL Editor in Supabase Dashboard
2. Paste migration SQL
3. Execute

**Local (with Supabase CLI):**
```bash
supabase db push
```

### Migration Best Practices

1. **One change per migration**: Easier to debug
2. **Include down migration in comments**: For reference
3. **Test locally first**: Before pushing to staging
4. **Never modify existing migrations**: Create new ones

---

## Testing Strategy

### Manual Testing Checklist

Before each PR:
- [ ] Feature works as expected
- [ ] No console errors
- [ ] Works on mobile viewport
- [ ] Loading states display correctly
- [ ] Error states handled
- [ ] Auth required pages redirect correctly

### Local Testing Commands

```bash
# Run development server
pnpm dev

# Type checking
pnpm type-check

# Linting
pnpm lint

# Build (catches build errors)
pnpm build
```

### Testing in Preview Environment

1. Push branch → Preview URL generated
2. Test full flow in Preview
3. Check Vercel logs for errors
4. Verify against staging database

---

## Troubleshooting

### Common Issues

#### Build Fails on Vercel

```
Error: Type error: ...
```
→ Run `pnpm type-check` locally to see full error

#### Supabase Auth Not Working

```
Error: Invalid API key
```
→ Check `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Vercel env vars

#### AI Features Timeout

```
Error: Function exceeded timeout
```
→ Check Vercel function timeout settings, consider streaming

### Debug Logging

```typescript
// Add to any server file for debugging
console.log('[DEBUG]', { data })

// View in Vercel Functions logs
```

### Useful Commands

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Check for type errors
pnpm tsc --noEmit

# Check bundle size
pnpm analyze
```

---

## Code Quality Standards

### TypeScript

- Strict mode enabled
- No `any` types (use `unknown` and narrow)
- Export types from `/src/types`
- Use Zod for runtime validation

### React

- Functional components only
- Hooks for state and effects
- Server components where possible
- Client components marked with `"use client"`

### Styling

- Tailwind CSS for all styling
- shadcn/ui as component base
- No inline styles
- Consistent spacing scale

### File Organization

- One component per file
- Index files for public exports
- Colocate tests with source

---

## Weekly Development Rhythm

### Monday
- Review previous week's progress
- Plan current week's tasks
- Set up any new branches

### Tuesday-Thursday
- Core feature development
- PR reviews
- Bug fixes as needed

### Friday
- Integration testing
- Documentation updates
- Code cleanup
- Plan for following week

---

## Getting Help

### Resources

- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Vercel AI SDK**: [sdk.vercel.ai](https://sdk.vercel.ai)
- **shadcn/ui**: [ui.shadcn.com](https://ui.shadcn.com)
- **TanStack Query**: [tanstack.com/query](https://tanstack.com/query)

### When Stuck

1. Check existing codebase for patterns
2. Search documentation
3. Ask Cursor/Claude with full context
4. Check GitHub issues for similar problems
5. Reach out to Paul
