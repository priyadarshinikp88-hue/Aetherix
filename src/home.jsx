import { useNavigate } from "react-router-dom";
import {
  FiHome,
  FiBell,
  FiUser,
  FiChevronDown,
} from "react-icons/fi";

import "./home.css";
import logo from "./assets/logo.png";

function Home() {

  const navigate = useNavigate();

  return (

    <div className="home-page">

      {/* Animated Background */}

      <div className="background">

        <div className="gradient"></div>

        <div className="stars"></div>

        <div className="glow glow1"></div>

        <div className="glow glow2"></div>

      </div>

      {/* HEADER */}

      <header className="home-header">

        <div className="logo">

          <img
            src={logo}
            alt="Aetherix"
          />

          <div>

            <h2>Aetherix Technologies</h2>

          </div>

        </div>

        <nav>

          <button>

            <FiHome />

            Home

          </button>

          <button>

            <FiBell />

            Notifications

          </button>
       
        <button
    onClick={() => navigate("/about")}
>
 About

</button>

          <button
  className="profile-btn"
  onClick={() => navigate("/profile")}
>
  <FiUser />
  Profile
  <FiChevronDown />
</button>

        </nav>

      </header>

      {/* HERO */}

      <section className="hero">

        <div className="hero-left">

          <h1>

            Trusted Intelligence

            <br />

            For Every Industry

          </h1>

          <button

            className="explore-btn"

            onClick={() => navigate("/explore-services")}

          >

            Explore Services

          </button>

        </div>
                {/* AI Assistant */}

        <div className="hero-right">

          <div className="assistant-card">

            <div className="assistant-logo">

              <img
                src={logo}
                alt="Aetherix AI"
              />

            </div>

            <h2>

              Aetherix AI

            </h2>

            <input
              type="text"
              placeholder="Ask Aetherix AI..."
            />

            <button className="ask-btn">

              Ask AI

            </button>

          </div>

        </div>

      </section>

           
      {/* ================= FOOTER ================= */}

      <footer className="about-footer">

        <h2>

          Aetherix Technologies

        </h2>

        <span>

          © 2026 Aetherix Technologies.
          All Rights Reserved.

        </span>

      </footer>
    </div>

  );

}

export default Home;