import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

const tickInterval = 1000

export const useLocalTimeStore = defineStore('localTime', () => {
  const now = ref(Date.now())
  let timerId: number | undefined

  const formatLocalTime = (timestamp: number) => {
    const date = new Date(timestamp)
    return {
      time: date.toLocaleTimeString(),
      date: date.toLocaleDateString(),
    }
  }

  const localTime = computed(() => formatLocalTime(now.value))

  const time = computed(() => new Date(now.value).toLocaleTimeString())
  const date = computed(() => new Date(now.value).toLocaleDateString())

  const startTimer = () => {
    if (timerId !== undefined) return
    timerId = window.setInterval(() => {
      now.value = Date.now()
    }, tickInterval)
  }

  const stopTimer = () => {
    if (timerId !== undefined) {
      window.clearInterval(timerId)
      timerId = undefined
    }
  }

  // Start timer immediately
  startTimer()

  return { localTime, startTimer, stopTimer }
})
