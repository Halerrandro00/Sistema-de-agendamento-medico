package com.clinica.agendamento.controller;

import com.clinica.agendamento.dto.CadastroMedicoDTO;
import com.clinica.agendamento.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import com.clinica.agendamento.dto.AtualizarMedicoDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import com.clinica.agendamento.dto.AtualizarPacienteDTO;
import java.util.List;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')") // Garante que apenas Admins podem acessar
public class AdminController {

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping("/medicos")
    public ResponseEntity<Void> cadastrarMedico(@RequestBody @Valid CadastroMedicoDTO dados) {
        usuarioService.cadastrarMedico(dados);
        return ResponseEntity.created(null).build();
    }

    @GetMapping("/usuarios")
    public ResponseEntity<List<com.clinica.agendamento.model.Usuario>> listarUsuarios() {
        List<com.clinica.agendamento.model.Usuario> usuarios = usuarioService.listarTodos();
        return ResponseEntity.ok(usuarios);
    }

    @PutMapping("/medicos/{id}")
    public ResponseEntity<Void> atualizarMedico(@PathVariable Long id, @RequestBody @Valid AtualizarMedicoDTO dados) {
        usuarioService.atualizarMedico(id, dados);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/pacientes/{id}")
    public ResponseEntity<Void> atualizarPaciente(@PathVariable Long id, @RequestBody @Valid AtualizarPacienteDTO dados) {
        usuarioService.atualizarPaciente(id, dados);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/usuarios/{id}")
    public ResponseEntity<Void> deletarUsuario(@PathVariable Long id) {
        usuarioService.deletarUsuario(id);
        return ResponseEntity.noContent().build();
    }
}