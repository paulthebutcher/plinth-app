import { serve } from 'inngest/next'
import { inngest } from '@/lib/inngest/client'
import { evidenceScan } from '@/lib/inngest/functions/evidence-scan'
import { generateOptions } from '@/lib/inngest/functions/generate-options'

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [evidenceScan, generateOptions],
})
