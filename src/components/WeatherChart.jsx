import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { motion } from 'framer-motion';

const WeatherChart = ({ data, unit }) => {
  if (!data || !data.list) return null;

  // Prepare data for the chart
  const chartData = data.list.map((item) => {
    const date = new Date(item.dt_txt);
    return {
      time: date.toLocaleDateString('en-US', { weekday: 'short', hour: 'numeric' }),
      temp: Math.round(item.main.temp),
    };
  });

  const tempUnit = unit === 'metric' ? '°C' : '°F';

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/20 backdrop-blur-md border border-white/30 p-3 rounded-lg text-white shadow-lg">
          <p className="font-semibold">{label}</p>
          <p className="text-lg">{`Temp: ${payload[0].value}${tempUnit}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass rounded-3xl p-6 w-full max-w-4xl mx-auto mt-8 mb-8"
    >
      <h3 className="text-xl font-semibold text-white mb-6 drop-shadow-md px-2">
        Temperature Trend
      </h3>
      <div className="h-64 w-full text-white">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" vertical={false} />
            <XAxis 
              dataKey="time" 
              stroke="rgba(255,255,255,0.7)" 
              tick={{ fill: 'rgba(255,255,255,0.8)', fontSize: 12 }}
              tickMargin={10}
              minTickGap={30}
            />
            <YAxis 
              stroke="rgba(255,255,255,0.7)" 
              tick={{ fill: 'rgba(255,255,255,0.8)', fontSize: 12 }}
              domain={['dataMin - 2', 'dataMax + 2']}
              tickFormatter={(value) => `${value}°`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="temp" 
              stroke="#ffffff" 
              strokeWidth={3}
              dot={{ r: 4, fill: '#ffffff', strokeWidth: 0 }}
              activeDot={{ r: 6, fill: '#3b82f6', stroke: '#ffffff', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default WeatherChart;
