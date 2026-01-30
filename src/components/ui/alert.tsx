import React from 'react'

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
    default: 'bg-blue-50 text-blue-700 border-blue-200',
    destructive: 'bg-red-50 text-red-700 border-red-200'
  }

  return (
    <div
      role="alert"
      className={`border rounded-lg p-4 ${variantStyles[variant]} ${className}`}
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
      className={`text-sm ${className}`}
      {...props}
    />
  )
}
