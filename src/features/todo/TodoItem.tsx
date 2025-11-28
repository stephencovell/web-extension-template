import { cn } from '@/utils/cn'
import type { Todo } from '@/types/todo'

interface TodoItemProps {
  todo: Todo
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <div class="flex items-center gap-3 p-3 group">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        class="w-4 h-4 rounded border-border text-primary focus:ring-ring"
      />
      <span
        class={cn(
          'flex-1 text-sm',
          todo.completed && 'text-muted-foreground line-through'
        )}
      >
        {todo.text}
      </span>
      <button
        onClick={() => onDelete(todo.id)}
        class="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
        aria-label="Delete todo"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}
