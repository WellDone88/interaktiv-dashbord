<script setup lang="ts">
import { useLocalTime } from '../composables/useLocalTime'

const { localTime } = useLocalTime()
</script>

<template>
  <section class="clock-card card">
    <h2>Lokaltid</h2>
    <p class="clock-time">{{ localTime.time }}</p>
    <p class="clock-date">{{ localTime.date }}</p>
  </section>
</template>

<style scoped>
.clock-card {
  background-color: #2d2d2d;
  padding: 20px;
  border-radius: 15px;
  display: inline-block;
  margin-bottom: 20px;
}

.clock-time {
  font-size: 2rem;
  margin: 10px 0 0;
  font-weight: 700;
}

.clock-date {
  margin: 5px 0 0;
  color: #cfcfcf;
}
</style>
