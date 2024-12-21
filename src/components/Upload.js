import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { createClient } from '@supabase/supabase-js';
import './Upload.css';

const SUPABASE_URL = "https://bemupixvlyhhbciakrbq.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmF4dlloeGJjaWFrcmJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI3MTY4MDQsImV4cCI6MjA0ODI5MjgwNH0.2YjCzaRfTjyo2qI5KZ_SoyIrPbNMH9imX2j3rw1YqCw";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const Upload = (props) => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [user, setUser] = useState(null);
  const [totalStorageUsage, setTotalStorageUsage] = useState(0);
  const [isUploadDisabled, setIsUploadDisabled] = useState(false); // State to disable upload
  const navigate = useNavigate();

  // Check authentication status
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate('/'); // Redirect to login page if not authenticated
      } else {
        setUser(currentUser);
        fetchTotalStorageUsage(); // Fetch total storage usage on load
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // Fetch total storage usage
  const fetchTotalStorageUsage = async () => {
    try {
      const { data, error } = await supabase.storage
        .from('pdfs')
        .list('', { limit: 1000 });

      if (error) {
        console.error('Error fetching storage usage:', error.message);
        return;
      }

      const totalUsage = data.reduce((acc, file) => acc + file.size, 0);
      setTotalStorageUsage(totalUsage);

      if (totalUsage >= 0.9 * 1024 * 1024 * 1024) { // 90% of 1 GB
        setIsUploadDisabled(true);
        props.showAlert(
          'Total storage is nearing the 1 GB limit. Uploads are disabled.'
        );
      } else {
        setIsUploadDisabled(false);
      }
    } catch (error) {
      console.error('Error checking storage usage:', error.message);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.size > 20 * 1024 * 1024) {
      props.showAlert('File size should be less than or equal to 1 MB.');
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
      props.showAlert('File size should be less than or equal to 1 MB.');
      return;
    }

    if (isUploadDisabled) {
      props.showAlert(
        'Uploads are currently disabled as total storage is nearing the 1 GB limit.'
      );
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

      if (insertError) {
        props.showAlert(insertError.message);
        return;
      }

      setFile(null);
      setFileName('');
      props.showAlert('File uploaded and details saved successfully!');
      fetchTotalStorageUsage(); // Refresh total storage usage after upload
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
            <h1>Upload Your Tax Files here</h1>
            <label htmlFor="file-upload" className="upload-area">
              Drop PDF file here or click to select
            </label>
            <input
              id="file-upload"
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              disabled={isUploadDisabled}
            />
            {fileName && <p>Selected file: {fileName}</p>}
            <button onClick={handleUpload} disabled={isUploadDisabled}>
              Proceed
            </button>
          </>
        )}
      </div>
    </>
  );
};

export default Upload;