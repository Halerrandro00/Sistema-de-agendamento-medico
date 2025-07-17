package com.clinica.agendamento.controller;

import com.clinica.agendamento.dto.AgendamentoConsultaDTO;
import com.clinica.agendamento.dto.ConsultaDetalheDTO;
import com.clinica.agendamento.model.Consulta;
import com.clinica.agendamento.service.ConsultaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@RestController
@RequestMapping("/pacientes/consultas")
// @PreAuthorize("hasRole('PACIENTE')") // Exemplo de como proteger o controller
public class PacienteController {

    @Autowired
    private ConsultaService consultaService;

    /**
     * Agenda uma nova consulta para o paciente autenticado.
     * O UserDetails vem do contexto de segurança (usuário logado).
     */
    @PostMapping
    @Transactional
    public ResponseEntity<ConsultaDetalheDTO> agendar(@RequestBody @Valid AgendamentoConsultaDTO dados, @AuthenticationPrincipal UserDetails usuarioLogado) {
        // O service irá extrair o ID do paciente do `usuarioLogado`
        Consulta consultaAgendada = consultaService.agendar(dados, usuarioLogado.getUsername());
        return ResponseEntity.ok(new ConsultaDetalheDTO(consultaAgendada));
    }

    /**
     * Retorna o histórico de consultas do paciente autenticado.
     */
    @GetMapping
    public ResponseEntity<List<ConsultaDetalheDTO>> historico(@AuthenticationPrincipal UserDetails usuarioLogado) {
        List<Consulta> consultas = consultaService.historicoPaciente(usuarioLogado.getUsername());
        // Converte a lista de entidades para uma lista de DTOs
        List<ConsultaDetalheDTO> detalhes = consultas.stream().map(ConsultaDetalheDTO::new).toList();
        return ResponseEntity.ok(detalhes);
    }

    /**
     * Cancela uma consulta.
     */
    @DeleteMapping("/{idConsulta}")
    @Transactional
    public ResponseEntity<Void> cancelar(@PathVariable Long idConsulta, @AuthenticationPrincipal UserDetails usuarioLogado) {
        consultaService.cancelar(idConsulta, usuarioLogado.getUsername());
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{idConsulta}")
    @Transactional
    public ResponseEntity<Void> remarcar(@PathVariable Long idConsulta, @RequestBody @Valid RemarcarConsultaDTO dados, @AuthenticationPrincipal UserDetails usuarioLogado) {
        consultaService.remarcar(idConsulta, dados, usuarioLogado.getUsername());
        return ResponseEntity.ok().build();
    }
}