<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useTimerStore } from '../stores/timer'

const minutes = ref(5)
const seconds = ref(0)

const timerStore = useTimerStore()
const { formattedTime, hasFinished, isRunning } = storeToRefs(timerStore)
const { setTimer, startTimer, pauseTimer, resetTimer } = timerStore

const updateTimer = () => {
  const totalSeconds =
    Math.max(0, Math.round(minutes.value)) * 60 + Math.max(0, Math.round(seconds.value))
  setTimer(totalSeconds)
}

const startCountdown = () => {
  updateTimer()
  startTimer()
}
</script>

<template>
  <section class="timer-card card">
    <div class="timer-header">
      <h2>Nedtelling</h2>
    </div>

    <div class="timer-display">
      <span>{{ formattedTime }}</span>
      <p v-if="hasFinished">Tiden er ute!</p>
    </div>

    <div class="timer-inputs">
      <label>
        Minutter
        <input type="number" min="0" v-model.number="minutes" />
      </label>
      <label>
        Sekunder
        <input type="number" min="0" max="59" v-model.number="seconds" />
      </label>
    </div>

    <div class="timer-actions">
      <button @click="startCountdown" :disabled="isRunning">Start</button>
      <button @click="pauseTimer" :disabled="!isRunning">Pause</button>
      <button @click="resetTimer">Reset</button>
    </div>
  </section>
</template>

<style scoped>
.timer-card {
  background-color: #2d2d2d;
  padding: 20px;
  border-radius: 15px;
}

.timer-header {
  margin-bottom: 18px;
}

.timer-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-bottom: 18px;
  font-size: 2.5rem;
  font-weight: 700;
}

.timer-display p {
  margin: 0;
  font-size: 1rem;
  color: #7ed957;
}

.timer-inputs {
  display: grid;
  grid-template-columns: repeat(2, minmax(100px, 1fr));
  gap: 12px;
  margin-bottom: 18px;
}

.timer-inputs label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 0.9rem;
}

.timer-inputs input {
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #444;
  background: #1f1f1f;
  color: white;
}

.timer-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.timer-actions button {
  flex: 1;
  padding: 10px 16px;
  border: none;
  border-radius: 10px;
  background-color: #3d3d3d;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s;
}

.timer-actions button:hover:not(:disabled) {
  background-color: #5a5a5a;
}

.timer-actions button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
