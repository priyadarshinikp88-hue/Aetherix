import "./dashboard.css";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function Dashboard() {

  const weather = JSON.parse(localStorage.getItem("weather"));

 const data = {
  labels: ["Morning", "Afternoon", "Evening", "Night"],
  datasets: [
    {
      label: "Temperature (°C)",
      data: weather
        ? [
            weather.main.temp - 2,
            weather.main.temp + 1,
            weather.main.temp,
            weather.main.temp - 3,
          ]
        : [0, 0, 0, 0],
      borderColor: "#4aa3ff",
      backgroundColor: "rgba(74,163,255,0.2)",
      tension: 0.4,
      fill: true,
    },
  ],
};

return (
    <div className="dashboard-page">

      <h1>📊 AI Weather Dashboard</h1>

      {weather ? (
        <>
          <div className="dashboard-grid">

            <div className="dashboard-card">
              <h2>🌡 Temperature</h2>
              <h1>{weather.main.temp}°C</h1>
            </div>

            <div className="dashboard-card">
              <h2>💧 Humidity</h2>
              <h1>{weather.main.humidity}%</h1>
            </div>

            <div className="dashboard-card">
              <h2>🌬 Wind Speed</h2>
              <h1>{weather.wind.speed} m/s</h1>
            </div>

            <div className="dashboard-card">
              <h2>☁ Condition</h2>
              <h1>{weather.weather[0].main}</h1>
            </div>

          </div>

        <div className="chart-container">

  <Line
    data={data}
    options={{
      responsive: true,
      maintainAspectRatio: false,
    }}
  />
</div>
<div className="dashboard-grid">

  <div className="dashboard-card">
  <h2>🌍 Air Quality</h2>

  <h1>{weather.air?.main?.aqi ?? "--"}</h1>

  <p>
    {{
      1: "🟢 Good",
      2: "🟡 Fair",
      3: "🟠 Moderate",
      4: "🔴 Poor",
      5: "🟣 Very Poor",
    }[weather.air?.main?.aqi] || "Not Available"}
  </p>
</div>
  <div className="dashboard-card ai-card">
    <h2>🤖 AI Weather Summary</h2>

    <p>
      {weather.main.temp > 35
        ? "High temperature detected. Stay hydrated and avoid direct sunlight."
        : weather.weather[0].main === "Rain"
        ? "Rain expected. Carry an umbrella before going outside."
        : weather.wind.speed > 10
        ? "Strong winds detected. Be cautious while travelling."
        : "Weather conditions are normal. Have a great day!"}
    </p>
  </div>

  <div className="dashboard-card">
    <h2>🥵 Feels Like</h2>
    <h1>{weather.main.feels_like}°C</h1>
  </div>

  <div className="dashboard-card">
    <h2>🌍 Pressure</h2>
    <h1>{weather.main.pressure} hPa</h1>
  </div>

  <div className="dashboard-card">
    <h2>👀 Visibility</h2>
    <h1>{weather.visibility / 1000} km</h1>
  </div>

  <div className="dashboard-card">
    <h2>📍 Coordinates</h2>
    <h1>{weather.coord.lat}, {weather.coord.lon}</h1>
  </div>

</div>
        </>
      ) : (
        <h2>Please search a city from Home page.</h2>
      )}

    </div>
  );
}

export default Dashboard;