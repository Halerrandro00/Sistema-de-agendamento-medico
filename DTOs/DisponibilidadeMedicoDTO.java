package com.clinica.agendamento.dto;

import com.clinica.agendamento.model.Disponibilidade;
import lombok.Data;

import java.time.DayOfWeek;
import java.time.LocalTime;

@Data
public class DisponibilidadeMedicoDTO {
    private Long id;
    private DayOfWeek diaDaSemana;
    private LocalTime horaInicio;
    private LocalTime horaFim;

    public DisponibilidadeMedicoDTO(Disponibilidade disponibilidade) {
        this.id = disponibilidade.getId();
        this.diaDaSemana = disponibilidade.getDiaDaSemana();
        this.horaInicio = disponibilidade.getHoraInicio();
        this.horaFim = disponibilidade.getHoraFim();
    }
}