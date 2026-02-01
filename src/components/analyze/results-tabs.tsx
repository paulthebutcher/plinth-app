'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { EvidencePlaceholder } from './evidence-placeholder'
import { OptionsPlaceholder } from './options-placeholder'
import { RecommendationPlaceholder } from './recommendation-placeholder'

export function ResultsTabs({ decisionId }: { decisionId: string }) {
  return (
    <Tabs defaultValue="recommendation" className="w-full">
      <TabsList className="gap-2">
        <TabsTrigger value="recommendation">Recommendation</TabsTrigger>
        <TabsTrigger value="evidence">Evidence</TabsTrigger>
        <TabsTrigger value="options">Options</TabsTrigger>
      </TabsList>

      <TabsContent value="recommendation" className="mt-6">
        <RecommendationPlaceholder />
      </TabsContent>

      <TabsContent value="evidence" className="mt-6">
        <EvidencePlaceholder />
      </TabsContent>

      <TabsContent value="options" className="mt-6">
        <OptionsPlaceholder />
      </TabsContent>
    </Tabs>
  )
}
