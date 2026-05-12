<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useCalendarStore } from '../stores/calendar'
import { useSelectedDateStore } from '../stores/selectedDate'
import { useTodoListStore } from '../stores/todoList'
import { useNorwegianHolidays } from '../composables/useNorwegianHolidays'

const calendarStore = useCalendarStore()
const { year, month, monthName, weeks } = storeToRefs(calendarStore)
const { goToPreviousMonth, goToNextMonth } = calendarStore

const selectedDateStore = useSelectedDateStore()
const { selectedDate } = storeToRefs(selectedDateStore)
const { selectDate } = selectedDateStore

const todoStore = useTodoListStore()
const { todos } = storeToRefs(todoStore)
const { isHoliday, getHolidayName } = useNorwegianHolidays()

// Get days with todos for current month
const daysWithTodos = computed(() => {
  const daysSet = new Set<number>()
  todos.value.forEach((todo) => {
    if (
      todo.dueDate &&
      todo.dueDate.getFullYear() === year.value &&
      todo.dueDate.getMonth() === month.value
    ) {
      daysSet.add(todo.dueDate.getDate())
    }
  })
  return daysSet
})

// Get days with holidays for current month
const daysWithHolidays = computed(() => {
  const holidayMap = new Map<number, string>()
  for (let day = 1; day <= 31; day++) {
    const holidayName = getHolidayName(year.value, month.value, day)
    if (holidayName) {
      holidayMap.set(day, holidayName)
    }
  }
  return holidayMap
})

// Check if day is selected
const isSelected = computed(() => {
  return (day: number | null) => {
    if (!day) return false
    const parts = selectedDate.value.split('-')
    const selectedYear = parseInt(parts[0] ?? '2026', 10)
    const selectedMonth = parseInt(parts[1] ?? '1', 10) - 1
    const selectedDay = parseInt(parts[2] ?? '1', 10)

    return day === selectedDay && year.value === selectedYear && month.value === selectedMonth
  }
})

const handleDayClick = (day: number | null) => {
  selectDate(day, month.value, year.value)
}
</script>

<template>
  <section class="calendar-mini">
    <div class="calendar-header-mini">
      <button @click="goToPreviousMonth" class="nav-btn-mini">‹</button>
      <span class="month-year-mini">{{ monthName }} {{ year }}</span>
      <button @click="goToNextMonth" class="nav-btn-mini">›</button>
    </div>

    <div class="weekdays-mini">
      <div v-for="day in ['M', 'T', 'O', 'T', 'F', 'L', 'S']" :key="day" class="weekday-mini">
        {{ day }}
      </div>
    </div>

    <div class="calendar-grid-mini">
      <div v-for="(week, weekIndex) in weeks" :key="weekIndex" class="week-mini">
        <div v-for="(day, dayIndex) in week" :key="dayIndex" class="day-cell">
          <button
            class="day-mini"
            :class="{
              'day-selected': isSelected(day),
              'day-with-todos': daysWithTodos.has(day as number),
              'day-holiday': daysWithHolidays.has(day as number),
            }"
            :disabled="!day"
            @click="handleDayClick(day)"
          >
            <span class="day-number">{{ day }}</span>
          </button>
          <div v-if="day && daysWithHolidays.has(day as number)" class="holiday-label">
            {{ daysWithHolidays.get(day as number) }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.calendar-mini {
  background-color: #2d2d2d;
  padding: 16px;
  border-radius: 14px;
  width: 100%;
  max-width: 420px;
  min-width: 320px;
}

.calendar-header-mini {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 12px;
}

.month-year-mini {
  font-weight: 700;
  font-size: 1rem;
  min-width: 120px;
  text-align: center;
}

.nav-btn-mini {
  background-color: #3d3d3d;
  border: none;
  color: white;
  padding: 4px 6px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: background-color 0.2s;
}

.nav-btn-mini:hover {
  background-color: #4d4d4d;
}

.weekdays-mini {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin-bottom: 4px;
  font-size: 0.8rem;
  font-weight: 600;
  color: #999;
  justify-items: center;
  align-items: center;
}

.weekday-mini {
  text-align: center;
  min-height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.calendar-grid-mini {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.week-mini {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

.day-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  min-height: 40px;
}

.day-mini {
  width: 100%;
  max-width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #1a1a1a;
  border-radius: 6px;
  font-size: 0.8rem;
  color: #cfcfcf;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.day-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.holiday-label {
  font-size: 0.55rem;
  font-weight: 600;
  color: #ff6b6b;
  text-align: center;
  max-width: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1;
}

.day-mini:disabled {
  cursor: not-allowed;
  opacity: 0;
}

.day-mini:not(:disabled):hover {
  background-color: #404040;
}

.day-mini.day-with-todos {
  background-color: #1a3a1a;
  border: 1px solid #4a9d4a;
  color: #7ed97e;
  font-weight: 600;
}

.day-mini.day-selected {
  background-color: #4a9d4a;
  color: white;
  font-weight: 600;
}

.day-mini.day-holiday {
  color: #ff6b6b;
  font-weight: 600;
}
</style>
