import React, { useState, useEffect } from 'react';
import api from '../api/api';

function PacienteDashboard() {
  const [consultas, setConsultas] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [selectedMedico, setSelectedMedico] = useState('');
  const [dataHora, setDataHora] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Busca o histórico de consultas do paciente logado
    const fetchConsultas = async () => {
      try {
        const response = await api.get('/pacientes/consultas');
        setConsultas(response.data);
      } catch (err) {
        console.error("Erro ao buscar histórico:", err);
      }
    };

    // ATENÇÃO: Criar um endpoint no backend para listar médicos, ex: GET /medicos
    const fetchMedicos = async () => {
        // const response = await api.get('/medicos'); 
        // setMedicos(response.data);
    };

    fetchConsultas();
    fetchMedicos();
  }, []);

  const handleAgendamento = async (e) => {
    e.preventDefault();
    try {
      await api.post('/pacientes/consultas', {
        medicoId: selectedMedico,
        dataHora: dataHora,
      });
      // Atualiza a lista de consultas após agendar
      const response = await api.get('/pacientes/consultas');
      setConsultas(response.data);
      setError('');
    } catch (err) {
      setError('Erro ao agendar consulta. Verifique os dados.');
    }
  };

  return (
    <div>
      <h2>Painel do Paciente</h2>

      <h3>Agendar Nova Consulta</h3>
      <form onSubmit={handleAgendamento}>
          {/* Popular este select com os médicos buscados da API */}
        <select value={selectedMedico} onChange={(e) => setSelectedMedico(e.target.value)} required>
            <option value="">Selecione um médico</option>
        </select>
        <input type="datetime-local" value={dataHora} onChange={(e) => setDataHora(e.target.value)} required />
        <button type="submit">Agendar</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>

      <h3>Minhas Consultas</h3>
      <ul>
        {consultas.map(consulta => (
          <li key={consulta.id}>
            {new Date(consulta.dataHora).toLocaleString()} com Dr(a). {consulta.medicoNome} - Status: {consulta.status}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PacienteDashboard;