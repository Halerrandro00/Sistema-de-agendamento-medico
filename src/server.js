require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 3000;

// Conectar ao Banco de Dados
connectDB();

const server = app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT} em ambiente de ${process.env.NODE_ENV}`);
});

module.exports = server; // Exportar para os testes