import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSelectedDateStore = defineStore('selectedDate', () => {
  const selectedDate = ref<string>(new Date().toISOString().split('T')[0]!)

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
})
