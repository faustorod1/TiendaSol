import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = () => {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    return token && user;
  };

  if (!isAuthenticated()) {
    return <Navigate to="/signin" replace />;
  }

  return children;
};

export default ProtectedRoute;