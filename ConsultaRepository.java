package com.clinica.agendamento.repository;

import com.clinica.agendamento.model.Consulta;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface ConsultaRepository extends JpaRepository<Consulta, Long> {

    // Retorna todas as consultas de um paciente com base no email
    List<Consulta> findByPacienteEmail(String emailPaciente);

    // Retorna todas as consultas de um médico pelo ID
    List<Consulta> findByMedicoId(Long medicoId);

    // Verifica se já existe uma consulta agendada para o médico no mesmo horário
    boolean existsByMedicoIdAndDataHora(Long medicoId, LocalDateTime dataHora);
}
