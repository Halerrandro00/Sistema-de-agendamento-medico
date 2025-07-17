import React, { useState, useEffect } from 'react';
import api from '../api/api';

function MedicoDashboard() {
  const [agenda, setAgenda] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAgenda = async () => {
      try {
        setLoading(true);
        const response = await api.get('/medicos/agenda');
        setAgenda(response.data);
        setLoading(false);
      } catch (err) {
        setError('Não foi possível carregar sua agenda.');
        setLoading(false);
        console.error("Erro ao buscar agenda:", err);
      }
    };

    fetchAgenda();
  }, []);

  if (loading) return <p>Carregando sua agenda...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h2>Painel do Médico - Minha Agenda</h2>
      <ul>
        {agenda.map((consulta) => (
          <li key={consulta.id}>
            <strong>{new Date(consulta.dataHora).toLocaleString()}</strong> - Paciente: {consulta.pacienteNome} - Status: {consulta.status}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MedicoDashboard;