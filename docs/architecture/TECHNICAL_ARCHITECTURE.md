# Plinth Technical Architecture

## Overview

This document defines the technical architecture for the Plinth MVP. The architecture prioritizes:
- **Developer velocity** (vibe coding compatible)
- **Operational simplicity** (minimal infrastructure)
- **Enterprise readiness** (auth, data isolation, security)
- **Cost efficiency** ($200-500/mo budget)

---

## Technology Stack

### Frontend
| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Framework | **Next.js 14 (App Router)** | SSR, file-based routing, API routes, Vercel-native |
| Styling | **Tailwind CSS + shadcn/ui** | Rapid development, consistent design system |
| State | **Zustand** | Simple, TypeScript-native, no boilerplate |
| Forms | **React Hook Form + Zod** | Type-safe validation, good DX |
| Data Fetching | **TanStack Query** | Caching, background refresh, optimistic updates |

### Backend
| Layer | Technology | Rationale |
|-------|-----------|-----------|
| API | **Next.js API Routes** | Colocation, simple deployment |
| Database | **Supabase (Postgres)** | Auth included, RLS for multi-tenancy, generous free tier |
| Auth | **Supabase Auth** | Email/password + OAuth out of box |
| File Storage | **Supabase Storage** | Integrated with auth, simple |
| Background Jobs | **Vercel Cron + Inngest** | Serverless job processing |

### AI/LLM
| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Primary LLM | **OpenAI GPT-4o** | Best reasoning, structured output |
| Fallback | **Claude 3.5 Sonnet** | Alternative for specific tasks |
| Orchestration | **Vercel AI SDK** | Streaming, tool use, provider switching |
| Web Research | **Firecrawl or Exa** | Competitor research, market context |

### Infrastructure
| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Hosting | **Vercel** | Zero-config, preview deploys, edge functions |
| CDN | **Vercel Edge** | Included |
| Monitoring | **Vercel Analytics + Sentry** | Performance + error tracking |
| Email | **Resend** | Transactional email, good DX |

---

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENTS                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                      │
│  │  Web App │  │  Shared  │  │  Email   │                      │
│  │ (Next.js)│  │  Links   │  │  Links   │                      │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘                      │
└───────┼─────────────┼─────────────┼─────────────────────────────┘
        │             │             │
        ▼             ▼             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      VERCEL EDGE                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    Next.js App Router                     │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │  │
│  │  │   Pages/    │  │    API      │  │   Server    │      │  │
│  │  │  Layouts    │  │   Routes    │  │  Components │      │  │
│  │  └─────────────┘  └──────┬──────┘  └─────────────┘      │  │
│  └──────────────────────────┼───────────────────────────────┘  │
└─────────────────────────────┼───────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│   SUPABASE    │    │   AI LAYER    │    │   EXTERNAL    │
│               │    │               │    │               │
│ ┌───────────┐ │    │ ┌───────────┐ │    │ ┌───────────┐ │
│ │  Postgres │ │    │ │  OpenAI   │ │    │ │ Firecrawl │ │
│ │   + RLS   │ │    │ │  GPT-4o   │ │    │ │    API    │ │
│ └───────────┘ │    │ └───────────┘ │    │ └───────────┘ │
│ ┌───────────┐ │    │ ┌───────────┐ │    │ ┌───────────┐ │
│ │   Auth    │ │    │ │  Claude   │ │    │ │   Exa     │ │
│ │  Service  │ │    │ │  Sonnet   │ │    │ │  Search   │ │
│ └───────────┘ │    │ └───────────┘ │    │ └───────────┘ │
│ ┌───────────┐ │    │ ┌───────────┐ │    │ ┌───────────┐ │
│ │  Storage  │ │    │ │  Vercel   │ │    │ │  Resend   │ │
│ │  (files)  │ │    │ │  AI SDK   │ │    │ │  (email)  │ │
│ └───────────┘ │    │ └───────────┘ │    │ └───────────┘ │
└───────────────┘    └───────────────┘    └───────────────┘
```

---

## Data Model

### Core Entities

```
┌─────────────────────────────────────────────────────────────────┐
│                        ORGANIZATION                              │
│  id, name, slug, plan, created_at                               │
└──────────────────────────┬──────────────────────────────────────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
          ▼                ▼                ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│      USER       │ │    DECISION     │ │   INVITATION    │
│                 │ │                 │ │                 │
│ id              │ │ id              │ │ id              │
│ email           │ │ org_id (FK)     │ │ org_id (FK)     │
│ org_id (FK)     │ │ owner_id (FK)   │ │ email           │
│ role            │ │ title           │ │ role            │
│ created_at      │ │ status          │ │ expires_at      │
└─────────────────┘ │ type            │ └─────────────────┘
                    │ context         │
                    │ created_at      │
                    │ updated_at      │
                    └────────┬────────┘
                             │
     ┌───────────┬───────────┼───────────┬───────────┐
     │           │           │           │           │
     ▼           ▼           ▼           ▼           ▼
┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐
│ OPTION  │ │EVIDENCE │ │CONSTRAINT│ │TRADEOFF │ │ OUTPUT  │
│         │ │         │ │         │ │         │ │         │
│ id      │ │ id      │ │ id      │ │ id      │ │ id      │
│ dec_id  │ │ dec_id  │ │ dec_id  │ │ dec_id  │ │ dec_id  │
│ title   │ │ claim   │ │ type    │ │ gives_up│ │ type    │
│ desc    │ │ source  │ │ desc    │ │ gets    │ │ content │
│ pros    │ │ strength│ │ severity│ │ option_id│ │ format  │
│ cons    │ │ option_id│ │         │ │         │ │ shared  │
│ rec_rank│ │         │ │         │ │         │ │ url_key │
└─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘
```

### Database Schema (Supabase/Postgres)

```sql
-- Organizations (tenants)
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  plan TEXT DEFAULT 'trial',
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users (with org membership)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  org_id UUID REFERENCES organizations(id),
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'member', 'viewer')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Decisions (core entity)
CREATE TABLE decisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) NOT NULL,
  owner_id UUID REFERENCES users(id) NOT NULL,
  title TEXT NOT NULL,
  decision_frame TEXT, -- The specific question being decided
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'in_review', 'committed', 'archived')),
  type TEXT, -- 'build_vs_buy', 'market_entry', 'investment', 'product_prioritization', 'custom'
  context TEXT, -- Background/framing text
  deadline TIMESTAMPTZ,
  urgency TEXT CHECK (urgency IN ('low', 'medium', 'high', 'critical')),
  confidence_score INTEGER CHECK (confidence_score BETWEEN 0 AND 100),
  confidence_rationale TEXT,
  recommendation_id UUID, -- FK to options, set when decision is made
  recommendation_rationale TEXT,
  reversal_conditions TEXT,
  quality_score INTEGER DEFAULT 0 CHECK (quality_score BETWEEN 0 AND 100),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Options (decision alternatives)
CREATE TABLE options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  decision_id UUID REFERENCES decisions(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  pros JSONB DEFAULT '[]',
  cons JSONB DEFAULT '[]',
  risks JSONB DEFAULT '[]',
  recommendation_rank INTEGER, -- 1 = recommended, null = not ranked
  ai_analysis JSONB, -- Cached AI-generated analysis
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Evidence (supporting data)
CREATE TABLE evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  decision_id UUID REFERENCES decisions(id) ON DELETE CASCADE NOT NULL,
  claim TEXT NOT NULL,
  source_url TEXT,
  source_type TEXT CHECK (source_type IN ('web_research', 'internal_data', 'interview', 'competitor', 'document')),
  strength TEXT DEFAULT 'moderate' CHECK (strength IN ('strong', 'moderate', 'weak')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Evidence-Option linking (many-to-many: evidence can support/challenge multiple options)
CREATE TABLE evidence_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  evidence_id UUID REFERENCES evidence(id) ON DELETE CASCADE NOT NULL,
  option_id UUID REFERENCES options(id) ON DELETE CASCADE NOT NULL,
  relationship TEXT NOT NULL CHECK (relationship IN ('supports', 'challenges', 'neutral')),
  UNIQUE(evidence_id, option_id)
);

-- Constraints (non-negotiables)
CREATE TABLE constraints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  decision_id UUID REFERENCES decisions(id) ON DELETE CASCADE NOT NULL,
  category TEXT CHECK (category IN ('legal', 'technical', 'budget', 'timeline', 'brand', 'org', 'other')),
  description TEXT NOT NULL,
  severity TEXT DEFAULT 'hard' CHECK (severity IN ('hard', 'soft')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tradeoffs (explicit acknowledgments)
CREATE TABLE tradeoffs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  decision_id UUID REFERENCES decisions(id) ON DELETE CASCADE NOT NULL,
  option_id UUID REFERENCES options(id) ON DELETE CASCADE,
  gives_up TEXT NOT NULL,
  gets TEXT NOT NULL,
  accepted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Outputs (generated artifacts)
CREATE TABLE outputs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  decision_id UUID REFERENCES decisions(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('brief')),  -- MVP: brief only
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'generating', 'complete', 'failed')),
  content TEXT,  -- Markdown content, null until generation complete
  error_message TEXT,  -- If status = 'failed'
  format TEXT DEFAULT 'markdown',
  is_shared BOOLEAN DEFAULT FALSE,
  share_key TEXT UNIQUE,  -- For shareable links
  created_at TIMESTAMPTZ DEFAULT NOW(),
  generated_at TIMESTAMPTZ  -- When generation completed
);

-- Background Jobs (for async AI operations)
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) NOT NULL,
  decision_id UUID REFERENCES decisions(id) ON DELETE CASCADE,
  type TEXT NOT NULL,  -- 'competitor_analysis', 'market_research', 'brief_generation', etc.
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
  input JSONB NOT NULL,  -- Job parameters
  output JSONB,  -- Job results
  error TEXT,
  progress INTEGER DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Comments (lightweight collaboration)
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  decision_id UUID REFERENCES decisions(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) NOT NULL,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,  -- For threading
  content TEXT NOT NULL,
  target_type TEXT,  -- 'decision', 'option', 'evidence', 'tradeoff', etc.
  target_id UUID,  -- ID of the thing being commented on
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Stakeholders (decision stakeholders)
CREATE TABLE stakeholders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  decision_id UUID REFERENCES decisions(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  role TEXT,
  stance TEXT CHECK (stance IN ('supportive', 'neutral', 'skeptical', 'unknown')),
  concerns TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Decision Progress (track section completion)
CREATE TABLE decision_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  decision_id UUID REFERENCES decisions(id) ON DELETE CASCADE NOT NULL,
  section TEXT NOT NULL CHECK (section IN ('frame', 'context', 'options', 'evidence', 'tradeoffs', 'recommendation')),
  is_complete BOOLEAN DEFAULT FALSE,
  completion_data JSONB DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(decision_id, section)
);

-- Invitations (pending org invites)
CREATE TABLE invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) NOT NULL,
  email TEXT NOT NULL,
  role TEXT DEFAULT 'member',
  invited_by UUID REFERENCES users(id),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days'),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Competitor Profiles (AI-generated)
CREATE TABLE competitor_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  decision_id UUID REFERENCES decisions(id) ON DELETE CASCADE NOT NULL,
  job_id UUID REFERENCES jobs(id),  -- Link to generation job
  company_name TEXT NOT NULL,
  company_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'generating', 'complete', 'failed', 'stale')),
  overview JSONB,
  product JSONB,
  market_position JSONB,
  strengths JSONB,
  weaknesses JSONB,
  recent_activity JSONB,
  strategic_signals JSONB,
  sources JSONB,
  information_gaps JSONB,  -- What data couldn't be found
  generated_at TIMESTAMPTZ,
  model_used TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User-added evidence on competitor profiles
CREATE TABLE competitor_evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES competitor_profiles(id) ON DELETE CASCADE NOT NULL,
  section TEXT NOT NULL,
  claim TEXT NOT NULL,
  source_url TEXT,
  source_type TEXT,
  notes TEXT,
  added_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI Analysis Cache (prevent redundant API calls)
CREATE TABLE ai_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cache_key TEXT UNIQUE NOT NULL, -- Hash of input parameters
  result JSONB NOT NULL,
  model TEXT,
  tokens_used INTEGER,
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '24 hours'),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security Policies
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE options ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidence_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE constraints ENABLE ROW LEVEL SECURITY;
ALTER TABLE tradeoffs ENABLE ROW LEVEL SECURITY;
ALTER TABLE outputs ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE stakeholders ENABLE ROW LEVEL SECURITY;
ALTER TABLE competitor_profiles ENABLE ROW LEVEL SECURITY;

-- Users can only see their own org's data
CREATE POLICY "Users see own org" ON users
  FOR ALL USING (org_id = (SELECT org_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Org members see decisions" ON decisions
  FOR ALL USING (org_id IN (SELECT org_id FROM users WHERE id = auth.uid()));

-- All child tables inherit through decision_id
CREATE POLICY "Org isolation" ON options
  FOR ALL USING (decision_id IN (SELECT id FROM decisions WHERE org_id IN
    (SELECT org_id FROM users WHERE id = auth.uid())));

CREATE POLICY "Org isolation" ON evidence
  FOR ALL USING (decision_id IN (SELECT id FROM decisions WHERE org_id IN
    (SELECT org_id FROM users WHERE id = auth.uid())));

CREATE POLICY "Org isolation" ON jobs
  FOR ALL USING (org_id IN (SELECT org_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Org isolation" ON comments
  FOR ALL USING (decision_id IN (SELECT id FROM decisions WHERE org_id IN
    (SELECT org_id FROM users WHERE id = auth.uid())));

-- Shared outputs are publicly viewable
CREATE POLICY "Shared outputs public" ON outputs
  FOR SELECT USING (is_shared = TRUE OR
    decision_id IN (SELECT id FROM decisions WHERE org_id IN
      (SELECT org_id FROM users WHERE id = auth.uid())));
```

---

## API Design

### Route Structure

```
/api
├── /auth
│   ├── /callback          # OAuth callback
│   └── /invite            # Process invitation
├── /organizations
│   ├── GET /              # Get current org
│   ├── PATCH /            # Update org settings
│   └── /members
│       ├── GET /          # List members
│       ├── POST /         # Invite member
│       └── DELETE /:id    # Remove member
├── /decisions
│   ├── GET /              # List decisions
│   ├── POST /             # Create decision
│   ├── GET /:id           # Get decision with all relations
│   ├── PATCH /:id         # Update decision
│   ├── DELETE /:id        # Archive decision
│   ├── /:id/options
│   │   ├── POST /         # Add option
│   │   ├── PATCH /:optId  # Update option
│   │   └── DELETE /:optId # Remove option
│   ├── /:id/evidence      # Same pattern
│   ├── /:id/constraints   # Same pattern
│   ├── /:id/tradeoffs     # Same pattern
│   └── /:id/outputs
│       ├── POST /         # Generate output
│       └── /:outId/share  # Toggle sharing
├── /ai
│   ├── POST /analyze-competitor    # Competitor analysis
│   ├── POST /analyze-options       # Option pros/cons
│   ├── POST /synthesize            # Generate synthesis
│   └── POST /generate-brief        # Create decision brief
└── /share
    └── GET /:shareKey     # Public output view
```

### Key API Patterns

1. **All mutations return updated entity** (optimistic UI)
2. **Streaming for AI responses** (Vercel AI SDK)
3. **Batch operations where logical** (e.g., reorder options)
4. **Consistent error format** (`{ error: string, code: string }`)

---

## AI Integration Architecture

### Prompt Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                    AI PROMPT SYSTEM                              │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                   SYSTEM PROMPT                          │   │
│  │  - Role: Strategic analysis assistant                    │   │
│  │  - Constraints: Professional tone, structured output     │   │
│  │  - Format: JSON with specific schema                     │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                  TASK-SPECIFIC PROMPT                    │   │
│  │  - Competitor Analysis                                   │   │
│  │  - Option Evaluation                                     │   │
│  │  - Synthesis Generation                                  │   │
│  │  - Brief Writing                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    CONTEXT INJECTION                     │   │
│  │  - Decision context                                      │   │
│  │  - Existing options/evidence                             │   │
│  │  - User preferences                                      │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### AI Feature Implementation

| Feature | Input | Output | Model |
|---------|-------|--------|-------|
| Competitor Analysis | Company name/URL | Structured profile | GPT-4o + Firecrawl |
| Option Evaluation | Option description + context | Pros/cons/risks array | GPT-4o |
| Evidence Assessment | Claim + source | Strength rating + summary | GPT-4o-mini |
| Decision Synthesis | All decision data | Narrative summary | GPT-4o |
| Executive Brief | Full decision + recommendation | Formatted document | GPT-4o |

### Cost Management

- **Cache aggressively**: Same competitor = same result for 24h
- **Use mini models for simple tasks**: Classification, extraction
- **Stream responses**: Better UX, same cost
- **Token budgets per operation**: Prevent runaway costs

---

## Security Architecture

### Authentication Flow

```
1. User signs up → Supabase Auth creates auth.users record
2. Trigger creates users record + new organization (if no invite)
3. OR user accepts invite → joins existing organization
4. JWT includes user.id, verified at API layer
5. RLS policies enforce org-level data isolation
```

### Data Isolation

- **Row Level Security (RLS)** on all tables
- **org_id foreign key** on all user-facing tables
- **No cross-org queries possible** at database level
- **API validates org membership** before any operation

### Secrets Management

- All API keys in Vercel environment variables
- Supabase service key **never exposed to client**
- OpenAI key **only used server-side**

---

## Cost Projections

### Monthly Estimates (at scale: 50 orgs, 200 users)

| Service | Estimated Cost |
|---------|---------------|
| Vercel Pro | $20 |
| Supabase Pro | $25 |
| OpenAI API | $100-300 |
| Firecrawl | $50 |
| Resend | $20 |
| Sentry | $26 |
| **Total** | **$241-391/mo** |

*Well within $200-500/mo budget with room for growth*

---

## Deployment Strategy

### Environments

| Environment | Purpose | Branch |
|-------------|---------|--------|
| Production | Live customers | `main` |
| Staging | QA, demos | `staging` |
| Preview | PR review | `feature/*` |
| Local | Development | N/A |

### CI/CD Pipeline

```
Push to branch
    │
    ▼
Vercel Preview Deploy
    │
    ▼
Automated checks (lint, type, test)
    │
    ▼
PR Review
    │
    ▼
Merge to main
    │
    ▼
Production Deploy (automatic)
```

---

## Technical Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| AI response quality inconsistent | High | Structured prompts, output validation, human review |
| Supabase outage | High | Status monitoring, graceful degradation |
| OpenAI rate limits | Medium | Queue system, multiple API keys, caching |
| Complex state management | Medium | Keep state simple, server as source of truth |
| Performance at scale | Low | Edge caching, pagination, lazy loading |
