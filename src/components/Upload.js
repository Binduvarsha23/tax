import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { createClient } from '@supabase/supabase-js';
import './Upload.css';

const SUPABASE_URL = "https://bemupixvlyhhbciakrbq.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJlbXVwaXh2bHloaGJjaWFrcmJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI3MTY4MDQsImV4cCI6MjA0ODI5MjgwNH0.2YjCzaRfTjyo2qI5KZ_SoyIrPbNMH9imX2j3rw1YqCw";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const Upload = (props) => {
  const [file, setFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [fileName, setFileName] = useState(''); // State for file name display
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Check authentication status
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate('/'); // Redirect to login page if not authenticated
      } else {
        setUser(currentUser);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.size > 20 * 1024 * 1024) { 
      props.showAlert('File size should be less than or equal to 20 MB.');
      setFile(null);
      setFileName('');
    } else {
      setFile(selectedFile);
      setFileName(selectedFile.name); 
    }
  };

  const handleUpload = async () => {
    if (!file) {
      props.showAlert('Please select a file to upload.');
      return;
    }

    if (file.size > 20 * 1024 * 1024) { 
      props.showAlert('File size should be less than or equal to 20 MB.');
      return;
    }

    try {
      const { data: fileData, error: fileError } = await supabase.storage
        .from('pdfs')
        .upload(`${user.email}/${file.name}`, file);

      if (fileError) {
        props.showAlert(fileError.message);
        return;
      }

      const { data: insertData, error: insertError } = await supabase
        .from('pdfs')
        .insert([
          {
            email: user.email,
            file_name: file.name,
            file_url: fileData.path,
          },
        ]);

        setFile(null);
        setFileName('');
        props.showAlert('File uploaded and details saved successfully!');
    } catch (error) {
      props.showAlert(error.message);
    }
  };

  const handleLogout = () => {
    const auth = getAuth();
    auth.signOut();
    setUser(null);
    navigate('/');
  };

  return (
    <>
      <header>
        <div className="logo">
          <span>Tax Alert</span>
        </div>
        <nav>
          <ul>
            <button id="logout-btn" onClick={handleLogout}>Logout</button>
          </ul>
        </nav>
      </header>
      <div className="upload-container">
        {user && (
          <>
            <h1>Upload Your Form-16 PDF</h1>
            <label htmlFor="file-upload" className="upload-area">
              Drop PDF file here or click to select
            </label>
            <input
              id="file-upload"
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
            />
            {fileName && <p>Selected file: {fileName}</p>}
            <button onClick={handleUpload}>Proceed</button>
          </>
        )}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
    </>
  );
};

export default Upload; 
