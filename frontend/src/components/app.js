import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const token = localStorage.getItem('authToken');

  return (
    <Router>
      <div>
        <nav style={{ padding: '1rem', background: '#eee' }}>
          <Link to="/login" style={{ marginRight: '1rem' }}>Login</Link>
          <Link to="/register" style={{ marginRight: '1rem' }}>Registrar</Link>
          <Link to="/dashboard">Dashboard</Link>
        </nav>

        <main style={{ padding: '1rem' }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* Rota padrão: redireciona baseado no login */}
            <Route path="/" element={<Navigate to={token ? "/dashboard" : "/login"} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
