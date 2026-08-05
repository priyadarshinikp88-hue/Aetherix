import logo from "./assets/logo.png";
import { useState, useEffect } from "react";
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

  const [loading, setLoading] =
    useState(false);

  // Animated Words

  const words = [
    "Explore",
    "Innovate",
    "Evolve",
  ];

  const [currentWord, setCurrentWord] =
    useState(0);

  useEffect(() => {

    const timer = setInterval(() => {

      setCurrentWord(
        (prev) =>
          (prev + 1) % words.length
      );

    }, 2500);

    return () =>
      clearInterval(timer);

  }, []);

  const handleLogin = async () => {

    if (!email.trim() || !password.trim()) {

      alert(
        "Please enter Email and Password"
      );

      return;

    }

    try {

      const response = await fetch(
        "https://aetherix-backend-eoj8.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data =
        await response.json();

      if (response.ok) {

        localStorage.setItem(
          "token",
          data.token
        );

        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

        navigate("/dashboard");

      } else {

        alert(data.message);

      }

    } catch (err) {

      console.log(err);

      alert("Server Error");

    }

  };

  const handleGoogleLogin =
    async () => {

      try {

        setLoading(true);

        const result =
          await signInWithPopup(
            auth,
            provider
          );

        localStorage.setItem(
          "user",
          JSON.stringify(result.user)
        );

        navigate("/dashboard");

      } catch (error) {

        console.log(error);

        alert(error.message);

      } finally {

        setLoading(false);

      }

    };
      return (

    <div className="login-container">

      {/* LEFT PANEL */}

      <div className="left-panel">

        <div className="background-glow"></div>

        <div className="logo-box">

          <img
            src={logo}
            alt="Aetherix Logo"
            className="logo-image"
          />

        </div>

        <h1 className="brand-title">
          AETHERIX
        </h1>

        <h2 className="brand-tagline">
          One Platform
          <br />
          Endless Possibilities
        </h2>

        <div className="word-slider">
           
           <h2 className="animated-word">
  ✨ {words[currentWord]}
</h2>

        </div>

        <div className="divider"></div>
    <p className="brand-message">

Building Intelligent Platforms
<br />
for Tomorrow

</p>
          <div className="trust-badges">

  <span>🛡 Secure</span>

  <span>⚡ Intelligent</span>

  <span>☁ Reliable</span>

</div>

      </div>

      {/* RIGHT PANEL */}

      <div className="right-panel">

        <div className="login-card">

          <div className="login-header">

            <h2>Welcome Back</h2>

            <p>

              Sign in to continue your journey with
              <strong> Aetherix</strong>

            </p>

          </div>

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
                setPassword(e.target.value)
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
            Sign In
          </button>

          <button
            className="google-btn"
            onClick={handleGoogleLogin}
            disabled={loading}
          >

            {loading
              ? "Signing In..."
              : "Continue with Google"}

          </button>

          <button
            className="phone-btn"
            onClick={() =>
              navigate("/phone-login")
            }
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
              navigate("/forgot-password")
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