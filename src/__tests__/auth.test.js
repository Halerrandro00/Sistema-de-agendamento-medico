const request = require('supertest');
const app = require('../app'); // Você precisará exportar seu app Express do seu arquivo principal (ex: app.js ou server.js)
const mongoose = require('mongoose');
const User = require('../models/User'); // Supondo que o modelo de usuário exista em src/models/User.js

// É uma boa prática usar um banco de dados separado para testes.
// Você pode usar um banco de dados real ou um em memória com `mongodb-memory-server`.
const mongoTestUri = 'mongodb://localhost:27017/sistema-agendamento-test';

describe('Auth Endpoints', () => {

    // Antes de todos os testes, conecta ao banco de dados de teste
    beforeAll(async () => {
        await mongoose.connect(mongoTestUri);
    });

    // Antes de cada teste, limpa a coleção de usuários para garantir que um teste não interfira no outro
    beforeEach(async () => {
        await User.deleteMany({});
    });

    // Depois de todos os testes, limpa e desconecta do banco
    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });

    describe('POST /auth/register', () => {
        it('deve registrar um novo usuário com sucesso e retornar status 201', async () => {
            const newUser = {
                nome: 'Test User',
                email: 'test@example.com',
                senha: 'password123',
                tipo: 'paciente'
            };

            const res = await request(app)
                .post('/api/auth/register') // A rota completa é /api/auth/register
                .send(newUser);

            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty('message', 'Usuário registrado com sucesso');

            // Opcional, mas recomendado: verificar se o usuário foi salvo corretamente no banco
            const userInDb = await User.findOne({ email: 'test@example.com' });
            expect(userInDb).not.toBeNull();
            expect(userInDb.email).toBe(newUser.email);
        });

        it('deve retornar status 400 se o email já existir', async () => {
            // Primeiro, cria um usuário para o teste
            const existingUser = {
                nome: 'Existing User',
                email: 'exists@example.com',
                senha: 'password123',
                tipo: 'medico'
            };
            await new User(existingUser).save();

            // Tenta registrar com o mesmo email
            const res = await request(app)
                .post('/api/auth/register')
                .send(existingUser);

            expect(res.statusCode).toEqual(400); // Supondo que seu controller retorne 400 para email duplicado
            expect(res.body).toHaveProperty('message', 'Email já cadastrado');
        });
    });
});