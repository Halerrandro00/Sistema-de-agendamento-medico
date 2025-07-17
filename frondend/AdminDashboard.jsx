import React, { useState } from 'react';
import api from '../api/api';

function AdminDashboard() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    crm: '',
    especialidade: '',
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await api.post('/admin/medicos', formData);
      setMessage('Médico cadastrado com sucesso!');
      // Limpa o formulário
      setFormData({ nome: '', email: '', senha: '', crm: '', especialidade: '' });
    } catch (error) {
      if (error.response && error.response.data) {
        setMessage(`Erro: ${error.response.data.message || 'Não foi possível cadastrar o médico.'}`);
      } else {
        setMessage('Erro de conexão ao tentar cadastrar o médico.');
      }
      console.error("Erro ao cadastrar médico:", error);
    }
  };

  return (
    <div>
      <h2>Painel do Administrador</h2>
      <h3>Cadastrar Novo Médico</h3>
      <form onSubmit={handleSubmit}>
        <input type="text" name="nome" value={formData.nome} onChange={handleChange} placeholder="Nome completo" required />
        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
        <input type="password" name="senha" value={formData.senha} onChange={handleChange} placeholder="Senha" required />
        <input type="text" name="crm" value={formData.crm} onChange={handleChange} placeholder="CRM" required />
        <input type="text" name="especialidade" value={formData.especialidade} onChange={handleChange} placeholder="Especialidade" required />
        <button type="submit">Cadastrar Médico</button>
      </form>
      {message && <p>{message}</p>}

      {/* Aqui você poderia adicionar uma lista de usuários (médicos e pacientes) */}
    </div>
  );
}

export default AdminDashboard;