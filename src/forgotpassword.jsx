import { useNavigate } from "react-router-dom";

function ForgotPassword() {

  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>Forgot Password</h1>

      <p>
        Password reset feature will be implemented soon.
      </p>

      <button onClick={() => navigate("/")}>
        Back to Login
      </button>
    </div>
  );
}

export default ForgotPassword;