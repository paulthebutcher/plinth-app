import React from 'react'

import { cn } from '@/lib/utils'

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'destructive'
}

export function Alert({
  children,
  variant = 'default',
  className = '',
  ...props
}: AlertProps) {
  const variantStyles = {
    default: 'bg-background-muted text-foreground border-border',
    destructive: 'bg-error-soft text-error border-error/30'
  }

  return (
    <div
      role="alert"
      className={cn(
        "rounded-lg border p-4",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function AlertDescription({
  className = '',
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-sm text-foreground-muted", className)}
      {...props}
    />
  )
}
