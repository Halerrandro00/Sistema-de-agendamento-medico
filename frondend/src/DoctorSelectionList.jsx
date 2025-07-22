import React from 'react';

const DoctorSelectionList = ({ doctors, onSelectDoctor }) => {
  if (doctors.length === 0) {
    return <p>Nenhum médico disponível no momento.</p>;
  }

  return (
    <div>
      <h3>Médicos Disponíveis</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {doctors.map((doctor) => (
          <li key={doctor._id} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong>{doctor.name}</strong><br />
              <small>{doctor.specialty}</small>
            </div>
            <button onClick={() => onSelectDoctor(doctor)}>Ver Horários</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DoctorSelectionList;

