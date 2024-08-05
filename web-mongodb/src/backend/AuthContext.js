import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAlerts } from './AlertService';

const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const showAlerts = useAlerts();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch('/api/me', {
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
            const response = await fetch('http://localhost:5000/api/login', {
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
                showAlerts('Login failed1: ' + error.message, 'error');
            }
        } catch (error) {
            showAlerts('Login failed2: ' + error.message, 'error');
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

    return (
        <AuthContext.Provider value={{ user, register, login, logout, home }}>
            {loading ? '' : children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => React.useContext(AuthContext);
