import logo from "./assets/logo.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./register.css";

function Register() {

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

 const handleRegister = async () => {
  if (
    name.trim() === "" ||
    email.trim() === "" ||
    password.trim() === "" ||
    confirmPassword.trim() === ""
  ) {
    alert("Please fill all fields.");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  const API_URL = import.meta.env.VITE_API_URL;

  try {
    const response = await fetch(
      `${API_URL}/auth/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      }
    );

    const data = await response.json();

    if (response.ok) {
      alert(data.message);
      navigate("/");
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error(error);
    alert("Server Error");
  }
};

  return (

    <div className="register-container">

      <div className="register-left">

        <div className="logo-box">
          <img
            src={logo}
            alt="Aetherix Logo"
            className="logo-image"
          />
        </div>

        <h1>Aetherix Technologies</h1>

        <h2>Create Your Account</h2>

        <p>
          Join our AI Weather Forecast Platform and receive accurate weather
          predictions, live alerts and smart insights.
        </p>

      </div>

      <div className="register-right">

        <div className="register-card">

          <h2>Create Account</h2>

          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button
            className="register-button"
            onClick={handleRegister}
          >
            Register
          </button>

          <button
            className="back-button"
            onClick={() => navigate("/login")}
          >
            Back to Login
          </button>

        </div>

      </div>

    </div>

  );

}

export default Register;