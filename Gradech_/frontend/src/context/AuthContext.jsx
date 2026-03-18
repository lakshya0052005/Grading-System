import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                // Check if token expired
                if (decoded.exp * 1000 < Date.now()) {
                    logoutUser();
                } else {
                    setUser({
                        id: decoded.userId,
                        role: decoded.role,
                        name: decoded.name,
                        email: decoded.email
                    });
                }
            } catch (error) {
                console.error('Invalid token:', error);
                logoutUser();
            }
        }
        setLoading(false);
    }, []);

    const loginUser = (userData, token) => {
        localStorage.setItem('token', token);
        setUser(userData);
    };

    const logoutUser = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loginUser, logoutUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
