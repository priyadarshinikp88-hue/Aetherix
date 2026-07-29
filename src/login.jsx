import logo from "./assets/logo.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

 const handleLogin = async () => {

  if (email.trim() === "" || password.trim() === "") {
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

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      alert(data.message);

      navigate("/home");

    } else {

      alert(data.message);

    }

  } catch (error) {

    console.error(error);
    alert("Server Error");

  }

};
  return (
    <div className="login-container">

      {/* Left Panel */}

      <div className="left-panel">

        <div className="logo-box">
          <img
            src={logo}
            alt="Aetherix Logo"
            className="logo-image"
          />
        </div>

        <h1>Aetherix Technologies</h1>

        <h2>AI Weather Forecast Platform</h2>

        
          <p>
  Smart weather prediction powered by Artificial Intelligence.
  Get accurate forecasts, weather alerts and real-time updates.
</p>

<div className="contact-info">

  <p>
  📧 <strong>Email:</strong>{" "}
  <a href="mailto:hpsthegame@gmail.com">
    hpsthegame@gmail.com
  </a>
</p>


</div>
    

      </div>

      {/* Right Panel */}

      <div className="right-panel">

        <div className="login-card">

          <h2>Welcome Back 👋</h2>

          <p>Login to continue</p>

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="show-password">

            <label>

              <input
                type="checkbox"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
              />

              Show Password

            </label>

          </div>

          <button
            className="login-btn"
            onClick={handleLogin}
          >
            Login
          </button>

          <button
            className="register-btn"
            onClick={() => navigate("/register")}
          >
            Create Account
          </button>

          <p
  className="forgot-password"
  onClick={() => navigate("/forgot-password")}
>
  Forgot Password?
</p>

        </div>

      </div>

    </div>
  );
}

export default Login;