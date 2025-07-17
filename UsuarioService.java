package com.clinica.agendamento.service;

import com.clinica.agendamento.dto.AtualizarMedicoDTO;
import com.clinica.agendamento.dto.CadastroMedicoDTO;
import com.clinica.agendamento.model.Medico;
import com.clinica.agendamento.model.Usuario;
import com.clinica.agendamento.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.clinica.agendamento.dto.AtualizarPacienteDTO;

import java.util.List;
public class UsuarioService implements UserDetailsService {
    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Este método precisa ser corrigido
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByEmail(email);
        if (usuario == null) {
            throw new UsernameNotFoundException("Usuário não encontrado com o email: " + email);
        }
        return new User(usuario.getEmail(), usuario.getSenha(), List.of(new SimpleGrantedAuthority("ROLE_" + usuario.getRole())));
    }

    public Usuario findByEmail(String email) {
        return usuarioRepository.findByEmail(email);
    }

    public void cadastrarMedico(CadastroMedicoDTO dados) {
        if (usuarioRepository.findByEmail(dados.getEmail()) != null) {
            throw new IllegalArgumentException("Email já cadastrado.");
        }
        Medico medico = new Medico();
        medico.setNome(dados.getNome());
        medico.setEmail(dados.getEmail());
        medico.setSenha(passwordEncoder.encode(dados.getSenha())); // Senha sempre criptografada
        medico.setCrm(dados.getCrm());
        medico.setEspecialidade(dados.getEspecialidade());
        medico.setRole("MEDICO");
        usuarioRepository.save(medico);
    }

    public List<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }

    @Transactional
    public void atualizarMedico(Long id, AtualizarMedicoDTO dados) {
        Medico medico = (Medico) usuarioRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Médico não encontrado com o ID: " + id));

        // Validações de unicidade (opcional, dependendo das regras de negócio)
        if (!medico.getEmail().equals(dados.getEmail()) && usuarioRepository.findByEmail(dados.getEmail()) != null) {
            throw new IllegalArgumentException("Email já cadastrado para outro usuário.");
        }
        // Validação de CRM único (opcional, descomente se necessário)
        // if (!medico.getCrm().equals(dados.getCrm()) && medicoRepository.findByCrm(dados.getCrm()) != null){
        //     throw new IllegalArgumentException("CRM já cadastrado para outro médico.");
        // }
        medico.setNome(dados.getNome());
        medico.setEmail(dados.getEmail());
        medico.setCrm(dados.getCrm());
        usuarioRepository.save(medico);
    }



    @Transactional
    public void atualizarPaciente(Long id, AtualizarPacienteDTO dados) {
        Paciente paciente = (Paciente) usuarioRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Paciente não encontrado com o ID: " + id));

        // Validação de unicidade (opcional)
        if (!paciente.getEmail().equals(dados.getEmail()) && usuarioRepository.findByEmail(dados.getEmail()) != null) {
            throw new IllegalArgumentException("Email já cadastrado para outro usuário.");
        }

        paciente.setNome(dados.getNome());
        paciente.setEmail(dados.getEmail());
        paciente.setDataNascimento(dados.getDataNascimento());
        paciente.setTelefone(dados.getTelefone());
        usuarioRepository.save(paciente);
    }

    @Transactional
    public void deletarUsuario(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado com o ID: " + id));
        usuarioRepository.delete(usuario);
    }
}
