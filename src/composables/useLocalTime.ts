import { computed, onMounted, onUnmounted, ref } from 'vue'

const tickInterval = 1000

export const useLocalTime = () => {
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

  onMounted(() => {
    timerId = window.setInterval(() => {
      now.value = Date.now()
    }, tickInterval)
  })

  onUnmounted(() => {
    if (timerId !== undefined) {
      window.clearInterval(timerId)
    }
  })

  return { localTime }
}
