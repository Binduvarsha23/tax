import React, { useState } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import "./Forgot.css";
import forgot from './forgot-password.avif';

const firebaseConfig = {
  apiKey: "AIzaSyDJf9ChptxLQdglUgSGuPoMzSiKabceLw4",
  authDomain: "login-8fad0.firebaseapp.com",
  projectId: "login-8fad0",
  storageBucket: "login-8fad0.appspot.com",
  messagingSenderId: "641125780732",
  appId: "1:641125780732:web:c00dfdc5ec18e2f1ae1b79",
  measurementId: "G-NDXKG77TZF",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const Forgot = (props) => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate(); // Hook to navigate to different routes

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email) {
      props.showAlert("Please enter your email address.");
      return;
    }

    setIsSubmitting(true);

    sendPasswordResetEmail(auth, email)
      .then(() => {
        props.showAlert("Password reset email sent! Check your inbox.");
        setEmail("");
        navigate("/"); // Redirect to homepage ("/") after successful submission
      })
      .catch((error) => {
        props.showAlert(`Error: ${error.message}`);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div className="forgot-password-container">
      <div className="illustration">
        <img src={forgot} alt="Forgot Password Illustration" />
      </div>
      <div className="form-section">
        <h1>Forgot Password?</h1>
        <p>Enter your email address below, and we'll send you a link to reset your password.</p>
        <form onSubmit={handleSubmit} id="forgot-password-form">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Link to='/'>Remember? Click here to Sign In!</Link>
          <button type="submit" disabled={isSubmitting} id="reset-password-button">
            {isSubmitting ? "Sending..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Forgot;