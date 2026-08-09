import { useEffect, useState } from "react";
import Navbar from "./navbar";
import "./dashboard.css";

import { getMoonPhase } from "../utils/moonPhase";

import {
  FiThermometer,
  FiDroplet,
  FiWind,
  FiCalendar,
  FiClock,
  FiBell,
  FiEye,
} from "react-icons/fi";

function Dashboard() {

  // =========================================================
  // WEATHER
  // =========================================================

  const [weather, setWeather] = useState(() => {
    try {
      const saved = localStorage.getItem("weather");
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error("Failed to load weather:", error);
      return null;
    }
  });


  // =========================================================
  // FORECAST
  // =========================================================

  const [forecast, setForecast] = useState([]);


  // =========================================================
  // CLOCK
  // =========================================================

  const [currentTime, setCurrentTime] = useState(new Date());


  useEffect(() => {

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);

  }, []);


  // =========================================================
  // GET FORECAST
  // =========================================================

  const getForecast = async (weatherData) => {

    try {

      const lat =
        weatherData?.coord?.lat ||
        localStorage.getItem("lat");

      const lon =
        weatherData?.coord?.lon ||
        localStorage.getItem("lon");


      if (!lat || !lon) {
        console.warn("Latitude/Longitude not available.");
        return;
      }


      // Save coordinates for Forecast page too
      localStorage.setItem("lat", lat);
      localStorage.setItem("lon", lon);

const response = await fetch(
  `https://aetherix-backend-eoj8.onrender.com/api/forecast?lat=${lat}&lon=${lon}`
);
     

      const data = await response.json();


      if (!response.ok) {

        console.error(
          "Forecast fetch failed:",
          data
        );

        return;
      }


      setForecast(data.list || []);

    } catch (error) {

      console.error(
        "Forecast error:",
        error
      );

    }

  };


  // =========================================================
  // INITIAL FORECAST
  // =========================================================

  useEffect(() => {

    if (weather) {
      getForecast(weather);
    }

  }, []);
 
  // =========================================================
// AUTOMATIC WEATHER UPDATE EVERY 1 MINUTE
// =========================================================

useEffect(() => {
  if (!weather) {
    return;
  }

  const updateWeather = async () => {
    try {
      // Prefer coordinates from current weather data
      // This is important for Live Location.
      const lat =
        weather?.coord?.lat ||
        localStorage.getItem("lat");

      const lon =
        weather?.coord?.lon ||
        localStorage.getItem("lon");

      if (!lat || !lon) {
        console.warn("Latitude/Longitude not available.");
        return;
      }

      console.log(
        `Updating weather for coordinates: ${lat}, ${lon}...`
      );

      const response = await fetch(
        `https://aetherix-backend-eoj8.onrender.com/api/weather?lat=${lat}&lon=${lon}`
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(
          "Weather update failed:",
          data
        );
        return;
      }

      // Update screen
      setWeather(data);

      // Save latest weather
      localStorage.setItem(
        "weather",
        JSON.stringify(data)
      );

      // Keep coordinates saved
      if (data?.coord?.lat) {
        localStorage.setItem(
          "lat",
          String(data.coord.lat)
        );
      }

      if (data?.coord?.lon) {
        localStorage.setItem(
          "lon",
          String(data.coord.lon)
        );
      }

      // Update forecast too
      getForecast(data);

      console.log(
        "Weather updated successfully"
      );

    } catch (error) {
      console.error(
        "Automatic weather update failed:",
        error
      );
    }
  };

  // Update every 1 minute
  const interval = setInterval(
    updateWeather,
    60000
  );

  return () => {
    clearInterval(interval);
  };

}, [weather?.coord?.lat, weather?.coord?.lon]);

  // =========================================================
  // NO WEATHER
  // =========================================================

  if (!weather) {

    return (

      <div className="dashboard-page">

        <Navbar
          weather={weather}
          setWeather={setWeather}
        />

        <div className="no-weather">

          <h1>
            No Weather Data
          </h1>

          <p>
            Search a city 
            to access the AI Weather Dashboard
          </p>

        </div>

      </div>

    );

  }


  // =========================================================
  // WEATHER DATA
  // =========================================================

  const city =
    weather.city ||
    weather.location?.city ||
    weather.location?.name ||
    weather.name ||
    "Unknown";


  const temperature =
    weather.main?.temp ?? "--";


  const feelsLike =
    weather.main?.feels_like ?? "--";


  const humidity =
    weather.main?.humidity ?? "--";


  const windSpeed =
    weather.wind?.speed ?? "--";


  const condition =
    weather.weather?.[0]?.main ||
    "Unknown";


  const description =
    weather.weather?.[0]?.description ||
    "";


  const visibility =
    weather.visibility != null
      ? (weather.visibility / 1000).toFixed(1)
      : "--";


  const pressure =
    weather.main?.pressure ?? "--";


  // =========================================================
  // SUNRISE / SUNSET
  // IMPORTANT: OpenWeather stores these in weather.sys
  // =========================================================

  const formatTime = (timestamp) => {

    if (!timestamp) {
      return "--:--";
    }

    return new Date(
      timestamp * 1000
    ).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  };


  const sunrise =
    formatTime(
      weather.sys?.sunrise
    );


  const sunset =
    formatTime(
      weather.sys?.sunset
    );


  // =========================================================
  // MOON PHASE
  // =========================================================

  let moonPhase = "--";

  try {

    moonPhase = getMoonPhase();

  } catch (error) {

    console.warn(
      "Moon phase unavailable"
    );

  }


  // =========================================================
  // WEATHER VISUAL
  // =========================================================

  const conditionLower =
    String(condition).toLowerCase();


  let weatherVisual = "☁️";


  if (
    conditionLower.includes("rain") ||
    conditionLower.includes("drizzle")
  ) {

    weatherVisual = "🌧️";

  } else if (
    conditionLower.includes("clear")
  ) {

    weatherVisual = "☀️";

  } else if (
    conditionLower.includes("snow")
  ) {

    weatherVisual = "❄️";

  } else if (
    conditionLower.includes("storm") ||
    conditionLower.includes("thunder")
  ) {

    weatherVisual = "⛈️";

  } else if (
    conditionLower.includes("cloud")
  ) {

    weatherVisual = "☁️";

  } else if (
    conditionLower.includes("mist") ||
    conditionLower.includes("fog") ||
    conditionLower.includes("haze")
  ) {

    weatherVisual = "🌫️";

  }


  // =========================================================
  // DATE / TIME
  // =========================================================

  const formattedDate =
    currentTime.toLocaleDateString(
      "en-IN",
      {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );


  const formattedTime =
    currentTime.toLocaleTimeString(
      "en-IN",
      {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }
    );


  // =========================================================
  // FORECAST DAYS
  // =========================================================

  const forecastDays = forecast
    .filter((item) =>
      item.dt_txt?.includes("12:00:00")
    )
    .slice(0, 5);


  // If 12 PM entries are unavailable,
  // use first 5 forecast entries.

  const displayForecast =
    forecastDays.length > 0
      ? forecastDays
      : forecast.slice(0, 5);


  // =========================================================
  // RETURN
  // =========================================================

  return (

    <div className="dashboard-page">

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <Navbar
        weather={weather}
        setWeather={setWeather}
      />


      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="dashboard-container">


        {/* ===================================================
            TOP SECTION
        =================================================== */}

        <section className="dashboard-top">


          {/* LEFT */}

          <div className="dashboard-intro">

            <div className="dashboard-badge">
              AI Powered Weather Dashboard
            </div>


            <h1>
              {city}, IN
            </h1>


            <div className="date-time">

              <div className="date-row">

                <FiCalendar />

                <span>
                  {formattedDate}
                </span>

              </div>


              <div className="date-row">

                <FiClock />

                <span>
                  {formattedTime}
                </span>

              </div>

            </div>

          </div>


          {/* WEATHER VISUAL */}

          <div className="weather-visual-card">

            <div className="weather-visual">

              <div className="weather-icon-large">
                {weatherVisual}
              </div>


              <div className="weather-condition">

                <h2>
                  {description || condition}
                </h2>

              </div>


              <div className="weather-intelligence">

                <span>
                  AI Powered
                </span>

                <span>
                  Weather
                </span>

                <span>
                  Intelligence
                </span>

              </div>

            </div>

          </div>

        </section>


        {/* ===================================================
            CURRENT WEATHER CARDS
        =================================================== */}

        <section className="weather-cards">


          {/* TEMPERATURE */}

          <div className="weather-card">

            <div className="card-title">

              <FiThermometer />

              <span>
                Temperature
              </span>

            </div>


            <div className="card-value">

              {Number(temperature).toFixed(2)}°C

            </div>


            <div className="card-description">
              Current Temperature
            </div>

          </div>


          {/* FEELS LIKE */}

          <div className="weather-card">

            <div className="card-title">

              <span>🤗</span>

              <span>
                Feels Like
              </span>

            </div>


            <div className="card-value">

              {Number(feelsLike).toFixed(2)}°C

            </div>


            <div className="card-description">
              Perceived Temperature
            </div>

          </div>


          {/* HUMIDITY */}

          <div className="weather-card">

            <div className="card-title">

              <FiDroplet />

              <span>
                Humidity
              </span>

            </div>


            <div className="card-value">

              {humidity}%

            </div>


            <div className="card-description">
              Moisture Level
            </div>

          </div>


          {/* WIND */}

          <div className="weather-card">

            <div className="card-title">

              <FiWind />

              <span>
                Wind Speed
              </span>

            </div>


            <div className="card-value">

              {windSpeed} m/s

            </div>


            <div className="card-description">
              Current Wind
            </div>

          </div>


          {/* CONDITION */}

          <div className="weather-card">

            <div className="card-title">

              <span>☁️</span>

              <span>
                Condition
              </span>

            </div>


            <div className="card-value condition-value">

              {condition}

            </div>


            <div className="card-description">
              {description}
            </div>

          </div>


          {/* =================================================
              SUNRISE
          ================================================= */}

          <div className="weather-card">

            <div className="card-title">

              <span>🌅</span>

              <span>
                Sunrise
              </span>

            </div>


            <div className="card-value small-value">

              {sunrise}

            </div>


            <div className="card-description">
              Sunrise Time
            </div>

          </div>


          {/* =================================================
              SUNSET
          ================================================= */}

          <div className="weather-card">

            <div className="card-title">

              <span>🌇</span>

              <span>
                Sunset
              </span>

            </div>


            <div className="card-value small-value">

              {sunset}

            </div>


            <div className="card-description">
              Sunset Time
            </div>

          </div>


          {/* =================================================
              MOON PHASE
          ================================================= */}

          <div className="weather-card">

            <div className="card-title">

              <span>🌙</span>

              <span>
                Moon Phase
              </span>

            </div>


            <div className="card-value small-value">

              {moonPhase}

            </div>


            <div className="card-description">
              Current Moon
            </div>

          </div>


          {/* PRESSURE */}

          <div className="weather-card">

            <div className="card-title">

              <span>💨</span>

              <span>
                Pressure
              </span>

            </div>


            <div className="card-value">

              {pressure}

            </div>


            <div className="card-description">
              Atmospheric Pressure
            </div>

          </div>


          {/* VISIBILITY */}

          <div className="weather-card">

            <div className="card-title">

              <FiEye />

              <span>
                Visibility
              </span>

            </div>


            <div className="card-value">

              {visibility} km

            </div>


            <div className="card-description">

              {weather.visibility >= 10000
                ? "Excellent Visibility"
                : weather.visibility >= 5000
                ? "Good Visibility"
                : "Moderate Visibility"}

            </div>

          </div>

        </section>

   {/* ===================================================
    FORECAST PAGE LINK
=================================================== */}

<section className="dashboard-forecast">

  <div className="forecast-header">

    <div>
      <span className="dashboard-badge">
        Weather Prediction
      </span>

      <h2>
        🌦 5-Day Weather Forecast
      </h2>

      <p>
        Forecast for {city}
      </p>
    </div>

    <button
      type="button"
      className="forecast-button"
      onClick={() => {
        window.location.href = "/forecast";
      }}
    >
      View Full Forecast →
    </button>

  </div>

</section>
        {/* ===================================================
            AUTO UPDATE
        =================================================== */}

        <div className="weather-update-status">

          Weather updates automatically every minute

        </div>

      </main>

    </div>

  );

}


export default Dashboard;