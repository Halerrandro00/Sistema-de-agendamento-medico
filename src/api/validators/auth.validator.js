const { body } = require('express-validator');

const registerValidator = [
  body('name').notEmpty().withMessage('O nome é obrigatório.'),
  body('email').isEmail().withMessage('Forneça um e-mail válido.'),
  body('password').isLength({ min: 6 }).withMessage('A senha deve ter no mínimo 6 caracteres.'),
  body('role').optional().isIn(['Paciente', 'Medico', 'Admin']).withMessage('O papel (role) é inválido.'),
];

const loginValidator = [
  body('email').isEmail().withMessage('Forneça um e-mail válido.'),
  body('password').notEmpty().withMessage('A senha é obrigatória.'),
];

module.exports = {
  registerValidator,
  loginValidator,
};