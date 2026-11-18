import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ allowedRole }) => {
  const { user, role, loading } = useAuth();
  const location = useLocation();

  // Wait until Supabase session is checked
  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.1rem'
        }}
      >
        Loading...
      </div>
    );
  }

  // User is not logged in
  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  // User is logged in but has the wrong role
  if (allowedRole && role !== allowedRole) {
    if (role === 'customer') {
      return <Navigate to="/marketplace" replace />;
    }

    if (role === 'artisan') {
      return (
        <Navigate
          to="/entrepreneur/dashboard"
          replace
        />
      );
    }

    return <Navigate to="/" replace />;
  }

  // User is authenticated and has the correct role
  return <Outlet />;
};