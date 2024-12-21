import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Auth from './components/Auth';
import Upload from './components/Upload';
import Forgot from './components/Forgot';
import Alert from './components/Alert';
import {useState } from 'react';
const App = () => {
  const [alert, setAlert] = useState(null);

  const showAlert = (message, type) => {
    setAlert({
      msg: message,
      type: type
    });
    setTimeout(() => {
      setAlert(null);
    }, 1500);
  };
  return (
    <Router>
      <Alert alert={alert} />
      <Routes>
        <Route path="/" element={<Auth showAlert={showAlert}/>} />
        <Route path="/Forgot" element={<Forgot showAlert={showAlert}/>} />
        <Route
          path="/upload"
          element={
              <Upload showAlert={showAlert}/>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;