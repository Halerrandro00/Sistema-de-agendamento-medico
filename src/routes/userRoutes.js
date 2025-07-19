const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Admin routes
router.get('/', authMiddleware, userController.getAllUsers);
router.put('/:id', authMiddleware, userController.updateUser);
router.delete('/:id', authMiddleware, userController.deleteUser);
// Rota pública para pacientes listarem os médicos disponíveis
router.get('/doctors', authMiddleware, userController.getDoctors);

// Rotas de Administrador para gerenciar todos os usuários
router.get('/', authMiddleware, roleMiddleware(['Admin']), userController.getAllUsers);
router.put('/:id', authMiddleware, roleMiddleware(['Admin']), userController.updateUser);
router.delete('/:id', authMiddleware, roleMiddleware(['Admin']), userController.deleteUser);

module.exports = router;

