-- Run these queries in Supabase SQL Editor to debug the org_id mismatch

-- 1. Check your user record
SELECT id, email, org_id FROM public.users WHERE email = 'pdbtrain92@gmail.com';

-- 2. Check the decision's org_id
SELECT id, title, org_id, owner_id FROM decisions WHERE id = '28cfa823-508e-4828-83ee-aaf46531be07';

-- 3. Check if org_ids match (should return a row if they match)
SELECT
  u.id as user_id,
  u.org_id as user_org_id,
  d.id as decision_id,
  d.org_id as decision_org_id,
  u.org_id = d.org_id as org_ids_match
FROM public.users u
CROSS JOIN decisions d
WHERE u.email = 'pdbtrain92@gmail.com'
AND d.id = '28cfa823-508e-4828-83ee-aaf46531be07';

-- 4. If they don't match, fix the decision to use the user's org_id:
-- UPDATE decisions
-- SET org_id = (SELECT org_id FROM public.users WHERE email = 'pdbtrain92@gmail.com')
-- WHERE id = '28cfa823-508e-4828-83ee-aaf46531be07';
