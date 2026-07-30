import "./forecast.css";

function Forecast() {
  return (
    <div className="forecast-page">

      <h1>🌦 5-Day Weather Forecast</h1>

      <p>
        Get accurate weather predictions for the next five days using
        AI-powered forecasting and OpenWeather data.
      </p>

      <div className="forecast-container">

        <div className="forecast-card">
          <h3>Monday</h3>
          <p>🌤 Sunny</p>
          <h2>30°C</h2>
        </div>

        <div className="forecast-card">
          <h3>Tuesday</h3>
          <p>☁ Cloudy</p>
          <h2>28°C</h2>
        </div>

        <div className="forecast-card">
          <h3>Wednesday</h3>
          <p>🌧 Rain</p>
          <h2>26°C</h2>
        </div>

        <div className="forecast-card">
          <h3>Thursday</h3>
          <p>⛈ Thunderstorm</p>
          <h2>25°C</h2>
        </div>

        <div className="forecast-card">
          <h3>Friday</h3>
          <p>🌤 Clear Sky</p>
          <h2>29°C</h2>
        </div>

      </div>

    </div>
  );
}

export default Forecast;