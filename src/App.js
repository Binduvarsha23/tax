import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Auth from './components/Auth';
import Upload from './components/Upload';
import Forgot from './components/Forgot';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/Forgot" element={<Forgot />} />
        <Route
          path="/upload"
          element={
              <Upload />
          }
        />
      </Routes>
    </Router>
  );
};

export default App;