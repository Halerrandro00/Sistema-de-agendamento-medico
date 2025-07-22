import React from 'react';

const DoctorList = ({ doctors }) => {
  if (doctors.length === 0) {
    return <p>Nenhum médico encontrado.</p>;
  }

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ borderBottom: '2px solid #333' }}>
          <th style={{ padding: '8px', textAlign: 'left' }}>Nome</th>
          <th style={{ padding: '8px', textAlign: 'left' }}>Email</th>
          <th style={{ padding: '8px', textAlign: 'left' }}>Especialidade</th>
        </tr>
      </thead>
      <tbody>
        {doctors.map((doctor) => (
          <tr key={doctor._id} style={{ borderBottom: '1px solid #ccc' }}>
            <td style={{ padding: '8px' }}>{doctor.name}</td>
            <td style={{ padding: '8px' }}>{doctor.email}</td>
            <td style={{ padding: '8px' }}>{doctor.specialty}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DoctorList;

