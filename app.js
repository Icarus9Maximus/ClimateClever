import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import moment from "moment-timezone";
import dotenv from "dotenv";

dotenv.config();

const app = express(); 
const port = process.env.PORT || 4000;
const API_URL = "https://api.openweathermap.org";


// Set up ejs as the template engine
app.set("view engine", "ejs");
// Serve static files like images, styles, etc, from the "public" directory
app.use(express.static("public"));
// Parse URL encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Have to move this API KEY into a .env file or another js file, also make sure that it isn't one of the files I put on vc.
const apiKey = process.env.API_KEY; // OpenWeather API key
const TIMEZONE_API_KEY = process.env.TIMEZONE_API_KEY; // TimezoneDB API key

// Route for the home page, renders a simple message at first
app.get("/", (req, res) => {
    res.render("weather.ejs", {
        content: "Wait a minute dawg",
        city: null,
        error: null
    })
});

// Route to handle the form submissions and to fetch the weather data from the API
app.post("/post-weather", async (req, res) => {
    const location = req.body.location; // retrieval of what the user inserts in the input field
    let currentYear = new Date().getFullYear(); // This retrieves the value for the current year
    
    // A try catch block is utilized instead of a promise
    try {
        // Fetch weather data from the OpenWeather API for the specified location
        const result = await axios.get(`${API_URL}/data/2.5/weather?q=${location}&appid=${apiKey}`); 
        
        // retrieve the temperature values from the API response and convert them from Kelvin to Celsius
            const tempKelvin = result.data.main.temp;
            const tempFeelKelvin = result.data.main.feels_like;
            const minTempKelvin = result.data.main.temp_min;
            const maxTempKelvin = result.data.main.temp_max;
            const tempCelsius = Math.floor(tempKelvin - 273.15);
            const tempFeelCelsius = Math.floor(tempFeelKelvin - 273.15);
            const minTempCelsius = Math.floor(minTempKelvin - 273.15);
            const maxTempCelsius = Math.floor(maxTempKelvin - 273.15);

            const windDegree = result.data.wind.deg; // Extract wind wind direction in degrees
            let timestamp = result.data.dt; // Get the timestamp of the data
            let date = new Date(timestamp * 1000); // Convert the timestamp to a JavaScript Date object

            // Retrieve the values for both the sunrise and the sunset in Unix time
            let sunriseTime = result.data.sys.sunrise;
            let sunsetTime = result.data.sys.sunset;
            
    // This function's purpose is to specify which direction the wind is travelling
            function getCompassDirection(windDegree) {
                const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW", "N"];
                const index = Math.round(windDegree / 22.5); // This number comes from diving 360 degress by the 16 geographical directions within the directions array
                
                return directions[index];
            }
    
            let windCompassDirection = getCompassDirection(windDegree); // Convert wind degree to compass direction
    
        // This displays the date in the manner in which I want it to be displayed
            let options = {
                weekday: "long",
                year: "numeric",
                month: "2-digit",
                day: "2-digit"
            }

            let formattedDate = date.toLocaleDateString("en-US", options); // Format the date

        // These two values are also retrieved from the weather API, gets the latitude and longitude
            const lat = result.data.coord.lat;
            const lon = result.data.coord.lon;

        // Fetch the timezone for the location using TimezoneDB API
            const timeZoneResponse = await axios.get(`https://api.timezonedb.com/v2.1/get-time-zone?key=${TIMEZONE_API_KEY}&format=json&by=position&lat=${lat}&lng=${lon}`);
            const timeZone = timeZoneResponse.data.zoneName; // This retrieves the timezone name
            // Convert the sunrise and sunset times to local time in the specified timezone
            const sunriseLocal = moment.unix(sunriseTime).tz(timeZone).format(`HH:mm`);
            const sunsetLocal = moment.unix(sunsetTime).tz(timeZone).format(`HH:mm`);
                
            // Render the weather.ejs template with the retrieved weather data 
            res.render("weather", {
                content: JSON.stringify(result.data),
                weather: result.data.weather[0].main,
                city: result.data.name,
                country: result.data.sys.country,
                condition: result.data.weather[0].description,
                temp: tempCelsius,
                minTemp: minTempCelsius,
                maxTemp: maxTempCelsius,
                feelTemp: tempFeelCelsius,
                letsatsi: formattedDate,
                windSpeed: result.data.wind.speed,
                sunrise: sunriseLocal,
                sunset: sunsetLocal,
                visibility: result.data.visibility / 1000, // Convert visibility to kilometres
                cloudCoverage: result.data.clouds.all,
                windDirection: windCompassDirection,
                humidity: result.data.main.humidity,
                pressure: result.data.main.pressure,
                year: currentYear
            });

    } catch (error) {
        // If an error occurs, renders the page with an error message
        res.render("weather", {
            content: null,
            city: null,
            error: "Sorry, the city you entered is not valid"
        })
    }
})

// Start the server and listen on the specified port
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});