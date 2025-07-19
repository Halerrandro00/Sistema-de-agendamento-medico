# Sistema de Agendamento Médico

## Descrição

Backend para uma clínica médica que permite marcação e gerenciamento de consultas, com diferentes níveis de acesso para Administradores, Médicos e Pacientes. Este projeto foi desenvolvido como parte de uma avaliação acadêmica.

## Recursos Principais
*   Autenticação e Autorização baseada em Roles (JWT)
*   Gerenciamento de Usuários (Admin)
*   Visualização e gerenciamento de consultas por perfil (Médico e Paciente)
*   Agendamento, remarcação e cancelamento de consultas
*   Histórico de consultas
*   Upload simulado de documentos
*   Notificações via log interno
## Dupla

- halerrandro
- 

## Link para o Sistema em Produção

> **Ainda não foi feito o deploy.**
> [URL do sistema aqui quando estiver online]

## Tecnologias

### Backend
- **Node.js** com **Express.js**: Para a construção da API RESTful.
- **MongoDB**: Banco de dados NoSQL para armazenamento dos dados.
- **Mongoose**: ODM para modelagem dos objetos do MongoDB.
- **JSON Web Tokens (JWT)**: Para autenticação e controle de acesso baseado em roles.
- **Bcrypt.js**: Para hashing de senhas.

### Frontend
- **React**: Biblioteca para construção da interface de usuário (UI).
- **Axios**: Para realizar as chamadas HTTP para o backend.
- **React Router**: Para gerenciamento de rotas no cliente.
