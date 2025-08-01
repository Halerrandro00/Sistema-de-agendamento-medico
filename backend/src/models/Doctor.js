const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true, // Garante que um usuário só pode ter um perfil de médico
  },
  specialty: {
    type: String,
    required: [true, 'A especialidade é obrigatória.'],
  },
  availableSlots: [{
    date: { type: String, required: true }, // Formato "YYYY-MM-DD"
    slots: [{ type: String, required: true }], // Formato "HH:MM"
  }],
}, { timestamps: true });

module.exports = mongoose.model('Doctor', DoctorSchema);

