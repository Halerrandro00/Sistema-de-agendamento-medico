import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    // Usuário não está logado, redireciona para o login
    return <Navigate to="/login" replace />;
  }

  // Se a rota exige papéis específicos e o usuário não tem um deles,
  // redireciona para uma página de "Não Autorizado" ou para o seu próprio dashboard.
  // Por simplicidade, aqui redirecionamos para o login.
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />; // Ou para uma página /unauthorized
  }

  // Se o usuário está logado e tem o papel correto (ou se a rota não exige papel),
  // renderiza o conteúdo da rota.
  return <Outlet />;
};

export default ProtectedRoute;
