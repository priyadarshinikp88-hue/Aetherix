import { useState, useEffect } from "react";
import "./forecast.css";
import Navbar from "./navbar";

function Forecast() {
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // GET FORECAST
  // =====================================================

  useEffect(() => {
    getForecast();
  }, []);

  const getForecast = async () => {
    const lat = localStorage.getItem("lat");
    const lon = localStorage.getItem("lon");

    if (!lat || !lon) {
      alert("Please search a city from Home page first.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `https://aetherix-backend-eoj8.onrender.com/api/forecast?lat=${lat}&lon=${lon}`
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Unable to fetch forecast");
        return;
      }

      const list = data.list || [];

      // =================================================
      // GROUP 3-HOUR FORECAST INTO DAYS
      // =================================================

      const groupedDays = {};

      list.forEach((item) => {
        const date = new Date(item.dt * 1000);

        // Local date key
        const dateKey = date.toLocaleDateString("en-CA");

        if (!groupedDays[dateKey]) {
          groupedDays[dateKey] = [];
        }

        groupedDays[dateKey].push(item);
      });

      // =================================================
      // CREATE DAILY FORECAST
      // =================================================

      const dailyForecast = Object.entries(groupedDays)
        .slice(0, 5)
        .map(([dateKey, items]) => {
          const temperatures = items.map(
            (item) => item.main?.temp ?? 0
          );

          const humidityValues = items.map(
            (item) => item.main?.humidity ?? 0
          );

          const windValues = items.map(
            (item) => item.wind?.speed ?? 0
          );

          const minTemp = Math.min(...temperatures);
          const maxTemp = Math.max(...temperatures);

          const averageTemp =
            temperatures.reduce((sum, value) => sum + value, 0) /
            temperatures.length;

          const averageHumidity =
            humidityValues.reduce((sum, value) => sum + value, 0) /
            humidityValues.length;

          const averageWind =
            windValues.reduce((sum, value) => sum + value, 0) /
            windValues.length;

          // Find the forecast closest to noon
          const representativeItem = items.reduce(
            (closest, current) => {
              const currentHour = new Date(
                current.dt * 1000
              ).getHours();

              const closestHour = new Date(
                closest.dt * 1000
              ).getHours();

              return Math.abs(currentHour - 12) <
                Math.abs(closestHour - 12)
                ? current
                : closest;
            }
          );

          return {
            date: dateKey,
            items,

            temp: averageTemp,

            min: minTemp,
            max: maxTemp,

            humidity: Math.round(averageHumidity),

            wind: averageWind,

            weather:
              representativeItem.weather?.[0] || {},

            icon:
              representativeItem.weather?.[0]?.icon || "01d",
          };
        });

      setForecast(dailyForecast);

    } catch (error) {
      console.error("Forecast error:", error);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="forecast-page">
        <Navbar />

        <div className="forecast-loading">
          <h2>🌦 Loading Weather Forecast...</h2>
          <p>
            Fetching the latest weather predictions.
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // EMPTY
  // =====================================================

  if (!forecast.length) {
    return (
      <div className="forecast-page">
        <Navbar />

        <div className="forecast-loading">
          <h2>⚠️ No Forecast Data</h2>

          <p>
            Please search for a city from the Home page first.
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // SUMMARY
  // =====================================================

  const averageTemp = Math.round(
    forecast.reduce(
      (sum, item) => sum + item.temp,
      0
    ) / forecast.length
  );

  const averageHumidity = Math.round(
    forecast.reduce(
      (sum, item) => sum + item.humidity,
      0
    ) / forecast.length
  );

  const averageWind = (
    forecast.reduce(
      (sum, item) => sum + item.wind,
      0
    ) / forecast.length
  ).toFixed(1);

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="forecast-page">

      <Navbar />

      {/* =================================================
          HEADER
      ================================================= */}

      <h1>
        🌦 5-Day Weather Forecast
      </h1>

      <p>
        Get detailed weather predictions for the next
        five days using Aetherix Weather Intelligence
        and OpenWeather data.
      </p>

      {/* =================================================
          SUMMARY
      ================================================= */}

      <div className="forecast-summary">

        <div className="summary-card">

          <h2>
            📅 Next 5 Days Forecast
          </h2>

          <p>
            Weather forecast generated for your selected
            location using real-time weather data.
          </p>

          <div className="summary-grid">

            {/* TEMPERATURE */}

            <div>
              <span>
                🌡 Average Temperature
              </span>

              <strong>
                {averageTemp}°C
              </strong>
            </div>

            {/* HUMIDITY */}

            <div>
              <span>
                💧 Average Humidity
              </span>

              <strong>
                {averageHumidity}%
              </strong>
            </div>

            {/* WIND */}

            <div>
              <span>
                💨 Average Wind
              </span>

              <strong>
                {averageWind} m/s
              </strong>
            </div>

          </div>

        </div>

      </div>

      {/* =================================================
          DAILY FORECAST CARDS
      ================================================= */}

      <div className="forecast-container">

        {forecast.map((item, index) => {

          const date = new Date(
            `${item.date}T12:00:00`
          );

          const dayName =
            index === 0
              ? "Today"
              : date.toLocaleDateString(
                  "en-US",
                  {
                    weekday: "long",
                  }
                );

          const fullDate =
            date.toLocaleDateString(
              "en-US",
              {
                day: "numeric",
                month: "short",
                year: "numeric",
              }
            );

          return (

            <div
              className="forecast-card"
              key={item.date}
            >

              {/* DAY */}

              <h3>
                {dayName}
              </h3>

              <p className="forecast-date">
                {fullDate}
              </p>

              {/* WEATHER ICON */}

              <img
                src={`https://openweathermap.org/img/wn/${item.icon}@2x.png`}
                alt={
                  item.weather?.description ||
                  "Weather"
                }
              />

              {/* AVERAGE TEMPERATURE */}

              <h2>
                {Math.round(item.temp)}°C
              </h2>

              {/* CONDITION */}

              <p className="forecast-desc">
                {item.weather?.description ||
                  "Weather information unavailable"}
              </p>

              {/* DETAILS */}

              <div className="forecast-details">

                {/* MAX */}

                <div>
                  <span>
                    🌡 Max
                  </span>

                  <strong>
                    {Math.round(item.max)}°C
                  </strong>
                </div>

                {/* MIN */}

                <div>
                  <span>
                    ❄ Min
                  </span>

                  <strong>
                    {Math.round(item.min)}°C
                  </strong>
                </div>

                {/* HUMIDITY */}

                <div>
                  <span>
                    💧 Humidity
                  </span>

                  <strong>
                    {item.humidity}%
                  </strong>
                </div>

                {/* WIND */}

                <div>
                  <span>
                    💨 Wind
                  </span>

                  <strong>
                    {item.wind.toFixed(1)} m/s
                  </strong>
                </div>

              </div>

            </div>

          );
        })}

      </div>

    </div>
  );
}

export default Forecast;