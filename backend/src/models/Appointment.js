const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true,
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String, // Ex: "10:00"
    required: true
  },
  status: {
    type: String,
    enum: ['agendada', 'cancelada', 'realizada'],
    default: 'agendada',
  },
  // Simulação de upload de documentos
  documents: [{
    fileName: String,
    uploadDate: Date
  }]
}, { timestamps: true });

module.exports = mongoose.model('Appointment', AppointmentSchema);
