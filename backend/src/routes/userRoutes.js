const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// O `router.use()` aplica os middlewares a todas as rotas definidas neste arquivo.
// Primeiro, verificamos se o usuário está autenticado (authMiddleware).
// Depois, verificamos se o usuário tem a role 'Admin' (roleMiddleware).
router.use(authMiddleware);
router.use(roleMiddleware(['admin']));

router.post('/', userController.createUser);
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;