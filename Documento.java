package com.clinica.agendamento.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class Documento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "consulta_id")
    private Consulta consulta;

    private String nomeArquivo;
    private String caminhoSimulado; // Em vez de armazenar o arquivo, simulamos o caminho
    private LocalDateTime dataUpload;
}