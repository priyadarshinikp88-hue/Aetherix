import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { useState, useEffect } from "react";
import "./home.css";
import ceo from "./assets/ceo.jpg";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";

function Home() {

  const navigate = useNavigate();

  /* ---------------- STATES ---------------- */

  const [city, setCity] = useState("");
  const [selectedCity, setSelectedCity] = useState(null);

  const [weather, setWeather] = useState(null);

  const [loading, setLoading] = useState(false);

  const [showAbout, setShowAbout] =
    useState(false);

  const [cityOptions, setCityOptions] =
    useState([]);

  const [locationEnabled, setLocationEnabled] =
    useState(
      localStorage.getItem("locationEnabled") !==
        "false"
    );

  const [lat, setLat] = useState("");

  const [lon, setLon] = useState("");

  const [searchText, setSearchText] = useState("");
  useEffect(() => {
  if (searchText.length < 2) {
    setCityOptions([]);
    return;
  }

  const timer = setTimeout(() => {
    searchCities(searchText);
  }, 300);

  return () => clearTimeout(timer);
}, [searchText]);

  /* ---------------- LOGOUT ---------------- */

  const handleLogout = async () => {

    try {

      await signOut(auth);

      if (window.recaptchaVerifier) {

        try {

          window.recaptchaVerifier.clear();

        } catch (e) {

          console.log(e);

        }

        window.recaptchaVerifier = null;

      }

      window.confirmationResult = null;

      navigate("/login");

    } catch (error) {

      console.log(error);

    }

  };

  /* ---------------- SEARCH CITY ---------------- */

  const searchCities = async (inputValue) => {

    if (inputValue.length < 2) {

      setCityOptions([]);

      return;

    }

    try {

      const response = await fetch(

        `https://aetherix-backend-eoj8.onrender.com/api/cities?q=${inputValue}`

      );

      const data = await response.json();

      setCityOptions(

        data.map((item) => ({

          label:
            `${item.name}` +
            `${item.state ? ", " + item.state : ""}, ${item.country}`,

          value: `${item.lat},${item.lon}`,

          lat: item.lat,

          lon: item.lon,

        }))

      );

    } catch (error) {

      console.log(error);

    }

  };
    /* ---------------- CURRENT LOCATION ---------------- */

  const getCurrentLocation = () => {

    if (!locationEnabled) {
      alert("Location Services are OFF");
      return;
    }

    if (!navigator.geolocation) {
      alert("Geolocation is not supported.");
      return;
    }

    navigator.geolocation.getCurrentPosition(

      async (position) => {

        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        try {

          const response = await fetch(
            `https://aetherix-backend-eoj8.onrender.com/api/weather?lat=${lat}&lon=${lon}`
          );

          const data = await response.json();

          if (!response.ok) {
            alert("Unable to fetch weather");
            return;
          }

          setWeather(data);

          localStorage.setItem(
            "weather",
            JSON.stringify(data)
          );

          localStorage.setItem("lat", lat);
          localStorage.setItem("lon", lon);

          navigate("/dashboard");

        } catch (error) {

          console.log(error);

        }

      },

      () => {
        alert("Please allow location permission.");
      }

    );

  };

  /* ---------------- GET WEATHER ---------------- */

  const getWeather = async () => {

    if (locationEnabled) {

      getCurrentLocation();

      return;

    }

    if (!selectedCity) {

      alert("Please select a city.");

      return;

    }

    try {

      setLoading(true);

      const response = await fetch(
        `https://aetherix-backend-eoj8.onrender.com/api/weather?lat=${selectedCity.lat}&lon=${selectedCity.lon}`
      );

      const data = await response.json();

      if (!response.ok) {

        alert(data.message);

        return;

      }

      setWeather(data);

      localStorage.setItem(
        "weather",
        JSON.stringify(data)
      );

      localStorage.setItem(
        "lat",
        selectedCity.lat
      );

      localStorage.setItem(
        "lon",
        selectedCity.lon
      );

      navigate("/dashboard");

    } catch (error) {

      console.log(error);

      alert("Failed to fetch weather.");

    } finally {

      setLoading(false);

    }

  };

  /* ---------------- UI ---------------- */

  return (

    <div className="home">

      {/* NAVBAR */}

      <nav className="navbar">

        <div className="logo-section">

          <div className="logo-circle">
            🌤
          </div>

          <div className="logo-text">

            <h2>Aetherix Technologies</h2>

            <p>
              AI Powered Weather Intelligence
            </p>

          </div>

        </div>

        <ul className="nav-links">

          <li onClick={() => navigate("/home")}>
            Home
          </li>

          <li onClick={() => navigate("/forecast")}>
            Forecast
          </li>

          <li onClick={() => navigate("/dashboard")}>
            Dashboard
          </li>

          <li onClick={() => navigate("/alerts")}>
            Alerts
          </li>

          <li
            onClick={() =>
              setShowAbout(!showAbout)
            }
          >
            About
          </li>

          <li>

            <button
              className="logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>

          </li>

        </ul>

      </nav>
            {/* ================= ABOUT ================= */}

      {showAbout && (

        <section className="about-section">

          <img
            src={ceo}
            alt="Founder"
            className="ceo-image"
          />

          <div className="about-content">

            <h2>
              About Aetherix Technologies
            </h2>

            <p>

              Aetherix Technologies is an AI-powered
              Weather Intelligence Platform focused on
              delivering real-time forecasts, smart
              weather alerts, analytics and enterprise
              weather solutions using Artificial
              Intelligence, Cloud Computing and the
              OpenWeather API.

            </p>

            <div className="about-grid">

              <div className="about-card">
                🤖 AI Prediction
              </div>

              <div className="about-card">
                📡 Live Weather
              </div>

              <div className="about-card">
                🌍 Global Coverage
              </div>

              <div className="about-card">
                ⚡ Smart Analytics
              </div>

            </div>

          </div>

        </section>

      )}

      {/* ================= HERO ================= */}

      <section className="hero">

        {/* LEFT */}

        <div className="left">

          <span className="hero-tag">

            AI Powered Weather Platform

          </span>

          <h1>

            Forecasting Tomorrow,

            <br />

            Today.

          </h1>

          <p>

            Experience intelligent weather
            forecasting with Artificial
            Intelligence, Live Monitoring,
            Smart Alerts and Data Analytics.

          </p>

          <div className="feature-box">

            <div className="feature">
              🤖 AI Powered
            </div>

            <div className="feature">
              📡 Live Weather
            </div>

            <div className="feature">
              🌎 Global Coverage
            </div>

            <div className="feature">
              ⚡ Smart Prediction
            </div>

          </div>

        </div>

        {/* RIGHT */}

        <div className="right">

          <div className="search-card">

            <h2>

              Search Weather

            </h2>

            <p>

              Search from thousands of
              cities worldwide.

            </p>

            <div className="location-header">

              <h4>

                Location Services

              </h4>

              <div
                className="toggle-switch"
                onClick={() => {

                  const value =
                    !locationEnabled;

                  setLocationEnabled(value);

                  localStorage.setItem(
                    "locationEnabled",
                    value
                  );

                }}
              >

                <div
                  className={
                    locationEnabled
                      ? "toggle active"
                      : "toggle"
                  }
                />

              </div>

            </div>
                       <Select
  options={cityOptions}
  value={selectedCity}
  inputValue={city}
  getOptionLabel={(option) => option.label}
  getOptionValue={(option) => option.value}
  filterOption={() => true}
  placeholder="Search your city..."
  isSearchable
  isClearable
  maxMenuHeight={250}

  styles={{
    control: (base) => ({
      ...base,
      backgroundColor: "#102847",
      borderColor: "#2d5f99",
      color: "white",
      minHeight: "52px",
      boxShadow: "none",
    }),

    input: (base) => ({
      ...base,
      color: "white",
    }),

    singleValue: (base) => ({
      ...base,
      color: "white",
    }),

    placeholder: (base) => ({
      ...base,
      color: "#b5c7df",
    }),

    menu: (base) => ({
      ...base,
      backgroundColor: "#102847",
      borderRadius: 12,
      overflow: "hidden",
      zIndex: 9999,
    }),

    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? "#1d4f86" : "#102847",
      color: "white",
      cursor: "pointer",
    }),

    menuPortal: (base) => ({
      ...base,
      zIndex: 9999,
    }),
  }}

  noOptionsMessage={() =>
    city.length < 2
      ? "Type at least 2 letters"
      : "No matching cities"
  }

  onInputChange={(value, actionMeta) => {
    if (actionMeta.action === "input-change") {
      setCity(value);

     setSearchText(value);
    }
  }}
         onChange={async (selected) => {

  setSelectedCity(selected);

  if (selected) {

    setCity(selected.label);

    setLat(selected.lat);

    setLon(selected.lon);

    setLoading(true);

    try {

      const response = await fetch(
        `https://aetherix-backend-eoj8.onrender.com/api/weather?lat=${selected.lat}&lon=${selected.lon}`
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      setWeather(data);

      localStorage.setItem("weather", JSON.stringify(data));
      localStorage.setItem("lat", selected.lat);
      localStorage.setItem("lon", selected.lon);

      navigate("/dashboard");

    } catch (error) {

      console.log(error);
      alert("Failed to fetch weather.");

    } finally {

      setLoading(false);

    }

  } else {

    setCity("");

    setLat("");

    setLon("");

    setCityOptions([]);

  }

}}
/>
            <button
              className="weather-btn"
              onClick={getWeather}
            >
              Get Weather
            </button>

            {loading && (

              <div className="loading-container">

                <div className="loader"></div>

                <p>

                  Fetching live weather...

                </p>

              </div>

            )}

            {weather && (

              <div className="city-box">

                <img
                  src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                  alt="Weather"
                />

                <h3>

                  {weather.name},
                  {" "}
                  {weather.sys.country}

                </h3>

                <h1>

                  {Math.round(weather.main.temp)}°C

                </h1>

                <p>

                  {weather.weather[0].description}

                </p>

                <small>

                  Updated:
                  {" "}
                  {new Date().toLocaleTimeString()}

                </small>

              </div>

            )}

          </div>

        </div>

      </section>
                  {/* ================= WEATHER OVERVIEW ================= */}

<section className="cards">

<div className="card">
          <h3>🌡 Temperature</h3>
          <h2>
            {weather ? `${weather.main.temp} °C` : "-- °C"}
          </h2>
        </div>

        <div className="card">
          <h3>🌡 Feels Like</h3>
          <h2>
            {weather ? `${weather.main.feels_like} °C` : "-- °C"}
          </h2>
        </div>

        <div className="card">
          <h3>💧 Humidity</h3>
          <h2>
            {weather ? `${weather.main.humidity}%` : "-- %"}
          </h2>
        </div>

        <div className="card">
          <h3>🌬 Wind Speed</h3>
          <h2>
            {weather ? `${weather.wind.speed} m/s` : "-- m/s"}
          </h2>
        </div>

        <div className="card">
          <h3>🌍 Air Quality</h3>
          <h2>
            {weather?.air?.main?.aqi ?? "--"}
          </h2>
          <p>
            {weather?.air?.main?.aqi
              ? ["Good","Fair","Moderate","Poor","Very Poor"][
                  weather.air.main.aqi - 1
                ]
              : "Not Available"}
          </p>
        </div>

        <div className="card">
          <h3>🌅 Sunrise</h3>
          <h2>
            {weather?.sys?.sunrise
              ? new Date(
                  weather.sys.sunrise * 1000
                ).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "--:--"}
          </h2>
        </div>

        <div className="card">
          <h3>🌇 Sunset</h3>
          <h2>
            {weather?.sys?.sunset
              ? new Date(
                  weather.sys.sunset * 1000
                ).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "--:--"}
          </h2>
        </div>

        <div className="card">
          <h3>☁ Weather</h3>

          {weather ? (
            <>
              <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt="Weather"
                width="70"
              />

              <h2>
                {weather.weather[0].main}
              </h2>
            </>
          ) : (
            <h2>--</h2>
          )}
        </div>

      </section>

      {/* ================= AI ================= */}

      <section className="ai-dashboard">

        <div className="ai-card">

          <h2>🤖 AI Weather Insights</h2>

          {weather ? (
            <>
              <p>📍 {weather.name}</p>
              <p>🌡 {weather.main.temp} °C</p>
              <p>💧 {weather.main.humidity}%</p>
              <p>🌬 {weather.wind.speed} m/s</p>
              <p>☁ {weather.weather[0].description}</p>
            </>
          ) : (
            <>
              <p>✔ AI Prediction</p>
              <p>✔ Travel Recommendation</p>
              <p>✔ Rain Forecast</p>
              <p>✔ Smart Alerts</p>
            </>
          )}

        </div>

        <div className="alert-card">

          <h2>🚨 System Status</h2>

          <div className="alert">
            Live Monitoring Active
          </div>

          <div className="alert safe">
            OpenWeather API Connected
          </div>

        </div>

      </section>

      {/* ================= STATS ================= */}

      <section className="stats">

        <div className="stat-box">
          <h1>100+</h1>
          <p>Cities Covered</p>
        </div>

        <div className="stat-box">
          <h1>99%</h1>
          <p>Forecast Accuracy</p>
        </div>

        <div className="stat-box">
          <h1>24/7</h1>
          <p>Live Updates</p>
        </div>

        <div className="stat-box">
          <h1>AI</h1>
          <p>Smart Prediction</p>
        </div>

      </section>

      {/* ================= SERVICES ================= */}

      <section className="services">

        <h2>Our Services</h2>

        <div className="service-container">

          <div className="service-card">
            <h3>🌦 Live Weather</h3>
            <p>Real-time weather monitoring worldwide.</p>
          </div>

          <div className="service-card">
            <h3>🤖 AI Forecasting</h3>
            <p>AI-powered intelligent predictions.</p>
          </div>

          <div className="service-card">
            <h3>🚨 Smart Alerts</h3>
            <p>Instant severe weather notifications.</p>
          </div>

          <div className="service-card">
            <h3>📊 Analytics</h3>
            <p>Weather insights and reporting.</p>
          </div>

        </div>

      </section>

      {/* ================= BUSINESS ================= */}

      <section className="business-query">

        <h2>Business Enquiries</h2>

        <div className="query-card">

          <p>

            Looking for enterprise weather
            solutions or API integration?
            Contact Aetherix Technologies.

          </p>

          <p>

            <strong>Email:</strong>
            {" "}
            hpsthegame@gmail.com

          </p>

        </div>

      </section>

      {/* ================= FOOTER ================= */}

      <footer>

        <div className="footer-content">

          <h2>🌤 Aetherix Technologies</h2>

          <p>

            Powered by React • Vite •
            OpenWeather API

          </p>

          <hr />

          <p>

            © 2026 Aetherix Technologies.
            All Rights Reserved.

          </p>

        </div>

      </footer>

    </div>

  );

}

export default Home;