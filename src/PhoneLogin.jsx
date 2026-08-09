import logo from "./assets/logo.png";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
  const [resending, setResending] = useState(false);

  // ==========================================
  // INITIALIZE MSG91
  // ==========================================

  useEffect(() => {

    initializeMSG91()
      .then(() => {
        console.log("MSG91 Initialized");
      })
      .catch((error) => {
        console.error("MSG91 Initialization Error:", error);
      });

  }, []);


  // ==========================================
  // SEND OTP
  // ==========================================

  const handleSendOTP = async () => {

    if (!phone.trim()) {
      alert("Please enter your mobile number.");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      alert("Please enter a valid 10-digit Indian mobile number.");
      return;
    }

    try {

      setSending(true);

      // +91 is automatically added
      const mobileNumber = `91${phone}`;

      console.log("Sending OTP to:", mobileNumber);

      const result = await sendOTP(mobileNumber);

      console.log("========== SEND OTP RESULT ==========");
      console.log(result);

      if (result?.type === "success") {

        alert("OTP sent successfully.");

      } else {

        alert(
          result?.message ||
          "Failed to send OTP."
        );

      }

    } catch (error) {

      console.error("========== SEND OTP ERROR ==========");
      console.error(error);

      alert(
        error?.message ||
        "Failed to send OTP."
      );

    } finally {

      setSending(false);

    }

  };


  // ==========================================
  // VERIFY OTP
  // ==========================================

  const handleVerifyOTP = async () => {

    if (!otp.trim()) {
      alert("Please enter the OTP.");
      return;
    }

    if (!/^\d{4,8}$/.test(otp)) {
      alert("Please enter a valid OTP.");
      return;
    }

    try {

      setVerifying(true);

      console.log("Verifying OTP:", otp);

      const result = await verifyOTP(otp);

      console.log("========== VERIFY OTP RESULT ==========");
      console.log(result);

      if (!result || result.type !== "success") {

        alert(
          result?.message ||
          "Invalid OTP."
        );

        return;
      }

      // ====================================
      // MSG91 ACCESS TOKEN
      // ====================================

      const accessToken =
        result.message ||
        result.accessToken ||
        result.token;

      if (!accessToken) {

        console.error(
          "MSG91 response does not contain access token:",
          result
        );

        alert("OTP verified, but MSG91 access token was not received.");

        return;
      }


      // ====================================
      // BACKEND
      // ====================================

      const API_URL = import.meta.env.VITE_API_URL;

      if (!API_URL) {

        alert("Backend API URL is not configured.");

        return;
      }

      console.log("Sending access token to backend...");

      const backendResponse = await axios.post(
        `${API_URL}/phone/verify-phone`,
        {
          accessToken: accessToken,
        }
      );

      console.log("========== BACKEND RESPONSE ==========");
      console.log(backendResponse.data);


      if (!backendResponse.data?.success) {

        alert(
          backendResponse.data?.message ||
          "Phone verification failed."
        );

        return;
      }


      // ====================================
      // SAVE LOGIN DATA
      // ====================================

      if (backendResponse.data.token) {

        localStorage.setItem(
          "token",
          backendResponse.data.token
        );

      }

      if (backendResponse.data.user) {

        localStorage.setItem(
          "user",
          JSON.stringify(
            backendResponse.data.user
          )
        );

      }


      // Save phone number if needed
      localStorage.setItem(
        "phone",
        `+91${phone}`
      );


      alert("Login Successful!");

      navigate("/dashboard");

    } catch (error) {

      console.error(
        "========== OTP VERIFICATION ERROR =========="
      );

      console.error(error);

      if (error?.response) {

        console.error(
          "Status:",
          error.response.status
        );

        console.error(
          "Response:",
          error.response.data
        );

        alert(
          error.response.data?.message ||
          "OTP verification failed."
        );

      } else {

        alert(
          error?.message ||
          "OTP verification failed."
        );

      }

    } finally {

      setVerifying(false);

    }

  };


  // ==========================================
  // RESEND OTP
  // ==========================================

  const handleRetryOTP = async () => {

    try {

      setResending(true);

      const result = await retryOTP();

      console.log(
        "========== RESEND OTP RESULT =========="
      );

      console.log(result);

      if (result?.type === "success") {

        alert("OTP resent successfully.");

      } else {

        alert(
          result?.message ||
          "Failed to resend OTP."
        );

      }

    } catch (error) {

      console.error(
        "========== RESEND OTP ERROR =========="
      );

      console.error(error);

      alert(
        error?.message ||
        "Failed to resend OTP."
      );

    } finally {

      setResending(false);

    }

  };


  // ==========================================
  // UI
  // ==========================================

  return (

    <div className="otp-page">

      <div className="otp-card">

        {/* LOGO */}

        <img
          src={logo}
          alt="Aetherix Technologies"
          className="otp-logo"
        />


        {/* TITLE */}

        <h2>
          Aetherix Phone Login
        </h2>


        {/* PHONE NUMBER */}

        <div className="phone-input-group">

          <div className="country-code">
            +91
          </div>

          <input
            type="tel"
            placeholder="Enter 10-digit mobile number"
            value={phone}
            maxLength={10}
            inputMode="numeric"
            autoComplete="tel"
            onChange={(e) => {

              const value =
                e.target.value.replace(/\D/g, "");

              setPhone(value);

            }}
          />

        </div>


        {/* SEND OTP */}

        <button
          onClick={handleSendOTP}
          disabled={sending}
        >

          {sending
            ? "Sending..."
            : "Send OTP"}

        </button>


        {/* OTP */}

        <input
          type="text"
          placeholder="Enter 6-digit OTP"
          value={otp}
          maxLength={8}
          inputMode="numeric"
          autoComplete="one-time-code"
          onChange={(e) => {

            const value =
              e.target.value.replace(/\D/g, "");

            setOtp(value);

          }}
        />


        {/* VERIFY */}

        <button
          onClick={handleVerifyOTP}
          disabled={verifying}
        >

          {verifying
            ? "Verifying..."
            : "Verify OTP"}

        </button>


        {/* RESEND */}

        <button
          onClick={handleRetryOTP}
          disabled={resending}
        >

          {resending
            ? "Resending..."
            : "Resend OTP"}

        </button>


        {/* BACK */}

        <button
          className="back-login-btn"
          onClick={() => navigate("/login")}
        >

          ← Back to Login

        </button>

      </div>

    </div>

  );

}

export default PhoneLogin;