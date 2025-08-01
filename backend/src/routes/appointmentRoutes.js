const express = require('express');
const router = express.Router();
// const multer = require('multer'); // Você precisará do multer para upload real
const appointmentController = require('../controllers/appointmentController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// Todas as rotas de consulta exigem autenticação
router.use(authMiddleware);

// Paciente agenda uma nova consulta
router.post('/', roleMiddleware(['paciente']), appointmentController.createAppointment);

// Paciente visualiza suas próprias consultas
router.get('/me', roleMiddleware(['paciente']), appointmentController.getMyAppointments);

// Médico visualiza suas consultas
router.get('/doctor/me', roleMiddleware(['medico']), appointmentController.getDoctorAppointments);

// Paciente pode remarcar ou cancelar. Médico pode cancelar ou marcar como realizada.
router.patch('/:id', roleMiddleware(['paciente', 'medico', 'admin']), appointmentController.updateAppointment);

// Rota para upload simulado de documentos (ex: receitas) para uma consulta.
// Idealmente, apenas o médico ou paciente podem fazer o upload.
router.post('/:id/documents', roleMiddleware(['paciente', 'medico']), /* upload.single('documento'), */ appointmentController.uploadDocument);

module.exports = router;
