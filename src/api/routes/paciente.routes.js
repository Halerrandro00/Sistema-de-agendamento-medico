const express = require('express');
const router = express.Router();

// Rota de teste simples
router.get('/', (req, res) => {
  res.json({ mensagem: 'Rota de pacientes funcionando!' });
});

// Exemplo de rota protegida (futura)
// router.get('/consultas', authMiddleware, controller.historicoConsultas);

module.exports = router;
