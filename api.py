from dotenv import load_dotenv
import os
import requests 
import matplotlib.pyplot as plt
from datetime import datetime

load_dotenv()

api_key = os.getenv("API_KEY")
city = "Kolkata"

# 1. Fetch current weather
url_weather = f"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={api_key}&units=metric"
response_weather = requests.get(url_weather)
weather_data = response_weather.json()

if response_weather.status_code == 200:
    print(f"--- Current Weather in {city} ---")
    print(f"Temperature: {weather_data['main']['temp']} °C")
    print(f"Humidity: {weather_data['main']['humidity']} %")
    print(f"Condition: {weather_data['weather'][0]['description']}\n")
else:
    print("Failed to fetch current weather.")

# 2. Fetch 5-day forecast
url_forecast = f"https://api.openweathermap.org/data/2.5/forecast?q={city}&appid={api_key}&units=metric"
response_forecast = requests.get(url_forecast)
forecast_data = response_forecast.json()

if response_forecast.status_code == 200:
    dates = []
    temps = []
    
    # The forecast API returns data every 3 hours. 
    # We will extract all data points to plot the trend.
    for item in forecast_data["list"]:
        # Parse datetime string into a datetime object for better formatting on the x-axis
        dt = datetime.strptime(item["dt_txt"], "%Y-%m-%d %H:%M:%S")
        dates.append(dt)
        temps.append(item["main"]["temp"])

    # 3. Plot the data
    plt.figure(figsize=(12, 6))
    plt.plot(dates, temps, marker='o', linestyle='-', color='b', linewidth=2, markersize=4)
    
    plt.title(f"5-Day Temperature Forecast for {city}", fontsize=16)
    plt.xlabel("Date and Time", fontsize=12)
    plt.ylabel("Temperature (°C)", fontsize=12)
    
    plt.grid(True, linestyle='--', alpha=0.7)
    plt.xticks(rotation=45)
    plt.tight_layout()
    
    # Save the plot to an image file
    output_img = "forecast_plot.png"
    plt.savefig(output_img)
    print(f"Successfully generated the forecast graph: {output_img}")
    
    # plt.show() # Uncomment this line to display the interactive graph window
else:
    print("Failed to fetch 5-day forecast data.")