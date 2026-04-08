import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';

const ProtectedMemberRoute = ({ children }) => {
  const { isMember, currentUser, initialLoading } = useAuth();
  const location = useLocation();

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isMember) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (currentUser?.status === 'pending') {
    return <Navigate to="/pending-approval" replace />;
  }

  if (currentUser?.role !== 'member' && currentUser?.role !== 'admin') {
    // If they are an applicant but approved, they should be updated to member, 
    // but let's strictly check if they are approved.
    if (currentUser?.status !== 'approved') {
       return <Navigate to="/pending-approval" replace />;
    }
  }

  return children;
};

export default ProtectedMemberRoute;