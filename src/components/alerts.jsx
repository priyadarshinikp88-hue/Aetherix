import "./alerts.css";
import Navbar from "./navbar";

function Alerts() {
  const weather = JSON.parse(localStorage.getItem("weather"));

  if (!weather) {
    return (
      <div className="alerts-page">
        <Navbar />
        <h1>🚨 Weather Alerts</h1>
        <h2>Please search a city first.</h2>
      </div>
    );
  }

  const condition = weather.weather[0].main;

  return (
    <div className="alerts-page">
      <Navbar />

      <h1>🚨 AI Weather Alerts</h1>

      <div className="alerts-container">

        {condition === "Rain" && (
          <div className="alert-card">
            🌧 Rain Alert
            <p>Carry an umbrella. Roads may be slippery.</p>
          </div>
        )}

        {condition === "Thunderstorm" && (
          <div className="alert-card">
            ⛈ Thunderstorm Warning
            <p>Avoid open areas and stay indoors.</p>
          </div>
        )}

        {condition === "Snow" && (
          <div className="alert-card">
            ❄ Snow Alert
            <p>Drive carefully and wear warm clothes.</p>
          </div>
        )}

        {weather.main.temp > 35 && (
          <div className="alert-card">
            🔥 Heat Wave
            <p>Stay hydrated and avoid direct sunlight.</p>
          </div>
        )}

        {weather.wind.speed > 12 && (
          <div className="alert-card">
            🌬 Strong Wind
            <p>Secure loose objects and travel carefully.</p>
          </div>
        )}

        {!["Rain", "Thunderstorm", "Snow"].includes(condition) &&
          weather.main.temp <= 35 &&
          weather.wind.speed <= 12 && (
            <div className="alert-card safe">
              ✅ No Active Alerts
              <p>Current weather conditions are safe.</p>
            </div>
          )}

      </div>
    </div>
  );
}

export default Alerts;