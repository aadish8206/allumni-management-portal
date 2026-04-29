import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const name = localStorage.getItem('name');
    if (token && role) {
      // In a real app we would verify token with backend
      setUser({ token, role, name });
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.user.role);
      localStorage.setItem('name', res.data.user.name);
      setUser({ token: res.data.token, role: res.data.user.role, name: res.data.user.name });
      return { success: true, role: res.data.user.role };
    } catch (error) {
      return { success: false, msg: error.response?.data?.msg || 'Login failed' };
    }
  };

  const register = async (userData) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, userData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.user.role);
      localStorage.setItem('name', res.data.user.name);
      setUser({ token: res.data.token, role: res.data.user.role, name: res.data.user.name });
      return { success: true, role: res.data.user.role };
    } catch (error) {
      return { success: false, msg: error.response?.data?.msg || 'Registration failed' };
    }
  };

  const refreshUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/me`, {
        headers: { 'x-auth-token': token }
      });
      const updatedUser = { token, role: res.data.role, name: res.data.name };
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('name', res.data.name);
      setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      console.error('Failed to refresh user', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, refreshUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
