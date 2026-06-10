import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ requireLibrarian = false }) => {
  const { isAuthenticated, isLibrarian, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <Loader2 className="animate-spin text-primary-500" size={48} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireLibrarian && !isLibrarian) {
    // Redirect non-librarians trying to access librarian routes to the catalog
    return <Navigate to="/catalog" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
