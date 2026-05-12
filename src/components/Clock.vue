<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useLocalTimeStore } from '../stores/localTime'

const localTimeStore = useLocalTimeStore()
const { localTime } = storeToRefs(localTimeStore)

const timeParts = computed(() => {
  const timeString = localTime.value.time || '00:00:00'
  const hoursMinutes = timeString.slice(0, 5)
  const seconds = timeString.slice(6)
  return { hoursMinutes, seconds }
})
</script>

<template>
  <section class="clock-card card">
    <h2>Lokaltid</h2>
    <p class="clock-time">
      <span class="clock-time-main">{{ timeParts.hoursMinutes }}</span>
      <span class="clock-time-seconds">:{{ timeParts.seconds }}</span>
    </p>
    <p class="clock-date">{{ localTime.date }}</p>
  </section>
</template>

<style scoped>
.clock-card {
  background-color: #2d2d2d;
  padding: 16px;
  border-radius: 15px;
  margin-bottom: 20px;
  width: 100%;
}

.clock-time {
  font-size: 1.75rem;
  margin: 8px 0 0;
  font-weight: 700;
  display: inline-flex;
  align-items: baseline;
  gap: 4px;
}

.clock-time-main {
  font-size: 2.1rem;
}

.clock-time-seconds {
  font-size: 1.2rem;
  color: #999;
}

.clock-date {
  margin: 4px 0 0;
  color: #cfcfcf;
}
</style>
