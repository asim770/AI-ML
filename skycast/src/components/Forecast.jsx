import React from 'react';
import { motion } from 'framer-motion';

const Forecast = ({ data, unit }) => {
  if (!data || !data.list) return null;

  const tempUnit = unit === 'metric' ? '°C' : '°F';

  // Filter out one forecast per day (e.g., at 12:00 PM)
  const dailyForecasts = data.list.filter((reading) => 
    reading.dt_txt.includes('12:00:00')
  );

  const getDayName = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-12">
      <h3 className="text-xl font-semibold text-white mb-4 pl-2 drop-shadow-md">
        5-Day Forecast
      </h3>
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="flex gap-4 overflow-x-auto pb-4 px-2 snap-x"
      >
        {dailyForecasts.map((forecast, index) => (
          <motion.div
            key={index}
            variants={item}
            className="glass min-w-[120px] rounded-2xl p-4 flex flex-col items-center text-white snap-center hover:bg-white/30 transition-colors cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="font-medium text-lg">{getDayName(forecast.dt_txt)}</span>
            <span className="text-sm text-white/80 mt-1">
              {new Date(forecast.dt_txt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
            <img 
              src={`https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`} 
              alt={forecast.weather[0].main}
              className="w-16 h-16 my-2 filter drop-shadow-md"
            />
            <div className="flex gap-2 font-semibold">
              <span>{Math.round(forecast.main.temp_max)}&deg;</span>
              <span className="text-white/60">{Math.round(forecast.main.temp_min)}&deg;</span>
            </div>
            <span className="text-xs text-white/80 capitalize mt-2 text-center h-8">
              {forecast.weather[0].description}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Forecast;
