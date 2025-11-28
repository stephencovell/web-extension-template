import { useState, useEffect } from 'preact/hooks'
import type { Todo } from '@/types/todo'

const STORAGE_KEY = 'todos'

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from storage on mount
  useEffect(() => {
    chrome.storage.local.get([STORAGE_KEY], (result) => {
      if (result[STORAGE_KEY]) {
        setTodos(result[STORAGE_KEY])
      }
      setIsLoaded(true)
    })
  }, [])

  // Save to storage when todos change
  useEffect(() => {
    if (isLoaded) {
      chrome.storage.local.set({ [STORAGE_KEY]: todos })
    }
  }, [todos, isLoaded])

  const addTodo = (text: string) => {
    if (!text.trim()) return

    const newTodo: Todo = {
      id: Date.now().toString(),
      text: text.trim(),
      completed: false
    }

    setTodos(prev => [...prev, newTodo])
  }

  const toggleTodo = (id: string) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    )
  }

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id))
  }

  const clearCompleted = () => {
    setTodos(prev => prev.filter(todo => !todo.completed))
  }

  const completedCount = todos.filter(t => t.completed).length

  return {
    todos,
    addTodo,
    toggleTodo,
    deleteTodo,
    clearCompleted,
    completedCount
  }
}
