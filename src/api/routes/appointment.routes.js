const express = require('express');
const router = express.Router();
const Appointment = require('../models/appointment.model');
const { isAuthenticated, hasRole } = require('../middlewares/auth.middleware');

// Paciente agenda uma consulta
router.post('/', [isAuthenticated, hasRole(['Paciente'])], async (req, res) => {
    const { doctor, date } = req.body;
    
    const newAppointment = new Appointment({
        doctor,
        date,
        patient: req.user.id
    });
    await newAppointment.save();
    res.status(201).json(newAppointment);
});

module.exports = router;