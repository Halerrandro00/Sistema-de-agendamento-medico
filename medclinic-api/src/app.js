const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const app = express();

dotenv.config();
app.use(express.json());

// Importar rotas
// const authRoutes = require('./routes/auth.routes');

// app.use('/api/auth', authRoutes);

// Middleware de erro
// const errorHandler = require('./middlewares/errorMiddleware');
// app.use(errorHandler);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Servidor rodando na porta ${process.env.PORT}`);
    });
  })
  .catch((err) => console.error('Erro ao conectar no MongoDB:', err));

module.exports = app; // para testes