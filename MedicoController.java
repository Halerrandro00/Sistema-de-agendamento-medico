package com.clinica.agendamento.controller;

import com.clinica.agendamento.dto.ConsultaDetalheDTO;
import com.clinica.agendamento.dto.DisponibilidadeDTO;
import com.clinica.agendamento.dto.DocumentoDTO;
import com.clinica.agendamento.dto.MedicoListagemDTO;
import com.clinica.agendamento.model.Usuario;
import com.clinica.agendamento.repository.MedicoRepository;
import com.clinica.agendamento.service.ConsultaService;
import jakarta.validation.Valid;
import java.time.LocalDateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/medicos")
public class MedicoController {

    @Autowired
    private MedicoRepository medicoRepository;

    @Autowired
    private ConsultaService consultaService;

    @GetMapping
    public ResponseEntity<List<MedicoListagemDTO>> listarMedicos() {
        List<MedicoListagemDTO> medicosDTO = medicoRepository.findAll().stream()
                .map(MedicoListagemDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(medicosDTO);
    }

    @GetMapping("/agenda")
    @PreAuthorize("hasRole('MEDICO')")
    public ResponseEntity<List<ConsultaDetalheDTO>> verAgenda(@AuthenticationPrincipal Usuario medicoLogado) {
        List<ConsultaDetalheDTO> agenda = consultaService.agendaMedico(medicoLogado.getId())
                .stream()
                .map(ConsultaDetalheDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(agenda);
    }

    @PostMapping("/consultas/{consultaId}/documentos")
    @PreAuthorize("hasRole('MEDICO')")
    public ResponseEntity<Void> uploadDocumento(@PathVariable Long consultaId, @RequestBody @Valid DocumentoDTO documentoDTO) {
        // Simulando o upload, apenas salvando as informações do documento
        consultaService.salvarDocumento(consultaId, documentoDTO);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/disponibilidade")
    @PreAuthorize("hasRole('MEDICO')")
    public ResponseEntity<Void> definirDisponibilidade(@RequestBody @Valid DisponibilidadeDTO dados, @AuthenticationPrincipal Usuario medicoLogado) {
        consultaService.definirDisponibilidade(dados, medicoLogado.getId());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/disponibilidade")
    @PreAuthorize("hasRole('MEDICO')")
    public ResponseEntity<List<DisponibilidadeMedicoDTO>> listarDisponibilidade(@AuthenticationPrincipal Usuario medicoLogado) {
        List<DisponibilidadeMedicoDTO> disponibilidade = consultaService.listarDisponibilidade(medicoLogado.getId())
                .stream()
                .map(DisponibilidadeMedicoDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(disponibilidade);
    }
}