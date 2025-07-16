const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const appointmentRoutes = require('./appointment.routes');

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/appointments', appointmentRoutes);

module.exports = router;