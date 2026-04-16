import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';

import Login from './pages/Login';
import Register from './pages/Register';
import AdminPortal from './pages/AdminPortal';
import StudentPortal from './pages/StudentPortal';
import AlumniPortal from './pages/AlumniPortal';

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
        <Route path="/" element={
          user ? <Navigate to={`/${user.role}-portal`} replace /> : <Navigate to="/login" replace />
        } />
        
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
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
