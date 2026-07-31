import "./alerts.css";
import Navbar from "./navbar";

function Alerts() {

  const weather = JSON.parse(localStorage.getItem("weather"));

  if (!weather) {
    return (
      <div className="alerts-page">
        <Navbar />
        <h1>🚨 AI Weather Alerts</h1>
        <h2>Please search a city first.</h2>
      </div>
    );
  }

  const condition = weather.weather[0].main;

  let title = "Weather Update";
  let message = "Current weather conditions are safe.";
  let icon = "☀️";

  if (condition === "Rain") {
    title = "Rain Alert";
    icon = "🌧️";
    message =
      `Heavy rain expected in ${weather.name}. Carry an umbrella and avoid waterlogged roads.`;
  }

  else if (condition === "Thunderstorm") {
    title = "Thunderstorm Warning";
    icon = "⛈️";
    message =
      `Thunderstorm detected in ${weather.name}. Stay indoors and avoid open areas.`;
  }

  else if (condition === "Snow") {
    title = "Snow Alert";
    icon = "❄️";
    message =
      `Snowfall expected in ${weather.name}. Wear warm clothes and drive carefully.`;
  }

  else if (condition === "Mist" || condition === "Fog" || condition === "Haze") {
    title = "Fog Alert";
    icon = "🌫️";
    message =
      `Low visibility detected in ${weather.name}. Drive carefully and use headlights.`;
  }

  else if (weather.main.temp >= 35) {
    title = "Heat Wave";
    icon = "🔥";
    message =
      `High temperature detected in ${weather.name}. Stay hydrated and avoid direct sunlight.`;
  }

  else if (weather.wind.speed >= 12) {
    title = "Strong Wind Alert";
    icon = "🌬️";
    message =
      `Strong winds are expected in ${weather.name}. Secure loose outdoor objects.`;
  }

  return (
    <div className="alerts-page">

      <Navbar />

      <h1>🚨 AI Weather Alerts</h1>

      <div className="alerts-container">

        <div className="alert-card">

          <div className="weather-icon">
            {icon}
          </div>

          <div className="alert-title">
            AetherixCloud Weather Alert
          </div>

          <div className="alert-message">

            <strong>{title}</strong>

            <br /><br />

            {message}

          </div>

          <div className="weather-info">

            <p>
              <span>📍 City</span>
              {weather.name}, {weather.sys.country}
            </p>

            <p>
              <span>🌡 Temperature</span>
              {weather.main.temp} °C
            </p>

            <p>
              <span>🌬 Wind Speed</span>
              {weather.wind.speed} m/s
            </p>

            <p>
              <span>💧 Humidity</span>
              {weather.main.humidity} %
            </p>

            <p>
              <span>☁ Condition</span>
              {weather.weather[0].description}
            </p>

            <p>
              <span>🕒 Last Updated</span>
              {new Date().toLocaleTimeString()}
            </p>

          </div>

          <div className="stay-safe">
            🛡 Stay Safe. Monitor weather updates regularly.
          </div>

        </div>

      </div>

    </div>
  );
}

export default Alerts;