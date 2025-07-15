const mongoose = require('mongoose');

const AgendaSchema = new mongoose.Schema({
  medicoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true,
  },
  horariosDisponiveis: {
    type: [Date],
    required: true,
  },
});

// ✅ ESSA LINHA EVITA O ERRO OverwriteModelError
module.exports = mongoose.models.Agenda || mongoose.model('Agenda', AgendaSchema);

