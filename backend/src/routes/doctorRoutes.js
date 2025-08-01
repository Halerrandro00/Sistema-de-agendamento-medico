const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// Rotas públicas para pacientes e visitantes
router.get('/', doctorController.getAllDoctors);
router.get('/:id/availability', doctorController.getDoctorAvailability);

// Rotas protegidas
// Admin cria um perfil de médico
router.post('/', authMiddleware, roleMiddleware(['admin']), doctorController.createDoctorProfile);
// Médico ou Admin atualiza a agenda
router.put('/:id/availability', authMiddleware, roleMiddleware(['admin', 'medico']), doctorController.updateDoctorAvailability);

module.exports = router;