import React, { useState, useEffect } from 'react';
import api from '../services/api';

// Você pode criar esses componentes depois
import AdminDashboard from '../components/AdminDashboard';
import DoctorDashboard from '../components/DoctorDashboard';
import PatientDashboard from '../components/PatientDashboard';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Você precisaria de uma rota no backend como /api/auth/me para pegar os dados do usuário logado
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        // Supondo que você crie uma rota /auth/profile que retorna o usuário
        const response = await api.get('/auth/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(response.data);
      } catch (error) {
        console.error("Erro ao buscar dados do usuário", error);
        // Redirecionar para o login se o token for inválido
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!user) {
    // Poderia redirecionar para o login
    return <div>Usuário não encontrado.</div>;
  }

  const renderDashboardByRole = () => {
    switch (user.role) {
      case 'Admin':
        return <AdminDashboard />;
      case 'Doctor':
        return <DoctorDashboard user={user} />;
      case 'Patient':
        return <PatientDashboard user={user} />;
      default:
        return <div>Perfil de usuário desconhecido.</div>;
    }
  };

  return (
    <div>
      <h1>Painel de Controle</h1>
      {renderDashboardByRole()}
    </div>
  );
};

export default Dashboard;
