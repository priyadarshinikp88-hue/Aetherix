import "./Profile.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Profile() {

  const navigate = useNavigate();

  const [profileImage, setProfileImage] = useState(
    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
  );

  const handleImageChange = (e) => {

    const file = e.target.files[0];

    if (file) {
      setProfileImage(URL.createObjectURL(file));
    }

  };

  const handleLogout = () => {

    localStorage.clear();

    navigate("/login");

  };

  return (

    <div className="profile-page">

      <div className="profile-back">

        <Link to="/" className="home-btn">
          ← Home
        </Link>

      </div>

      <section className="profile-container">

        <div className="profile-card">

          <div className="profile-image-section">

            <img
              src={profileImage}
              alt="Profile"
              className="profile-image"
            />

            <label
              htmlFor="profileUpload"
              className="change-photo-btn"
            >
              Change Photo
            </label>

            <input
              id="profileUpload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />

          </div>

          <h1>My Profile</h1>

          <h2>your name</h2>

          <p className="profile-email">
            example@gmail.com
          </p>

          <p className="profile-phone">
            +91 **********
          </p>

          <p className="profile-birthday">
            🎂 date/month/year
          </p>

          <div className="membership-card">

            <h3>Membership</h3>

            <span className="membership">
              ⭐ User
            </span>

          </div>

          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </section>

    </div>

  );

}

export default Profile;