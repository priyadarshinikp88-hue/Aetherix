import "./WeatherSearch.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FiSearch, FiMapPin } from "react-icons/fi";
import axios from "axios";

function WeatherSearch() {

  const navigate = useNavigate();

  const [city, setCity] = useState("");
   
     const handleSearch = async () => {

  if (!city.trim()) {
    alert("Please enter a city name.");
    return;
  }

  try {

    const apiKey = "e50888965e64e26c26f2f75a8f40f82e";

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );

    localStorage.setItem(
      "weather",
      JSON.stringify(response.data)
    );

    navigate("/dashboard");

  } catch (error) {

    alert("City not found.");

    console.log(error);

  }

};
  return (

    <div className="weather-search-page">

      <div className="weather-back">

        <Link to="/" className="home-btn">
          ← Home
        </Link>

      </div>

      <section className="weather-card">

        <span className="weather-tag">
          AETHERIX AI
        </span>

        <h1>
          Weather Intelligence
        </h1>

        <p>
          Search any city worldwide to access
          real-time weather, forecasts and AI insights.
        </p>

        <div className="search-box">

          <FiSearch className="search-icon" />

          <input
            type="text"
            placeholder="Enter city name..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />

        </div>

        <button
          className="search-btn"
          onClick={handleSearch}
        >
          Search Weather
        </button>

        <div className="recent-searches">

          <h3>
            Recent Searches
          </h3>

         

        </div>

        <button className="location-btn">

          <FiMapPin />

          Use Current Location

        </button>

      </section>

    </div>

  );

}

export default WeatherSearch;