# Weather API

## Overview

This project is an API backend that provides weather information for various locations. It interacts with a third-party weather API to deliver real-time weather data in a structured format.

## Endpoints

### Main Route
**GET /**  
Returns a message "Hello World" to ensure that the server is running.  
Response format: `{ message: "Hello World!" }`

### City Search
**GET /cities/:city**  
Returns a list of cities matching the searched name  
Parameter: `city` (name of the city)  
Uses the OpenWeatherMap Geocoding API  
Limit: 10 results maximum

### Weather Data
**GET /weather/:city**  
Returns weather forecasts for a specific city  
Parameter: `city` (name of the city)

**GET /weather/:lat/:lon**  
Returns weather forecasts based on coordinates  
Parameters:  
- `lat` (latitude)  
- `lon` (longitude)

### Images
**GET /images/:city**  
Returns images related to the specified city  
Parameter: `city` (name of the city)  
Uses the Unsplash API


**GET /image**  
Returns a random nature image  
Uses the Unsplash API

**Note:** This function is still under development.

## Limitations
- Rate limit: 100 requests per 15 minutes per IP
- CORS enabled only for:
    - `https://weather-app-zeta-inky.vercel.app`
    - `http://localhost:3000`
    - `http://127.0.0.1:3000`
- Allowed methods: GET, POST
