const mongoose = require('mongoose');

const consultaSchema = new mongoose.Schema({
  medicoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true,
  },
  pacienteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true,
  },
  data: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['agendada', 'realizada', 'cancelada'],
    default: 'agendada',
  },
});

const Consulta = mongoose.models.Consulta || mongoose.model('Consulta', consultaSchema);

module.exports = Consulta;
