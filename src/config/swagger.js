module.exports = {
  openapi: "3.0.3",
  info: {
    title: "API de Agendamento Médico",
    version: "1.0.0",
    description:
      "API RESTful para agendamento, gerenciamento de consultas, agenda, documentos e usuários com autenticação JWT.",
  },
  servers: [
    {
      url: "http://localhost:3000/api",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      UsuarioBase: {
        type: "object",
        properties: {
          id: { type: "string", example: "user123" },
          nome: { type: "string", example: "João da Silva" },
          email: { type: "string", format: "email", example: "joao@email.com" },
          role: { type: "string", enum: ["admin", "medico", "paciente"], example: "paciente" },
        },
      },
      Consulta: {
        type: "object",
        properties: {
          id: { type: "string", example: "consulta123" },
          paciente: { $ref: "#/components/schemas/UsuarioBase" },
          medico: { $ref: "#/components/schemas/UsuarioBase" },
          dataHora: { type: "string", format: "date-time", example: "2025-07-20T14:30:00Z" },
          status: { type: "string", enum: ["agendada", "confirmada", "cancelada", "concluida"], example: "agendada" },
          tipoConsulta: { type: "string", example: "Consulta Geral" },
          observacoes: { type: "string", example: "Paciente relata dor de cabeça." },
        },
      },
      ConsultaInput: {
        type: "object",
        required: ["pacienteId", "medicoId", "dataHora", "tipoConsulta"],
        properties: {
          pacienteId: { type: "string", example: "user123" },
          medicoId: { type: "string", example: "medico123" },
          dataHora: { type: "string", format: "date-time", example: "2025-07-20T14:30:00Z" },
          status: { type: "string", enum: ["agendada", "confirmada", "cancelada", "concluida"], default: "agendada" },
          tipoConsulta: { type: "string", example: "Consulta Geral" },
          observacoes: { type: "string" },
        },
      },
      Agenda: {
        type: "object",
        properties: {
          id: { type: "string", example: "agenda001" },
          medicoId: { type: "string", example: "medico123" },
          data: { type: "string", format: "date", example: "2025-07-20" },
          horariosDisponiveis: { type: "array", items: { type: "string", example: "14:00" } },
          bloqueios: { type: "array", items: { type: "string", example: "12:00" } },
        },
      },
      AgendaInput: {
        type: "object",
        required: ["medicoId", "data", "horariosDisponiveis"],
        properties: {
          medicoId: { type: "string", example: "medico123" },
          data: { type: "string", format: "date", example: "2025-07-20" },
          horariosDisponiveis: { type: "array", items: { type: "string" } },
          bloqueios: { type: "array", items: { type: "string" } },
        },
      },
      Documento: {
        type: "object",
        properties: {
          id: { type: "string", example: "doc001" },
          pacienteId: { type: "string", example: "paciente123" },
          tipo: { type: "string", example: "receita" },
          nomeArquivo: { type: "string", example: "receita-julho.pdf" },
          url: { type: "string", example: "https://meusite.com/documentos/receita-julho.pdf" },
          dataCriacao: { type: "string", format: "date-time", example: "2025-07-10T10:00:00Z" },
        },
      },
      DocumentoInput: {
        type: "object",
        required: ["pacienteId", "tipo", "nomeArquivo", "url"],
        properties: {
          pacienteId: { type: "string" },
          tipo: { type: "string", example: "receita" },
          nomeArquivo: { type: "string" },
          url: { type: "string", format: "uri" },
        },
      },
      UsuarioBaseInput: {
        type: "object",
        required: ["nome", "email", "role"],
        properties: {
          nome: { type: "string" },
          email: { type: "string", format: "email" },
          role: { type: "string", enum: ["admin", "medico", "paciente"] },
        },
      },
    },
  },
  security: [{ bearerAuth: [] }],
  paths: {
    "/consultas": {
      get: {
        summary: "Listar consultas (filtradas por status, médico ou paciente)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "query",
            name: "status",
            schema: { type: "string", enum: ["agendada", "confirmada", "cancelada", "concluida"] },
            description: "Filtrar por status da consulta",
          },
          {
            in: "query",
            name: "medicoId",
            schema: { type: "string" },
            description: "Filtrar por médico",
          },
          {
            in: "query",
            name: "pacienteId",
            schema: { type: "string" },
            description: "Filtrar por paciente",
          },
        ],
        responses: {
          "200": {
            description: "Lista de consultas",
            content: {
              "application/json": {
                schema: { type: "array", items: { $ref: "#/components/schemas/Consulta" } },
              },
            },
          },
        },
      },
      post: {
        summary: "Criar consulta",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/ConsultaInput" } },
          },
        },
        responses: { "201": { description: "Consulta criada" } },
      },
    },
    "/consultas/{id}": {
      get: {
        summary: "Obter consulta por ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: {
          "200": {
            description: "Consulta encontrada",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/Consulta" } },
            },
          },
          "403": { description: "Acesso negado" },
          "404": { description: "Consulta não encontrada" },
        },
      },
      put: {
        summary: "Atualizar consulta",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/ConsultaInput" } },
          },
        },
        responses: { "200": { description: "Consulta atualizada" } },
      },
      delete: {
        summary: "Cancelar ou deletar consulta",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: { "204": { description: "Consulta cancelada/deletada" } },
      },
    },
    "/agenda": {
      get: {
        summary: "Listar agendas",
        security: [{ bearerAuth: [] }],
        parameters: [
          { in: "query", name: "medicoId", schema: { type: "string" }, description: "Filtrar por médico" },
          { in: "query", name: "data", schema: { type: "string", format: "date" }, description: "Filtrar por data" },
        ],
        responses: {
          "200": {
            description: "Lista de agendas",
            content: {
              "application/json": {
                schema: { type: "array", items: { $ref: "#/components/schemas/Agenda" } },
              },
            },
          },
        },
      },
      post: {
        summary: "Criar ou atualizar agenda",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/AgendaInput" } },
          },
        },
        responses: { "201": { description: "Agenda criada ou atualizada" } },
      },
    },
    "/agenda/{id}": {
      get: {
        summary: "Obter agenda por ID",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": {
            description: "Agenda encontrada",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/Agenda" } },
            },
          },
          "404": { description: "Agenda não encontrada" },
        },
      },
      delete: {
        summary: "Deletar agenda",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "204": { description: "Agenda deletada" } },
      },
    },
    "/documentos": {
      get: {
        summary: "Listar documentos",
        security: [{ bearerAuth: [] }],
        parameters: [
          { in: "query", name: "pacienteId", schema: { type: "string" }, description: "Filtrar por paciente" },
        ],
        responses: {
          "200": {
            description: "Lista de documentos",
            content: {
              "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Documento" } } },
            },
          },
        },
      },
      post: {
        summary: "Upload de documento",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/DocumentoInput" } },
          },
        },
        responses: { "201": { description: "Documento criado" } },
      },
    },
    "/documentos/{id}": {
      get: {
        summary: "Obter documento por ID",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": {
            description: "Documento encontrado",
            content: { "application/json": { schema: { $ref: "#/components/schemas/Documento" } } },
          },
          "404": { description: "Documento não encontrado" },
        },
      },
      delete: {
        summary: "Deletar documento",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "204": { description: "Documento deletado" } },
      },
    },
    "/admin/users": {
      get: {
        summary: "Listar usuários",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "Lista de usuários",
            content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/UsuarioBase" } } } },
          },
        },
      },
      post: {
        summary: "Criar novo usuário",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["nome", "email", "role", "senha"],
                properties: {
                  nome: { type: "string", example: "Maria da Silva" },
                  email: { type: "string", format: "email", example: "maria@email.com" },
                  role: { type: "string", enum: ["admin", "medico", "paciente"], example: "medico" },
                  senha: { type: "string", format: "password" },
                },
              },
            },
          },
        },
        responses: { "201": { description: "Usuário criado" } },
      },
    },
    "/admin/users/{id}": {
      get: {
        summary: "Obter usuário por ID",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": {
            description: "Usuário encontrado",
            content: { "application/json": { schema: { $ref: "#/components/schemas/UsuarioBase" } } },
          },
          "404": { description: "Usuário não encontrado" },
        },
      },
      put: {
        summary: "Atualizar usuário",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  nome: { type: "string" },
                  email: { type: "string", format: "email" },
                  role: { type: "string", enum: ["admin", "medico", "paciente"] },
                },
              },
            },
          },
        },
        responses: { "200": { description: "Usuário atualizado" } },
      },
      delete: {
        summary: "Deletar usuário",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "204": { description: "Usuário deletado" } },
      },
    },
  },
};
