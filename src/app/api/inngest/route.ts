import { serve } from 'inngest/next'
import { inngest } from '@/lib/inngest/client'
import {
  analyzeDecision,
  evidenceScan,
  generateOptions,
  mapEvidence,
  scoreOptions,
  generateRecommendation,
  generateBrief,
} from '@/lib/inngest/functions'

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    analyzeDecision,
    evidenceScan,
    generateOptions,
    mapEvidence,
    scoreOptions,
    generateRecommendation,
    generateBrief,
  ],
})
