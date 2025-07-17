package com.clinica.agendamento.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDate;

@Data
public class AtualizarPacienteDTO {
    @NotBlank
    private String nome;
    @Email
    private String email;

    // Não incluímos a senha aqui por segurança
    private LocalDate dataNascimento;
    private String telefone;
}