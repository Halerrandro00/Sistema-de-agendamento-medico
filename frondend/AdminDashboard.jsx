import React, { useState, useEffect } from 'react';
import api from '../api/api';
import DoctorList from '../components/DoctorList';

function AdminDashboard() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        // Assumindo que sua API tem uma rota GET /api/users/doctors para buscar médicos
        // ou uma rota /api/users que retorna todos e você filtra pelo tipo 'medico'.
        // Vamos usar a segunda abordagem como exemplo.
        const { data } = await api.get('/users');
        const doctorUsers = data.filter(user => user.tipo === 'medico');
        setDoctors(doctorUsers);
      } catch (err) {
        setError('Falha ao buscar a lista de médicos.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []); // O array vazio garante que o useEffect rode apenas uma vez, quando o componente montar.

  return (
    <div>
      <h1>Dashboard do Administrador</h1>
      <h2>Gerenciamento de Médicos</h2>
      {loading && <p>Carregando médicos...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && <DoctorList doctors={doctors} />}
    </div>
  );
}

export default AdminDashboard;

