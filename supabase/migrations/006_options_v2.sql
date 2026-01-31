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

ALTER TABLE option_scores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Org isolation" ON option_scores
  FOR ALL USING (decision_id IN (SELECT id FROM decisions WHERE org_id IN
    (SELECT org_id FROM users WHERE id = auth.uid())));
