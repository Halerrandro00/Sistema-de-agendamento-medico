import React, { useState, useEffect } from 'react';
import api from '../api/api';
import DoctorSelectionList from '../components/DoctorSelectionList';
import DoctorSchedule from '../components/DoctorSchedule';

function PacienteDashboard() {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
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
  }, []);

  return (
    <div>
      <h1>Agendar Consulta</h1>
      {loading && <p>Carregando...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      {!loading && !error && (
        <>
          {selectedDoctor ? (
            <DoctorSchedule doctor={selectedDoctor} onBack={() => setSelectedDoctor(null)} />
          ) : (
            <DoctorSelectionList doctors={doctors} onSelectDoctor={setSelectedDoctor} />
          )}
        </>
      )}
    </div>
  );
}

export default PacienteDashboard;
