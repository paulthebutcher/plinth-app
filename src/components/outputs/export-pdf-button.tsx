 'use client'

 import { useState } from 'react'
 import { Button } from '@/components/ui/button'

 interface ExportPdfButtonProps {
   decisionId: string
 }

 export function ExportPdfButton({ decisionId }: ExportPdfButtonProps) {
   const [isLoading, setIsLoading] = useState(false)

   const handleExport = async () => {
     try {
       setIsLoading(true)
       const res = await fetch(`/api/decisions/${decisionId}/brief/pdf`)
       if (!res.ok) {
         throw new Error('Failed to generate PDF')
       }
       const blob = await res.blob()
       const url = window.URL.createObjectURL(blob)
       const link = document.createElement('a')
       link.href = url
       link.download = `decision-brief.pdf`
       link.click()
       window.URL.revokeObjectURL(url)
     } finally {
       setIsLoading(false)
     }
   }

   return (
     <Button variant="outline" onClick={handleExport} disabled={isLoading}>
       {isLoading ? 'Generating...' : 'Export PDF'}
     </Button>
   )
 }
