<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'

const stations = [
  { name: 'NRK P1', url: 'https://lyd.nrk.no/icecast/mp3/high/s0w7hwn47m/p1' },
  { name: 'NRK P2', url: 'https://lyd.nrk.no/icecast/mp3/high/s0w7hwn47m/p2' },
  { name: 'NRK P3', url: 'https://lyd.nrk.no/icecast/mp3/high/s0w7hwn47m/p3' },
  { name: 'NRK P13', url: 'https://lyd.nrk.no/icecast/mp3/high/s0w7hwn47m/p13' },
  { name: 'NRK Alltid Nyheter', url: 'https://lyd.nrk.no/icecast/mp3/high/s0w7hwn47m/nyheter' },
  { name: 'NRK MP3', url: 'https://lyd.nrk.no/icecast/mp3/high/s0w7hwn47m/mp3' },
  { name: 'NRK Jazz', url: 'https://lyd.nrk.no/icecast/mp3/high/s0w7hwn47m/jazz' },
  { name: 'NRK Klassisk', url: 'https://lyd.nrk.no/icecast/mp3/high/s0w7hwn47m/klassisk' },
  { name: 'NRK Folkemusikk', url: 'https://lyd.nrk.no/icecast/mp3/high/s0w7hwn47m/folkemusikk' },
  { name: 'NRK Sámi Radio', url: 'https://lyd.nrk.no/icecast/mp3/high/s0w7hwn47m/sapmi' },
]

const currentIndex = ref(0)
const isMuted = ref(false)
const isPlaying = ref(false)
const statusMessage = ref('Klar')
const volume = ref(0.6)
const audio = ref<HTMLAudioElement | null>(null)

const currentStation = computed(() => stations[currentIndex.value]!)
const volumeLabel = computed(() => Math.round(volume.value * 100))
const audioSupport = computed(() => {
  if (!audio.value) return 'ukjent'
  return (
    audio.value.canPlayType('audio/aac') || audio.value.canPlayType('audio/mpeg') || 'støttes ikke'
  )
})

function loadStation(index: number) {
  currentIndex.value = index
  const audioElement = audio.value
  if (!audioElement) return

  audioElement.pause()
  audioElement.src = stations[index]!.url
  audioElement.muted = isMuted.value
  audioElement.volume = volume.value
  audioElement.load()
  statusMessage.value = `Lastet ${stations[index]!.name}`

  if (isPlaying.value) {
    audioElement
      .play()
      .then(() => {
        isPlaying.value = true
        statusMessage.value = `Spiller ${stations[index]!.name}`
      })
      .catch((error) => {
        console.warn('Radio playback error:', error)
        statusMessage.value = `Kan ikke spille ${stations[index]!.name}`
        isPlaying.value = false
      })
  }
}

function prevStation() {
  const nextIndex = (currentIndex.value - 1 + stations.length) % stations.length
  loadStation(nextIndex)
}

function nextStation() {
  const nextIndex = (currentIndex.value + 1) % stations.length
  loadStation(nextIndex)
}

function toggleMute() {
  isMuted.value = !isMuted.value
  if (audio.value) {
    audio.value.muted = isMuted.value
  }
}

function playRadio() {
  const audioElement = audio.value
  if (!audioElement) return

  audioElement.src = currentStation.value.url
  audioElement.muted = isMuted.value
  audioElement.volume = volume.value
  audioElement.load()

  audioElement
    .play()
    .then(() => {
      isPlaying.value = true
      statusMessage.value = `Spiller ${currentStation.value.name}`
    })
    .catch((error) => {
      console.warn('Radio playback error:', error)
      statusMessage.value = `Spillfeil: ${error?.message || 'ukjent feil'}`
      isPlaying.value = false
    })
}

function stopRadio() {
  const audioElement = audio.value
  if (!audioElement) return
  audioElement.pause()
  audioElement.currentTime = 0
  isPlaying.value = false
}

watch(volume, (newVolume) => {
  if (audio.value) {
    audio.value.volume = newVolume
    if (newVolume === 0) {
      isMuted.value = true
      audio.value.muted = true
    } else if (isMuted.value) {
      isMuted.value = false
      audio.value.muted = false
    }
  }
})

onMounted(() => {
  const audioElement = audio.value
  if (!audioElement) return
  audioElement.src = currentStation.value.url
  audioElement.volume = volume.value
  audioElement.muted = isMuted.value
  audioElement.onerror = () => {
    statusMessage.value = 'Feil ved avspilling. Sjekk om strømmen støttes.'
  }
})
</script>

<template>
  <section class="radio-card card">
    <h2>Radio</h2>
    <div class="station-display">
      <button class="nav-button" type="button" @click="prevStation">◀</button>
      <div class="station-name">{{ currentStation.name }}</div>
      <button class="nav-button" type="button" @click="nextStation">▶</button>
    </div>

    <div class="controls">
      <button type="button" @click="playRadio" class="control-button">Spill</button>
      <button type="button" @click="toggleMute" class="control-button">
        {{ isMuted ? 'Lyd på' : 'Mute' }}
      </button>
      <button type="button" @click="stopRadio" class="control-button stop-button">
        Stopp radio
      </button>
    </div>
    <div class="status-text">{{ isPlaying ? 'Spilles nå' : 'Stoppet' }} – {{ statusMessage }}</div>
    <div class="support-text">Støtte: {{ audioSupport }}</div>

    <div class="volume-row">
      <label for="volume-slider">Volum</label>
      <input id="volume-slider" type="range" min="0" max="1" step="0.01" v-model.number="volume" />
      <span>{{ volumeLabel }}%</span>
    </div>

    <audio ref="audio" preload="none"></audio>
    <div class="station-list">
      <span>Kanaler:</span>
      <ul>
        <li v-for="(station, index) in stations" :key="station.name">
          <button
            type="button"
            :class="{ active: index === currentIndex }"
            @click="loadStation(index)"
          >
            {{ station.name }}
          </button>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.radio-card {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.station-display {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 16px;
  background-color: #242424;
  border-radius: 14px;
}

.station-name {
  flex: 1;
  text-align: center;
  font-size: 1.2rem;
  font-weight: 700;
  color: #f5f5f5;
}

.nav-button,
.control-button {
  background: #5c5c5c;
  color: #fff;
  border: none;
  padding: 10px 14px;
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.nav-button:hover,
.control-button:hover {
  background: #7a7a7a;
}

.stop-button {
  background: #bd2c2c;
}

.stop-button:hover {
  background: #d24444;
}

.controls {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.volume-row {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 12px;
  align-items: center;
}

.volume-row input[type='range'] {
  width: 100%;
}

.station-list {
  font-size: 0.95rem;
  color: #dcdcdc;
}

.station-list ul {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 8px 0 0;
  padding: 0;
  list-style: none;
}

.station-list button {
  background: transparent;
  border: 1px solid #5c5c5c;
  color: #f5f5f5;
  border-radius: 999px;
  padding: 6px 12px;
  cursor: pointer;
}

.station-list button.active {
  background: #4a90e2;
  border-color: #4a90e2;
}
</style>
