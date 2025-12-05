import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PhoneLogin from "./src/Components/PhoneLogin";
import ForgotPassword from "./src/Components/ForgotPassword";
import Home from "./src/Components/Home";
import Signup from "./src/Components/Signup";
import Login from "./src/Components/Login";
import DynamicReactCalculator from "./src/Components/DynamicCalculator";


export default function Main() {
  return (
    <>
      <React.StrictMode>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/home" element={<Home />} />
            <Route path="/phone-login" element={<PhoneLogin />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route
              path="/dynamic-calculator"
              element={<DynamicReactCalculator />}
            />
          </Routes>
        </BrowserRouter>
      </React.StrictMode>
      <ToastContainer position="top-left" autoClose={2000} />
    </>
  );
}
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Main />);