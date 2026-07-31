import "./dashboard.css";

function WeatherCard({ weather }) {
  if (!weather) return null;

  return (
    <div className="dashboard-card" style={{ marginBottom: "25px" }}>
      <h2>{weather.name}</h2>

      <img
        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
        alt=""
      />

      <h1>{weather.main.temp}°C</h1>

      <h3>{weather.weather[0].description}</h3>

      <p>
        Feels Like: {weather.main.feels_like}°C
      </p>
    </div>
  );
}

export default WeatherCard;