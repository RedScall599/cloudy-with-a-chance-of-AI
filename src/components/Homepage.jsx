import React, { useState, useEffect } from 'react'
import SearchBar from '../hooks/SearchBar'
import WeatherCard from '../hooks/WeatherCard'
import ForecastGrid from '../hooks/ForecastGrid'
import { processSearchInput } from '../utils/citySearch'

export default function Homepage() {
  const [currentWeather, setCurrentWeather] = useState(null)
  const [forecast, setForecast] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [stateConversionMessage, setStateConversionMessage] = useState('')
  const [timeOfDay, setTimeOfDay] = useState('')
  const [testTime, setTestTime] = useState(null)

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY

  function getTimeOfDay() {
    const hour = testTime !== null ? testTime : new Date().getHours()
    if (hour >= 6 && hour < 12) return 'morning'
    if (hour >= 12 && hour < 17) return 'afternoon'
    if (hour >= 17 && hour < 20) return 'evening'
    return 'night'
  }

  function cycleTimeOfDay() {
    const times = [8, 14, 18, 22]
    const current = testTime !== null ? testTime : new Date().getHours()
    const currentIndex = times.findIndex(time => time === current)
    const nextIndex = (currentIndex + 1) % times.length
    setTestTime(times[nextIndex])
  }

  useEffect(() => {
    setTimeOfDay(getTimeOfDay())
  }, [testTime])

  async function fetchWeather(searchInput) {
    try {
      setError('')
      setLoading(true)
      setStateConversionMessage('')

      if (!API_KEY) {
        setError('Weather API key not found. Please check your environment variables.')
        setLoading(false)
        return
      }

      const cityToSearch =
        searchInput === 'auto:ip' ? searchInput : processSearchInput(searchInput)

      if (cityToSearch !== searchInput && searchInput !== 'auto:ip') {
        setStateConversionMessage(
          `Found state "${searchInput}" - showing weather for ${cityToSearch}`
        )
      }

      const res = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${cityToSearch}&days=7&aqi=no&alerts=no`
      )
      const data = await res.json()

      if (data.error) {
        setError('City not found')
        setCurrentWeather(null)
        setForecast([])
        setStateConversionMessage('')
        return
      }

      setCurrentWeather({
        location: `${data.location.name}, ${data.location.region}`,
        temp: data.current.temp_f,
        condition: data.current.condition.text,
        humidity: data.current.humidity,
        windSpeed: data.current.wind_mph,
        pressure: data.current.pressure_mb,
        uvIndex: data.current.uv,
        icon: `https:${data.current.condition.icon}`
      })

      setForecast(
        data.forecast.forecastday.map(day => ({
          day: new Date(day.date).toLocaleDateString('en-US', { weekday: 'long' }),
          temp: day.day.avgtemp_f,
          condition: day.day.condition.text,
          icon: `https:${day.day.condition.icon}`
        }))
      )
    } catch (err) {
      console.error(err)
      setError('Failed to fetch weather data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWeather('auto:ip')
  }, [])

  return (
    <div className={`homepage-container ${timeOfDay}`}>
      <header className="homepage-header">
        <div className="homepage-logo">⛅ Cloudy with AI</div>
        <div className="homepage-nav">
          <button className="nav-btn" onClick={cycleTimeOfDay}>
            {timeOfDay === 'morning' && '☀️ Morning'}
            {timeOfDay === 'afternoon' && '🌤️ Afternoon'}
            {timeOfDay === 'evening' && '🌅 Evening'}
            {timeOfDay === 'night' && '🌙 Night'}
          </button>
        </div>
      </header>

      <main className="homepage-main">
        <div className="main-content">
          <SearchBar onSearch={fetchWeather} />

          {loading && <p className="status-message loading">Loading your local weather...</p>}
          {error && <p className="status-message error">{error}</p>}
          {stateConversionMessage && (
            <p className="status-message info">{stateConversionMessage}</p>
          )}

          <WeatherCard weather={currentWeather} />

          <div className="forecast-section">
            <ForecastGrid forecast={forecast} />
          </div>
        </div>

        {/* ✅ FIXED this section’s bracket nesting */}
        {currentWeather && (
          <div className="sidebar-content">
            <div className="info-card">
              <h3 className="info-card-title">Weather Details</h3>
              <div className="info-card-content">
                <p>
                  Today's conditions in {currentWeather.location.split(',')[0]} are{' '}
                  {currentWeather.condition.toLowerCase()}. The current temperature feels comfortable
                  at {currentWeather.temp}°F.
                </p>
              </div>
            </div>

            <div className="info-card">
              <h3 className="info-card-title">Air Quality</h3>
              <div className="info-card-content">
                <p>
                  UV Index: {currentWeather.uvIndex}/10
                  <br />
                  Humidity: {currentWeather.humidity}%
                  <br />
                  Pressure: {(currentWeather.pressure * 0.02953).toFixed(2)} inHg
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
