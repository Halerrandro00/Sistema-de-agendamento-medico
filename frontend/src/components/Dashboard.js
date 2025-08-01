import React, { useState, useEffect } from 'react';

function Dashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // Using useMemo to prevent the user object from being recreated on every render,
  // which would cause an infinite loop in the useEffect hook.
  const user = React.useMemo(() => JSON.parse(localStorage.getItem('user')), []);

  useEffect(() => {
    // If the user is null (e.g., localStorage is empty), don't fetch.
    if (!user) return;

    const fetchAppointments = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Você não está autenticado.');
        setLoading(false);
        return;
      }

      // Define the correct endpoint based on the user's role
      const endpoint = user.role === 'medico' 
        ? 'http://localhost:3000/api/appointments/doctor/me'
        : 'http://localhost:3000/api/appointments/me';

      try {
        const response = await fetch(endpoint, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Falha ao buscar consultas.');
        }

        const data = await response.json();
        setAppointments(data.appointments);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [user]); // The [user] dependency ensures the fetch runs if the user changes.

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  if (loading) return <p>Carregando suas consultas...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h1>Bem-vindo, {user?.name}!</h1>
      <button onClick={handleLogout}>Sair</button>

      <h2>Suas Consultas</h2>
      {appointments.length === 0 ? (
        <p>Nenhuma consulta encontrada.</p>
      ) : (
        <ul>
          {appointments.map((appt) => (
            <li key={appt._id}>
              Data: {new Date(appt.date).toLocaleDateString('pt-BR')} às {appt.time} - 
              Status: {appt.status}
              {user.role === 'paciente' && ` com Dr(a). ${appt.doctor.user.name} (${appt.doctor.specialty})`}
              {user.role === 'medico' && ` com Paciente: ${appt.patient.name}`}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dashboard;