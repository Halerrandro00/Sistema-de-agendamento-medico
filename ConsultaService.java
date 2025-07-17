package com.clinica.agendamento.service;

import com.clinica.agendamento.dto.AgendamentoConsultaDTO;
import com.clinica.agendamento.model.Consulta;
import com.clinica.agendamento.model.Medico;
import com.clinica.agendamento.model.Paciente;
import com.clinica.agendamento.repository.ConsultaRepository;
import com.clinica.agendamento.repository.MedicoRepository;
import com.clinica.agendamento.repository.PacienteRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.clinica.agendamento.repository.DisponibilidadeRepository;

import java.util.List;

@Service

public class ConsultaService {

    @Autowired
    private ConsultaRepository consultaRepository;

    @Autowired
    private MedicoRepository medicoRepository;

    @Autowired
    private PacienteRepository pacienteRepository;

    // Você também precisará do repositório de disponibilidade
    @Autowired
    private DisponibilidadeRepository disponibilidadeRepository;

    @Autowired
    private NotificacaoService notificacaoService;

    public Consulta agendar(AgendamentoConsultaDTO dados, String emailPaciente) {
        // A busca do paciente deve garantir que ele é do tipo Paciente.
        // A busca por email no UsuarioRepository é mais genérica.
        Paciente paciente = (Paciente) pacienteRepository.findByEmail(emailPaciente);
        if (paciente == null) {
            throw new EntityNotFoundException("Paciente não encontrado com o email: " + emailPaciente);
        }

        Medico medico = medicoRepository.findById(dados.getMedicoId())
                .orElseThrow(() -> new EntityNotFoundException("Médico não encontrado com o ID: " + dados.getMedicoId()));

        // Validação de disponibilidade: verifica se o médico já tem uma consulta nesse horário
        if (consultaRepository.existsByMedicoIdAndDataHora(medico.getId(), dados.getDataHora())) {
            throw new IllegalArgumentException("Médico já possui uma consulta agendada para este horário.");
        }
     // Validação de disponibilidade do médico (dia e hora)
        LocalDateTime dataHoraConsulta = dados.getDataHora();
        DayOfWeek diaDaSemanaConsulta = dataHoraConsulta.getDayOfWeek();
        LocalTime horaConsulta = dataHoraConsulta.toLocalTime();

        boolean medicoDisponivel = disponibilidadeRepository.findByMedicoIdAndDiaDaSemana(medico.getId(), diaDaSemanaConsulta)
                .stream()
                .anyMatch(disponibilidade -> horaConsulta.isAfter(disponibilidade.getHoraInicio()) && horaConsulta.isBefore(disponibilidade.getHoraFim()));

        if (!medicoDisponivel) {
            throw new IllegalArgumentException("Médico não atende neste dia ou horário.");
        }

        Consulta consulta = new Consulta();
        consulta.setMedico(medico);
        consulta.setPaciente(paciente);
        consulta.setDataHora(dados.getDataHora());
        consulta.setStatus("AGENDADA");

        notificacaoService.notificarAgendamento(consulta);

        return consultaRepository.save(consulta);
    }

    public List<Consulta> historicoPaciente(String emailPaciente) {
        return consultaRepository.findByPacienteEmail(emailPaciente);
    }

    public void cancelar(Long idConsulta, String emailPaciente) {
        Consulta consulta = consultaRepository.findById(idConsulta)
                .orElseThrow(() -> new EntityNotFoundException("Consulta não encontrada com o ID: " + idConsulta));

        // Validação: o paciente só pode cancelar a própria consulta
        if (!consulta.getPaciente().getEmail().equals(emailPaciente)) {
            // Lançar uma exceção de segurança é mais apropriado
            throw new SecurityException("Paciente não autorizado a cancelar esta consulta.");
        }

        // Regra de negócio: não pode cancelar com menos de 24 horas de antecedência.
        java.time.LocalDateTime agora = java.time.LocalDateTime.now();
        if (consulta.getDataHora().isBefore(agora.plusHours(24))) {
            throw new IllegalArgumentException("A consulta não pode ser cancelada com menos de 24 horas de antecedência.");
        }

        consulta.setStatus("CANCELADA");
        consulta.setMotivoCancelamento("Cancelado pelo paciente.");
        consultaRepository.save(consulta);
        notificacaoService.notificarCancelamento(consulta);
    }

    public List<Consulta> agendaMedico(Long medicoId) {
        return consultaRepository.findByMedicoId(medicoId);
    }

    public void remarcar(Long idConsulta, RemarcarConsultaDTO dados, String emailPaciente) {
        Consulta consulta = consultaRepository.findById(idConsulta)
                .orElseThrow(() -> new EntityNotFoundException("Consulta não encontrada com o ID: " + idConsulta));

        if (!consulta.getPaciente().getEmail().equals(emailPaciente)) {
            throw new SecurityException("Paciente não autorizado a remarcar esta consulta.");
        }

        if (dados.getNovaDataHora().isBefore(LocalDateTime.now().plusHours(1))) {
            throw new IllegalArgumentException("A nova data/hora deve ser pelo menos uma hora no futuro.");
        }

        Medico medico = consulta.getMedico();
        LocalDateTime novaDataHora = dados.getNovaDataHora();
        if (consultaRepository.existsByMedicoIdAndDataHora(medico.getId(), novaDataHora)) {
            throw new IllegalArgumentException("Médico já possui uma consulta agendada para o novo horário.");
        }

        DayOfWeek diaSemana = novaDataHora.getDayOfWeek();
        LocalTime horaConsulta = novaDataHora.toLocalTime();

        boolean disponivel = disponibilidadeRepository.findByMedicoIdAndDiaDaSemana(medico.getId(), diaSemana)
                .stream()
                .anyMatch(d -> horaConsulta.isAfter(d.getHoraInicio()) && horaConsulta.isBefore(d.getHoraFim()));

        if (!disponivel) {
            throw new IllegalArgumentException("O médico não atende neste dia e horário.");
        }
        consulta.setDataHora(novaDataHora);
        consultaRepository.save(consulta);

        // Notificar sobre a remarcação (pode criar um método específico ou reutilizar o de agendamento)
        notificacaoService.notificarAgendamento(consulta); // Exemplo de reutilização
    }

    public void definirDisponibilidade(DisponibilidadeDTO dados, Long medicoId) {
        Medico medico = medicoRepository.findById(medicoId)
                .orElseThrow(() -> new EntityNotFoundException("Médico não encontrado com o ID: " + medicoId));

        Disponibilidade novaDisponibilidade = new Disponibilidade();
        novaDisponibilidade.setMedico(medico);
        novaDisponibilidade.setDiaDaSemana(dados.getDiaDaSemana());
        novaDisponibilidade.setHoraInicio(dados.getHoraInicio());
        novaDisponibilidade.setHoraFim(dados.getHoraFim());

        // Lógica para substituir ou adicionar nova disponibilidade pode ser incluída aqui
        disponibilidadeRepository.save(novaDisponibilidade);
    }

    public List<Disponibilidade> listarDisponibilidade(Long medicoId) {
        return disponibilidadeRepository.findByMedicoId(medicoId);
    }
}