-- =====================================================
-- PLINTH DATABASE FIX SCRIPT
-- Run this in Supabase SQL Editor
-- Safe to run multiple times
-- =====================================================

-- STEP 1: Create organizations table if missing
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  plan TEXT DEFAULT 'trial',
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- STEP 2: Create users table if missing
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  org_id UUID,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'member',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- STEP 3: Add org_id column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'users'
    AND column_name = 'org_id'
  ) THEN
    ALTER TABLE users ADD COLUMN org_id UUID;
  END IF;
END $$;

-- STEP 4: Create a default organization
INSERT INTO organizations (id, name, slug, plan)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'My Organization',
  'default-org',
  'trial'
)
ON CONFLICT (slug) DO NOTHING;

-- STEP 5: Link ALL users without an org to the default org
UPDATE users
SET org_id = '00000000-0000-0000-0000-000000000001'
WHERE org_id IS NULL;

-- STEP 6: Create decisions table if missing (needed for the app to work)
CREATE TABLE IF NOT EXISTS decisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  owner_id UUID NOT NULL,
  title TEXT NOT NULL,
  decision_frame TEXT,
  status TEXT DEFAULT 'draft',
  analysis_status TEXT DEFAULT 'draft',
  decision_type TEXT,
  time_horizon TEXT,
  reversibility INTEGER,
  stakes INTEGER,
  scope INTEGER,
  company_context TEXT,
  falsification_criteria TEXT,
  context TEXT,
  deadline TIMESTAMPTZ,
  urgency TEXT,
  confidence_score INTEGER,
  confidence_rationale TEXT,
  recommendation_id UUID,
  recommendation_rationale TEXT,
  reversal_conditions TEXT,
  metadata JSONB DEFAULT '{}',
  analysis_started_at TIMESTAMPTZ,
  analysis_completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- STEP 7: Create jobs table if missing
CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  decision_id UUID,
  type TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  input JSONB NOT NULL DEFAULT '{}',
  output JSONB,
  error TEXT,
  progress INTEGER DEFAULT 0,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- STEP 8: Create constraints table if missing
CREATE TABLE IF NOT EXISTS constraints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  decision_id UUID NOT NULL,
  category TEXT,
  description TEXT NOT NULL,
  severity TEXT DEFAULT 'hard',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- VERIFICATION QUERIES - Check these results
-- =====================================================

-- Check 1: Organizations exist
SELECT 'ORGANIZATIONS' as check_name, COUNT(*) as count FROM organizations;

-- Check 2: Users have org_id
SELECT 'USERS WITH ORG' as check_name,
       COUNT(*) as total_users,
       COUNT(org_id) as users_with_org
FROM users;

-- Check 3: Your specific user
SELECT 'YOUR USER' as check_name, id, email, org_id
FROM users
WHERE email = 'pdbtrain92@gmail.com';

-- Check 4: Tables exist
SELECT 'TABLES' as check_name, table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('organizations', 'users', 'decisions', 'jobs', 'constraints')
ORDER BY table_name;
