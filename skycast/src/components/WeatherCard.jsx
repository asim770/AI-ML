import React from 'react';
import { motion } from 'framer-motion';
import { Droplets, Wind, Gauge, MapPin } from 'lucide-react';

const WeatherCard = ({ data, unit }) => {
  if (!data) return null;

  const temp = Math.round(data.main.temp);
  const feelsLike = Math.round(data.main.feels_like);
  const tempUnit = unit === 'metric' ? '°C' : '°F';
  const speedUnit = unit === 'metric' ? 'm/s' : 'mph';

  // OpenWeatherMap icon URL
  const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="glass rounded-3xl p-8 w-full max-w-md mx-auto text-white"
    >
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <MapPin size={24} />
            {data.name}, {data.sys.country}
          </h2>
          <p className="text-white/80 capitalize mt-1 text-lg">
            {data.weather[0].description}
          </p>
        </div>
        <motion.div 
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        >
          <img 
            src={iconUrl} 
            alt={data.weather[0].description} 
            className="w-24 h-24 drop-shadow-lg filter -mt-4 -mr-4"
          />
        </motion.div>
      </div>

      <div className="mt-8 mb-10 flex flex-col items-center">
        <h1 className="text-7xl font-extrabold tracking-tighter drop-shadow-md">
          {temp}{tempUnit}
        </h1>
        <p className="text-white/80 mt-2 text-lg">
          Feels like {feelsLike}{tempUnit}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 border-t border-white/20 pt-6">
        <div className="flex flex-col items-center">
          <Droplets size={24} className="mb-2 text-blue-200" />
          <span className="text-white/80 text-sm">Humidity</span>
          <span className="font-semibold text-lg">{data.main.humidity}%</span>
        </div>
        <div className="flex flex-col items-center">
          <Wind size={24} className="mb-2 text-gray-200" />
          <span className="text-white/80 text-sm">Wind</span>
          <span className="font-semibold text-lg">{data.wind.speed} {speedUnit}</span>
        </div>
        <div className="flex flex-col items-center">
          <Gauge size={24} className="mb-2 text-red-200" />
          <span className="text-white/80 text-sm">Pressure</span>
          <span className="font-semibold text-lg">{data.main.pressure} hPa</span>
        </div>
      </div>
    </motion.div>
  );
};

export default WeatherCard;
