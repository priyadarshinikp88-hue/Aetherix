import "./dashboard.css";
import Navbar from "./navbar";
import WeatherCard from "./weathercard";
import AIInsight from "./aiinsight";

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

  if (!weather) {
    return (
      <div className="dashboard-page">
        <Navbar />
        
        <h2>Please search a city first.</h2>
      </div>
    );
  }

  const data = {
    labels: ["Morning", "Afternoon", "Evening", "Night"],
    datasets: [
      {
        label: "Temperature (°C)",
        data: [
          weather.main.temp - 2,
          weather.main.temp + 1,
          weather.main.temp,
          weather.main.temp - 3,
        ],
        borderColor: "#4aa3ff",
        backgroundColor: "rgba(74,163,255,0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  return (
    <div className="dashboard-page">
      <Navbar />

      <h1>📊 AI Weather Dashboard</h1>

      <WeatherCard weather={weather} />

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

      <div className="dashboard-card">
  <h2>🌅 Sunrise</h2>
  <h1>
    {new Date(weather.sys.sunrise * 1000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}
  </h1>
</div>

<div className="dashboard-card">
  <h2>🌇 Sunset</h2>
  <h1>
    {new Date(weather.sys.sunset * 1000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}
  </h1>
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

      <AIInsight weather={weather} />
    </div>
  );
}

export default Dashboard;