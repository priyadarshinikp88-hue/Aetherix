import "./dashboard.css";
import Navbar from "./navbar";
import WeatherCard from "./weathercard";
import AIInsight from "./aiinsight";
import { getMoonPhase } from "../utils/moonPhase";

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

  const weather = JSON.parse(
    localStorage.getItem("weather")
  );

  const currentDate = new Date();

  const formattedDate =
    currentDate.toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const formattedTime =
    currentDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const moonPhase = getMoonPhase();
    const getAQIStatus = (aqi) => {

  switch (aqi) {

    case 1:
      return "🟢 Good";

    case 2:
      return "🟡 Fair";

    case 3:
      return "🟠 Moderate";

    case 4:
      return "🔴 Poor";

    case 5:
      return "🟣 Very Poor";

    default:
      return "Not Available";

  }

};
  const getAQIAdvice = (aqi) => {

  switch (aqi) {

    case 1:
      return "Air quality is excellent for outdoor activities.";

    case 2:
      return "Air quality is acceptable for most people.";

    case 3:
      return "Sensitive people should reduce prolonged outdoor activity.";

    case 4:
      return "Avoid outdoor exercise if possible.";

    case 5:
      return "Stay indoors and wear a mask if going outside.";

    default:
      return "No air quality data available.";

  }

};

  if (!weather) {

    return (

      <div className="dashboard-page">

        <Navbar />

        <div className="empty-dashboard">

          <h1>No Weather Data</h1>

          <p>

            Search a city from the Home page
            to access the AI Weather Dashboard.

          </p>

        </div>

      </div>

    );

  }

  const data = {

    labels: [

      "Morning",

      "Afternoon",

      "Evening",

      "Night",

    ],

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

        backgroundColor:
          "rgba(74,163,255,0.2)",

        tension: 0.4,

        fill: true,

      },

    ],

  };

  return (

    <div className="dashboard-page">

      <Navbar />

      {/* ================= HERO ================= */}

      <section className="dashboard-hero">

        <div className="hero-left">

          <span className="dashboard-tag">

            AI Powered Weather Dashboard

          </span>

          <h1>

            {weather.name},

            {" "}

            {weather.sys.country}

          </h1>

          <p>

            {formattedDate}

          </p>

          <p>

            {formattedTime}

          </p>

        </div>

        <div className="hero-right">

          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
            alt="Weather Icon"
          />

          <h1>

            {Math.round(weather.main.temp)}°C

          </h1>

          <p>

            {weather.weather[0].description}

          </p>

        </div>

      </section>

            {/* ================= WEATHER OVERVIEW ================= */}

      <section className="dashboard-grid">

        <div className="dashboard-card">

          <h3>🌡 Temperature</h3>

          <h1>{weather.main.temp}°C</h1>

          <p>Current Temperature</p>

        </div>

        <div className="dashboard-card">

          <h3>🤗 Feels Like</h3>

          <h1>{weather.main.feels_like}°C</h1>

          <p>Perceived Temperature</p>

        </div>

        <div className="dashboard-card">

          <h3>💧 Humidity</h3>

          <h1>{weather.main.humidity}%</h1>

          <p>Moisture Level</p>

        </div>

        <div className="dashboard-card">

          <h3>🌬 Wind Speed</h3>

          <h1>{weather.wind.speed} m/s</h1>

          <p>Current Wind</p>

        </div>

        <div className="dashboard-card">

          <h3>☁ Condition</h3>

          <h1>{weather.weather[0].main}</h1>

          <p>{weather.weather[0].description}</p>

        </div>

        <div className="dashboard-card">

          <h3>🌅 Sunrise</h3>

          <h1>

            {new Date(
              weather.sys.sunrise * 1000
            ).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}

          </h1>

        </div>

        <div className="dashboard-card">

          <h3>🌇 Sunset</h3>

          <h1>

            {new Date(
              weather.sys.sunset * 1000
            ).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}

          </h1>

        </div>
        
       <div className="dashboard-card">

  <h3>🌙 Moon Phase</h3>

  <h1>{moonPhase}</h1>

  <p>Current Lunar Phase</p>

</div>

        <div className="dashboard-card">

          <h3>📊 Pressure</h3>

          <h1>{weather.main.pressure} hPa</h1>

          <p>Atmospheric Pressure</p>

        </div>

        <div className="dashboard-card">

  <h3>👁 Visibility</h3>

  <h1>

    {(weather.visibility / 1000).toFixed(1)} km

  </h1>

  <p>
  {weather.visibility >= 10000
    ? "Excellent Visibility"
    : weather.visibility >= 5000
    ? "Good Visibility"
    : weather.visibility >= 2000
    ? "Moderate Visibility"
    : "Poor Visibility"}
</p>
</div>

        <div className="dashboard-card">

  <h3>☁ Cloud Cover</h3>

  <h1>

    {weather.clouds.all}%

  </h1>

  <p>

    {weather.clouds.all < 20
      ? "Clear Sky"
      : weather.clouds.all < 50
      ? "Partly Cloudy"
      : weather.clouds.all < 80
      ? "Mostly Cloudy"
      : "Overcast"}

  </p>

</div>  

      <div className="dashboard-card">

  <h3>🌍 Air Quality</h3>

  <h1>

    {weather.air?.main?.aqi || "--"}

  </h1>

  <p>

  {weather.air?.main?.aqi
    ? getAQIStatus(weather.air.main.aqi)
    : "Not Available"}

</p>

<small>

  {weather.air?.main?.aqi
    ? getAQIAdvice(weather.air.main.aqi)
    : ""}

</small>

</div>

      </section>

      {/* ================= WEATHER SUMMARY ================= */}

      <WeatherCard weather={weather} />

      {/* ================= TEMPERATURE CHART ================= */}

      <section className="chart-section">

        <div className="chart-card">

          <h2>

            📈 Temperature Trend

          </h2>

          <div className="chart-container">

            <Line

              data={data}

              options={{

                responsive: true,

                maintainAspectRatio: false,

                plugins: {

                  legend: {

                    labels: {

                      color: "#ffffff",

                    },

                  },

                },

                scales: {

                  x: {

                    ticks: {

                      color: "#ffffff",

                    },

                  },

                  y: {

                    ticks: {

                      color: "#ffffff",

                    },

                  },

                },

              }}

            />

          </div>

        </div>

      </section>
            {/* ================= AI INSIGHTS ================= */}

      <section className="ai-section">

        <div className="ai-panel">

          <h2>🤖 AI Weather Intelligence</h2>

          <AIInsight weather={weather} />

        </div>

      </section>

      {/* ================= QUICK INSIGHTS ================= */}

      <section className="quick-insights">

        <div className="insight-card">

          <h3>☀ UV Recommendation</h3>

          <p>
            {weather.main.temp > 35
              ? "High temperature detected. Stay hydrated and avoid prolonged exposure."
              : "Weather is comfortable for outdoor activities."}
          </p>

        </div>

        <div className="insight-card">

          <h3>🌧 Rain Possibility</h3>

          <p>

            {weather.weather[0].main.toLowerCase().includes("rain")
              ? "Carry an umbrella today."
              : "No significant rainfall expected."}

          </p>

        </div>

        <div className="insight-card">

          <h3>💨 Wind Advisory</h3>

          <p>

            {weather.wind.speed > 8
              ? "Strong winds detected. Be cautious while travelling."
              : "Wind conditions are normal."}

          </p>

        </div>

      </section>

      {/* ================= FOOTER ================= */}

      <footer className="dashboard-footer">

        <h2>Aetherix Technologies</h2>

        <p>

          AI Powered Weather Intelligence Platform

        </p>

        <hr />

        <p>

          Powered by React • OpenWeather API • AI

        </p>

      </footer>

    </div>

  );

}

export default Dashboard;