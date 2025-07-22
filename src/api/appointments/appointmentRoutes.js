const express = require('express');
const router = express.Router();
const {
    createAppointment,
    getAvailableSlots
} = require('../controllers/appointmentController');
const autenticar = require('../middlewares/authMiddleware');

// Rota para o paciente criar um novo agendamento
router.post('/', autenticar, createAppointment);

// Rota para buscar horários disponíveis de um médico específico
router.get('/available/:doctorId', autenticar, getAvailableSlots);

module.exports = router;