-- =====================================================
-- COMPREHENSIVE PLINTH DATABASE SETUP SCRIPT
-- Combines all 7 migrations with idempotent operations
-- Safe for partial/incomplete migrations
-- =====================================================

-- =====================================================
-- 1. CREATE BASE TABLES (if not exists)
-- =====================================================

CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  plan TEXT DEFAULT 'trial',
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  org_id UUID REFERENCES organizations(id),
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'member', 'viewer')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS decisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) NOT NULL,
  owner_id UUID REFERENCES users(id) NOT NULL,
  title TEXT NOT NULL,
  decision_frame TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'in_review', 'committed', 'archived')),
  type TEXT,
  context TEXT,
  deadline TIMESTAMPTZ,
  urgency TEXT CHECK (urgency IN ('low', 'medium', 'high', 'critical')),
  confidence_score INTEGER CHECK (confidence_score BETWEEN 0 AND 100),
  confidence_rationale TEXT,
  recommendation_id UUID,
  recommendation_rationale TEXT,
  reversal_conditions TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) NOT NULL,
  decision_id UUID REFERENCES decisions(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
  input JSONB NOT NULL,
  output JSONB,
  error TEXT,
  progress INTEGER DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  decision_id UUID REFERENCES decisions(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  pros JSONB DEFAULT '[]',
  cons JSONB DEFAULT '[]',
  risks JSONB DEFAULT '[]',
  recommendation_rank INTEGER,
  ai_analysis JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  decision_id UUID REFERENCES decisions(id) ON DELETE CASCADE NOT NULL,
  claim TEXT NOT NULL,
  source_url TEXT,
  source_type TEXT CHECK (source_type IN ('web_research', 'internal_data', 'interview', 'competitor', 'document')),
  strength TEXT DEFAULT 'moderate' CHECK (strength IN ('strong', 'moderate', 'weak')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS evidence_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  evidence_id UUID REFERENCES evidence(id) ON DELETE CASCADE NOT NULL,
  option_id UUID REFERENCES options(id) ON DELETE CASCADE NOT NULL,
  relationship TEXT NOT NULL CHECK (relationship IN ('supports', 'challenges', 'neutral')),
  UNIQUE(evidence_id, option_id)
);

CREATE TABLE IF NOT EXISTS constraints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  decision_id UUID REFERENCES decisions(id) ON DELETE CASCADE NOT NULL,
  category TEXT CHECK (category IN ('legal', 'technical', 'budget', 'timeline', 'brand', 'org', 'other')),
  description TEXT NOT NULL,
  severity TEXT DEFAULT 'hard' CHECK (severity IN ('hard', 'soft')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tradeoffs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  decision_id UUID REFERENCES decisions(id) ON DELETE CASCADE NOT NULL,
  option_id UUID REFERENCES options(id) ON DELETE CASCADE,
  gives_up TEXT NOT NULL,
  gets TEXT NOT NULL,
  accepted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS stakeholders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  decision_id UUID REFERENCES decisions(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  role TEXT,
  stance TEXT CHECK (stance IN ('supportive', 'neutral', 'skeptical', 'unknown')),
  concerns TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS outputs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  decision_id UUID REFERENCES decisions(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('brief')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'generating', 'complete', 'failed')),
  content TEXT,
  error_message TEXT,
  format TEXT DEFAULT 'markdown',
  is_shared BOOLEAN DEFAULT FALSE,
  share_key TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  generated_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS competitor_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  decision_id UUID REFERENCES decisions(id) ON DELETE CASCADE NOT NULL,
  job_id UUID REFERENCES jobs(id),
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
  information_gaps JSONB,
  generated_at TIMESTAMPTZ,
  model_used TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  decision_id UUID REFERENCES decisions(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) NOT NULL,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  target_type TEXT,
  target_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) NOT NULL,
  email TEXT NOT NULL,
  role TEXT DEFAULT 'member',
  invited_by UUID REFERENCES users(id),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days'),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 2. ADD MISSING COLUMNS FROM MIGRATION 002 (analysis_tracking)
-- =====================================================

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

-- Remove old quality_score column if it exists (clean up from initial schema)
ALTER TABLE decisions DROP COLUMN IF EXISTS quality_score;

-- =====================================================
-- 3. CREATE NEW TABLES FROM MIGRATION 003 (assumptions_ledger)
-- =====================================================

CREATE TABLE IF NOT EXISTS assumptions_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  decision_id UUID REFERENCES decisions(id) ON DELETE CASCADE NOT NULL,
  statement TEXT NOT NULL,
  status TEXT DEFAULT 'declared'
    CHECK (status IN ('declared', 'implicit', 'verified', 'violated', 'unverified')),
  source TEXT,
  linked_option_ids UUID[] DEFAULT '{}',
  verification_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 4. CREATE NEW TABLES FROM MIGRATION 004 (decision_changers)
-- =====================================================

CREATE TABLE IF NOT EXISTS decision_changers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  decision_id UUID REFERENCES decisions(id) ON DELETE CASCADE NOT NULL,
  condition TEXT NOT NULL,
  would_favor TEXT NOT NULL,
  likelihood TEXT DEFAULT 'medium' CHECK (likelihood IN ('low', 'medium', 'high')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 5. ADD MISSING COLUMNS FROM MIGRATION 005 (evidence_v2)
-- =====================================================

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

-- =====================================================
-- 6. CREATE NEW TABLES AND COLUMNS FROM MIGRATION 006 (options_v2)
-- =====================================================

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

-- =====================================================
-- 7. CREATE NEW TABLES FROM MIGRATION 007 (recommendations)
-- =====================================================

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

-- =====================================================
-- 8. ENABLE ROW LEVEL SECURITY ON ALL TABLES
-- =====================================================

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
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE assumptions_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE decision_changers ENABLE ROW LEVEL SECURITY;
ALTER TABLE option_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 9. CREATE OR REPLACE RLS POLICIES
-- =====================================================

-- Drop policies if they exist before creating them
DROP POLICY IF EXISTS "Users see own org" ON users;
DROP POLICY IF EXISTS "Org members see decisions" ON decisions;
DROP POLICY IF EXISTS "Org isolation" ON options;
DROP POLICY IF EXISTS "Org isolation" ON evidence;
DROP POLICY IF EXISTS "Org isolation" ON evidence_options;
DROP POLICY IF EXISTS "Org isolation" ON constraints;
DROP POLICY IF EXISTS "Org isolation" ON tradeoffs;
DROP POLICY IF EXISTS "Org isolation" ON stakeholders;
DROP POLICY IF EXISTS "Org isolation" ON jobs;
DROP POLICY IF EXISTS "Org isolation" ON comments;
DROP POLICY IF EXISTS "Org isolation" ON competitor_profiles;
DROP POLICY IF EXISTS "Org isolation" ON invitations;
DROP POLICY IF EXISTS "Org isolation" ON assumptions_ledger;
DROP POLICY IF EXISTS "Org isolation" ON decision_changers;
DROP POLICY IF EXISTS "Org isolation" ON option_scores;
DROP POLICY IF EXISTS "Org isolation" ON recommendations;
DROP POLICY IF EXISTS "Shared outputs public" ON outputs;

-- Main policies
CREATE POLICY "Users see own org" ON users
  FOR ALL USING (org_id = (SELECT org_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Org members see decisions" ON decisions
  FOR ALL USING (org_id IN (SELECT org_id FROM users WHERE id = auth.uid()));

-- Child table policies
CREATE POLICY "Org isolation" ON options
  FOR ALL USING (decision_id IN (SELECT id FROM decisions WHERE org_id IN
    (SELECT org_id FROM users WHERE id = auth.uid())));

CREATE POLICY "Org isolation" ON evidence
  FOR ALL USING (decision_id IN (SELECT id FROM decisions WHERE org_id IN
    (SELECT org_id FROM users WHERE id = auth.uid())));

CREATE POLICY "Org isolation" ON evidence_options
  FOR ALL USING (evidence_id IN (SELECT id FROM evidence WHERE decision_id IN
    (SELECT id FROM decisions WHERE org_id IN
      (SELECT org_id FROM users WHERE id = auth.uid()))));

CREATE POLICY "Org isolation" ON constraints
  FOR ALL USING (decision_id IN (SELECT id FROM decisions WHERE org_id IN
    (SELECT org_id FROM users WHERE id = auth.uid())));

CREATE POLICY "Org isolation" ON tradeoffs
  FOR ALL USING (decision_id IN (SELECT id FROM decisions WHERE org_id IN
    (SELECT org_id FROM users WHERE id = auth.uid())));

CREATE POLICY "Org isolation" ON stakeholders
  FOR ALL USING (decision_id IN (SELECT id FROM decisions WHERE org_id IN
    (SELECT org_id FROM users WHERE id = auth.uid())));

CREATE POLICY "Org isolation" ON jobs
  FOR ALL USING (org_id IN (SELECT org_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Org isolation" ON comments
  FOR ALL USING (decision_id IN (SELECT id FROM decisions WHERE org_id IN
    (SELECT org_id FROM users WHERE id = auth.uid())));

CREATE POLICY "Org isolation" ON competitor_profiles
  FOR ALL USING (decision_id IN (SELECT id FROM decisions WHERE org_id IN
    (SELECT org_id FROM users WHERE id = auth.uid())));

CREATE POLICY "Org isolation" ON invitations
  FOR ALL USING (org_id IN (SELECT org_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Org isolation" ON assumptions_ledger
  FOR ALL USING (decision_id IN (SELECT id FROM decisions WHERE org_id IN
    (SELECT org_id FROM users WHERE id = auth.uid())));

CREATE POLICY "Org isolation" ON decision_changers
  FOR ALL USING (decision_id IN (SELECT id FROM decisions WHERE org_id IN
    (SELECT org_id FROM users WHERE id = auth.uid())));

CREATE POLICY "Org isolation" ON option_scores
  FOR ALL USING (decision_id IN (SELECT id FROM decisions WHERE org_id IN
    (SELECT org_id FROM users WHERE id = auth.uid())));

CREATE POLICY "Org isolation" ON recommendations
  FOR ALL USING (decision_id IN (SELECT id FROM decisions WHERE org_id IN
    (SELECT org_id FROM users WHERE id = auth.uid())));

-- Shared outputs are publicly viewable
CREATE POLICY "Shared outputs public" ON outputs
  FOR SELECT USING (is_shared = TRUE OR
    decision_id IN (SELECT id FROM decisions WHERE org_id IN
      (SELECT org_id FROM users WHERE id = auth.uid())));

-- =====================================================
-- 10. DIAGNOSTIC QUERIES
-- =====================================================

-- Display schema status summary

-- Count rows in each major table
SELECT
  'organizations' as table_name,
  COUNT(*) as row_count
FROM organizations
UNION ALL
SELECT 'users', COUNT(*) FROM users
UNION ALL
SELECT 'decisions', COUNT(*) FROM decisions
UNION ALL
SELECT 'options', COUNT(*) FROM options
UNION ALL
SELECT 'evidence', COUNT(*) FROM evidence
UNION ALL
SELECT 'assumptions_ledger', COUNT(*) FROM assumptions_ledger
UNION ALL
SELECT 'decision_changers', COUNT(*) FROM decision_changers
UNION ALL
SELECT 'option_scores', COUNT(*) FROM option_scores
UNION ALL
SELECT 'recommendations', COUNT(*) FROM recommendations
UNION ALL
SELECT 'jobs', COUNT(*) FROM jobs
UNION ALL
SELECT 'outputs', COUNT(*) FROM outputs
ORDER BY table_name;

-- Check decisions table columns
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'decisions'
ORDER BY ordinal_position;

-- Check evidence table columns
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'evidence'
ORDER BY ordinal_position;

-- Check options table columns
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'options'
ORDER BY ordinal_position;

-- Check all tables with RLS enabled
SELECT
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN (
    'organizations', 'users', 'decisions', 'options', 'evidence',
    'evidence_options', 'constraints', 'tradeoffs', 'outputs', 'jobs',
    'comments', 'stakeholders', 'competitor_profiles', 'invitations',
    'assumptions_ledger', 'decision_changers', 'option_scores', 'recommendations'
  )
ORDER BY tablename;

-- Count RLS policies per table
SELECT
  schemaname,
  tablename,
  COUNT(*) as policy_count
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN (
    'organizations', 'users', 'decisions', 'options', 'evidence',
    'evidence_options', 'constraints', 'tradeoffs', 'outputs', 'jobs',
    'comments', 'stakeholders', 'competitor_profiles', 'invitations',
    'assumptions_ledger', 'decision_changers', 'option_scores', 'recommendations'
  )
GROUP BY schemaname, tablename
ORDER BY tablename;

-- =====================================================
-- END OF SETUP SCRIPT
-- =====================================================
