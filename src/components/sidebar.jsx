import {
  FaHome,
  FaCloudSun,
  FaLeaf,
  FaPlane,
  FaCity,
  FaMapMarkedAlt,
  FaChartBar,
  FaBell,
  FaUser,
  FaCog,
} from "react-icons/fa";

import { useNavigate, useLocation } from "react-router-dom";
import "./sidebar.css";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const menuItems = [
  { name: "Dashboard", icon: <FaHome />, path: "/dashboard" },
  { name: "Weather", icon: <FaCloudSun />, path: "/dashboard" },
  { name: "Forecast", icon: <FaChartBar />, path: "/forecast" },
  { name: "Maps", icon: <FaMapMarkedAlt />, path: "/map" },
  { name: "Alerts", icon: <FaBell />, path: "/alerts" },
  { name: "Agriculture", icon: <FaLeaf />, path: "/coming-soon" },
  { name: "Travel", icon: <FaPlane />, path: "/coming-soon" },
  { name: "Smart City", icon: <FaCity />, path: "/coming-soon" },
  { name: "Profile", icon: <FaUser />, path: "/profile" },
  { name: "Settings", icon: <FaCog />, path: "/settings" },
];

  return (
    <aside className="sidebar">
      <div
  className="sidebar-logo"
  onClick={() => navigate("/dashboard")}
>
  <div className="sidebar-logo-icon">🌤</div>

  <h2>AETHERIX</h2>

  <p>Trusted Intelligence</p>
</div>

      <div className="sidebar-menu">

  <p className="menu-heading">
    MAIN MENU
  </p>
        {menuItems.map((item) => (
          <div
            key={item.name}
            className={`menu-item ${
              location.pathname === item.path ? "active" : ""
            }`}
            onClick={() => navigate(item.path)}
          >
            <span className="menu-icon">{item.icon}</span>
            <span>{item.name}</span>
          </div>
        ))}
      </div>
     
     <div className="sidebar-footer">

  <div className="sidebar-user">

    <div className="user-avatar">
      👩
    </div>

    <div className="user-info">
      <h4>Priyadarshini</h4>
      <p>Administrator</p>
    </div>

  </div>

  <button
    className="logout-sidebar-btn"
    onClick={() => navigate("/")}
  >
    🚪 Logout
  </button>

</div>
    </aside>
  );
}

export default Sidebar;