import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

const getDaysInMonth = (date: Date): number => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
}

const getFirstDayOfMonth = (date: Date): number => {
  // JavaScript getDay() returns 0 (Sunday) to 6 (Saturday)
  // We want Monday = 0, so we adjust: (getDay() - 1 + 7) % 7
  const dayOfWeek = new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  return (dayOfWeek - 1 + 7) % 7
}

const generateCalendarDays = (date: Date): (number | null)[] => {
  const daysInMonth = getDaysInMonth(date)
  const firstDay = getFirstDayOfMonth(date)
  const days: (number | null)[] = Array(firstDay).fill(null)

  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  return days
}

const getWeeks = (days: (number | null)[]): (number | null)[][] => {
  const weeks: (number | null)[][] = []
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7))
  }
  return weeks
}

export const useCalendarStore = defineStore('calendar', () => {
  const currentDate = ref(new Date())

  const year = computed(() => currentDate.value.getFullYear())
  const month = computed(() => currentDate.value.getMonth())
  const monthName = computed(() => {
    return currentDate.value.toLocaleString('no-NO', { month: 'long' })
  })

  const days = computed(() => generateCalendarDays(currentDate.value))
  const weeks = computed(() => getWeeks(days.value))

  const goToPreviousMonth = () => {
    currentDate.value = new Date(year.value, month.value - 1)
  }

  const goToNextMonth = () => {
    currentDate.value = new Date(year.value, month.value + 1)
  }

  const goToToday = () => {
    currentDate.value = new Date()
  }

  return {
    currentDate,
    year,
    month,
    monthName,
    weeks,
    goToPreviousMonth,
    goToNextMonth,
    goToToday,
  }
})
