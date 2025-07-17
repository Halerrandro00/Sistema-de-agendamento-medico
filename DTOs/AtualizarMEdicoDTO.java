package com.clinica.agendamento.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AtualizarMedicoDTO {
    @NotBlank
    private String nome;
    @Email
    private String email;

    // Não incluímos a senha aqui por segurança

    @NotBlank
    private String crm;
}