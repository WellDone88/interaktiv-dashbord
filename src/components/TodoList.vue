<script setup lang="ts">
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useTodoListStore } from '../stores/todoList'
import { useSelectedDateStore } from '../stores/selectedDate'
import { useNorwegianHolidays } from '../composables/useNorwegianHolidays'

const todoStore = useTodoListStore()
const { todos } = storeToRefs(todoStore)
const { addNewTodo, removeTodoItem, toggleTodoItem } = todoStore

const selectedDateStore = useSelectedDateStore()
const { selectedDate } = storeToRefs(selectedDateStore)
const { getHolidayName } = useNorwegianHolidays()

const newTodoTitle = ref('')

const todosForSelectedDate = computed(() => {
  const parts = (selectedDate.value || '2026-01-01').split('-')
  const year = parseInt(parts[0] || '2026', 10)
  const month = parseInt(parts[1] || '1', 10)
  const day = parseInt(parts[2] || '1', 10)
  const selected = new Date(year, month - 1, day)

  return todos.value.filter((todo) => {
    if (!todo.dueDate) return false
    return (
      todo.dueDate.getFullYear() === selected.getFullYear() &&
      todo.dueDate.getMonth() === selected.getMonth() &&
      todo.dueDate.getDate() === selected.getDate()
    )
  })
})

const activeTodosForDate = computed(() => {
  return todosForSelectedDate.value.filter((todo) => !todo.completed)
})

const completedTodosForDate = computed(() => {
  return todosForSelectedDate.value.filter((todo) => todo.completed)
})

const handleAddTodo = () => {
  if (newTodoTitle.value.trim()) {
    const parts = (selectedDate.value || '2026-01-01').split('-')
    const year = parseInt(parts[0] || '2026', 10)
    const month = parseInt(parts[1] || '1', 10)
    const day = parseInt(parts[2] || '1', 10)
    const dueDate = new Date(year, month - 1, day)
    addNewTodo(newTodoTitle.value, dueDate)
    newTodoTitle.value = ''
  }
}

const handleComplete = (id: string) => {
  toggleTodoItem(id)
}

const displayDate = computed(() => {
  const parts = (selectedDate.value || '2026-01-01').split('-')
  const year = parseInt(parts[0] || '2026', 10)
  const month = parseInt(parts[1] || '1', 10)
  const day = parseInt(parts[2] || '1', 10)
  const date = new Date(year, month - 1, day)
  return date.toLocaleDateString('no-NO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
})

const holidayName = computed(() => {
  const parts = (selectedDate.value || '2026-01-01').split('-')
  const year = parseInt(parts[0] || '2026', 10)
  const month = parseInt(parts[1] || '1', 10) - 1
  const day = parseInt(parts[2] || '1', 10)
  return getHolidayName(year, month, day)
})
</script>

<template>
  <section class="todo-card card">
    <div class="todo-header">
      <h2>Gjøremål</h2>
    </div>

    <div class="date-selector">
      <label for="todo-date">Velg dato:</label>
      <input v-model="selectedDate" id="todo-date" type="date" class="date-input" />
      <span class="selected-date">{{ displayDate }}</span>
      <span v-if="holidayName" class="holiday-name">{{ holidayName }}</span>
    </div>

    <div class="add-todo">
      <input
        v-model="newTodoTitle"
        type="text"
        placeholder="Legg til nytt gjøremål..."
        class="todo-input"
        @keyup.enter="handleAddTodo"
      />
      <button @click="handleAddTodo" class="add-btn">Legg til</button>
    </div>

    <ul v-if="activeTodosForDate.length > 0" class="todo-list">
      <li v-for="todo in activeTodosForDate" :key="todo.id" class="todo-item">
        <div class="todo-content">
          <input
            type="checkbox"
            :checked="todo.completed"
            @change="() => handleComplete(todo.id)"
            class="todo-checkbox"
          />
          <span class="todo-title">{{ todo.title }}</span>
        </div>
        <button @click="removeTodoItem(todo.id)" class="delete-btn">✕</button>
      </li>
    </ul>

    <div v-if="completedTodosForDate.length > 0" class="completed-section">
      <h3 class="completed-title">✓ Fullført ({{ completedTodosForDate.length }})</h3>
      <ul class="todo-list completed-list">
        <li v-for="todo in completedTodosForDate" :key="todo.id" class="todo-item completed-item">
          <div class="todo-content">
            <input
              type="checkbox"
              :checked="todo.completed"
              @change="() => handleComplete(todo.id)"
              class="todo-checkbox"
            />
            <span class="todo-title">{{ todo.title }}</span>
          </div>
          <button @click="removeTodoItem(todo.id)" class="delete-btn">✕</button>
        </li>
      </ul>
    </div>

    <div
      v-if="activeTodosForDate.length === 0 && completedTodosForDate.length === 0"
      class="empty-state"
    >
      <p>Ingen gjøremål for denne datoen</p>
    </div>
  </section>
</template>

<style scoped>
.todo-card {
  background-color: #2d2d2d;
  padding: 20px;
  border-radius: 15px;
  margin-bottom: 20px;
}

.todo-header {
  margin-bottom: 16px;
}

.todo-card h2 {
  margin: 0;
  font-size: 1.5rem;
}

.date-selector {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #3d3d3d;
}

.date-selector label {
  font-size: 0.9rem;
  color: #cfcfcf;
  font-weight: 500;
}

.date-input {
  background-color: #1a1a1a;
  border: 1px solid #3d3d3d;
  color: white;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: border-color 0.2s;
}

.date-input:focus {
  outline: none;
  border-color: #0066cc;
}

.selected-date {
  font-size: 0.9rem;
  color: #0066cc;
  font-weight: 500;
  margin-left: auto;
}

.holiday-name {
  font-size: 0.85rem;
  color: #ff6b6b;
  font-weight: 600;
  padding: 4px 8px;
  background-color: #3a1a1a;
  border-radius: 4px;
}

.add-todo {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}

.todo-input {
  flex: 1;
  background-color: #1a1a1a;
  border: 1px solid #3d3d3d;
  color: white;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: border-color 0.2s;
}

.todo-input:focus {
  outline: none;
  border-color: #0066cc;
}

.add-btn {
  background-color: #0066cc;
  border: none;
  color: white;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 600;
  transition: background-color 0.2s;
}

.add-btn:hover {
  background-color: #0052a3;
}

.todo-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.todo-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #1a1a1a;
  padding: 12px;
  border-radius: 8px;
  transition: opacity 0.3s;
}

.todo-item.completed {
  opacity: 0.6;
  text-decoration: line-through;
}

.todo-content {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.todo-checkbox {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.todo-title {
  flex: 1;

  .completed-section {
    margin-top: 24px;
    padding-top: 16px;
    border-top: 1px solid #3d3d3d;
  }

  .completed-title {
    font-size: 0.95rem;
    color: #0066cc;
    margin: 0 0 12px;
    font-weight: 600;
  }

  .completed-list {
    opacity: 0.65;
  }

  .completed-item {
    background-color: #1a1a1a;
  }

  .completed-item .todo-title {
    text-decoration: line-through;
    color: #666;
  }
  font-size: 0.95rem;
}

.delete-btn {
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 4px 8px;
  transition: color 0.2s;
}

.delete-btn:hover {
  color: #ff6b6b;
}

.empty-state {
  text-align: center;
  padding: 20px;
  color: #999;
}
</style>
