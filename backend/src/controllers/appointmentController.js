const mongoose = require('mongoose');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const User = require('../models/User');
const { sendEmail } = require('../services/emailService');

// Paciente: Agenda uma nova consulta
exports.createAppointment = async (req, res) => {
  const { doctorId, date, time } = req.body;
  const patientId = req.userId;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const doctor = await Doctor.findById(doctorId).session(session);
    if (!doctor) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).send({ error: 'Médico não encontrado.' });
    }

    const dateObj = new Date(date);
    const dateStr = dateObj.toISOString().split('T')[0];

    const day = doctor.availableSlots.find(d => d.date === dateStr);
    if (!day || !day.slots.includes(time)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).send({ error: 'Horário indisponível.' });
    }

    const [appointment] = await Appointment.create([{
      patient: patientId,
      doctor: doctorId,
      date: dateObj,
      time,
    }], { session });

    // Remove o horário reservado
    day.slots = day.slots.filter(s => s !== time);
    await doctor.save({ session });

    await session.commitTransaction();
    session.endSession();

    // Busca os dados para notificação por e-mail
    const patient = await User.findById(patientId);
    const doctorUser = await User.findById(doctor.user);

    if (patient && doctorUser) {
      const appointmentDate = new Date(date).toLocaleDateString('pt-BR');

      // Notifica o paciente
      sendEmail({
        to: patient.email,
        subject: 'Consulta Agendada com Sucesso!',
        template: 'appointmentConfirmation',
        context: {
          patientName: patient.name,
          doctorName: doctorUser.name,
          specialty: doctor.specialty,
          appointmentDate,
          time,
        },
      });

      // Notifica o médico
      sendEmail({
        to: doctorUser.email,
        subject: 'Nova Consulta Agendada na sua Agenda',
        template: 'appointmentConfirmation', // Pode criar um template diferente se quiser
        context: {
          patientName: patient.name,
          doctorName: doctorUser.name,
          specialty: doctor.specialty,
          appointmentDate,
          time,
        },
      });
    }

    res.status(201).send({ message: 'Consulta agendada com sucesso!', appointment });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).send({ error: 'Falha ao agendar consulta', details: err.message });
  }
};

// Paciente: Visualiza seu histórico de consultas
exports.getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.userId })
      .populate({
        path: 'doctor',
        select: 'specialty',
        populate: {
          path: 'user',
          select: 'name'
        }
      })
      .sort({ date: -1 });

    res.send({ appointments });
  } catch (err) {
    res.status(500).send({ error: 'Erro ao buscar consultas' });
  }
};

// Médico: Visualiza suas consultas
exports.getDoctorAppointments = async (req, res) => {
  try {
    const doctorProfile = await Doctor.findOne({ user: req.userId });
    if (!doctorProfile) {
      return res.status(404).send({ error: 'Perfil de médico não encontrado.' });
    }

    const appointments = await Appointment.find({ doctor: doctorProfile._id })
      .populate('patient', 'name email')
      .sort({ date: -1 });

    res.send({ appointments });
  } catch (err) {
    res.status(500).send({ error: 'Erro ao buscar consultas do médico' });
  }
};

async function handleReschedule(appointment, { date, time }, session) {
  const newDate = date ? new Date(date) : appointment.date;
  const newTime = time || appointment.time;
  const oldTime = appointment.time;
  const oldDate = appointment.date;

  // If no change in date or time, do nothing.
  if (newDate.getTime() === oldDate.getTime() && newTime === oldTime) {
    return;
  }

  const doctor = await Doctor.findById(appointment.doctor).session(session);
  if (!doctor) {
    throw new Error('Doctor profile not found during reschedule.');
  }

  const newDateStr = newDate.toISOString().split('T')[0];

  // 1. Check availability in the new slot
  const newDay = doctor.availableSlots.find(d => d.date === newDateStr);
  if (!newDay || !newDay.slots.includes(newTime)) {
    throw { status: 400, message: 'Novo horário indisponível.' };
  }

  // 2. Release the old slot
  const oldDateStr = oldDate.toISOString().split('T')[0];
  let oldDay = doctor.availableSlots.find(d => d.date === oldDateStr);
  if (!oldDay) {
    oldDay = { date: oldDateStr, slots: [] };
    doctor.availableSlots.push(oldDay);
  }
  if (!oldDay.slots.includes(oldTime)) {
    oldDay.slots.push(oldTime);
    oldDay.slots.sort();
  }

  // 3. Occupy the new slot
  newDay.slots = newDay.slots.filter(s => s !== newTime);

  // 4. Update appointment and save doctor
  appointment.date = newDate;
  appointment.time = newTime;
  await doctor.save({ session });
}

async function handleStatusChange(appointment, newStatus, permissions, session) {
  const { isPatient, isDoctorOfAppointment, isAdmin } = permissions;

  if (!['cancelada', 'realizada'].includes(newStatus)) {
    throw { status: 400, message: 'Status inválido fornecido.' };
  }

  let hasPermission = false;
  if (newStatus === 'cancelada') {
    hasPermission = isPatient || isDoctorOfAppointment || isAdmin;
  } else if (newStatus === 'realizada') {
    hasPermission = isDoctorOfAppointment;
  }

  if (!hasPermission) {
    throw { status: 403, message: 'Acesso negado. Você não tem permissão para realizar esta ação.' };
  }

  // If cancelling, return the slot to the doctor's availability
  if (newStatus === 'cancelada' && appointment.status !== 'cancelada') {
    const doctor = await Doctor.findById(appointment.doctor).session(session);
    if (doctor) {
      const dateStr = appointment.date.toISOString().split('T')[0];
      let day = doctor.availableSlots.find(d => d.date === dateStr);
      if (!day) {
        day = { date: dateStr, slots: [] };
        doctor.availableSlots.push(day);
      }
      if (!day.slots.includes(appointment.time)) {
        day.slots.push(appointment.time);
        day.slots.sort();
      }
      await doctor.save({ session });
    }
  }

  appointment.status = newStatus;
}

async function sendUpdateNotifications(appointmentId, { status, date, time }) {
  const populatedAppointment = await Appointment.findById(appointmentId)
    .populate({ path: 'patient', select: 'name email' })
    .populate({ path: 'doctor', populate: { path: 'user', select: 'name email' } });

  if (!populatedAppointment) return;

  const { patient, doctor, time: apptTime } = populatedAppointment;
  const doctorUser = doctor.user;
  const appointmentDate = new Date(populatedAppointment.date).toLocaleDateString('pt-BR');

  if (status === 'cancelada') {
    // ... logic to send cancellation email ...
  }

  if (date || time) {
    // ... logic to send reschedule email ...
  }
}

// Paciente, Médico ou Admin: Atualiza uma consulta (status ou data/hora)
exports.updateAppointment = async (req, res) => {
  const { status, date, time } = req.body;
  const { id: appointmentId } = req.params;
  const { userId, userRole } = req;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const appointment = await Appointment.findById(appointmentId).session(session);
    if (!appointment) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).send({ error: 'Consulta não encontrada.' });
    }

    // Impede a alteração de uma consulta já finalizada
    if (['realizada', 'cancelada'].includes(appointment.status) && (date || time || status)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).send({ error: `Não é possível alterar o status de uma consulta que já foi ${appointment.status.toLowerCase()}.` });
    }

    // Lógica de Permissão Robusta
    const isPatient = appointment.patient.toString() === userId;
    const doctorProfile = await Doctor.findOne({ user: userId }).session(session);
    const isDoctorOfAppointment = !!(doctorProfile && appointment.doctor.toString() === doctorProfile._id.toString());
    const isAdmin = userRole === 'admin';

    const permissions = { isPatient, isDoctorOfAppointment, isAdmin };

    // --- LÓGICA DE REMARCAÇÃO ---
    if (date || time) {
      if (!isPatient) {
        throw { status: 403, message: 'Apenas o paciente pode remarcar a consulta.' };
      }
      await handleReschedule(appointment, { date, time }, session);
    }

    // --- LÓGICA DE ATUALIZAÇÃO DE STATUS ---
    if (status) {
      await handleStatusChange(appointment, status, permissions, session);
    }

    await appointment.save({ session });
    await session.commitTransaction();
    session.endSession();

    // Send notifications outside of the transaction
    sendUpdateNotifications(appointmentId, { status, date, time });

    res.send({ message: 'Status da consulta atualizado com sucesso!', appointment });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error('Falha ao atualizar consulta:', err);
    res.status(err.status || 500).send({ error: err.message || 'Falha ao atualizar consulta.' });
  }
};

// Simulação de Upload de Documento
exports.uploadDocument = async (req, res) => {
  const { id: appointmentId } = req.params;
  // Em um upload real, o nome do arquivo viria de req.file (com multer)
  const simulatedFileName = `documento_${Date.now()}.pdf`;

  try {
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).send({ error: 'Consulta não encontrada.' });
    }

    // Adiciona o documento simulado ao array
    appointment.documents.push({ fileName: simulatedFileName, uploadDate: new Date() });
    await appointment.save();

    console.log(`[LOG DE NOTIFICAÇÃO] Documento '${simulatedFileName}' adicionado à consulta ${appointmentId}.`);
    res.send({ message: 'Documento enviado com sucesso!', appointment });
  } catch (err) {
    res.status(500).send({ error: 'Falha ao enviar documento.', details: err.message });
  }
};
