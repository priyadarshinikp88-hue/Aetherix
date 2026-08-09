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
  const [cityOptions, setCityOptions] = useState([]);
  const [searchingCities, setSearchingCities] = useState(false);

  // =====================================================
  // CITY SUGGESTIONS
  // =====================================================

  const searchCities = async (inputValue) => {
    const value = inputValue.trim();

    setCity(inputValue);

    if (value.length < 2) {
      setCityOptions([]);
      return;
    }

    try {
      setSearchingCities(true);

      const response = await fetch(
        `https://aetherix-backend-eoj8.onrender.com/api/cities?q=${encodeURIComponent(
          value
        )}`
      );

      const data = await response.json();

      console.log("🔎 City search:", value);
      console.log("🏙 City suggestions:", data);

      if (!response.ok) {
        setCityOptions([]);
        return;
      }

      const options = Array.isArray(data)
        ? data
            .filter(
              (item) =>
                item?.name &&
                item?.lat != null &&
                item?.lon != null
            )
            .map((item) => ({
              name: item.name,
              state: item.state || "",
              country: item.country || "",
              lat: item.lat,
              lon: item.lon,
            }))
        : [];

      setCityOptions(options);
    } catch (error) {
      console.error("❌ City search error:", error);
      setCityOptions([]);
    } finally {
      setSearchingCities(false);
    }
  };

  // =====================================================
  // SELECT CITY FROM SUGGESTIONS
  // =====================================================

  const selectCity = async (selectedCity) => {
    if (!selectedCity) return;

    console.log("📍 Selected city:", selectedCity);

    try {
      const response = await fetch(
        `https://aetherix-backend-eoj8.onrender.com/api/weather?lat=${encodeURIComponent(
          selectedCity.lat
        )}&lon=${encodeURIComponent(selectedCity.lon)}`
      );

      const data = await response.json();

      console.log("🌤 Weather response:", data);

      if (!response.ok) {
        alert(data.message || "Unable to fetch weather.");
        return;
      }

      // Update weather state
      if (setWeather) {
        setWeather(data);
      }

      // Save weather
      localStorage.setItem(
        "weather",
        JSON.stringify(data)
      );

      // Save coordinates for forecast
      localStorage.setItem(
        "lat",
        String(selectedCity.lat)
      );

      localStorage.setItem(
        "lon",
        String(selectedCity.lon)
      );

      // Clear search
      setCity("");
      setCityOptions([]);

      // Dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("❌ Weather fetch error:", error);

      alert(
        "Unable to fetch weather. Please try again."
      );
    }
  };

  // =====================================================
  // SEARCH BUTTON / ENTER
  // =====================================================

  const searchCity = () => {
    if (!city.trim()) {
      alert("Please enter a city.");
      return;
    }

    // If suggestions exist, select the first one
    if (cityOptions.length > 0) {
      selectCity(cityOptions[0]);
      return;
    }

    alert("Please select a city from the suggestions.");
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
          const response = await fetch(
            `https://aetherix-backend-eoj8.onrender.com/api/weather?lat=${encodeURIComponent(
              lat
            )}&lon=${encodeURIComponent(lon)}`
          );

          const data = await response.json();

          console.log("🌤 Live weather:", data);

          if (!response.ok) {
            alert(
              data.message ||
                "Unable to fetch weather."
            );
            return;
          }

          if (setWeather) {
            setWeather(data);
          }

          localStorage.setItem(
            "weather",
            JSON.stringify(data)
          );

          localStorage.setItem(
            "lat",
            String(lat)
          );

          localStorage.setItem(
            "lon",
            String(lon)
          );

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

      (error) => {
        console.error(
          "❌ Geolocation error:",
          error
        );

        if (error.code === 1) {
          alert(
            "Location permission was denied."
          );
        } else if (error.code === 2) {
          alert(
            "Your location could not be determined."
          );
        } else if (error.code === 3) {
          alert(
            "Location request timed out."
          );
        } else {
          alert(
            "Unable to get your current location."
          );
        }
      },

      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  };

  // =====================================================
  // NAVIGATION
  // =====================================================

  const openAlerts = () => {
    navigate("/alerts");
  };

  const goBack = () => {
    navigate(-1);
  };

  const goHome = () => {
    navigate("/");
  };

  // =====================================================
  // JSX
  // =====================================================

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
          SEARCH
      ================================================= */}

      <div className="search-container">

        <div className="search-box">

          <FiSearch
            className="search-icon"
            onClick={searchCity}
            title="Search City"
          />

          <input
            type="text"
            placeholder="Search city..."
            value={city}
            onChange={(e) =>
              searchCities(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                searchCity();
              }

              if (e.key === "Escape") {
                setCityOptions([]);
              }
            }}
          />

          <motion.button
            type="button"
            className="location-btn"
            onClick={getLiveLocation}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Use my current location"
          >
            <MdMyLocation className="live-icon" />
            <span>Live</span>
          </motion.button>

        </div>

        {/* =================================================
            CITY SUGGESTIONS
        ================================================= */}

        {cityOptions.length > 0 && (
          <div className="city-suggestions">

            {cityOptions.map((item, index) => (
              <button
                key={`${item.name}-${item.lat}-${item.lon}-${index}`}
                type="button"
                className="city-suggestion"
                onClick={() => selectCity(item)}
              >
                <FiSearch />

                <span>
                  <strong>
                    {item.name}
                  </strong>

                  {item.state && (
                    <small>
                      {item.state}
                    </small>
                  )}

                  <small>
                    {item.country}
                  </small>
                </span>
              </button>
            ))}

          </div>
        )}

        {searchingCities &&
          city.trim().length >= 2 && (
            <div className="city-search-loading">
              Searching cities...
            </div>
          )}

      </div>

      {/* =================================================
          RIGHT SIDE
      ================================================= */}

      <div className="nav-right">

        <button
          type="button"
          className="nav-icon-btn notification-btn"
          onClick={openAlerts}
          title="Weather Alerts"
        >
          <FiBell />

          <span className="notification-dot"></span>
        </button>

        <button
          type="button"
          className="nav-icon-btn back-btn"
          onClick={goBack}
          title="Go Back"
        >
          <FiArrowLeft />
        </button>

        <button
          type="button"
          className="nav-home"
          onClick={goHome}
          title="Home"
        >
          <FiHome />

          <span>Home</span>
        </button>

      </div>

    </nav>
  );
}

export default Navbar;