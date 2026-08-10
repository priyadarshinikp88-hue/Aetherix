import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

const API_URL = "https://aetherix-backend-eoj8.onrender.com";

function Profile() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    membership: "User",
    profileImage: "",
  });

  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // =====================================================
  // GET TOKEN
  // =====================================================

  const getToken = () => {
    return (
      localStorage.getItem("token") ||
      localStorage.getItem("authToken") ||
      localStorage.getItem("accessToken")
    );
  };

  // =====================================================
  // LOAD PROFILE
  // =====================================================

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const token = getToken();

    if (!token) {
      alert("Please login again.");
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/auth/profile`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      console.log("PROFILE RESPONSE:", data);

      if (response.status === 401) {
        alert("Session expired. Please login again.");

        localStorage.removeItem("token");
        localStorage.removeItem("authToken");
        localStorage.removeItem("accessToken");

        navigate("/login");
        return;
      }

      if (!response.ok) {
        alert(data.message || "Unable to load profile.");
        return;
      }

      setProfile({
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        membership: data.membership || "User",
        profileImage: data.profileImage || "",
      });
    } catch (error) {
      console.error("Profile loading error:", error);
      alert("Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // CHANGE PHOTO
  // =====================================================

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image.");
      return;
    }

    // Keep image size reasonable
    if (file.size > 4 * 1024 * 1024) {
      alert("Please select an image smaller than 4 MB.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setProfile((prev) => ({
        ...prev,
        profileImage: reader.result,
      }));
    };

    reader.readAsDataURL(file);
  };

  // =====================================================
  // SAVE PROFILE
  // =====================================================

  const saveProfile = async () => {
    const token = getToken();

    if (!token) {
      alert("Please login again.");
      navigate("/login");
      return;
    }

    if (!profile.name.trim()) {
      alert("Please enter your name.");
      return;
    }

    if (
      profile.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        profile.email.trim()
      )
    ) {
      alert("Please enter a valid email.");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        `${API_URL}/api/auth/profile`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

         body: JSON.stringify({
  name: profile.name.trim(),
  email: profile.email.trim(),
  phone: profile.phone.trim(),
  profileImage: profile.profileImage || "",
}),
        }
      );

      const data = await response.json();

      console.log("SAVE PROFILE RESPONSE:", data);

      if (response.status === 401) {
        alert("Invalid or expired token. Please login again.");

        localStorage.removeItem("token");
        localStorage.removeItem("authToken");
        localStorage.removeItem("accessToken");

        navigate("/login");
        return;
      }

      if (!response.ok) {
        alert(data.message || "Unable to update profile.");
        return;
      }

      // =================================================
      // UPDATE STATE WITH DATABASE RESPONSE
      // =================================================

      setProfile({
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        membership: data.membership || "User",
        profileImage: data.profileImage || "",
      });

      // =================================================
      // SAVE LOCAL USER DATA
      // =================================================

      localStorage.setItem(
        "user",
        JSON.stringify(data)
      );

      setEditMode(false);

      alert("Profile updated successfully.");
    } catch (error) {
      console.error("Profile update error:", error);

      alert(
        "Unable to save profile. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("authToken");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");

    navigate("/login");
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-loading">
          Loading profile...
        </div>
      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="profile-page">

      <div className="profile-card">

        {/* ================= PHOTO ================= */}

        <div className="profile-photo-section">

          <img
            src={
              profile.profileImage ||
              "/default-profile.png"
            }
            alt="Profile"
            className="profile-photo"
          />

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            style={{ display: "none" }}
          />

          <button
            type="button"
            className="change-photo-btn"
            onClick={() =>
              fileInputRef.current?.click()
            }
          >
            Change Photo
          </button>

        </div>

        {/* ================= TITLE ================= */}

        <h1>My Profile</h1>

        {/* ================= VIEW MODE ================= */}

        {!editMode ? (
          <>
            <div className="profile-details">

              <h2>
                {profile.name || "Your Name"}
              </h2>

              <p>
                {profile.email || "No email"}
              </p>

              <p>
                {profile.phone
                  ? `+${profile.phone}`
                  : "No phone number"}
              </p>

            </div>

            {/* ================= MEMBERSHIP ================= */}

            <div className="membership-box">

              <h3>Membership</h3>

              <span className="membership-badge">
                ⭐ {profile.membership || "User"}
              </span>

            </div>

            {/* ================= EDIT ================= */}

            <button
              type="button"
              className="edit-profile-btn"
              onClick={() => setEditMode(true)}
            >
              Edit Profile
            </button>
          </>
        ) : (
          /* ================= EDIT MODE ================= */

          <div className="profile-edit-form">

            <label>Name</label>

            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
              placeholder="Enter your name"
            />

            <label>Email</label>

            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />

            <label>Phone Number</label>

            <input
              type="tel"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
            />

            <div className="profile-action-buttons">

              <button
                type="button"
                className="save-profile-btn"
                onClick={saveProfile}
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : "Save Profile"}
              </button>

              <button
                type="button"
                className="cancel-profile-btn"
                onClick={() => {
                  setEditMode(false);
                  loadProfile();
                }}
              >
                Cancel
              </button>

            </div>

          </div>
        )}

        {/* ================= LOGOUT ================= */}

        <button
          type="button"
          className="logout-btn"
          onClick={logout}
        >
          Logout
        </button>

      </div>

    </div>
  );
}

export default Profile;