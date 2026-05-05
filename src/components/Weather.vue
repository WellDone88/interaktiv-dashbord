<script setup lang="ts">
import { onMounted } from 'vue'
import { useWeather } from '../composables/useWeather'

const { weather, icon, description, temperatureDisplay, refreshWeather, loading } = useWeather()

onMounted(() => {
  refreshWeather()
})
</script>

<template>
  <section class="weather-card card">
    <div class="weather-header">
      <h2>Vær</h2>
      <button @click="refreshWeather" class="refresh-btn" :disabled="loading">🔄</button>
    </div>

    <div v-if="loading" class="loading">Laster værdata...</div>

    <div v-else class="weather-main">
      <span class="weather-icon">{{ icon }}</span>
      <div class="weather-info">
        <p class="temperature">{{ temperatureDisplay }}</p>
        <p class="condition">{{ description }}</p>
      </div>
    </div>

    <div v-if="!loading" class="weather-details">
      <div class="detail">
        <span class="detail-label">Sted</span>
        <span class="detail-value">{{ weather.location }}</span>
      </div>
      <div class="detail">
        <span class="detail-label">Fuktighet</span>
        <span class="detail-value">{{ weather.humidity }}%</span>
      </div>
      <div class="detail">
        <span class="detail-label">Vind</span>
        <span class="detail-value">{{ weather.windSpeed }} km/h</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.weather-card {
  background-color: #2d2d2d;
  padding: 20px;
  border-radius: 15px;
  margin-bottom: 20px;
}

.weather-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.weather-header h2 {
  margin: 0;
  font-size: 1.5rem;
}

.refresh-btn {
  background-color: #3d3d3d;
  border: none;
  color: white;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition:
    background-color 0.2s,
    transform 0.2s;
}

.refresh-btn:hover:not(:disabled) {
  background-color: #4d4d4d;
  transform: rotate(180deg);
}

.refresh-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.weather-main {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}

.weather-icon {
  font-size: 3rem;
}

.weather-info {
  display: flex;
  flex-direction: column;
}

.temperature {
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
}

.condition {
  font-size: 1.1rem;
  color: #cfcfcf;
  margin: 5px 0 0;
}

.weather-details {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.detail {
  background-color: #1a1a1a;
  padding: 12px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.detail-label {
  font-size: 0.85rem;
  color: #999;
}

.detail-value {
  font-size: 1rem;
  font-weight: 700;
}

.loading {
  text-align: center;
  padding: 40px 20px;
  color: #999;
  font-size: 0.95rem;
}
</style>
