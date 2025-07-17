const express = require('express');
const router = express.Router();

// Rota de teste
router.get('/', (req, res) => {
  res.json({ mensagem: 'Rota de médicos funcionando!' });
});

// Exemplo de rota protegida
// router.get('/agenda', middlewareAutenticacao, controller.listarAgenda);

module.exports = router;
