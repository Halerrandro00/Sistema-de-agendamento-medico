const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // A string de conexão deve estar no seu arquivo .env
    await mongoose.connect(process.env.MONGO_URI);

    console.log('MongoDB Conectado com sucesso!');
  } catch (err) {
    console.error('Erro ao conectar com o MongoDB:', err.message);
    // Encerra a aplicação com falha se não conseguir conectar ao DB
    process.exit(1);
  }
};

module.exports = connectDB;

