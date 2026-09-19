import { useState, useEffect, useCallback } from 'react'
import { useDashboardStore } from '../../store/dashboardStore'
import type { WeatherData } from '../../types'
import { Cloud, Sun, CloudRain, CloudSnow, Wind, Droplets } from 'lucide-react'

const MOCK_WEATHER: WeatherData = {
  temperature: 22,
  condition: 'Partly Cloudy',
  humidity: 65,
  windSpeed: 12,
  location: 'San Francisco, CA',
  icon: 'partly-cloudy',
}

const WEATHER_ICONS: Record<string, React.ReactNode> = {
  'clear': <Sun className="w-12 h-12 text-yellow-500" />,
  'sunny': <Sun className="w-12 h-12 text-yellow-500" />,
  'partly-cloudy': <Cloud className="w-12 h-12 text-gray-400" />,
  'cloudy': <Cloud className="w-12 h-12 text-gray-400" />,
  'rain': <CloudRain className="w-12 h-12 text-blue-400" />,
  'snow': <CloudSnow className="w-12 h-12 text-blue-200" />,
}

const API_KEY = 'demo_key'
const API_URL = 'https://api.openweathermap.org/data/2.5/weather'
const DEFAULT_LOCATION = 'San Francisco'

export function WeatherWidget() {
  const { weather, setWeather } = useDashboardStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [location, setLocation] = useState(DEFAULT_LOCATION)

  const fetchWeather = useCallback(async (city: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(
        `${API_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
      )
      
      if (!response.ok) {
        throw new Error('Failed to fetch weather data')
      }
      
      const data = await response.json()
      
      const weatherData: WeatherData = {
        temperature: Math.round(data.main.temp),
        condition: data.weather[0].main,
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind.speed * 3.6),
        location: `${data.name}, ${data.sys.country}`,
        icon: data.weather[0].main.toLowerCase(),
      }
      
      setWeather(weatherData)
    } catch (err) {
      console.error('Failed to fetch weather:', err)
      setError('Unable to fetch weather. Using mock data.')
      setWeather(MOCK_WEATHER)
    } finally {
      setLoading(false)
    }
  }, [setWeather])

  useEffect(() => {
    if (!weather) {
      fetchWeather(DEFAULT_LOCATION)
    }
  }, [weather, fetchWeather])

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    fetchWeather(location)
  }

  const displayWeather = weather || MOCK_WEATHER

  return (
    <div className="widget-card p-6 h-full flex flex-col">
      <h2 className="text-lg font-semibold mb-4">Weather</h2>
      
      <form onSubmit={handleSearch} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter city name"
            className="input-field text-sm"
            aria-label="City name"
          />
          <button 
            type="submit" 
            className="btn-primary text-sm"
            disabled={loading}
            aria-label="Search weather"
          >
            {loading ? '...' : 'Search'}
          </button>
        </div>
      </form>

      {error && (
        <p className="text-xs text-yellow-600 dark:text-yellow-400 mb-2">
          {error}
        </p>
      )}

      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="mb-2">
          {WEATHER_ICONS[displayWeather.icon] || <Cloud className="w-12 h-12 text-gray-400" />}
        </div>
        
        <div className="text-4xl font-bold mb-1">
          {displayWeather.temperature}°C
        </div>
        
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          {displayWeather.condition}
        </p>
        
        <p className="text-xs text-gray-400">
          {displayWeather.location}
        </p>

        <div className="flex gap-6 mt-4 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <Droplets className="w-4 h-4" />
            <span>{displayWeather.humidity}%</span>
          </div>
          <div className="flex items-center gap-1">
            <Wind className="w-4 h-4" />
            <span>{displayWeather.windSpeed} km/h</span>
          </div>
        </div>
      </div>
    </div>
  )
}
