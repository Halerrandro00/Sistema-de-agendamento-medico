require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Importar rotas
const authRoutes = require('./src/routes/authRoutes');
// const userRoutes = require('./src/routes/userRoutes'); // Descomente quando criar este arquivo
// const doctorRoutes = require('./src/routes/doctorRoutes'); // Descomente quando criar este arquivo
// const appointmentRoutes = require('./src/routes/appointmentRoutes'); // Descomente quando criar este arquivo

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors()); // Permite requisições de outras origens (seu frontend)
app.use(express.json());

// Adicione esta rota para lidar com a requisição do favicon e evitar o erro 404 no console.
app.get('/favicon.ico', (req, res) => {
    res.status(204).send(); // 204 No Content
});

// Conexão com o MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Conectado ao MongoDB com sucesso!'))
    .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// Usar as rotas
app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/doctors', doctorRoutes);
// app.use('/api/appointments', appointmentRoutes);

// Rota de teste
app.get('/', (req, res) => {
    res.send('API do Sistema de Agendamento Médico está no ar!');
});

app.listen(PORT, () => {
    console.log(`[BACKEND] Servidor rodando em http://localhost:${PORT}`);
});
