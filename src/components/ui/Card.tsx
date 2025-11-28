import { ComponentChildren } from 'preact'
import { cn } from '@/utils/cn'

interface CardProps {
  children: ComponentChildren
  className?: string
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      class={cn(
        'bg-card text-card-foreground rounded-lg border border-border shadow-sm',
        className
      )}
    >
      {children}
    </div>
  )
}
