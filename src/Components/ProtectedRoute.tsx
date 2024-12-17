import React from 'react';
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthContext } from '../auth/authContext';

interface ProtectedRouteProps {
  children?: React.ReactNode;  // Añade esto para permitir que ProtectedRoute tenga hijos
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { loggedUser } = useAuthContext();
  const location = useLocation();

  if (Object.keys(loggedUser).length === 0) {
    return <Navigate to="/loguearse" state={{ from: location }} replace />;
  }

  return children ? React.createElement(React.Fragment, {}, children) : <Outlet />;
};

export default ProtectedRoute;