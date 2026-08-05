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
    { name: "Environment", icon: <FaCloudSun />, path: "/dashboard" },
    { name: "Agriculture", icon: <FaLeaf />, path: "/coming-soon" },
    { name: "Travel", icon: <FaPlane />, path: "/coming-soon" },
    { name: "Smart City", icon: <FaCity />, path: "/coming-soon" },
    { name: "Maps", icon: <FaMapMarkedAlt />, path: "/map" },
    { name: "Reports", icon: <FaChartBar />, path: "/coming-soon" },
    { name: "Alerts", icon: <FaBell />, path: "/alerts" },
    { name: "Profile", icon: <FaUser />, path: "/coming-soon" },
    { name: "Settings", icon: <FaCog />, path: "/coming-soon" },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h2>AETHERIX</h2>
        <p>Daily Decisions</p>
      </div>

      <div className="sidebar-menu">
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
        Version 1.0
      </div>
    </aside>
  );
}

export default Sidebar;