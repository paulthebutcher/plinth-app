'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { EvidenceList, type EvidenceListItem } from './evidence-list'
import { OptionsList, type OptionListItem } from './options-list'
import { RecommendationView } from './recommendation-view'

interface ResultsTabsProps {
  decisionId: string
  evidence: EvidenceListItem[]
  options: OptionListItem[]
  optionEvidence: { id: string; claim: string; sourceUrl: string | null }[]
  optionMappings: {
    optionId: string
    evidenceId: string
    relationship: 'supporting' | 'contradicting' | 'unknown'
  }[]
  recommendation: {
    optionTitle: string | null
    rationale: string | null
    confidence: number | null
    hedgeOptionTitle?: string | null
    hedgeCondition?: string | null
    decisionChangers: { condition: string; wouldFavor: string; likelihood: string }[]
    monitorTriggers: { signal: string; frequency: string; source?: string; threshold?: string }[]
  }
}

export function ResultsTabs({
  decisionId,
  evidence,
  options,
  optionEvidence,
  optionMappings,
  recommendation,
}: ResultsTabsProps) {
  return (
    <Tabs defaultValue="recommendation" className="w-full">
      <TabsList className="gap-2">
        <TabsTrigger value="recommendation">Recommendation</TabsTrigger>
        <TabsTrigger value="evidence">Evidence</TabsTrigger>
        <TabsTrigger value="options">Options</TabsTrigger>
      </TabsList>

      <TabsContent value="recommendation" className="mt-6">
        <RecommendationView
          optionTitle={recommendation.optionTitle}
          rationale={recommendation.rationale}
          confidence={recommendation.confidence}
          hedgeOptionTitle={recommendation.hedgeOptionTitle}
          hedgeCondition={recommendation.hedgeCondition}
          decisionChangers={recommendation.decisionChangers}
          monitorTriggers={recommendation.monitorTriggers}
          decisionId={decisionId}
        />
      </TabsContent>

      <TabsContent value="evidence" className="mt-6">
        <EvidenceList evidence={evidence} decisionId={decisionId} />
      </TabsContent>

      <TabsContent value="options" className="mt-6">
        <OptionsList
          options={options}
          decisionId={decisionId}
          evidence={optionEvidence}
          mappings={optionMappings}
        />
      </TabsContent>
    </Tabs>
  )
}
