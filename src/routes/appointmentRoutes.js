const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Busca agendamentos (filtrado por perfil)
router.get('/', authMiddleware, appointmentController.getAppointments);

// Cria um agendamento (apenas Pacientes)
router.post('/', authMiddleware, roleMiddleware(['Patient']), appointmentController.createAppointment);

// Atualiza um agendamento (Paciente pode remarcar, Médico/Admin podem mudar status)
router.put('/:id', authMiddleware, appointmentController.updateAppointment);

// Cancela/Deleta um agendamento (Paciente cancela, Admin deleta)
router.delete('/:id', authMiddleware, appointmentController.deleteAppointment);

// Adiciona um documento a um agendamento (apenas o Médico da consulta)
router.post('/:id/documents', authMiddleware, roleMiddleware(['Doctor']), appointmentController.addDocumentToAppointment);

module.exports = router;
