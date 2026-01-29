# Plinth Project Folder Structure

## Overview

This structure optimizes for:
- **Vibe coding compatibility**: Clear boundaries for AI-assisted development
- **Feature isolation**: Easy to work on one area without breaking others
- **Scalability**: Patterns that grow with the product
- **Type safety**: Colocation of types with implementation

---

## Root Structure

```
plinth/
├── src/
│   ├── app/                    # Next.js App Router
│   ├── components/             # React components
│   ├── lib/                    # Core utilities & business logic
│   ├── hooks/                  # Custom React hooks
│   ├── stores/                 # Zustand state stores
│   ├── types/                  # TypeScript types/interfaces
│   └── styles/                 # Global styles
├── supabase/
│   ├── migrations/             # Database migrations
│   └── seed.sql                # Seed data for development
├── public/                     # Static assets
├── docs/                       # Documentation (symlink from planning)
├── tests/                      # Test files
├── .env.local                  # Local environment variables
├── .env.example                # Template for env vars
├── next.config.js              # Next.js configuration
├── tailwind.config.js          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
├── package.json
└── README.md
```

---

## Detailed Structure

### `/src/app` - Next.js App Router

```
app/
├── (auth)/                     # Auth route group (no layout)
│   ├── login/
│   │   └── page.tsx
│   ├── signup/
│   │   └── page.tsx
│   ├── invite/
│   │   └── [token]/
│   │       └── page.tsx
│   └── callback/
│       └── route.ts            # OAuth callback
│
├── (dashboard)/                # Authenticated route group
│   ├── layout.tsx              # Dashboard layout (sidebar, header)
│   ├── page.tsx                # Dashboard home / decision list
│   ├── decisions/
│   │   ├── new/
│   │   │   └── page.tsx        # New decision flow
│   │   └── [id]/
│   │       ├── page.tsx        # Decision detail view
│   │       ├── edit/
│   │       │   └── page.tsx    # Edit mode (if separate)
│   │       └── outputs/
│   │           └── page.tsx    # Manage outputs
│   ├── team/
│   │   └── page.tsx            # Team settings
│   └── settings/
│       └── page.tsx            # User/org settings
│
├── (public)/                   # Public route group
│   └── share/
│       └── [key]/
│           └── page.tsx        # Public output view
│
├── api/                        # API routes
│   ├── auth/
│   │   └── callback/
│   │       └── route.ts
│   ├── organizations/
│   │   ├── route.ts            # GET, PATCH org
│   │   └── members/
│   │       └── route.ts        # GET, POST, DELETE members
│   ├── decisions/
│   │   ├── route.ts            # GET list, POST create
│   │   └── [id]/
│   │       ├── route.ts        # GET, PATCH, DELETE decision
│   │       ├── options/
│   │       │   └── route.ts
│   │       ├── evidence/
│   │       │   └── route.ts
│   │       ├── constraints/
│   │       │   └── route.ts
│   │       ├── tradeoffs/
│   │       │   └── route.ts
│   │       └── outputs/
│   │           ├── route.ts
│   │           └── [outputId]/
│   │               └── share/
│   │                   └── route.ts
│   ├── ai/
│   │   ├── analyze-competitor/
│   │   │   └── route.ts
│   │   ├── analyze-options/
│   │   │   └── route.ts
│   │   ├── synthesize/
│   │   │   └── route.ts
│   │   └── generate-brief/
│   │       └── route.ts
│   └── share/
│       └── [key]/
│           └── route.ts        # Public output API
│
├── layout.tsx                  # Root layout
├── page.tsx                    # Landing page (marketing)
├── globals.css                 # Global styles
└── providers.tsx               # Client providers wrapper
```

### `/src/components` - React Components

```
components/
├── ui/                         # shadcn/ui components (generated)
│   ├── button.tsx
│   ├── card.tsx
│   ├── dialog.tsx
│   ├── dropdown-menu.tsx
│   ├── input.tsx
│   ├── label.tsx
│   ├── select.tsx
│   ├── textarea.tsx
│   ├── toast.tsx
│   └── ...
│
├── layout/                     # Layout components
│   ├── dashboard-layout.tsx
│   ├── sidebar.tsx
│   ├── header.tsx
│   ├── nav-item.tsx
│   └── user-menu.tsx
│
├── decisions/                  # Decision-related components
│   ├── decision-list.tsx
│   ├── decision-card.tsx
│   ├── decision-header.tsx
│   ├── decision-progress.tsx
│   ├── context-editor.tsx
│   ├── status-badge.tsx
│   └── new-decision-modal.tsx
│
├── options/                    # Option components
│   ├── options-panel.tsx
│   ├── option-card.tsx
│   ├── option-editor.tsx
│   ├── pros-cons-list.tsx
│   └── recommendation-picker.tsx
│
├── evidence/                   # Evidence components
│   ├── evidence-panel.tsx
│   ├── evidence-card.tsx
│   ├── evidence-editor.tsx
│   └── strength-badge.tsx
│
├── constraints/                # Constraint components
│   ├── constraints-panel.tsx
│   └── constraint-editor.tsx
│
├── tradeoffs/                  # Tradeoff components
│   ├── tradeoffs-panel.tsx
│   └── tradeoff-editor.tsx
│
├── ai/                         # AI feature components
│   ├── competitor-input.tsx
│   ├── competitor-profile.tsx
│   ├── competitor-comparison.tsx
│   ├── analyze-button.tsx
│   ├── synthesis-panel.tsx
│   ├── suggestions-list.tsx
│   └── ai-loading-state.tsx
│
├── outputs/                    # Output components
│   ├── output-generator.tsx
│   ├── brief-preview.tsx
│   ├── brief-editor.tsx
│   ├── export-menu.tsx
│   ├── share-toggle.tsx
│   └── public-output-view.tsx
│
├── team/                       # Team components
│   ├── team-settings.tsx
│   ├── member-list.tsx
│   ├── invite-member.tsx
│   ├── role-picker.tsx
│   └── invite-accept.tsx
│
├── collaboration/              # Collaboration components
│   ├── comment-thread.tsx
│   ├── comment-input.tsx
│   ├── mention-picker.tsx
│   └── activity-feed.tsx
│
├── templates/                  # Decision templates
│   ├── template-selector.tsx
│   └── templates/
│       ├── build-vs-buy.tsx
│       ├── market-entry.tsx
│       └── investment.tsx
│
└── common/                     # Shared components
    ├── loading-spinner.tsx
    ├── error-boundary.tsx
    ├── empty-state.tsx
    ├── confirm-dialog.tsx
    ├── page-header.tsx
    └── rich-text-editor.tsx
```

### `/src/lib` - Core Logic

```
lib/
├── supabase/
│   ├── client.ts               # Browser client
│   ├── server.ts               # Server client (for API routes)
│   ├── middleware.ts           # Auth middleware helper
│   └── types.ts                # Generated Supabase types
│
├── ai/
│   ├── client.ts               # OpenAI/Vercel AI SDK setup
│   ├── prompts/
│   │   ├── competitor-profile.ts
│   │   ├── competitor-comparison.ts
│   │   ├── option-analysis.ts
│   │   ├── options-comparison.ts
│   │   ├── decision-synthesis.ts
│   │   ├── tradeoff-suggestions.ts
│   │   ├── confidence-assessment.ts
│   │   └── generate-brief.ts
│   ├── schemas/                # Zod schemas for AI outputs
│   │   ├── competitor.ts
│   │   ├── analysis.ts
│   │   └── brief.ts
│   └── cache.ts                # AI response caching
│
├── research/
│   ├── firecrawl.ts            # Web scraping client
│   └── exa.ts                  # Search API client
│
├── api/
│   ├── errors.ts               # API error handling
│   ├── response.ts             # Response helpers
│   └── validation.ts           # Request validation
│
├── email/
│   ├── client.ts               # Resend client
│   └── templates/
│       ├── invite.tsx
│       └── welcome.tsx
│
├── pdf/
│   └── generator.ts            # PDF generation logic
│
└── utils/
    ├── cn.ts                   # Class name helper
    ├── date.ts                 # Date formatting
    ├── slug.ts                 # Slug generation
    └── share-key.ts            # Share key generation
```

### `/src/hooks` - Custom Hooks

```
hooks/
├── use-user.ts                 # Current user hook
├── use-organization.ts         # Current org hook
├── use-decisions.ts            # Decisions list hook
├── use-decision.ts             # Single decision hook
├── use-autosave.ts             # Autosave logic
├── use-ai-analysis.ts          # AI analysis with streaming
├── use-team.ts                 # Team members hook
└── use-debounce.ts             # Debounce utility
```

### `/src/stores` - Zustand Stores

```
stores/
├── user-store.ts               # User state
├── decision-store.ts           # Current decision state
├── ui-store.ts                 # UI state (modals, sidebars)
└── draft-store.ts              # Unsaved changes
```

### `/src/types` - TypeScript Types

```
types/
├── database.ts                 # Supabase generated types
├── decision.ts                 # Decision domain types
├── ai.ts                       # AI response types
├── api.ts                      # API request/response types
└── index.ts                    # Re-exports
```

### `/supabase` - Database

```
supabase/
├── migrations/
│   ├── 00001_initial_schema.sql
│   ├── 00002_rls_policies.sql
│   ├── 00003_functions.sql
│   └── ...
├── seed.sql                    # Development seed data
└── config.toml                 # Supabase local config
```

---

## File Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Components | kebab-case | `decision-card.tsx` |
| Hooks | use-* prefix | `use-decision.ts` |
| Stores | *-store suffix | `decision-store.ts` |
| Types | singular noun | `decision.ts` |
| Utils | descriptive | `share-key.ts` |
| API routes | route.ts | `route.ts` |

---

## Import Aliases

Configure in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/stores/*": ["./src/stores/*"],
      "@/types/*": ["./src/types/*"]
    }
  }
}
```

Usage:
```typescript
import { Button } from "@/components/ui/button"
import { useDecision } from "@/hooks/use-decision"
import { supabase } from "@/lib/supabase/client"
```

---

## Vibe Coding Guidelines

When working with AI assistants (Cursor, Claude):

### Do
- Reference this structure when asking for new features
- Ask for one component/file at a time
- Provide context about related files
- Request TypeScript with strict types

### Don't
- Let AI create files outside this structure
- Accept components that mix concerns
- Skip type definitions
- Ignore the established patterns

### Example Prompt
> "Create the `OptionCard` component at `src/components/options/option-card.tsx`. It should display an option's title, description, and pros/cons. Use the shadcn Card component as base. Reference the `Option` type from `@/types/decision.ts`."

---

## Quick Reference

| Need to... | Look in... |
|------------|-----------|
| Add a page | `/src/app/(dashboard)/` |
| Create API endpoint | `/src/app/api/` |
| Build a component | `/src/components/` |
| Add business logic | `/src/lib/` |
| Create a hook | `/src/hooks/` |
| Add types | `/src/types/` |
| Modify database | `/supabase/migrations/` |
