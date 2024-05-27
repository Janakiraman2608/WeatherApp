import { useEffect, useState } from "react";
import axios from "axios";
import {
  OPENWEATHERMAP_API_KEY,
  WEATHERBIT_API_KEY,
  enableMockWeather,
} from "../config";

const Weather = ({ location }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [apiOption, setApiOption] = useState("OPENWEATHERMAP");
  const [unit, setUnit] = useState("C");
  const [theme, setTheme] = useState("");

  useEffect(() => {
    const getWeatherData = async () => {
      if (!enableMockWeather) {
        let apiUrl =
          apiOption === "OPENWEATHERMAP"
            ? `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lng}&appid=${OPENWEATHERMAP_API_KEY}&units=metric`
            : `http://api.weatherbit.io/v2.0/current?lat=${location.lat}&lon=${location.lng}&key=${WEATHERBIT_API_KEY}&units=M`;
        let response = await axios.get(apiUrl);
        const data =
          apiOption === "OPENWEATHERMAP"
            ? response.data
            : response.data.data[0];

        updateTheme(data);
        setWeatherData(data);
      } else {
        // Conditionally import the mock setup in development environment
        import("../mock/weatherService").then(() => {
          console.log("Mock adapter enabled");
          let mockApiUrl =
            apiOption === "OPENWEATHERMAP" ? "openWeatherMap" : "weatherBit";

          axios
            .get(mockApiUrl)
            .then((response) => {
              const data =
                apiOption === "OPENWEATHERMAP"
                  ? response.data.data
                  : response.data.data.data[0];

              updateTheme(data);
              setWeatherData(data);
            })
            .catch((error) => {
              console.error(error);
            });
        });
      }
    };

    getWeatherData();

    // Refresh data for every one hour
    const refreshWeatherData = setInterval(() => {
      getWeatherData();
    }, 1000 * 60 * 60);

    return () => clearInterval(refreshWeatherData);
  }, [location, apiOption]);

  const handleApiToggle = () => {
    setWeatherData(null);
    setApiOption((prevState) => {
      return prevState === "OPENWEATHERMAP" ? "WEATHERBIT" : "OPENWEATHERMAP";
    });
  };

  const handleUnitToggle = () => {
    setUnit((prevState) => {
      return prevState === "C" ? "F" : "C";
    });
  };

  const tempCtoF = (temp) => {
    let tempFahrenheit = (temp * 9) / 5 + 32;
    return tempFahrenheit.toFixed(2);
  };

  const updateTheme = (data) => {
    const tempCelsius =
      apiOption === "OPENWEATHERMAP" ? data.main.temp : data.temp;
    if (unit === "F") {
      const tempFahrenheit = tempCtoF(tempCelsius);
      if (tempFahrenheit > 104) {
        setTheme("hot");
      } else if (tempFahrenheit < 50) {
        setTheme("cold");
      } else {
        setTheme("moderate");
      }
    } else {
      if (tempCelsius > 40) {
        setTheme("hot");
      } else if (tempCelsius < 10) {
        setTheme("cold");
      } else {
        setTheme("moderate");
      }
    }
  };

  const getTemp = () => {
    const temp =
      apiOption === "OPENWEATHERMAP"
        ? unit === "C"
          ? weatherData.main.temp
          : tempCtoF(weatherData.main.temp)
        : unit === "C"
        ? weatherData.temp
        : tempCtoF(weatherData.temp);
    return temp;
  };

  const shareOnTwitter = () => {
    const weatherDescription =
      apiOption === "OPENWEATHERMAP"
        ? weatherData.weather[0].description
        : weatherData.weather.description;

    // To share the weather update in twitter using intent API
    const shareUrl = `https://twitter.com/intent/tweet?text=Current%20weather%20at%20${
      apiOption === "OPENWEATHERMAP" ? weatherData.name : weatherData.city_name
    }%20${getTemp()}%20°${unit}%20-%20${weatherDescription}&hashtags=weather`;

    window.open(shareUrl, "_blank");
  };

  return (
    <div className={`card__weather ${theme}`}>
      {weatherData ? (
        <div>
          <div className="card__weather--buttons">
            <button onClick={handleApiToggle}>
              Switch to{" "}
              {apiOption === "OPENWEATHERMAP" ? "Weatherbit" : "OpenWeatherMap"}
            </button>
            <button onClick={handleUnitToggle}>
              Switch to {unit === "C" ? "Fahrenheit" : "Celsius"}
            </button>
          </div>
          <h2>
            Weather data from{" "}
            {apiOption === "OPENWEATHERMAP" ? "OpenWeatherMap" : "Weatherbit"}
          </h2>
          <p>
            Weather in{" "}
            {apiOption === "OPENWEATHERMAP"
              ? weatherData.name
              : weatherData.city_name}
          </p>
          <p>
            Temperature: {getTemp()} &deg;{unit}
          </p>
          <p>
            Weather:{" "}
            {apiOption === "OPENWEATHERMAP"
              ? weatherData.weather[0].description
              : weatherData.weather.description}
          </p>
          <button onClick={shareOnTwitter}>Share to Twitter</button>
        </div>
      ) : (
        <p>Fetching the weather...</p>
      )}
    </div>
  );
};

export default Weather;
