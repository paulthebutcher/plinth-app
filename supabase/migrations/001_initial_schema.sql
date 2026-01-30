-- Create tables
-- 1. Base table with no dependencies
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  plan TEXT DEFAULT 'trial',
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Users (depends on organizations)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  org_id UUID REFERENCES organizations(id),
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'member', 'viewer')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Decisions (depends on organizations, users)
CREATE TABLE decisions (
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
  quality_score INTEGER DEFAULT 0 CHECK (quality_score BETWEEN 0 AND 100),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Jobs (depends on organizations, decisions)
CREATE TABLE jobs (
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

-- 5. Options (depends on decisions)
CREATE TABLE options (
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

-- 6. Evidence (depends on decisions)
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

-- 7. Evidence-Options (depends on evidence, options)
CREATE TABLE evidence_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  evidence_id UUID REFERENCES evidence(id) ON DELETE CASCADE NOT NULL,
  option_id UUID REFERENCES options(id) ON DELETE CASCADE NOT NULL,
  relationship TEXT NOT NULL CHECK (relationship IN ('supports', 'challenges', 'neutral')),
  UNIQUE(evidence_id, option_id)
);

-- 8. Constraints (depends on decisions)
CREATE TABLE constraints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  decision_id UUID REFERENCES decisions(id) ON DELETE CASCADE NOT NULL,
  category TEXT CHECK (category IN ('legal', 'technical', 'budget', 'timeline', 'brand', 'org', 'other')),
  description TEXT NOT NULL,
  severity TEXT DEFAULT 'hard' CHECK (severity IN ('hard', 'soft')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Tradeoffs (depends on decisions, options)
CREATE TABLE tradeoffs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  decision_id UUID REFERENCES decisions(id) ON DELETE CASCADE NOT NULL,
  option_id UUID REFERENCES options(id) ON DELETE CASCADE,
  gives_up TEXT NOT NULL,
  gets TEXT NOT NULL,
  accepted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Stakeholders (depends on decisions)
CREATE TABLE stakeholders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  decision_id UUID REFERENCES decisions(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  role TEXT,
  stance TEXT CHECK (stance IN ('supportive', 'neutral', 'skeptical', 'unknown')),
  concerns TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Outputs (depends on decisions)
CREATE TABLE outputs (
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

-- 12. Competitor Profiles (depends on decisions, jobs)
CREATE TABLE competitor_profiles (
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

-- 13. Comments (depends on decisions, users, comments)
CREATE TABLE comments (
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

-- 14. Invitations (depends on organizations, users)
CREATE TABLE invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) NOT NULL,
  email TEXT NOT NULL,
  role TEXT DEFAULT 'member',
  invited_by UUID REFERENCES users(id),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days'),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
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

-- RLS Policies
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

-- Shared outputs are publicly viewable
CREATE POLICY "Shared outputs public" ON outputs
  FOR SELECT USING (is_shared = TRUE OR
    decision_id IN (SELECT id FROM decisions WHERE org_id IN
      (SELECT org_id FROM users WHERE id = auth.uid())));
