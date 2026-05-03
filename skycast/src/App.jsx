import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CloudRain, Moon, Sun, Cloud, ToggleLeft, ToggleRight } from 'lucide-react';

import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import Forecast from './components/Forecast';
import WeatherChart from './components/WeatherChart';
import Loader from './components/Loader';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState('metric'); // 'metric' for °C, 'imperial' for °F
  const [theme, setTheme] = useState('from-blue-400 to-blue-200'); // default gradient

  const fetchWeather = async (city) => {
    if (!API_KEY || API_KEY === 'your_api_key_here') {
      setError('Please configure your OpenWeatherMap API key in the .env file.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch current weather
      const weatherRes = await axios.get(`${BASE_URL}/weather`, {
        params: {
          q: city,
          units: unit,
          appid: API_KEY,
        },
      });

      // Fetch forecast
      const forecastRes = await axios.get(`${BASE_URL}/forecast`, {
        params: {
          q: city,
          units: unit,
          appid: API_KEY,
        },
      });

      setWeatherData(weatherRes.data);
      setForecastData(forecastRes.data);
      updateTheme(weatherRes.data);
      
      // Save recent search
      localStorage.setItem('recentCity', city);

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch weather data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherByCoords = async (lat, lon) => {
    if (!API_KEY || API_KEY === 'your_api_key_here') {
      setError('Please configure your OpenWeatherMap API key in the .env file.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const weatherRes = await axios.get(`${BASE_URL}/weather`, {
        params: {
          lat,
          lon,
          units: unit,
          appid: API_KEY,
        },
      });

      const forecastRes = await axios.get(`${BASE_URL}/forecast`, {
        params: {
          lat,
          lon,
          units: unit,
          appid: API_KEY,
        },
      });

      setWeatherData(weatherRes.data);
      setForecastData(forecastRes.data);
      updateTheme(weatherRes.data);

    } catch (err) {
      setError('Failed to fetch weather data for your location.');
    } finally {
      setLoading(false);
    }
  };

  const updateTheme = (data) => {
    const isNight = data.weather[0].icon.includes('n');
    const condition = data.weather[0].main.toLowerCase();

    if (isNight) {
      setTheme('from-slate-900 via-purple-900 to-slate-900');
    } else if (condition.includes('rain') || condition.includes('drizzle')) {
      setTheme('from-slate-700 to-slate-500');
    } else if (condition.includes('cloud')) {
      setTheme('from-blue-300 to-gray-400');
    } else if (condition.includes('clear')) {
      setTheme('from-cyan-400 to-blue-200');
    } else if (condition.includes('snow')) {
      setTheme('from-blue-100 to-white');
    } else {
      setTheme('from-blue-400 to-blue-200'); // default
    }
  };

  const toggleUnit = () => {
    const newUnit = unit === 'metric' ? 'imperial' : 'metric';
    setUnit(newUnit);
    if (weatherData) {
      fetchWeather(weatherData.name);
    }
  };

  const handleGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
        },
        () => {
          setError('Unable to retrieve your location. Falling back to default city.');
          fetchWeather('Delhi');
        }
      );
    } else {
      fetchWeather('Delhi');
    }
  };

  useEffect(() => {
    const recentCity = localStorage.getItem('recentCity');
    if (recentCity) {
      fetchWeather(recentCity);
    } else {
      fetchWeather('Delhi');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Effect to re-fetch if unit changes and we already have data
  useEffect(() => {
    if (weatherData) {
      fetchWeather(weatherData.name);
    }
  }, [unit]);

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme} transition-colors duration-1000 p-4 md:p-8 flex flex-col font-sans`}>
      <header className="max-w-6xl w-full mx-auto flex justify-between items-center mb-8">
        <div className="flex items-center gap-2 text-white">
          <CloudRain size={32} />
          <h1 className="text-3xl font-bold tracking-tight">SkyCast</h1>
        </div>
        
        <div className="flex items-center gap-4 text-white">
          <button 
            onClick={handleGeolocation}
            className="hover:bg-white/20 p-2 rounded-full transition-colors hidden sm:block"
            title="Use my location"
          >
            <span className="text-sm font-medium px-2 py-1 glass rounded-full">📍 Auto Detect</span>
          </button>
          
          <button 
            onClick={toggleUnit}
            className="flex items-center gap-2 hover:bg-white/20 p-2 rounded-full transition-colors"
            title="Toggle °C / °F"
          >
            <span className="font-semibold">{unit === 'metric' ? '°C' : '°F'}</span>
            {unit === 'metric' ? <ToggleLeft size={24} /> : <ToggleRight size={24} />}
          </button>
        </div>
      </header>

      <main className="flex-1 w-full max-w-6xl mx-auto">
        <SearchBar onSearch={fetchWeather} />

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-white p-4 rounded-xl max-w-md mx-auto mb-8 text-center backdrop-blur-md">
            {error}
          </div>
        )}

        {loading ? (
          <Loader />
        ) : (
          <div className="flex flex-col items-center justify-center">
            <WeatherCard data={weatherData} unit={unit} />
            <Forecast data={forecastData} unit={unit} />
            <WeatherChart data={forecastData} unit={unit} />
          </div>
        )}
      </main>
      
      <footer className="text-center text-white/60 mt-8 pb-4">
        <p>&copy; {new Date().getFullYear()} SkyCast Weather App. Built with React & Tailwind.</p>
      </footer>
    </div>
  );
}

export default App;
