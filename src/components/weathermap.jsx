import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Navbar from "./navbar";
import "./weathermap.css";

// Fix marker icon
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function WeatherMap() {
  const weather = JSON.parse(localStorage.getItem("weather"));

  if (!weather) {
    return (
      <div>
        <Navbar />
        <h2
          style={{
            textAlign: "center",
            marginTop: "80px",
            color: "white",
          }}
        >
          Please search a city from the Home page first.
        </h2>
      </div>
    );
  }

  const position = [weather.coord.lat, weather.coord.lon];

  return (
    <div className="map-page">
      <Navbar />

      <h1 className="map-title">🌍 Live Weather Map</h1>

      <MapContainer
        center={position}
        zoom={10}
        style={{
          height: "80vh",
          width: "95%",
          margin: "20px auto",
          borderRadius: "15px",
        }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={position}>
          <Popup>
            <h3>{weather.name}</h3>

            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt="weather"
            />

            <p>🌡 {weather.main.temp} °C</p>

            <p>💧 Humidity: {weather.main.humidity}%</p>

            <p>🌬 Wind: {weather.wind.speed} m/s</p>

            <p>☁ {weather.weather[0].description}</p>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default WeatherMap;