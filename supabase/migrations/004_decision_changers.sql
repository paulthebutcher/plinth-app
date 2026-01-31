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
