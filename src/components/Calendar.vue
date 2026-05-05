<script setup lang="ts">
import { useCalendar } from '../composables/useCalendar'

const { year, monthName, weeks, goToPreviousMonth, goToNextMonth } = useCalendar()
</script>

<template>
  <section class="calendar-mini">
    <div class="calendar-header-mini">
      <button @click="goToPreviousMonth" class="nav-btn-mini">‹</button>
      <span class="month-year-mini">{{ monthName }} {{ year }}</span>
      <button @click="goToNextMonth" class="nav-btn-mini">›</button>
    </div>

    <div class="weekdays-mini">
      <div v-for="day in ['M', 'T', 'O', 'T', 'F', 'L', 'S']" :key="day" class="weekday-mini">
        {{ day }}
      </div>
    </div>

    <div class="calendar-grid-mini">
      <div v-for="(week, weekIndex) in weeks" :key="weekIndex" class="week-mini">
        <div v-for="(day, dayIndex) in week" :key="dayIndex" class="day-mini">
          {{ day }}
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.calendar-mini {
  background-color: #2d2d2d;
  padding: 8px;
  border-radius: 10px;
  width: fit-content;
}

.calendar-header-mini {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  margin-bottom: 8px;
}

.month-year-mini {
  font-weight: 600;
  font-size: 0.85rem;
  min-width: 90px;
  text-align: center;
}

.nav-btn-mini {
  background-color: #3d3d3d;
  border: none;
  color: white;
  padding: 4px 6px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: background-color 0.2s;
}

.nav-btn-mini:hover {
  background-color: #4d4d4d;
}

.weekdays-mini {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
  margin-bottom: 4px;
  font-size: 0.65rem;
  font-weight: 600;
  color: #999;
}

.weekday-mini {
  width: 20px;
  text-align: center;
}

.calendar-grid-mini {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.week-mini {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
}

.day-mini {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #1a1a1a;
  border-radius: 3px;
  font-size: 0.65rem;
  color: #cfcfcf;
}
</style>
