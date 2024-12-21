import React, { useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './Auth.css'; 
import { Link } from 'react-router-dom';

// Firebase Configuration
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

const Auth = (props) => {
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
  
    // Validate password length
    if (password.length < 6) {
      props.showAlert("Password must be at least 6 characters long.")
      return;
    }
  
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      props.showAlert("Sign Up Successful!");
      setIsRightPanelActive(false);
    } catch (error) {
      props.showAlert(error.message);
    }
  };
  

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      props.showAlert("Sign In Successful!");
      navigate('/upload');        
    } catch (error) {
      props.showAlert(error.message);
    }
  };

  return (
    <div className={`container ${isRightPanelActive ? 'right-panel-active' : ''}`} id="container">
      <div className="form-container sign-up-container">
        <form onSubmit={handleSignUp}>
          <h1>Sign Up</h1>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Sign Up</button>
        </form>
      </div>

      <div className="form-container sign-in-container">
        <form onSubmit={handleSignIn}>
          <h1>Sign In</h1>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Link to="/Forgot">Forgot your password?</Link>
          <button type="submit">Sign In</button>
        </form>
      </div>

      <div className="overlay-container">
        <div className="overlay">
          <div className="overlay-panel overlay-left">
            <h1>Welcome Back!</h1>
            <p>To stay connected with us please login with your personal info</p>
            <button className="ghost" onClick={() => setIsRightPanelActive(false)}>Sign In</button>
          </div>
          <div className="overlay-panel overlay-right">
            <h1>Hello, Friend!</h1>
            <p>Enter your personal details and start your journey with us</p>
            <button className="ghost" onClick={() => setIsRightPanelActive(true)}>Sign Up</button>
          </div>
        </div>
      </div>

      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};

export default Auth;