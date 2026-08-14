import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, adminOnly = false, employeeOnly = false }) {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  // Not authenticated → go to login
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  const isAdmin = user.role === 'ROLE_ADMIN' || user.role === 'ADMIN';

  // Admin-only page but user is not admin → redirect to admin dashboard or employee dashboard
  if (adminOnly && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  // Employee-only page but user is admin → redirect admin to their dashboard
  if (employeeOnly && isAdmin) {
    return <Navigate to="/admin-dashboard" replace />;
  }

  return children;
}

export default ProtectedRoute;
