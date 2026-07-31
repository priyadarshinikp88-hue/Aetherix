import { useNavigate } from "react-router-dom";
import "../home.css";

function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="navbar">

      <div className="logo-section">
        <div className="logo-circle">🌤</div>

        <div>
          <h2>Aetherix Technologies</h2>
          <p>AI Weather Forecast Platform</p>
        </div>
      </div>

      <ul>
        <li onClick={() => navigate("/home")}>Home</li>

        <li onClick={() => navigate("/forecast")}>Forecast</li>

        <li onClick={() => navigate("/dashboard")}>Dashboard</li>

        <li onClick={() => navigate("/alerts")}>Alerts</li>

        <li onClick={() => navigate("/home")}>About</li>

        <li onClick={() => navigate("/map")}>Map</li>

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
  );
}

export default Navbar;