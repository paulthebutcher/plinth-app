import { z } from 'zod'
import { completeJSON } from '@/lib/services/openai'
import type { Option } from '@/lib/analysis/option-composer'

interface MergeGroup {
  indices: number[]
  reason: string
  keepIndex: number
}

const mergeSchema = z.array(
  z.object({
    indices: z.array(z.number().int().min(0)).min(2),
    keepIndex: z.number().int().min(0),
    reason: z.string().min(1),
  })
)

const buildPrompt = (options: Option[]) => [
  'You are merging cosmetically similar strategic options.',
  'If two options are >70% similar in intent, group them.',
  'For each group, choose the best articulated option to keep.',
  'Return JSON array with: indices (array of option indices), keepIndex, reason.',
  'Only include groups with 2+ indices.',
  '',
  ...options.map((option, index) => `${index}: ${option.title} — ${option.summary}`),
].join('\n')

const mergeOptions = (options: Option[], groups: MergeGroup[]) => {
  const toRemove = new Set<number>()
  const merged = [...options]

  groups.forEach((group) => {
    if (group.indices.length < 2) return
    if (!group.indices.includes(group.keepIndex)) return

    const keep = merged[group.keepIndex]
    if (!keep) return

    const combinedEvidence = new Set(keep.groundedInEvidence)
    group.indices.forEach((index) => {
      if (index === group.keepIndex) return
      const candidate = merged[index]
      if (!candidate) return
      candidate.groundedInEvidence.forEach((id) => combinedEvidence.add(id))
      toRemove.add(index)
    })

    merged[group.keepIndex] = {
      ...keep,
      groundedInEvidence: Array.from(combinedEvidence),
    }
  })

  return {
    merged: merged.filter((_, index) => !toRemove.has(index)),
    removed: Array.from(toRemove),
  }
}

export async function dedupeOptions(options: Option[]): Promise<Option[]> {
  if (options.length <= 3) {
    return options
  }

  const { data: groups } = await completeJSON(
    buildPrompt(options),
    mergeSchema,
    { model: 'gpt-4o-mini' }
  )

  const { merged, removed } = mergeOptions(options, groups)

  if (removed.length) {
    console.info('Option dedupe merged', {
      removed,
      reasons: groups.map((group) => ({ indices: group.indices, reason: group.reason })),
    })
  }

  if (merged.length < 3) {
    return options
  }

  return merged.slice(0, 6)
}
