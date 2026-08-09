import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FiArrowLeft,
  FiSearch,
  FiHome,
  FiX,
} from "react-icons/fi";

import { WiDayCloudy } from "react-icons/wi";
import { GiWheat } from "react-icons/gi";

import {
  FaCity,
  FaShip,
  FaPlane,
} from "react-icons/fa";

import { MdOutlineInsights } from "react-icons/md";

import "./ExploreServices.css";


function ExploreServices() {

  const navigate = useNavigate();

  // ==============================
  // SERVICE SEARCH
  // ==============================

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState("");


  // ==============================
  // SERVICES
  // ==============================

  const services = [

    {
      title: "Weather Intelligence",
      icon: <WiDayCloudy />,
      description: "Live Weather • Forecast • Alerts",
      route: "/dashboard",
    },

    {
      title: "Weather Search",
      icon: <WiDayCloudy />,
      description: "Search cities • Live Weather • Forecast",
      route: "/weather-search",
    },

    {
      title: "Agriculture AI",
      icon: <GiWheat />,
      description: "Crop Health • Irrigation • Advisory",
      route: "/agriculture",
    },

    {
      title: "Smart City",
      icon: <FaCity />,
      description: "Traffic • Pollution • Disaster",
      route: "/smartcity",
    },

    {
      title: "Marine",
      icon: <FaShip />,
      description: "Ocean • Navigation • Fishing",
      route: "/marine",
    },

    {
      title: "Aviation",
      icon: <FaPlane />,
      description: "Wind • Visibility • Flight Weather",
      route: "/aviation",
    },

    {
      title: "Climate Analytics",
      icon: <MdOutlineInsights />,
      description: "Historical Data • AI Analytics",
      route: "/climate",
    },

  ];


  // ==============================
  // FILTER SERVICES
  // ==============================

  const filteredServices = services.filter((service) =>
    `${service.title} ${service.description}`
      .toLowerCase()
      .includes(searchText.toLowerCase())
  );


  // ==============================
  // CLOSE SEARCH
  // ==============================

  const closeSearch = () => {
    setSearchOpen(false);
    setSearchText("");
  };


  // ==============================
  // OPEN SERVICE
  // ==============================

  const openService = (route) => {
    navigate(route);
  };


  return (

    <div className="explore-page">


      {/* =================================================
          HEADER
      ================================================= */}

      <header className="explore-navbar">


        {/* ================= LOGO ================= */}

        <div
          className="explore-logo"
          onClick={() => navigate("/")}
          title="Aetherix Technologies"
        >

          <img
            src="/logo.png"
            alt="Aetherix Technologies"
          />

        </div>


        {/* ================= BACK BUTTON ================= */}

        <button
          type="button"
          className="explore-back-btn"
          onClick={() => navigate(-1)}
          title="Go Back"
        >

          <FiArrowLeft />

        </button>


        {/* ================= RIGHT NAVIGATION ================= */}

        <div className="explore-nav-right">


          {/* =================================================
              SEARCH
          ================================================= */}

          {searchOpen ? (

            <div className="service-search-box">

              <FiSearch />

              <input
                type="text"
                placeholder="Search services..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                autoFocus
              />

              <button
                type="button"
                className="service-search-close"
                onClick={closeSearch}
                title="Close Search"
              >

                <FiX />

              </button>

            </div>

          ) : (

            <button
              type="button"
              className="explore-search-btn"
              onClick={() => setSearchOpen(true)}
              title="Search Services"
            >

              <FiSearch />

            </button>

          )}


          {/* =================================================
              HOME
          ================================================= */}

          <button
            type="button"
            className="explore-home-btn"
            onClick={() => navigate("/")}
            title="Home"
          >

            <FiHome />

            <span>
              Home
            </span>

          </button>


        </div>

      </header>


      {/* =================================================
          HERO
      ================================================= */}

      <section className="explore-hero">

        <h1>
          Explore Aetherix AI Services
        </h1>

        <p>
          Choose the intelligence platform you want to use.
        </p>

      </section>


      {/* =================================================
          SERVICES
      ================================================= */}

      <section className="services-grid">


        {filteredServices.length > 0 ? (

          filteredServices.map((service) => (

            <div
              key={service.title}
              className="service-card"
              onClick={() => openService(service.route)}
            >


              {/* SERVICE ICON */}

              <div className="service-icon">

                {service.icon}

              </div>


              {/* SERVICE TITLE */}

              <h3>
                {service.title}
              </h3>


              {/* SERVICE DESCRIPTION */}

              <p>
                {service.description}
              </p>


              {/* OPEN SERVICE */}

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  openService(service.route);
                }}
              >

                Open Service →

              </button>


            </div>

          ))

        ) : (

          <div className="no-service-results">

            <div className="no-service-icon">
              🔍
            </div>

            <h2>
              No Service Found
            </h2>

            <p>
              Try searching for another Aetherix service.
            </p>

          </div>

        )}

      </section>


    </div>

  );

}


export default ExploreServices;