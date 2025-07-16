const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const { isAuthenticated, hasRole } = require('../middlewares/auth.middleware');

// Exemplo de rota protegida: Admin pode listar todos os usuários
router.get('/', [isAuthenticated, hasRole(['Admin'])], async (req, res) => {
    const users = await User.find().select('-password');
    res.json(users);
});

module.exports = router;