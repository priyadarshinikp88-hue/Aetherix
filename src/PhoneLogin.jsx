import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import "./otp.css";

function PhoneLogin() {
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);

  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    initializeRecaptcha();

    return () => {
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
        } catch (e) {}

        window.recaptchaVerifier = null;
      }
    };
  }, []);

  const initializeRecaptcha = async () => {
    try {
      if (window.recaptchaVerifier) return;

      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "normal",
          callback: () => {
            console.log("reCAPTCHA verified");
          },
          "expired-callback": () => {
            console.log("reCAPTCHA expired");
            window.recaptchaVerifier = null;
          },
        }
      );

      await window.recaptchaVerifier.render();

      console.log("reCAPTCHA Ready");
    } catch (err) {
      console.error(err);
    }
  };

  const sendOTP = async () => {
    if (!window.recaptchaVerifier) {
      await initializeRecaptcha();
    }

    if (!phone.trim()) {
      alert("Enter phone number");
      return;
    }

    if (!phone.startsWith("+")) {
      alert("Phone number must be like +91XXXXXXXXXX");
      return;
    }

    try {
      setSending(true);

      const confirmation = await signInWithPhoneNumber(
        auth,
        phone.trim(),
        window.recaptchaVerifier
      );

      setConfirmationResult(confirmation);

      alert("OTP Sent Successfully");
    } catch (error) {
      console.error(error);

      if (error.code === "auth/too-many-requests") {
        alert(
          "Too many OTP requests.\n\nPlease wait 30-60 minutes before trying again."
        );
      } else {
        alert(
          "Error Code: " +
            error.code +
            "\n\n" +
            error.message
        );
      }

      try {
        window.recaptchaVerifier.clear();
      } catch (e) {}

      window.recaptchaVerifier = null;

      await initializeRecaptcha();
    } finally {
      setSending(false);
    }
  };

  const verifyOTP = async () => {
    if (!confirmationResult) {
      alert("Send OTP first");
      return;
    }

    if (otp.length !== 6) {
      alert("Enter 6 digit OTP");
      return;
    }

    try {
      setVerifying(true);

      const result = await confirmationResult.confirm(otp);

      console.log(result);

      alert("Phone Login Successful");

      navigate("/home");
    } catch (error) {
      console.error(error);

      alert(
        "Error Code: " +
          error.code +
          "\n\n" +
          error.message
      );
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="otp-container">
      <div className="otp-card">
        <h2>Phone OTP Login</h2>

        <input
          type="tel"
          placeholder="+91XXXXXXXXXX"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <button
          onClick={sendOTP}
          disabled={sending}
        >
          {sending ? "Sending..." : "Send OTP"}
        </button>

        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <button
          onClick={verifyOTP}
          disabled={verifying}
        >
          {verifying ? "Verifying..." : "Verify OTP"}
        </button>

        <div
          id="recaptcha-container"
          style={{
            marginTop: "20px",
            display: "flex",
            justifyContent: "center",
          }}
        />
      </div>
    </div>
  );
}

export default PhoneLogin;