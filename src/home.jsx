import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { useState } from "react";
import "./home.css";
import ceo from "./assets/ceo.jpg";

function Home() {


  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cityOptions, setCityOptions] = useState([]);
  const [showAbout, setShowAbout] = useState(false);
const [selectedCity, setSelectedCity] = useState(null);
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");

  const navigate = useNavigate();

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
    console.log("API Response:", data);

   const options = data.map((item) => ({
  label: `${item.name}${item.state ? ", " + item.state : ""}, ${item.country}`,
  value: item.name,
  lat: item.lat,
  lon: item.lon,
}));
    console.log("Options:", options);
    setCityOptions(options);
  } catch (error) {
    console.log(error);
  }

};

const getCurrentLocation = () => {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser.");
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

        localStorage.setItem("weather", JSON.stringify(data));
        localStorage.setItem("lat", lat);
        localStorage.setItem("lon", lon);
      } catch (err) {
        console.error(err);
        alert("Location weather failed");
      }
    },
    () => {
      alert("Please allow location access.");
    }
  );
};

  const getWeather = async () => {
  if (!selectedCity) {
    alert("Please select a city from the suggestions");
    return;
  }

  try {
    setLoading(true);

    // Makes the loader visible for at least 1 second
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const response = await fetch(
      `https://aetherix-backend-eoj8.onrender.com/api/weather?lat=${selectedCity.lat}&lon=${selectedCity.lon}`
    );

    const data = await response.json();

    ...
  }finally {
  setLoading(false);
}
};
  return (

    <div className="home">

      {/* NAVBAR */}

      <nav className="navbar">

        <div className="logo-section">

          <div className="logo-circle">
            🌤
          </div>

          <div>

            <h2>Aetherix Technologies</h2>

            <p>AI Weather Forecast Platform</p>

          </div>

        </div>

        
   <ul>
  <li onClick={() => navigate("/home")} style={{ cursor: "pointer" }}>
    Home
  </li>

  <li onClick={() => navigate("/forecast")} style={{ cursor: "pointer" }}>
    Forecast
  </li>

  <li onClick={() => navigate("/dashboard")} style={{ cursor: "pointer" }}>
    Dashboard
  </li>

  <li onClick={() => navigate("/alerts")} style={{ cursor: "pointer" }}>
    Alerts
  </li>

  <li
    onClick={() => setShowAbout(!showAbout)}
    style={{ cursor: "pointer" }}
  >
    About
  </li>

  <li>
    <button
      className="logout-btn"
      onClick={() => navigate("/")}
    >
      Logout
    </button>
  </li>
</ul>
      </nav>
    {/* ABOUT */}

{showAbout && (
  
  <section className="about-section">

  {/* CEO */}

  <img src={ceo} alt="CEO" className="ceo-image" />


  <p className="about-text">
  Aetherix Technologies is an innovative AI-powered weather forecasting platform dedicated to delivering accurate, reliable, and real-time weather intelligence for individuals, businesses, and organizations. By combining Artificial Intelligence, cloud computing, and the OpenWeather API, our platform provides live weather monitoring, intelligent forecasts, smart weather alerts, advanced weather analytics, and location-based insights to help users make informed decisions. Our mission is to enhance safety, improve travel planning, support agriculture, assist disaster preparedness, and empower industries with data-driven weather solutions that are accessible, efficient, and easy to use. We are committed to continuous innovation, delivering scalable and intelligent weather technologies that transform complex weather data into meaningful information, enabling smarter decisions and a better future through the power of AI.
</p>


  {/* ABOUT */}

</section>
)}

      {/* HERO */}

      <section className="hero">

        <div className="left">

          <h1
  style={{
    fontSize: "40px",
    lineHeight: "1.2",
    fontWeight: "700"
  }}
 >
  AI Weather Forecast
  <br />
  Intelligence Platform
</h1>
          

          <p>
            Forecasting Tomorrow, Today.
          </p>

          <div className="feature-box">

            <div className="feature">🤖 AI Powered</div>

            <div className="feature">📡 Live Weather</div>

            <div className="feature">🌍 Global Coverage</div>

            <div className="feature">⚡ Smart Prediction</div>

          </div>

        </div>

        <div className="right">

          <div className="search-card">

  <h2>Search Weather</h2>

  <p>Options: {cityOptions.length}</p>

 <Select
  options={cityOptions}
  placeholder="Search City..."
  isSearchable
  isClearable
  inputValue={city}
  styles={{
    control: (provided) => ({
      ...provided,
      backgroundColor: "#ffffff",
      border: "2px solid #4aa3ff",
      borderRadius: "10px",
      minHeight: "55px",
      fontSize: "18px",
      boxShadow: "none",
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#2d4f7c",
      color: "#fff",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#4aa3ff" : "#2d4f7c",
      color: "#fff",
      cursor: "pointer",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#000",
    }),
    input: (provided) => ({
      ...provided,
      color: "#000",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#777",
    }),
  }}
  onInputChange={(value, actionMeta) => {
    if (actionMeta.action === "input-change") {
      setCity(value);
      searchCities(value);
    }
  }}
 onChange={(selected) => {
  if (selected) {
    setSelectedCity(selected);
    setCity(selected.label);

    setLat(selected.lat);
    setLon(selected.lon);
  } else {
    setSelectedCity(null);
    setCity("");
    setLat("");
    setLon("");
    setCityOptions([]);
  }
}}
/>
 <button onClick={getWeather}>
  Get Weather
</button> 

<button
    className="location-btn"
    onClick={getCurrentLocation}
>
    🧭 Use My Current Location
</button>

  {loading && (
  <div className="loading-container">
    <div className="loader"></div>
    <p>🌤 Fetching live weather data...</p>
  </div>
)}

  {weather && (
  <div className="city-box">

    <h3>
      {weather.name}, {weather.sys.country}
    </h3>

    <div style={{ textAlign: "center", marginTop: "15px" }}>
      <img
        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
        alt="Weather Icon"
      />

      <h3>
        {weather.name}, {weather.sys.country}
      </h3>

      <p>{weather.weather[0].description}</p>
      <p style={{ marginTop: "10px", fontSize: "14px", color: "#ddd" }}>
  Last Updated: {new Date().toLocaleTimeString()}
</p>
    </div>

  </div>
)}
</div>   {/* search-card */}

</div>   {/* right */}

</section>
    
      {/* WEATHER CARDS */}

      <section className="cards">

        <div className="card">
  <h3>🌍 Air Quality</h3>

  <h2>
    {weather?.air?.main?.aqi ?? "--"}
  </h2>

  <p>
    {weather?.air?.main?.aqi
  ? ["Good", "Fair", "Moderate", "Poor", "Very Poor"][
      weather.air.main.aqi - 1
    ]
  : "Not Available"}
  </p>
</div>

              <div className="card">
          <h3>🌡 Temperature</h3>
          <h2>
            {weather ? `${weather.main.temp} °C` : "-- °C"}
          </h2>
        </div>

        <div className="card">
  <h3>🌡 Feels Like</h3>
  <h2>{weather ? `${weather.main.feels_like} °C` : "-- °C"}</h2>
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
  <h3>🌅 Sunrise</h3>
  <h2>
    {weather
      ? new Date(weather.sys.sunrise * 1000).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "--:--"}
  </h2>
</div>
      <div className="card">
  <h3>🌇 Sunset</h3>
  <h2>
    {weather
      ? new Date(weather.sys.sunset * 1000).toLocaleTimeString([], {
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
        alt="Weather Icon"
        width="70"
      />

      <h2>{weather.weather[0].main}</h2>

    </>

  ) : (

    <h2>---</h2>

  )}

</div>

      </section>

      {/* AI DASHBOARD */}

      <section className="ai-dashboard">

        <div className="ai-card">

          <h2>🤖 AI Weather Insights</h2>

          {weather ? (

            <>
              <p>📍 City : {weather.name}</p>

              <p>🌍 Country : {weather.sys.country}</p>

              <p>🌡 Feels Like : {weather.main.feels_like} °C</p>

              <p>💧 Humidity : {weather.main.humidity}%</p>

              <p>🌬 Wind Speed : {weather.wind.speed} m/s</p>

              <p>☁ Condition : {weather.weather[0].description}</p>

            </>

          ) : (

            <>
              <p>✔ AI Rain Prediction</p>

              <p>✔ Temperature Trend</p>

              <p>✔ Smart Weather Alerts</p>

              <p>✔ Travel Recommendation</p>

            </>

          )}

        </div>

        <div className="alert-card">

          <h2>🚨 Weather Alerts</h2>

          <div className="alert">

            Live Weather Monitoring Enabled

          </div>

          <div className="alert safe">

            OpenWeather API Connected

          </div>

        </div>

      </section>

      {/* STATISTICS */}

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

{/* SERVICES */}

<section className="services">

  <h2>Our Services</h2>

  <div className="service-container">

    <div className="service-card">
      <h3>🌦 Live Weather Monitoring</h3>
      <p>Real-time weather updates for cities worldwide.</p>
    </div>

    <div className="service-card">
      <h3>🤖 AI Weather Prediction</h3>
      <p>AI-powered intelligent weather forecasting.</p>
    </div>

    <div className="service-card">
      <h3>🚨 Weather Alerts</h3>
      <p>Instant severe weather notifications and alerts.</p>
    </div>

    <div className="service-card">
      <h3>📊 Weather Analytics</h3>
      <p>Weather reports, trends and analytics dashboard.</p>
    </div>

  </div>

</section>

{/* BUSINESS ENQUIRY */}

<section className="business-query">

  <h2>Business Enquiries</h2>

  <div className="query-card">

    <p>
      Looking for AI-powered weather forecasting solutions for your
      organization? Contact Aetherix Technologies for collaborations,
      enterprise solutions, API integration, and custom weather analytics.
    </p>

    <p><strong>📧 Email:</strong> hpsthegame@gmail.com</p>

    </div>

</section>
    
      <footer>

  <div className="footer-content">

    <h2>🌤 Aetherix Technologies</h2>

    <p>
      Powered by OpenWeather API | React | Vite
    </p>

    <hr />

    <p>
      © 2026 Aetherix Technologies. All Rights Reserved.
    </p>

  </div>

</footer>

    </div>

  );

}

export default Home;