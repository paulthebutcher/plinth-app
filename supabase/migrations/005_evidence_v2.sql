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
