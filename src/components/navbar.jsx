import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FiBell,
  FiSearch,
  FiArrowLeft,
  FiHome,
} from "react-icons/fi";

import { MdMyLocation } from "react-icons/md";
import { motion } from "framer-motion";

import logo from "../assets/logo.png";

import "./navbar.css";

function Navbar({ weather, setWeather }) {
  const navigate = useNavigate();

  const [city, setCity] = useState("");

  // =====================================================
  // SEARCH CITY
  // =====================================================

  const searchCity = async () => {
    if (!city.trim()) {
      alert("Please enter a city.");
      return;
    }

    try {
      const response = await fetch(
        `https://aetherix-backend-eoj8.onrender.com/api/weather?city=${encodeURIComponent(
          city.trim()
        )}`
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "City not found.");
        return;
      }

      if (setWeather) {
        setWeather(data);
      }

      localStorage.setItem(
        "weather",
        JSON.stringify(data)
      );

      navigate("/dashboard");

    } catch (error) {
      console.error("Weather search error:", error);

      alert("Unable to fetch weather.");
    }
  };


  // =====================================================
  // LIVE LOCATION
  // =====================================================

  const getLiveLocation = () => {
    console.log("📍 Live button clicked");

    if (!navigator.geolocation) {
      alert(
        "Geolocation is not supported by your browser."
      );
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        console.log("📍 Latitude:", lat);
        console.log("📍 Longitude:", lon);

        try {
          const url =
            `https://aetherix-backend-eoj8.onrender.com/api/weather` +
            `?lat=${encodeURIComponent(lat)}` +
            `&lon=${encodeURIComponent(lon)}`;

          console.log("🌐 Weather API:", url);

          const response = await fetch(url);

          console.log(
            "🌐 Status:",
            response.status
          );

          const data = await response.json();

          console.log("🌤 Weather:", data);

          if (!response.ok) {
            alert(
              data.message ||
              "Unable to fetch weather."
            );

            return;
          }

          // Update React state
          if (setWeather) {
            setWeather(data);
          }

          // Save weather
          localStorage.setItem(
            "weather",
            JSON.stringify(data)
          );

          // Save coordinates
          localStorage.setItem(
            "lat",
            String(lat)
          );

          localStorage.setItem(
            "lon",
            String(lon)
          );

          // Go to dashboard
          navigate("/dashboard");

        } catch (error) {
          console.error(
            "❌ Live weather error:",
            error
          );

          alert(
            "Unable to connect to weather server."
          );
        }
      },

      // =================================================
      // LOCATION ERROR
      // =================================================

      (error) => {
        console.error(
          "❌ Geolocation error:",
          error
        );

        if (error.code === 1) {
          alert(
            "Location permission was denied. Please allow location access for localhost."
          );

        } else if (error.code === 2) {
          alert(
            "Your location could not be determined. Please try again."
          );

        } else if (error.code === 3) {
          alert(
            "Location request timed out. Please try again."
          );

        } else {
          alert(
            "Unable to get your current location."
          );
        }
      },

      // =================================================
      // LOCATION OPTIONS
      // =================================================

      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  };


  // =====================================================
  // NOTIFICATION
  // =====================================================

  const openAlerts = () => {
    navigate("/alerts");
  };


  // =====================================================
  // BACK
  // =====================================================

  const goBack = () => {
    navigate(-1);
  };


  // =====================================================
  // HOME
  // =====================================================

  const goHome = () => {
    navigate("/");
  };

  return (
    <nav className="navbar">

      {/* =================================================
          LOGO
      ================================================= */}

      <div
        className="logo-section"
        onClick={goHome}
      >
        <img
          src={logo}
          alt="Aetherix Technologies"
          className="aetherix-logo"
        />
      </div>


      {/* =================================================
          SEARCH + LIVE
      ================================================= */}
<div className="search-container">

  <div className="search-box">

    <FiSearch
      className="search-icon"
      onClick={searchCity}
    />

    <input
      type="text"
      placeholder="Search city..."
      value={city}
      onChange={(e) => setCity(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          searchCity();
        }
      }}
    />

    {/* LIVE INSIDE SEARCH BAR */}
    <motion.button
      type="button"
      className="location-btn"
      onClick={getLiveLocation}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <MdMyLocation className="live-icon" />
      <span>Live</span>
    </motion.button>

  </div>

</div>

      {/* =================================================
          RIGHT SIDE
      ================================================= */}

      <div className="nav-right">

        {/* ================= NOTIFICATION ================= */}

        <button
          type="button"
          className="nav-icon-btn notification-btn"
          onClick={openAlerts}
          title="Weather Alerts"
        >

          <FiBell />

        </button>


        {/* ================= BACK ================= */}

        <button
          type="button"
          className="nav-icon-btn back-btn"
          onClick={goBack}
          title="Go Back"
        >

          <FiArrowLeft />

        </button>


        {/* ================= HOME ================= */}

        <button
          type="button"
          className="nav-home"
          onClick={goHome}
          title="Home"
        >

          <FiHome />

          <span>
            Home
          </span>

        </button>

      </div>

    </nav>
  );
}

export default Navbar;