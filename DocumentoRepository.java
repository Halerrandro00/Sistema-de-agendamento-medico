package com.clinica.agendamento.repository;

import com.clinica.agendamento.model.Documento;
import org.springframework.data.jpa.repository.JpaRepository;
public interface DocumentoRepository extends JpaRepository<Documento, Long> {
}