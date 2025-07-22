import React, { useContext } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const DashboardLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderBottom: '1px solid #ccc', background: '#f7f7f7' }}>
        <h1>Clínica Médica</h1>
        {user && (
          <div>
            <span>Olá, {user.role}</span>
            <button onClick={handleLogout} style={{ marginLeft: '1rem' }}>Sair</button>
          </div>
        )}
      </header>
      <main style={{ padding: '1rem' }}>
        <Outlet /> {/* As páginas específicas do dashboard (Admin, Médico, etc.) serão renderizadas aqui */}
      </main>
    </div>
  );
};

export default DashboardLayout;