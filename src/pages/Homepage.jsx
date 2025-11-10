

import React, { useState, useEffect } from 'react'
import SearchBar from '../components/SearchBar'
import WeatherCard from '../components/WeatherCard'
import ForecastGrid from '../components/ForecastGrid'
import { processSearchInput } from '../utils/citySearch'

export default function Homepage() {
  const [currentWeather, setCurrentWeather] = useState(null)
  const [forecast, setForecast] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [stateConversionMessage, setStateConversionMessage] = useState('')
  // Initialize immediately so the badge shows without a flash
  const [timeOfDay, setTimeOfDay] = useState(() => getTimeOfDay())

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY

  function getTimeOfDay() {
    const now = new Date()
    const hour = now.getHours()
    if (hour >= 6 && hour < 12) return 'morning'
    if (hour >= 12 && hour < 17) return 'afternoon'
    if (hour >= 17 && hour < 20) return 'evening'
    return 'night'
  }

  // No manual override function needed; theme updates automatically based on clock

  async function fetchWeather(searchInput) {
    try {
      // Reset error state and set loading to true
      setError('')
      setLoading(true)
      setStateConversionMessage('')

      // Check if API key exists
      if (!API_KEY) {
        setError('Weather API key not found. Please check your environment variables.')
        setLoading(false)
        return
      }

let cityToSearch = searchInput
      let searchResult = null

      if (searchInput !== 'auto:ip') {
        searchResult = processSearchInput(searchInput)
        cityToSearch = searchResult.city
      }

      if (searchResult && searchResult.type === 'state') {
        setStateConversionMessage(
          `Found state "${searchResult.original}" - showing weather for ${cityToSearch}`
        )
      }



      const res = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${cityToSearch}&days=7&aqi=no&alerts=no`
      )
      const data = await res.json()

      // Handle API-specific errors (city not found, etc.)
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
      // Always set loading to false, whether success or error
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWeather('auto:ip')
  }, [])

  useEffect(() => {
    // Align updates to every minute to avoid unnecessary re-renders
    const interval = setInterval(() => {
      setTimeOfDay(getTimeOfDay())
    }, 60000) // check every 60s

    // Also do an immediate check on mount in case the minute just rolled over
    setTimeOfDay(getTimeOfDay())

    return () => clearInterval(interval)
  }, [])

  return (
    <div className={`homepage-container ${timeOfDay}`}>
      <header className="homepage-header">
        <div className="homepage-logo">⛅ Cloudy with AI</div>
        <div className="homepage-nav">
          <div 
            className="time-display"
          >
            {timeOfDay === 'morning' && '☀️ Morning'}
            {timeOfDay === 'afternoon' && '🌤️ Afternoon'}
            {timeOfDay === 'evening' && '🌅 Evening'}
            {timeOfDay === 'night' && '🌙 Night'}
          </div>
        </div>
      </header>

      <main className="homepage-main">
        <div className="main-content">
          {/* 
            CONCEPT: Passing Props - Passing the fetchWeather function to SearchBar component
            This allows the child component to trigger data fetching in the parent
          */}
          <SearchBar onSearch={fetchWeather} />

          {/* Conditional rendering based on state - shows different UI based on loading/error states */}
          {loading && <p className="status-message loading">Loading your local weather...</p>}
          {error && <p className="status-message error">{error}</p>}
          {stateConversionMessage && <p className="status-message info">{stateConversionMessage}</p>}

          {/* 
            CONCEPT: Passing Props - Passing state data down to child components
            WeatherCard receives current weather data, ForecastGrid receives forecast array
            This demonstrates how data flows down the component tree through props
          */}
          <WeatherCard weather={currentWeather} />
          <div className="forecast-section">
            <ForecastGrid forecast={forecast} />
          </div>
        </div>

        {/* Sidebar with additional weather details */}
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