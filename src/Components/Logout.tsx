import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../auth/authContext';
import { Navigate } from 'react-router-dom';

function Logout() {
  const [redirect, setRedirect] = useState<boolean>(false);
  const { logout } = useAuthContext();

  useEffect(() => {
    const logoutAndRedirect = () => {
     logout(); // Asegúrate de que logout devuelva una promesa
      setRedirect(true);
    };
    logoutAndRedirect();
  }, [logout]);

  if (redirect) {
    return <Navigate to="/" replace />;
  }

  return <div>Cerrando sesión...</div>;
}

export default Logout;