const { body } = require('express-validator');

const createAppointmentValidator = [
  body('doctor').isMongoId().withMessage('ID do médico inválido.'),
  body('date').isISO8601().toDate().withMessage('Formato de data inválido. Use o padrão ISO8601.'),
];

module.exports = {
  createAppointmentValidator,
};