import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase"; 
import { toast } from "react-toastify";
import "../Css/Signup.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Please enter your email");
      return;
    }

    setError("");

    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent! Check your inbox.");
      navigate("/"); 
      
    } catch (err) {
      console.error(err);
      setError("Failed to send reset email. Check email and try again.");
      toast.error(err.message || "Something went wrong.");
    }
  };

  return (
    <div className="login-page">
      <h1 className="login-header">
        Reset <span>Password</span>
      </h1>

      <div className="login-container">
        <h2 className="login-title">Forgot your password?</h2>
        <p className="login-subtitle">
          Enter your registered email. We’ll send a reset link.
        </p>

        <form onSubmit={handleReset}>
          <div className="field-group">
            <label className="login-label">Email</label>
            <input
              type="email"
              className="login-input"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {error && <div className="login-error">{error}</div>}

          <button type="submit" className="login-btn">
            Send Reset Link
          </button>
        </form>

        <p className="login-footer">
          Remembered your password?{" "}
          <span onClick={() => navigate("/")}>Back to Login</span>
        </p>
      </div>
    </div>
  );
}
