const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['Agendada', 'Confirmada', 'Cancelada', 'Realizada'],
    default: 'Agendada',
  },
  notes: {
    type: String,
  },
  documents: [
    {
      fileName: String,
      filePath: String,
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model('Appointment', AppointmentSchema);