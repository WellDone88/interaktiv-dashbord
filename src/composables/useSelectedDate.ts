import { ref } from 'vue'

// Shared state for selected date across components
const selectedDate = ref<string>(new Date().toISOString().split('T')[0]!)

export const useSelectedDate = () => {
  const setSelectedDate = (date: string) => {
    selectedDate.value = date
  }

  const selectDate = (day: number | null, month: number, year: number) => {
    if (day === null) return

    const monthString = String(month + 1).padStart(2, '0')
    const dayString = String(day).padStart(2, '0')
    selectedDate.value = `${year}-${monthString}-${dayString}`
  }

  return {
    selectedDate,
    setSelectedDate,
    selectDate,
  }
}
