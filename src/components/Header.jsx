import { FiHome, FiGrid, FiBell, FiUser } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "./Header.css";

function Header() {

  const navigate = useNavigate();

  return (

    <header className="header">

      <div className="header-logo">

        <h2>AETHERIX</h2>

        <span>Technologies</span>

      </div>

      <nav className="header-nav">

        <button onClick={() => navigate("/")}>
          <FiHome />
          <span>Home</span>
        </button>

        <button onClick={() => navigate("/dashboard")}>
          <FiGrid />
          <span>Dashboard</span>
        </button>

      </nav>

      <div className="header-actions">

        <button className="icon-btn">
          <FiBell />
        </button>

        <button className="profile-btn">
          <FiUser />
          <span>Profile</span>
        </button>

      </div>

    </header>

  );

}

export default Header;