import { inngest } from '../client'
import {
  evidenceScan,
  generateOptions,
  mapEvidence,
  scoreOptions,
  generateRecommendation,
  generateBrief,
} from './index'

export const analyzeDecision = inngest.createFunction(
  { id: 'analyze-decision', name: 'Analyze Decision' },
  { event: 'decision/analyze' },
  async ({ event, step }) => {
    const { decisionId } = event.data

    await step.invoke('evidence-scan', {
      function: evidenceScan,
      data: { decisionId },
    })

    await step.invoke('generate-options', {
      function: generateOptions,
      data: { decisionId },
    })

    await step.invoke('map-evidence', {
      function: mapEvidence,
      data: { decisionId },
    })

    await step.invoke('score-options', {
      function: scoreOptions,
      data: { decisionId },
    })

    await step.invoke('generate-recommendation', {
      function: generateRecommendation,
      data: { decisionId },
    })

    await step.invoke('generate-brief', {
      function: generateBrief,
      data: { decisionId },
    })

    return { status: 'complete', decisionId }
  }
)
