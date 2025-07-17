const express = require('express');
const cors = require('cors');
const passport = require('passport');
const path = require('path');
const apiRoutes = require('./api/routes/routes');

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
app.use('/api', apiRoutes);

module.exports = app;