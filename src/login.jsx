import logo from "./assets/logo.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "./firebase";

import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      alert("Please enter Email and Password");
      return;
    }

    try {
      const response = await fetch(
        "https://aetherix-backend-eoj8.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem(
          "token",
          data.token
        );

        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

        navigate("/home");
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.log(err);
      alert("Server Error");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);

      const result = await signInWithPopup(
        auth,
        provider
      );

      localStorage.setItem(
        "user",
        JSON.stringify(result.user)
      );

      navigate("/home");
    } catch (error) {
      console.log(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">

      {/* LEFT */}

      <div className="left-panel">

        <div className="logo-box">
          <img
            src={logo}
            alt="logo"
            className="logo-image"
          />
        </div>

        <h1>Aetherix Technologies</h1>

        <h2>
          AI-Powered Digital Innovation Platform
        </h2>

        <p>
          Building intelligent digital
          solutions for businesses,
          education, climate intelligence,
          cloud computing, cybersecurity,
          artificial intelligence and
          digital transformation.
        </p>

        <br />

        <p>
          Empowering organizations with
          secure, scalable and innovative
          technology platforms that drive
          growth, intelligence and
          sustainability.
        </p>

        <div className="contact-info">

          <p>
            🌐 www.aetherixcloud.com
          </p>

          <p>
            📧
            <a href="mailto:shrinivas@aetherixcloud.com">
              shrinivas@aetherixcloud.com
            </a>
          </p>

        </div>

      </div>

      {/* RIGHT */}

      <div className="right-panel">

        <div className="login-card">

          <h2>
            Welcome to
            <span>
              {" "}
              Aetherix Cloud
            </span>
          </h2>

          <p>
            Securely sign in to access
            your cloud dashboard.
          </p>

          <div className="input-box">

            <FiMail className="input-icon" />

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />

          </div>

          <div className="input-box">

            <FiLock className="input-icon" />

            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              placeholder="Password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
            />

            <span
              className="eye-icon"
              onClick={() =>
                setShowPassword(
                  !showPassword
                )
              }
            >
              {showPassword ? (
                <FiEyeOff />
              ) : (
                <FiEye />
              )}
            </span>

          </div>

          <button
            className="login-btn"
            onClick={handleLogin}
          >
            Login
          </button>

          <button
            className="google-btn"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            {loading
              ? "Signing in..."
              : "Continue with Google"}
          </button>
 
        <button
  className="phone-btn"
  onClick={() => navigate("/phone-login")}
>
  📱 Continue with Phone
</button>

          <button
            className="register-btn"
            onClick={() =>
              navigate("/register")
            }
          >
            Create Account
          </button>

          <p
            className="forgot-password"
            onClick={() =>
              navigate(
                "/forgot-password"
              )
            }
          >
            Forgot Password?
          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;