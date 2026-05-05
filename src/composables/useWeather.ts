import { computed, ref } from 'vue'

interface WeatherData {
  temperature: number
  condition: string
  humidity: number
  windSpeed: number
  location: string
}

const getWeatherIcon = (condition: string): string => {
  const conditionMap: Record<string, string> = {
    sunny: '☀️',
    cloudy: '☁️',
    rainy: '🌧️',
    snowy: '❄️',
    windy: '💨',
    clear: '🌙',
    overcast: '☁️',
    'partly cloudy': '⛅',
  }
  return conditionMap[condition.toLowerCase()] || '🌡️'
}

const formatTemperature = (temp: number): string => `${Math.round(temp)}°C`

const getWeatherDescription = (condition: string): string => {
  const descriptions: Record<string, string> = {
    sunny: 'Solrikt',
    cloudy: 'Skyet',
    rainy: 'Regnfullt',
    snowy: 'Snøfall',
    windy: 'Blåsig',
    clear: 'Klart',
    overcast: 'Overskyet',
    'partly cloudy': 'Delvis skyet',
  }
  return descriptions[condition.toLowerCase()] || condition
}

const mapWeatherCode = (code: number): string => {
  const weatherMap: Record<number, string> = {
    0: 'clear',
    1: 'sunny',
    2: 'partly cloudy',
    3: 'overcast',
    45: 'cloudy',
    48: 'cloudy',
    51: 'rainy',
    53: 'rainy',
    55: 'rainy',
    61: 'rainy',
    63: 'rainy',
    65: 'rainy',
    71: 'snowy',
    73: 'snowy',
    75: 'snowy',
    77: 'snowy',
    80: 'rainy',
    81: 'rainy',
    82: 'rainy',
    85: 'snowy',
    86: 'snowy',
    95: 'rainy',
    96: 'rainy',
    99: 'rainy',
  }
  return weatherMap[code] || 'cloudy'
}

const fetchWeatherData = async (): Promise<WeatherData> => {
  try {
    const response = await fetch(
      'https://api.open-meteo.com/v1/forecast?latitude=59.9139&longitude=10.7522&current_weather=true&hourly=relativehumidity_2m&timezone=auto',
    )
    const data = await response.json()
    const current = data.current_weather || data.current || {}
    const humidityValues = data.hourly?.relativehumidity_2m || []
    const timeValues = data.hourly?.time || []
    const currentTime = current.time || timeValues[0]
    const humidityIndex = timeValues.indexOf(currentTime)
    const humidity = humidityIndex >= 0 ? humidityValues[humidityIndex] : (humidityValues[0] ?? 0)

    return {
      temperature: current.temperature ?? 18,
      condition: mapWeatherCode(current.weathercode ?? 0),
      humidity,
      windSpeed: current.windspeed ?? 12,
      location: 'Oslo',
    }
  } catch (error) {
    console.error('Failed to fetch weather:', error)
    return {
      temperature: 18,
      condition: 'cloudy',
      humidity: 65,
      windSpeed: 12,
      location: 'Oslo',
    }
  }
}

export const useWeather = () => {
  const weather = ref<WeatherData>({
    temperature: 18,
    condition: 'cloudy',
    humidity: 65,
    windSpeed: 12,
    location: 'Oslo',
  })

  const loading = ref(false)

  const icon = computed(() => getWeatherIcon(weather.value.condition))
  const description = computed(() => getWeatherDescription(weather.value.condition))
  const temperatureDisplay = computed(() => formatTemperature(weather.value.temperature))

  const loadWeather = async () => {
    loading.value = true
    const data = await fetchWeatherData()
    weather.value = data
    loading.value = false
  }

  const refreshWeather = async () => {
    await loadWeather()
  }

  return {
    weather,
    icon,
    description,
    temperatureDisplay,
    refreshWeather,
    loading,
  }
}
