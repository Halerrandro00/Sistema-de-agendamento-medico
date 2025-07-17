import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', { email, senha });
      const { token, role } = response.data;

      localStorage.setItem('authToken', token);

      // Redireciona baseado no perfil do usuário
      if (role === 'PACIENTE') {
        navigate('/paciente/dashboard');
      } else if (role === 'MEDICO') {
        navigate('/medico/dashboard');
      } else if (role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        setError('Perfil de usuário desconhecido.');
      }

    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError('Email ou senha inválidos.');
      } else {
        setError('Erro ao tentar logar. Tente novamente mais tarde.');
      }
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          placeholder="Senha"
          required
        />
        <button type="submit">Entrar</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default LoginPage;

