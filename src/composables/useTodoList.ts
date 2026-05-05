import { computed, ref } from 'vue'

interface Todo {
  id: string
  title: string
  completed: boolean
  dueDate: Date | null
}

const generateId = (): string => `todo-${Date.now()}-${Math.random()}`

const formatDateShort = (date: Date): string => {
  return date.toLocaleDateString('no-NO', { month: 'short', day: 'numeric' })
}

const isToday = (date: Date): boolean => {
  const today = new Date()
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  )
}

const isOverdue = (date: Date): boolean => {
  const today = new Date()
  return date < today && !isToday(date)
}

const addTodo = (todos: Todo[], title: string, dueDate: Date | null = null): Todo[] => {
  return [
    ...todos,
    {
      id: generateId(),
      title,
      completed: false,
      dueDate,
    },
  ]
}

const removeTodo = (todos: Todo[], id: string): Todo[] => {
  return todos.filter((todo) => todo.id !== id)
}

const toggleTodo = (todos: Todo[], id: string): Todo[] => {
  return todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo))
}

const completeTodoByDate = (todos: Todo[], date: Date): Todo[] => {
  return todos.map((todo) => {
    if (todo.dueDate && isToday(todo.dueDate) === isToday(date)) {
      return { ...todo, completed: true }
    }
    return todo
  })
}

const getActiveTodos = (todos: Todo[]): Todo[] => {
  return todos.filter((todo) => !todo.completed)
}

const getTodosByDate = (todos: Todo[], date: Date): Todo[] => {
  return todos.filter((todo) => {
    if (!todo.dueDate) return false
    return (
      todo.dueDate.getFullYear() === date.getFullYear() &&
      todo.dueDate.getMonth() === date.getMonth() &&
      todo.dueDate.getDate() === date.getDate()
    )
  })
}

export const useTodoList = () => {
  const todos = ref<Todo[]>([
    {
      id: generateId(),
      title: 'Fullføre prosjekt',
      completed: false,
      dueDate: new Date(),
    },
    {
      id: generateId(),
      title: 'Møte med team',
      completed: false,
      dueDate: new Date(new Date().getTime() + 86400000),
    },
  ])

  const activeTodos = computed(() => getActiveTodos(todos.value))

  const addNewTodo = (title: string, dueDate: Date | null = null) => {
    todos.value = addTodo(todos.value, title, dueDate)
  }

  const removeTodoItem = (id: string) => {
    todos.value = removeTodo(todos.value, id)
  }

  const toggleTodoItem = (id: string) => {
    todos.value = toggleTodo(todos.value, id)
  }

  const getTodosBySelectedDate = (date: Date): Todo[] => {
    return getTodosByDate(todos.value, date)
  }

  const markDateTodosComplete = (date: Date) => {
    todos.value = completeTodoByDate(todos.value, date)
  }

  return {
    todos,
    activeTodos,
    addNewTodo,
    removeTodoItem,
    toggleTodoItem,
    getTodosBySelectedDate,
    markDateTodosComplete,
    formatDateShort,
    isToday,
    isOverdue,
  }
}
