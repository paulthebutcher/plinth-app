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
