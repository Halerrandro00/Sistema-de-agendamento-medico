package com.clinica.agendamento.repository;

import com.clinica.agendamento.model.Medico;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MedicoRepository extends JpaRepository<Medico, Long> {
    Medico findByCrm(String crm);
}