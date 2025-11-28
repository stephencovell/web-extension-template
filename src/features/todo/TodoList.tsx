import { useState } from 'preact/hooks'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { useTodos } from '@/hooks/useTodos'
import { TodoItem } from './TodoItem'

export function TodoList() {
  const [input, setInput] = useState('')
  const { todos, addTodo, toggleTodo, deleteTodo, clearCompleted, completedCount } = useTodos()

  const handleSubmit = () => {
    addTodo(input)
    setInput('')
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }

  return (
    <div class="w-80 p-4">
      <header class="mb-4">
        <h1 class="text-lg font-semibold">Todo List</h1>
        <p class="text-sm text-muted-foreground">
          {todos.length === 0
            ? 'No tasks yet'
            : `${completedCount} of ${todos.length} completed`}
        </p>
      </header>

      <div class="flex gap-2 mb-4">
        <Input
          value={input}
          onChange={setInput}
          onKeyDown={handleKeyDown}
          placeholder="Add a task..."
        />
        <Button onClick={handleSubmit} size="sm">
          Add
        </Button>
      </div>

      {todos.length > 0 && (
        <Card className="divide-y divide-border">
          {todos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
            />
          ))}
        </Card>
      )}

      {todos.length > 0 && completedCount > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearCompleted}
          className="mt-3 w-full"
        >
          Clear completed
        </Button>
      )}
    </div>
  )
}
