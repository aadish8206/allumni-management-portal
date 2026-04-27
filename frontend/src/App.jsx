import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';

import Login from './pages/Login';
import Register from './pages/Register';
import AdminPortal from './pages/AdminPortal';
import StudentPortal from './pages/StudentPortal';
import AlumniPortal from './pages/AlumniPortal';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Home from './pages/Home';

const PrivateRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to their specific portal if they try to access wrong one
    return <Navigate to={`/${user.role}-portal`} replace />;
  }

  return children;
};

function App() {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        
        <Route path="/login" element={user ? <Navigate to={`/${user.role}-portal`} replace /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to={`/${user.role}-portal`} replace /> : <Register />} />
        <Route path="/forgot-password" element={user ? <Navigate to={`/${user.role}-portal`} replace /> : <ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        
        <Route path="/admin-portal/*" element={
          <PrivateRoute allowedRoles={['admin']}>
            <AdminPortal />
          </PrivateRoute>
        } />
        
        <Route path="/student-portal/*" element={
          <PrivateRoute allowedRoles={['student']}>
            <StudentPortal />
          </PrivateRoute>
        } />
        
        <Route path="/alumni-portal/*" element={
          <PrivateRoute allowedRoles={['alumni']}>
            <AlumniPortal />
          </PrivateRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
