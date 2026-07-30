import { useState, useEffect } from "react";
import "./forecast.css";
import Navbar from "./Navbar";

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

     { forecast
  .forecast?.filter(item => item.dt_txt.includes("12:00:00"))
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

          <h2>{item.main.temp} °C</h2>

          <p>{item.weather[0].description}</p>

        </div>
      ))}

    </div>

  </div>
);
}

export default Forecast;