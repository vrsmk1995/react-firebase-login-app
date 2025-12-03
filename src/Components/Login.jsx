import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase"; // make sure firebase.js is in src/
import { toast } from "react-toastify";
import "../Css/Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    setError("");

    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const user = userCred.user;

      const loginTime = new Date().toLocaleString();
      const sessionId = Date.now();

      const currentSession = {
        uid: user.uid,
        email: user.email,
        name: user.displayName || "",
        loginTime,
        logoutTime: null,
        sessionId,
      };

      // active user
      localStorage.setItem("user", JSON.stringify(currentSession));

      // history
      const existingHistory =
        JSON.parse(localStorage.getItem("loginHistory")) || [];
      existingHistory.push(currentSession);
      localStorage.setItem("loginHistory", JSON.stringify(existingHistory));

      toast.success("Login successful!");
      navigate("/home");
    } catch (err) {
      console.error(err);
      setError("Invalid email or password");
      toast.error("Login failed. Please try again.");
    }
  };

  const goToSignup = () => {
    navigate("/signup");
  };

  return (
    <div className="login-page">
      <h1 className="login-header">
        Welcome To Etv <span>Login</span> Here
      </h1>

      <div className="login-container">
        <h2 className="login-title">Sign in to your account</h2>
        <p className="login-subtitle">Please enter your details to continue</p>

        <form onSubmit={handleLogin}>
          <div className="field-group">
            <label className="login-label">Email</label>
            <input
              type="email"
              className="login-input"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="field-group">
            <label className="login-label">Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                className="login-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <p
            className="login-footer"
            style={{ textAlign: "right", marginTop: "4px" }}
          >
            <span onClick={() => navigate("/forgot-password")}>
              Forgot password?
            </span>
          </p>

          {error && <div className="login-error">{error}</div>}

          <button type="submit" className="login-btn">
            Login
          </button>
        </form>

        <p className="login-footer">
          Don’t have an account? <span onClick={goToSignup}>Create one</span>
        </p>
        <p className="login-footer">
          Or login with phone?{" "}
          <span onClick={() => navigate("/phone-login")}>Phone Login</span>
        </p>
      </div>
    </div>
  );
}
