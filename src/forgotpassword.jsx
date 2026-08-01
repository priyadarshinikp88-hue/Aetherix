import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleSubmit = async () => {
    if (!email.trim()) {
      alert("Please enter your email.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();
      alert(data.message);

    } catch (error) {
      console.error(error);
      alert("Server Error");
    }
  };

  return (
    <div style={{ padding: "50px", maxWidth: "400px", margin: "auto" }}>
      <h2>Forgot Password</h2>

      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "15px",
        }}
      />

      <button
        onClick={handleSubmit}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "10px",
        }}
      >
        Send Reset Link
      </button>

      <button
        onClick={() => navigate("/")}
        style={{
          width: "100%",
          padding: "10px",
        }}
      >
        Back to Login
      </button>
    </div>
  );
}

export default ForgotPassword;