import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { addUser, logUser } from './api/users'; // Adjust path according to your structure
import { useAlerts } from './AlertService';

const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dash, setDash] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const showAlerts = useAlerts();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch('/api/me', { // Assuming you have a /me route to get user info
                    credentials: 'include'
                });
                if (response.ok) {
                    const userData = await response.json();
                    setUser(userData);
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error('Error fetching user:', error);
                setUser(null);
            }
            setLoading(false);
        };

        fetchUser();
    }, []);

    const register = async (firstName, lastName, displayName, email, password, role) => {
        try {
            const response = await fetch('/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ firstName, lastName, displayName, email, role, password })
            });
            if (response.ok) {
                showAlerts('Registration successful!', 'success');
            } else {
                const error = await response.json();
                showAlerts('Registration failed: ' + error.message, 'error');
            }
        } catch (error) {
            showAlerts('Registration failed: ' + error.message, 'error');
        }
    };

    const login = async (email, password) => {
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            if (response.ok) {
                const userData = await response.json();
                setUser(userData);
                showAlerts('Login successful!', 'success');
            } else {
                const error = await response.json();
                showAlerts('Login failed: ' + error.message, 'error');
            }
        } catch (error) {
            showAlerts('Login failed: ' + error.message, 'error');
        }
    };

    const logout = async () => {
        try {
            await fetch('/api/logout', { method: 'POST' });
            setUser(null);
            showAlerts('Logged out successfully', 'info');
        } catch (error) {
            showAlerts('Error logging out: ' + error.message, 'error');
        }
    };

    const home = () => {
        navigate('/');
    };

    useEffect(() => {
        setDash(location.pathname !== "/dashboard");
    }, [location]);

    return (
        <AuthContext.Provider value={{ user, register, login, logout, home, dash }}>
            {loading ? '' : children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => React.useContext(AuthContext);
