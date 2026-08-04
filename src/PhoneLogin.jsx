import logo from "./assets/logo.png";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./otp.css";

import {
  initializeMSG91,
  sendOTP,
  verifyOTP,
  retryOTP,
} from "./msg91";

import "./otp.css";

function PhoneLogin() {
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    initializeMSG91()
      .then(() => console.log("MSG91 Initialized"))
      .catch(console.error);
  }, []);

  const handleSendOTP = async () => {
    if (!phone.trim()) {
      alert("Enter Mobile Number");
      return;
    }

    try {
      setSending(true);

      const result = await sendOTP(phone);

      console.log(result);

      if (result.type === "success") {
        alert("OTP Sent Successfully");
      } else {
        alert(result.message || "Failed to send OTP");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to send OTP");
    } finally {
      setSending(false);
    }
  };
    const handleVerifyOTP = async () => {
  if (!otp.trim()) {
    alert("Enter OTP");
    return;
  }

  try {
    setVerifying(true);

    const result = await verifyOTP(otp);

    console.log("========== VERIFY OTP RESULT ==========");
    console.log(result);
    console.log("Type:", result.type);
    console.log("Message:", result.message);
    console.log("Keys:", Object.keys(result));

    if (result.type !== "success") {
      alert("Invalid OTP");
      return;
    }

    const API_URL = import.meta.env.VITE_API_URL;

    const backendResponse = await axios.post(
      `${API_URL}/phone/verify-phone`,
      {
        accessToken: result.message,
      }
    );

    console.log("========== BACKEND RESPONSE ==========");
    console.log(backendResponse.data);

    if (!backendResponse.data.success) {
      return;
    }
    console.log("STEP 1");

localStorage.setItem(
  "token",
  backendResponse.data.token
);

console.log("STEP 2");

localStorage.setItem(
  "user",
  JSON.stringify(backendResponse.data.user)
);

console.log("STEP 3");

alert("Login Successful");

console.log("STEP 4");

navigate("/dashboard");

console.log("STEP 5");

  } catch (err) {
    console.error("========== AXIOS ERROR ==========");
    console.error(err);

    if (err.response) {
      console.log("Status:", err.response.status);
      console.log("Response:", err.response.data);

      alert(
        JSON.stringify(err.response.data, null, 2)
      );
    } else {
      alert("OTP Verification Failed");
    }
  } finally {
    setVerifying(false);
  }
};

  const handleRetryOTP = async () => {
    try {
      await retryOTP();
      alert("OTP Resent Successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to resend OTP");
    }
  };

  return (
    <div className="otp-container">
      <div className="otp-card">

        <img
          src={logo}
          alt="logo"
          style={{
            width: "80px",
            display: "block",
            margin: "0 auto 15px",
          }}
        />

        <h2>Aetherix Phone Login</h2>

        <input
          type="tel"
          placeholder="Enter Mobile Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <button
          onClick={handleSendOTP}
          disabled={sending}
        >
          {sending
            ? "Sending..."
            : "Send OTP"}
        </button>

        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
                <button
          onClick={handleVerifyOTP}
          disabled={verifying}
        >
          {verifying
            ? "Verifying..."
            : "Verify OTP"}
        </button>

        <button
          onClick={handleRetryOTP}
        >
          Resend OTP
        </button>

        <button
          onClick={() => navigate("/login")}
          style={{
            background: "#6b7280",
            marginTop: "10px",
          }}
        >
          ← Back to Login
        </button>

      </div>
    </div>
  );
}

export default PhoneLogin;