import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithPhoneNumber } from "firebase/auth";
import { auth, generateRecaptcha } from "../firebase";
import { toast } from "react-toastify";
import "../Css/PhoneLogin.css";

export default function PhoneLogin() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("phone"); // "phone" | "otp"
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();

    if (!phone) {
      toast.error("Please enter phone number");
      return;
    }

    // Basic India-style normalization
    let raw = phone.replace(/\s+/g, "");
    if (raw.startsWith("+")) {
      // use as is
    } else {
      // assume 10 digit Indian number
      if (raw.startsWith("0")) raw = raw.slice(1);
      if (raw.length !== 10) {
        toast.error("Enter valid 10-digit mobile number");
        return;
      }
      raw = "+91" + raw;
    }

    try {
      generateRecaptcha();
      const appVerifier = window.recaptchaVerifier;

      const confirmationResult = await signInWithPhoneNumber(
        auth,
        raw,
        appVerifier
      );

      window.confirmationResult = confirmationResult;
      toast.success("OTP sent successfully");
      setStep("otp");
    } catch (err) {
      console.error("OTP error:", err);
      toast.error(err.code + " : " + err.message);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!otp) {
      toast.error("Please enter OTP");
      return;
    }

    try {
      const result = await window.confirmationResult.confirm(otp);
      const user = result.user;
      console.log("Phone login success:", user);

      toast.success("Phone login successful");
      navigate("/home");
    } catch (err) {
      console.error("Verify OTP error:", err);
      toast.error(err.code + " : " + err.message);
    }
  };

  return (
    <div className="phone-page">
      <h1 className="phone-header">Phone Login</h1>

      <div className="phone-container">
        {step === "phone" ? (
          <form onSubmit={handleSendOtp}>
            <label className="phone-label">Mobile Number</label>
            <input
              type="tel"
              className="phone-input"
              placeholder="Enter mobile number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            {/* recaptcha DIV is required */}
            <div id="recaptcha-container"></div>

            <button type="submit" className="phone-btn">
              Send OTP
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp}>
            <label className="phone-label">Enter OTP</label>
            <input
              type="text"
              className="phone-input"
              placeholder="6-digit code"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <button type="submit" className="phone-btn">
              Verify & Login
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
