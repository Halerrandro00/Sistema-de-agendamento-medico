import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/api';

const DoctorSchedule = ({ doctor, onBack }) => {
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchSchedule = async () => {
      setError('');
      setSuccess('');
      try {
        // Busca os horários disponíveis do backend
        const { data: availableSlots } = await api.get(`/appointments/available/${doctor._id}`);

        setAvailableSlots(availableSlots);

      } catch (err) {
        setError('Não foi possível carregar os horários. Tente novamente.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [doctor._id]);

  const handleBookAppointment = async (slot) => {
    if (!window.confirm(`Confirmar agendamento com ${doctor.name} para ${new Date(slot).toLocaleString('pt-BR')}?`)) {
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      await api.post('/appointments', {
        doctor: doctor._id,
        patient: user.id, // ID do usuário logado, vindo do AuthContext
        date: slot,
      });
      
      setSuccess(`Consulta agendada com sucesso para ${new Date(slot).toLocaleString('pt-BR')}!`);
      setAvailableSlots(prevSlots => prevSlots.filter(s => s !== slot)); // Remove o horário agendado da lista

    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Falha ao agendar a consulta. O horário pode não estar mais disponível.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={onBack}>&larr; Voltar para a lista de médicos</button>
      <h3 style={{ marginTop: '1rem' }}>Horários Disponíveis para Dr(a). {doctor.name}</h3>
      <p>{doctor.specialty}</p>
      
      {loading && <p>Carregando horários...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      {!loading && !error && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {availableSlots.length > 0 ? (
            availableSlots.map((slot) => (
              <button key={slot} onClick={() => handleBookAppointment(slot)} disabled={loading}>
                {new Date(slot).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
              </button>
            ))
          ) : (
            <p>Nenhum horário disponível para este médico.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default DoctorSchedule;