# Sistema de Agendamento Médico

Backend para uma clínica médica que permite marcação e gerenciamento de consultas.

## Descrição

Este projeto implementa uma API RESTful para um sistema de agendamento de consultas médicas, com diferentes níveis de acesso para Administradores, Médicos e Pacientes.

## Tecnologias

- Java 17
- Spring Boot 3
- Spring Data JPA
- Spring Security
- H2 Database (para desenvolvimento)
- Maven

## Recursos Principais

- **Autenticação e Autorização baseada em Roles (JWT)**
- **Gerenciamento de Usuários (Admin)**: Admins podem cadastrar e gerenciar médicos e pacientes.
- **Gerenciamento de Agenda (Médico)**: Médicos podem definir seus horários de atendimento.
- **Visualização de Consultas (Médico)**: Médicos podem ver todas as suas consultas agendadas.
- **Agendamento de Consultas (Paciente)**: Pacientes podem buscar médicos por especialidade, ver horários disponíveis e agendar, remarcar ou cancelar consultas.
- **Histórico de Consultas**: Pacientes e médicos têm acesso ao seu histórico.
- **Upload de Documentos (Simulado)**: Médicos podem associar documentos (receitas, exames) a uma consulta.
- **Notificações (Log Interno)**: O sistema registra eventos importantes como agendamento e cancelamento.

## Como Executar

```bash
# Clone o repositório
git clone https://github.com/Halerrandro00/Sistema-de-agendamento-medico.git

# Navegue até o diretório do projeto
cd Sistema-de-agendamento-medico

# Execute o projeto com Maven
./mvnw spring-boot:run
```