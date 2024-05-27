# Weather Portal

A weather portal developed in React.js that provides location-based weather information using OpenWeatherMap and Weatherbit APIs. It also allows users to share weather updates on Twitter.

## Description

This application determines the user's location, displays the weather information for that location, and provides the ability to switch between different weather data sources and units of measurement. It also includes a feature to share weather updates on Twitter.

## Installation

1. Clone the repository:
    git clone https://github.com/your-username/weather-portal.git
    cd weather-portal

2. Install dependencies:
    npm install

3. Obtain API keys for OpenWeatherMap, Weatherbit, and Google Maps.

4. Create a .env file in the root directory and add your API keys:
    OPENWEATHERMAP_API_KEY=your_openweathermap_api_key
    WEATHERBIT_API_KEY=your_weatherbit_api_key
    GOOGLE_MAPS_API_KEY=your_google_maps_api_key

5. Start the dev server:
    npm run dev

6. To generate production build:
    npm run build

7. To run test suite:
    npm test