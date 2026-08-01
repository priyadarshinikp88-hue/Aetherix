import { useState } from "react";
import { auth, RecaptchaVerifier } from "./firebase";
import { signInWithPhoneNumber } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function PhoneLogin() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmation, setConfirmation] = useState(null);

  const navigate = useNavigate();

  const sendOTP = async () => {
    try {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "normal",
        }
      );

      const confirmationResult = await signInWithPhoneNumber(
        auth,
        phone,
        window.recaptchaVerifier
      );

      setConfirmation(confirmationResult);
      alert("OTP Sent Successfully");
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  const verifyOTP = async () => {
    try {
      await confirmation.confirm(otp);

      alert("Phone Login Successful");

      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Invalid OTP");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "40px auto" }}>
      <h2>Phone OTP Login</h2>

      <input
        type="tel"
        placeholder="+91XXXXXXXXXX"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />

      <button
        onClick={sendOTP}
        style={{ width: "100%", padding: "10px" }}
      >
        Send OTP
      </button>

      <br />
      <br />

      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />

      <button
        onClick={verifyOTP}
        style={{ width: "100%", padding: "10px" }}
      >
        Verify OTP
      </button>

      <div
        id="recaptcha-container"
        style={{ marginTop: "20px" }}
      ></div>
    </div>
  );
}

export default PhoneLogin;