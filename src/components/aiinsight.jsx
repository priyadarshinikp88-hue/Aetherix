import "./dashboard.css";

function AIInsight({ weather }) {
  if (!weather) return null;

  let message = "";

  if (weather.main.temp > 35)
    message =
      "🥵 High temperature detected. Stay hydrated and avoid direct sunlight.";

  else if (weather.weather[0].main === "Rain")
    message =
      "🌧 Rain expected. Carry an umbrella before leaving home.";

  else if (weather.wind.speed > 10)
    message =
      "🌬 Strong winds detected. Drive carefully and secure loose objects.";

  else if (weather.main.humidity > 80)
    message =
      "💧 Humidity is high. Stay hydrated and wear light clothing.";

  else
    message =
      "☀ Weather looks pleasant today. Enjoy your day!";

  return (
    <div className="dashboard-card ai-card">
      <h2>🤖 AI Weather Insight</h2>

      <p
        style={{
          fontSize: "18px",
          lineHeight: "30px",
        }}
      >
        {message}
      </p>
    </div>
  );
}

export default AIInsight;