import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { getAuth, signOut } from 'firebase/auth';

const useSessionTimeout = () => {
  const [timer, setTimer] = useState(null);
  const auth = getAuth();

  const startSessionTimer = () => {
    // Set timer for 20 minutes
    setTimer(setTimeout(showSessionAlert, 1 * 60 * 1000));
  };

  const resetSessionTimer = () => {
    clearTimeout(timer);
    startSessionTimer();
  };

  const showSessionAlert = () => {
    Swal.fire({
      title: 'Session Expiring',
      text: "Your session is about to expire. Do you want to extend it?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Extend Session',
      cancelButtonText: 'Sign Out'
    }).then((result) => {
      if (result.isConfirmed) {
        // User wants to extend the session
        resetSessionTimer();
      } else {
        // User wants to sign out
        signOut(auth).catch((error) => {
          console.error("Error signing out:", error);
        });
      }
    });
  };

  useEffect(() => {
    startSessionTimer();

    // Cleanup timer on unmount
    return () => clearTimeout(timer);
  }, []);

  return { resetSessionTimer };
};

export default useSessionTimeout;
