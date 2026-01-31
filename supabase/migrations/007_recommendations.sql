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

ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Org isolation" ON recommendations
  FOR ALL USING (decision_id IN (SELECT id FROM decisions WHERE org_id IN
    (SELECT org_id FROM users WHERE id = auth.uid())));
