const express = require('express');
const router = express.Router();

// Corrigindo os nomes dos arquivos para corresponder ao seu projeto
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const appointmentRoutes = require('./appointmentRoutes');
// Adicionando os módulos de rota que estavam faltando
const AgendaRoutes = require('./AgendaRoutes');
const consultaRoutes = require('./consultaRoutes');
const documentoRoutes = require('./documentoRoutes');
const adminRoutes = require('./adminRoutes');

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/agendas', AgendaRoutes);
router.use('/consultas', consultaRoutes);
router.use('/documentos', documentoRoutes);
router.use('/admin', adminRoutes);

module.exports = router;