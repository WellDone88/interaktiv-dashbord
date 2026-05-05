import { computed, onBeforeUnmount, ref } from 'vue'

const formatTime = (seconds: number): string => {
  const safeSeconds = Math.max(0, Math.round(seconds))
  const minutes = Math.floor(safeSeconds / 60)
  const remainder = safeSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`
}

const playAlarmSound = () => {
  try {
    const context = new AudioContext()
    const oscillator = context.createOscillator()
    const gain = context.createGain()

    oscillator.type = 'sine'
    oscillator.frequency.value = 880
    gain.gain.value = 0.2

    oscillator.connect(gain)
    gain.connect(context.destination)
    oscillator.start()
    oscillator.stop(context.currentTime + 0.4)

    oscillator.onended = () => context.close()
  } catch {
    // Lyd kan feile i noen miljøer, men timeren fungerer fortsatt.
  }
}

export const useTimer = () => {
  const durationSeconds = ref(300)
  const remainingSeconds = ref(durationSeconds.value)
  const isRunning = ref(false)
  const intervalId = ref<number | null>(null)

  const formattedTime = computed(() => formatTime(remainingSeconds.value))
  const hasFinished = computed(() => remainingSeconds.value <= 0)

  const stopTimer = () => {
    if (intervalId.value !== null) {
      clearInterval(intervalId.value)
      intervalId.value = null
    }
    isRunning.value = false
  }

  const setTimer = (seconds: number) => {
    const safeSeconds = Math.max(0, Math.round(seconds))
    durationSeconds.value = safeSeconds
    remainingSeconds.value = safeSeconds
  }

  const resetTimer = () => {
    stopTimer()
    remainingSeconds.value = durationSeconds.value
  }

  const startTimer = () => {
    if (remainingSeconds.value <= 0) {
      remainingSeconds.value = durationSeconds.value
    }

    if (isRunning.value || remainingSeconds.value <= 0) {
      return
    }

    isRunning.value = true
    intervalId.value = window.setInterval(() => {
      remainingSeconds.value = Math.max(0, remainingSeconds.value - 1)

      if (remainingSeconds.value <= 0) {
        stopTimer()
        playAlarmSound()
      }
    }, 1000)
  }

  const pauseTimer = () => {
    stopTimer()
  }

  onBeforeUnmount(() => stopTimer())

  return {
    durationSeconds,
    remainingSeconds,
    isRunning,
    formattedTime,
    hasFinished,
    setTimer,
    startTimer,
    pauseTimer,
    resetTimer,
  }
}
