import { type Database } from './database'

export type Decision = Database['public']['Tables']['decisions']['Row']
export type NewDecision = Database['public']['Tables']['decisions']['Insert']

export type DecisionStatus = 'draft' | 'active' | 'complete' | 'archived'
export type AnalysisStatus = 'draft' | 'framing' | 'context' | 'scanning' | 'options' | 'mapping' | 'scoring' | 'recommending' | 'complete'
export type DecisionType = 'product_bet' | 'market_entry' | 'investment' | 'platform' | 'org_model'
export type TimeHorizon = '3-6_months' | '6-12_months' | '1-2_years' | '2+_years'

export interface CreateDecisionBody {
  title: string
  description?: string
  decision_type?: DecisionType
  time_horizon?: TimeHorizon
}
