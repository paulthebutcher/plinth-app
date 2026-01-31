-- Add analysis flow tracking columns
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

-- Remove old quality_score in favor of confidence
ALTER TABLE decisions DROP COLUMN IF EXISTS quality_score;
