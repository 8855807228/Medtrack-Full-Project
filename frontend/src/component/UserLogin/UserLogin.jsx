import React, { useState } from "react";
import "./UserLogin.css";

const UserLogin = () => {
  const [number, setNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [fullName, setFullName] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false); // For toggling between login and registration

  // Handle phone number submission and OTP request for Login
  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3333/api/sendLoginOtp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone: number }),
      });

      if (response.ok) {
        setIsOtpSent(true); // OTP sent successfully
        alert("OTP sent successfully to your phone.");
      } else {
        alert("Failed to send OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error during OTP request:", error);
      alert("An error occurred while sending OTP.");
    }
  };

  // Handle phone number submission and OTP request for Registration
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3333/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone: number, fullName }),
      });

      if (response.ok) {
        setIsOtpSent(true); // OTP sent successfully for registration
        alert("OTP sent successfully to your phone for registration.");
      } else {
        alert("Failed to send OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error during registration request:", error);
      alert("An error occurred during registration.");
    }
  };

  // Handle OTP verification for Registration
  const handleOtpSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:3333/api/verifyRegistration",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ phone: number, otp, fullName }),
        }
      );

      if (response.ok) {
        setIsOtpVerified(true); // OTP verified successfully
        alert("OTP verified successfully. Registration complete.");
      } else {
        alert("Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error during OTP verification:", error);
      alert("An error occurred while verifying OTP.");
    }
  };

  // Handle OTP verification for Login
  const handleLoginOtpSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3333/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone: number, otp }),
      });

      if (response.ok) {
        setIsOtpVerified(true); // OTP verified successfully
        alert("OTP verified successfully. Logging you in...");
      } else {
        alert("Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error during OTP verification:", error);
      alert("An error occurred while verifying OTP.");
    }
  };

  return (
    <div className="user-login-container">
      <header className="user-login-header">
        <img
          src="/path/to/your/logo.png"
          alt="Your Logo"
          className="user-login-logo"
        />
        <nav className="user-login-nav">
          <ul>
            <li>
              <a href="#">Platform</a>
            </li>
            <li>
              <a href="#">Solutions</a>
            </li>
            <li>
              <a href="#">Resources</a>
            </li>
            <li>
              <a href="#">About</a>
            </li>
            <li>
              <a href="#">Sign In</a>
            </li>
          </ul>
        </nav>
      </header>

      <div className="user-login-content">
        <div className="user-login-form">
          <h2>{isRegistering ? "Create Account" : "Welcome Back!"}</h2>
          <p>
            {isRegistering
              ? "Sign up to create your account"
              : "Sign in to access your profile, appointments, and settings"}
          </p>

          {!isOtpSent ? (
            <form
              onSubmit={
                isRegistering ? handleRegisterSubmit : handlePhoneSubmit
              }
            >
              <input
                onChange={(e) => setNumber(e.target.value)}
                type="number"
                placeholder="Enter Phone Number"
                value={number}
                required
              />
              {isRegistering && (
                <input
                  onChange={(e) => setFullName(e.target.value)}
                  type="text"
                  placeholder="Enter Full Name"
                  value={fullName}
                  required
                />
              )}
              <button type="submit">
                {isRegistering ? "Get OTP for Registration" : "Get Otp →"}
              </button>
            </form>
          ) : !isOtpVerified ? (
            <form
              onSubmit={isRegistering ? handleOtpSubmit : handleLoginOtpSubmit}
            >
              <input
                onChange={(e) => setOtp(e.target.value)}
                type="number"
                placeholder="Enter OTP"
                value={otp}
                required
              />
              <button type="submit">
                {isRegistering ? "Verify OTP for Registration" : "Verify OTP →"}
              </button>
            </form>
          ) : (
            <p>
              {isRegistering
                ? "Account successfully created!"
                : "Successfully logged in!"}
            </p>
          )}

          <button onClick={() => setIsRegistering(!isRegistering)}>
            {isRegistering
              ? "Already have an account? Login"
              : "Don't have an account? Create one"}
          </button>
        </div>
      </div>

      <footer className="user-login-footer">
        <p>
          Patient | Doctor | Nurse | Receptionist | Laboratorist | Pharmacist
        </p>
        <p>Copyright © 2023 MedTrack. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default UserLogin;
