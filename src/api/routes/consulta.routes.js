const express = require('express');
const router = express.Router();

// Rota de teste
router.get('/', (req, res) => {
  res.json({ mensagem: 'Consultas funcionando!' });
});

// Exemplo de POST para criar uma consulta
// router.post('/', controller.agendarConsulta);

module.exports = router;
