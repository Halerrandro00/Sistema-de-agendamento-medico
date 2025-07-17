const express = require('express');
const router = express.Router();

// Rota de teste simples para verificar se a API está funcionando
router.get('/teste', (req, res) => {
  res.json({ mensagem: 'API funcionando!' });
});

// Importar sub-rotas
const authRoutes = require('./auth.routes');
const consultaRoutes = require('./consulta.routes');
const medicoRoutes = require('./medico.routes');
const pacienteRoutes = require('./paciente.routes');

// Usar as rotas
router.use('/auth', authRoutes);
router.use('/consultas', consultaRoutes);
router.use('/medicos', medicoRoutes);
router.use('/pacientes', pacienteRoutes);

module.exports = router;
