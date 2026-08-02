import "./alerts.css";
import Navbar from "./navbar";

function Alerts() {

  const weather = JSON.parse(
    localStorage.getItem("weather")
  );

  if (!weather) {

    return (

      <div className="alerts-page">

        <Navbar />

        <div className="no-alerts">

          <h1>🚨 AI Weather Alerts</h1>

          <h2>Please search a city first.</h2>

        </div>

      </div>

    );

  }

  const alerts = [];

  /* ================= WEATHER ALERTS ================= */

  if (weather.main.temp >= 38) {

    alerts.push({

      icon: "🔥",

      type: "High",

      title: "Extreme Heat Warning",

      message:
        "Temperature is extremely high. Stay hydrated and avoid direct sunlight.",

    });

  }

  if (weather.weather[0].main === "Rain") {

    alerts.push({

      icon: "🌧️",

      type: "Medium",

      title: "Rain Alert",

      message:
        "Carry an umbrella and avoid waterlogged roads.",

    });

  }

  if (weather.weather[0].main === "Thunderstorm") {

    alerts.push({

      icon: "⛈️",

      type: "High",

      title: "Thunderstorm Warning",

      message:
        "Stay indoors and avoid open areas until the storm passes.",

    });

  }

  if (
    weather.weather[0].main === "Fog" ||
    weather.weather[0].main === "Mist" ||
    weather.weather[0].main === "Haze"
  ) {

    alerts.push({

      icon: "🌫️",

      type: "Medium",

      title: "Low Visibility",

      message:
        "Drive carefully and use headlights if travelling.",

    });

  }

  if (weather.wind.speed >= 10) {

    alerts.push({

      icon: "🌬️",

      type: "Medium",

      title: "Strong Wind",

      message:
        "Secure loose outdoor objects and be cautious while travelling.",

    });

  }

  if (weather.air?.main?.aqi >= 4) {

    alerts.push({

      icon: "🌍",

      type: "High",

      title: "Poor Air Quality",

      message:
        "Sensitive groups should reduce outdoor activity.",

    });

  }

  if (alerts.length === 0) {

    alerts.push({

      icon: "✅",

      type: "Safe",

      title: "No Active Alerts",

      message:
        "Current weather conditions are normal. Enjoy your day!",

    });

  }

  return (

    <div className="alerts-page">

      <Navbar />

      <h1 className="alerts-heading">

        🚨 AI Smart Weather Alerts

      </h1>

      <p className="alerts-subtitle">

        Real-time intelligent weather alerts
        generated using live weather data.

      </p>
              <div className="alerts-grid">

{alerts.map((alert, index) => (

          <div className="alert-card" key={index}>

            <div className="alert-icon">

              {alert.icon}

            </div>

            <div
              className={`alert-badge ${alert.type.toLowerCase()}`}
            >

              {alert.type} Priority

            </div>

            <h2>

              {alert.title}

            </h2>

            <p>

              {alert.message}

            </p>

            <div className="weather-details">

              <div>

                <span>📍 City</span>

                <strong>

                  {weather.name}, {weather.sys.country}

                </strong>

              </div>

              <div>

                <span>🌡 Temperature</span>

                <strong>

                  {Math.round(weather.main.temp)}°C

                </strong>

              </div>

              <div>

                <span>💧 Humidity</span>

                <strong>

                  {weather.main.humidity}%

                </strong>

              </div>

              <div>

                <span>💨 Wind</span>

                <strong>

                  {weather.wind.speed} m/s

                </strong>

              </div>

              <div>

                <span>🌍 AQI</span>

                <strong>

                  {weather.air?.main?.aqi || "--"}

                </strong>

              </div>

              <div>

                <span>☁ Condition</span>

                <strong>

                  {weather.weather[0].description}

                </strong>

              </div>

            </div>

            <div className="alert-footer">

              Updated: {new Date().toLocaleTimeString()}

            </div>

          </div>
        

        ))}

      </div>

    </div>

  );

}

export default Alerts;