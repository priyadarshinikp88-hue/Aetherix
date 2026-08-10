import "./Profile.css";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Profile() {
  const navigate = useNavigate();

  const [profileImage, setProfileImage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [membership, setMembership] = useState("User");

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // =====================================================
  // LOAD PROFILE
  // =====================================================

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch(
          "https://aetherix-backend-eoj8.onrender.com/api/auth/profile",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          alert(data.message || "Unable to load profile");
          return;
        }

        const user = data.user;

        setName(user.name || "");
        setEmail(user.email || "");
        setPhone(user.phone || "");
        setMembership(user.membership || "User");
        setProfileImage(user.profileImage || "");

        // Keep localStorage synchronized
        localStorage.setItem(
          "user",
          JSON.stringify(user)
        );

      } catch (error) {
        console.error(
          "Profile loading error:",
          error
        );
      }
    };

    loadProfile();
  }, [navigate]);

  // =====================================================
  // CHANGE PHOTO
  // =====================================================

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    // Only images
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    // 2 MB limit
    if (file.size > 2 * 1024 * 1024) {
      alert("Please select an image smaller than 2 MB.");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setProfileImage(reader.result);
    };

    reader.readAsDataURL(file);
  };

  // =====================================================
  // SAVE PROFILE
  // =====================================================

  const handleSave = async () => {
    if (!name.trim()) {
      alert("Name cannot be empty.");
      return;
    }

    if (!email.trim()) {
      alert("Email cannot be empty.");
      return;
    }

    setSaving(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login again.");
        navigate("/login");
        return;
      }

      const response = await fetch(
        "https://aetherix-backend-eoj8.onrender.com/api/auth/profile",
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            phone: phone.trim(),
            profileImage,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Failed to update profile."
        );
        return;
      }

      // Save updated user locally
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      // Update screen
      setName(data.user.name || "");
      setEmail(data.user.email || "");
      setPhone(data.user.phone || "");
      setMembership(
        data.user.membership || "User"
      );
      setProfileImage(
        data.user.profileImage || ""
      );

      setEditing(false);

      alert("Profile updated successfully!");

    } catch (error) {
      console.error(
        "Profile update error:",
        error
      );

      alert(
        "Unable to update profile. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  // =====================================================
  // PROFILE IMAGE
  // =====================================================

  const defaultImage =
    "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  return (
    <div className="profile-page">

      {/* ================= BACK ================= */}

      <div className="profile-back">
        <Link
          to="/"
          className="home-btn"
        >
          ← Home
        </Link>
      </div>

      {/* ================= PROFILE ================= */}

      <section className="profile-container">

        <div className="profile-card">

          {/* ================= PHOTO ================= */}

          <div className="profile-image-section">

            <img
              src={
                profileImage ||
                defaultImage
              }
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
              style={{
                display: "none",
              }}
            />

          </div>

          {/* ================= TITLE ================= */}

          <h1>My Profile</h1>

          {/* ================= NAME ================= */}

          {editing ? (
            <input
              type="text"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              className="profile-input"
              placeholder="Enter your name"
            />
          ) : (
            <h2>
              {name || "Your Name"}
            </h2>
          )}

          {/* ================= EMAIL ================= */}

          {editing ? (
            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="profile-input"
              placeholder="Enter your email"
            />
          ) : (
            <p className="profile-email">
              {email || "No email"}
            </p>
          )}

          {/* ================= PHONE ================= */}

          {editing ? (
            <input
              type="tel"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value)
              }
              className="profile-input"
              placeholder="Enter phone number"
            />
          ) : (
            <p className="profile-phone">
              {phone || "No phone number"}
            </p>
          )}

          {/* ================= MEMBERSHIP ================= */}

          <div className="membership-card">

            <h3>Membership</h3>

            <span className="membership">
              ⭐ {membership}
            </span>

          </div>

          {/* ================= ACTION BUTTONS ================= */}

          {!editing ? (
            <button
              className="edit-profile-btn"
              onClick={() =>
                setEditing(true)
              }
            >
              Edit Profile
            </button>
          ) : (
            <div className="profile-actions">

              <button
                className="save-profile-btn"
                onClick={handleSave}
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>

              <button
                className="cancel-profile-btn"
                onClick={() =>
                  window.location.reload()
                }
                disabled={saving}
              >
                Cancel
              </button>

            </div>
          )}

          {/* ================= LOGOUT ================= */}

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