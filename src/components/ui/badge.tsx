import * as React from 'react'

import { cn } from '@/lib/utils'

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outline' | 'subtle'
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variants = {
    default: 'bg-primary text-primary-foreground',
    outline: 'border border-border text-foreground',
    subtle: 'border border-border bg-background-muted text-foreground-muted',
  }

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium',
        variants[variant],
        className
      )}
      {...props}
    />
  )
}
