const express = require('express');
const cors = require('cors');
const passport = require('passport');
const path = require('path');
const dotenv = require('dotenv');
// Carrega as variáveis de ambiente do arquivo .env ANTES de qualquer outro código
dotenv.config();
const mainRoutes = require('./routes'); // Importa o roteador principal

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos da pasta 'uploads' (para os documentos)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Passport Middleware
app.use(passport.initialize());
require('./config/passport')(passport);

// Rotas da API
app.use('/api', mainRoutes);

// Rota padrão para a raiz "/"
app.get('/', (req, res) => {
  res.send('Bem-vindo à API do Sistema de Agendamento Médico!');
});


module.exports = app;