import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';

const LightDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
    localStorage.setItem('darkMode', !isDarkMode); // Store user preference
  };

  useEffect(() => {
    const storedDarkMode = localStorage.getItem('darkMode');
    if (storedDarkMode) {
      setIsDarkMode(JSON.parse(storedDarkMode));
    }
  }, []);

  return (
    <div className={`LightDarkMode ${isDarkMode ? 'dark-mode' : ''}`}>
      <div style={{ marginTop:'60px' }}>
        <Button variant="primary" onClick={toggleDarkMode}>
          {isDarkMode ? 'Light Mode' : 'Dark Mode'}
        </Button>
      </div>
    </div>
  );
};

export default LightDarkMode;
