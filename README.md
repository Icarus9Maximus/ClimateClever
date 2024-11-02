# ClimateClever

**ClimateClever** is a modern weather application that provides users with accurate and up-to-date weather information based on their location. The application leverages the OpenWeather API and TimezoneDB to deliver comprehensive weather data, including local time for sunrise and sunset.

## Features

- **Real-time Weather Data**: Get current weather conditions for any city.
- **Temperature Conversion**: Automatically converts temperatures from Kelvin to Celsius.
- **Wind Direction**: Displays wind direction in compass format.
- **Local Timezone Support**: Sunrise and sunset times are shown in the local timezone.
- **Error Handling**: Displays user-friendly error messages for invalid city inputs.

## Technologies Used

- **Express.js**: Backend framework for handling HTTP requests and serving EJS templates.
- **EJS**: Templating engine for rendering dynamic content.
- **Axios**: Promise-based HTTP client for making API requests.
- **Moment-Timezone**: Library for handling and formatting dates and times in different timezones.
- **dotenv**: Loads environment variables from a `.env` file into `process.env`.
- **OpenWeather API**: Provides weather data based on the user's location.
- **TimezoneDB**: Converts UTC time to local time using the city's latitude and longitude.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/climateclever.git
   ```
