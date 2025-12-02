import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "./firebase"; // 👈 adjust if your path is different
import { toast } from "react-toastify";

export default function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!name || !email || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError("");

    try {
      // 1️⃣ Create user in Firebase Auth
      const userCred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCred.user;

      // 2️⃣ Set display name
      await updateProfile(user, {
        displayName: name,
      });

      // 3️⃣ Prepare session info for login history
      const loginTime = new Date().toLocaleString();
      const sessionId = Date.now();

      const currentSession = {
        uid: user.uid,
        email: user.email,
        name: name,
        loginTime,
        logoutTime: null,
        sessionId,
      };

      // 4️⃣ Save active user in localStorage
      localStorage.setItem("user", JSON.stringify(currentSession));

      // 5️⃣ Push into login history
      const existingHistory =
        JSON.parse(localStorage.getItem("loginHistory")) || [];
      existingHistory.push(currentSession);
      localStorage.setItem("loginHistory", JSON.stringify(existingHistory));

      // 6️⃣ Success toast
      toast.success("Account created successfully!");

      // 7️⃣ Redirect to Home (user is already logged in)
      navigate("/home");
    } catch (err) {
      console.error(err);
      setError("Failed to create account. Try again.");
      toast.error(err.message || "Signup failed. Please try again.");
    }
  };

  return (
    <div className="signup-page">
      <h1 className="signup-header">
        Create <span>Etv Win</span> Account
      </h1>

      <div className="signup-container">
        <h2 className="signup-title">Create User Account</h2>
        <p className="signup-subtitle">Fill the details to register</p>

        <form onSubmit={handleSignup}>
          <div className="field-group">
            <label className="signup-label">Full Name</label>
            <input
              type="text"
              className="signup-input"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="field-group">
            <label className="signup-label">Email</label>
            <input
              type="email"
              className="signup-input"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="field-group">
            <label className="signup-label">Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                className="signup-input"
                placeholder="Create a password"
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

          <div className="field-group">
            <label className="signup-label">Confirm Password</label>
            <div className="password-wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="signup-input"
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
              >
                {showConfirmPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {error && <div className="signup-error">{error}</div>}

          <button type="submit" className="signup-btn">
            Create User
          </button>
        </form>

        <p className="signup-footer">
          Already have an account?{" "}
          <span onClick={() => navigate("/")}>Login here</span>
        </p>
      </div>
    </div>
  );
}
