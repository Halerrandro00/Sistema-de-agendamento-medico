const express = require('express');
const router = express.Router();
const { isAuthenticated, hasRole } = require('../middlewares/auth.middleware');
const { listAllUsers } = require('../controllers/user.controller'); // Importar do controller

// Exemplo de rota protegida: Admin pode listar todos os usuários
router.get('/', [isAuthenticated, hasRole(['Admin'])], listAllUsers);

module.exports = router;