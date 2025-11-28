import { cn } from '@/utils/cn'

interface InputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  onKeyDown?: (e: KeyboardEvent) => void
}

export function Input({ value, onChange, placeholder, className, onKeyDown }: InputProps) {
  return (
    <input
      type="text"
      value={value}
      onInput={(e) => onChange((e.target as HTMLInputElement).value)}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      class={cn(
        'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm',
        'transition-colors placeholder:text-muted-foreground',
        'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
    />
  )
}
