import "./alerts.css";

function Alerts() {

  const weather = JSON.parse(localStorage.getItem("weather"));

  if (!weather) {
    return (
      <div className="alerts-page">
        <h1>🚨 Weather Alerts</h1>
        <h2>Please search a city from the Home page first.</h2>
      </div>
    );
  }

  const condition = weather.weather[0].main;

  return (
    <div className="alerts-page">

      <h1>🚨 Weather Alerts</h1>

      {condition === "Rain" && (
        <div className="alert-card">
          🌧 Heavy Rain Alert
        </div>
      )}

      {condition === "Thunderstorm" && (
        <div className="alert-card">
          ⛈ Thunderstorm Warning
        </div>
      )}

      {condition === "Snow" && (
        <div className="alert-card">
          ❄ Snow Alert
        </div>
      )}

      {weather.main.temp > 35 && (
        <div className="alert-card">
          🔥 Heat Wave Alert
        </div>
      )}

      {weather.wind.speed > 12 && (
        <div className="alert-card">
          🌬 Strong Wind Warning
        </div>
      )}

      {!["Rain", "Thunderstorm", "Snow"].includes(condition) &&
        weather.main.temp <= 35 &&
        weather.wind.speed <= 12 && (
          <div className="alert-card safe">
            ✅ No Active Alerts
          </div>
        )}

    </div>
  );
}

export default Alerts;