import { useState } from "react";
import "./dashboard.css";

function SearchBar() {
  const [city, setCity] = useState("");

  const searchWeather = async () => {
    if (!city.trim()) {
      alert("Please enter a city name.");
      return;
    }

    try {
      const response = await fetch(
        `https://aetherix-backend-eoj8.onrender.com/api/weather?city=${encodeURIComponent(city)}`
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Unable to fetch weather");
        return;
      }

      if (!data.coord) {
        alert("Weather data is incomplete.");
        return;
      }

      localStorage.setItem("weather", JSON.stringify(data));
      localStorage.setItem("lat", data.coord.lat);
      localStorage.setItem("lon", data.coord.lon);

      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Unable to connect to the server.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: "10px",
        margin: "20px",
      }}
    >
      <input
        type="text"
        placeholder="Search City..."
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />

      <button onClick={searchWeather}>
        🔍 Search
      </button>
    </div>
  );
}

export default SearchBar;