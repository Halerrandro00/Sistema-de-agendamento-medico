import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import MedicoDashboard from './pages/MedicoDashboard';
import PacienteDashboard from './pages/PacienteDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          {/* Agrupando rotas protegidas sob um layout comum */}
          <Route element={<DashboardLayout />}>
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
            </Route>
            
            <Route element={<ProtectedRoute allowedRoles={['medico']} />}>
              <Route path="/medico/dashboard" element={<MedicoDashboard />} />
            </Route>
            
            <Route element={<ProtectedRoute allowedRoles={['paciente']} />}>
              <Route path="/paciente/dashboard" element={<PacienteDashboard />} />
            </Route>
          </Route>
          
          {/* Redireciona para o login se nenhuma rota corresponder */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
