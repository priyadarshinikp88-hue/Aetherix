import { useState, useEffect } from "react";
import "./forecast.css";
import Navbar from "./navbar";

function Forecast() {
    const [forecast, setForecast] = useState([]);
    useEffect(() => {
  getForecast();
}, []);

const getForecast = async () => {

  const lat = localStorage.getItem("lat");
  const lon = localStorage.getItem("lon");

  if (!lat || !lon) {
    alert("Please search a city from Home page first.");
    return;
  }

  try {

    const response = await fetch(
      `https://aetherix-backend-eoj8.onrender.com/api/forecast?lat=${lat}&lon=${lon}`
    );

    const data = await response.json();

if (!response.ok) {
  alert(data.message || "Unable to fetch forecast");
  return;
}

setForecast(data.list || []);

  } catch (error) {
    console.log(error);
  }
};
 return (
  <div className="forecast-page">

    <Navbar />

    <h1>🌦 Live 5-Day Weather Forecast</h1>

    <p>
      Get accurate weather predictions for the next five days using
      AI-powered forecasting and OpenWeather data.
    </p>

    <div className="forecast-container">
      <section className="forecast-summary">

  <div className="summary-card">

    <h2>📅 Next 5 Days Forecast</h2>

    <p>

      Weather forecast generated using
      OpenWeather data for your selected
      location.

    </p>

    <div className="summary-grid">

      <div>

        <span>🌡 Average Temp</span>

        <strong>

          {Math.round(
            forecast.reduce(
              (sum, item) => sum + item.main.temp,
              0
            ) / (forecast.length || 1)
          )}°C

        </strong>

      </div>

      <div>

        <span>💧 Avg Humidity</span>

        <strong>

          {Math.round(
            forecast.reduce(
              (sum, item) => sum + item.main.humidity,
              0
            ) / (forecast.length || 1)
          )}%

        </strong>

      </div>

      <div>

        <span>💨 Avg Wind</span>

        <strong>

          {(
            forecast.reduce(
              (sum, item) => sum + item.wind.speed,
              0
            ) / (forecast.length || 1)
          ).toFixed(1)} m/s

        </strong>

      </div>

    </div>

  </div>

</section>

    {forecast
  .filter((item) => item.dt_txt.includes("12:00:00"))
  .slice(0, 5)
  .map((item, index) => (
        <div className="forecast-card" key={index}>

          <h3>
  {new Date(item.dt_txt).toLocaleDateString("en-US", {
    weekday: "long",
  })}
</h3>

          <img
            src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
            alt="Weather Icon"
            width="70"
          />

         <h2>

  {Math.round(item.main.temp)}°C

</h2>

<p className="forecast-desc">

  {item.weather[0].description}

</p>

<div className="forecast-details">

  <div>

    🌡 Max

    <strong>

      {Math.round(item.main.temp_max)}°C

    </strong>

  </div>

  <div>

    ❄ Min

    <strong>

      {Math.round(item.main.temp_min)}°C

    </strong>

  </div>

  <div>

    💧 Humidity

    <strong>

      {item.main.humidity}%

    </strong>

  </div>

  <div>

    💨 Wind

    <strong>

      {item.wind.speed} m/s

    </strong>

  </div>

</div>

        </div>
      ))}

    </div>

  </div>
);
}

export default Forecast;