from dotenv import load_dotenv
import os
import requests 
load_dotenv()

api_key = os.getenv("API_KEY")


city = "Kolkata"

url = f"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={api_key}&units=metric"

response = requests.get(url)
data = response.json()

if response.status_code == 200:
    temperature = data["main"]["temp"]
    humidity = data["main"]["humidity"]
    pressure = data["main"]["pressure"]
    wind_speed = data["wind"]["speed"]
    weather_desc = data["weather"][0]["description"]

    print(f"City: {city}")
    print(f"Temperature: {temperature} °C")
    print(f"Humidity: {humidity} %")
    print(f"Pressure: {pressure} hPa")
    print(f"Wind Speed: {wind_speed} m/s")
    print(f"Condition: {weather_desc}")

else:
    print("Error:", data)