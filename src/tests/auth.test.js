const request = require('supertest');
const mongoose = require('mongoose');
const server = require('../src/server'); // Importa o servidor
const User = require('../src/api/models/user.model');

describe('Auth Endpoints', () => {
  beforeAll(async () => {
    // Conectar a um banco de dados de teste em memória ou um de teste separado
    await mongoose.connect(process.env.MONGO_URI);
  });

  afterEach(async () => {
    // Limpar o banco de dados após cada teste
    await User.deleteMany({});
  });

  afterAll(async () => {
    // Fechar a conexão e o servidor
    await mongoose.connection.close();
    server.close();
  });

  it('should register a new user successfully', async () => {
    const res = await request(server).post('/api/auth/register').send({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('token');
  });
});