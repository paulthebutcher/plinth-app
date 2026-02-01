CREATE TABLE IF NOT EXISTS briefs (
  id UUID PRIMARY KEY,
  decision_id UUID REFERENCES decisions(id) ON DELETE CASCADE NOT NULL,
  sections JSONB NOT NULL,
  citations JSONB NOT NULL,
  markdown TEXT NOT NULL,
  generated_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_briefs_decision_id ON briefs(decision_id);
