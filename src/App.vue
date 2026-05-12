<script setup lang="ts">
import Clock from './components/Clock.vue'
import Calendar from './components/Calendar.vue'
import Weather from './components/Weather.vue'
import TodoList from './components/TodoList.vue'
import Timer from './components/Timer.vue'
import Radio from './components/Radio.vue'
</script>

<template>
  <div id="dashboard">
    <header class="header"></header>
    <main class="grid-container">
      <Weather class="card" />
      <Clock class="card" />
      <Radio class="card" />
      <TodoList class="card" />
      <Timer class="card" />
      <Calendar class="card" />
    </main>
  </div>
</template>

<style scoped>
#dashboard {
  font-family: 'Inter', sans-serif;
  background-color: #1a1a1a;
  color: white;
  min-height: 100vh;
  padding: 20px;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.card {
  background-color: #2d2d2d;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}
</style>
