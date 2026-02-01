import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Cpu, Shield, Swords, TrendingUp, Users } from 'lucide-react'

interface DecisionChangersListProps {
  decisionId: string
}

const getChangeType = (condition: string) => {
  const lower = condition.toLowerCase()
  if (lower.includes('market') || lower.includes('demand')) return { label: 'Market', icon: TrendingUp }
  if (lower.includes('regulat') || lower.includes('compliance')) return { label: 'Regulatory', icon: Shield }
  if (lower.includes('competitor') || lower.includes('rival')) return { label: 'Competitive', icon: Swords }
  if (lower.includes('tech') || lower.includes('platform') || lower.includes('infrastructure')) {
    return { label: 'Tech', icon: Cpu }
  }
  return { label: 'Internal', icon: Users }
}

export async function DecisionChangersList({ decisionId }: DecisionChangersListProps) {
  const supabase = await createClient()
  const { data: changers } = await supabase
    .from('decision_changers')
    .select('condition, would_favor, likelihood')
    .eq('decision_id', decisionId)

  if (!changers?.length) {
    return (
      <Card className="p-4 text-sm text-foreground-muted">
        No decision changers recorded yet.
      </Card>
    )
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {changers.map((changer, index) => {
        const { label, icon: Icon } = getChangeType(changer.condition)
        return (
          <Card key={`${changer.condition}-${index}`} className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon className="h-4 w-4" />
              </div>
              <div className="space-y-1">
                <Badge variant="subtle">{label}</Badge>
                <p className="text-sm text-foreground">{changer.condition}</p>
                <p className="text-xs text-foreground-muted">
                  Would favor {changer.would_favor} • {changer.likelihood ?? 'medium'}
                </p>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
