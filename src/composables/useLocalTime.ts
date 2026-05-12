import { computed, onMounted, onUnmounted, ref } from 'vue'

const tickInterval = 1000

export const useLocalTime = () => {
  const now = ref(Date.now())
  let timerId: number | undefined

  const formatLocalTime = (timestamp: number) => {
    const date = new Date(timestamp)
    return {
      time: date.toLocaleTimeString('no-NO', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }),
      date: date.toLocaleDateString('no-NO'),
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
