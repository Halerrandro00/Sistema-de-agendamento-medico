const Appointment = require('../models/Consulta'); // Corrigido: O modelo para agendamentos é 'Consulta'
const Availability = require('../models/Agenda');   // Corrigido: O modelo para disponibilidade é 'Agenda'

exports.createAppointment = async (req, res) => {
  const { doctor, date } = req.body;
  const patientId = req.user.userId;

  try {
    // 1. Validação básica de entrada
    if (!doctor || !date) {
      return res.status(400).json({ message: 'Médico e data são obrigatórios.' });
    }

    const appointmentDate = new Date(date);
    const dayOfWeek = appointmentDate.getUTCDay(); // 0 = Domingo, ..., 6 = Sábado
    const time = appointmentDate.toISOString().substr(11, 5); // Formato "HH:mm"

    // 2. Verifica se o médico está disponível no dia e horário especificados
    const doctorAvailability = await Availability.findOne({
      doctor: doctor,
      dayOfWeek: dayOfWeek,
      startTime: { $lte: time },
      endTime: { $gt: time },
    });

    if (!doctorAvailability) {
      return res.status(400).json({ message: 'O médico não está disponível no dia e horário selecionados.' });
    }

    // 3. Verifica se o horário já está ocupado por outra consulta
    const existingAppointment = await Appointment.findOne({
      doctor: doctor,
      date: appointmentDate,
      status: { $ne: 'Cancelled' }, // Não considera horários cancelados como ocupados
    });

    if (existingAppointment) {
      return res.status(409).json({ message: 'Este horário já está agendado.' });
    }

    // 4. Cria o agendamento
    const newAppointment = new Appointment({
      doctor,
      patient: patientId,
      date: appointmentDate,
    });

    await newAppointment.save();
    console.log(`[LOG] Nova consulta agendada: ID ${newAppointment._id} para o paciente ${patientId} com o médico ${doctor}`);
    res.status(201).json(newAppointment);

  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar agendamento.', error: error.message });
  }
};

exports.getAppointments = async (req, res) => {
  try {
    const { role, userId } = req.user;
    let query = {};

    if (role === 'Patient') {
      query = { patient: userId };
    } else if (role === 'Doctor') {
      query = { doctor: userId };
    }
    // Se for Admin, a query continua vazia {} para buscar todos.

    const appointments = await Appointment.find(query)
      .populate('doctor', 'name email')
      .populate('patient', 'name email')
      .sort({ date: 'desc' });
      
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar agendamentos.', error: error.message });
  }
};

exports.updateAppointment = async (req, res) => {
  try {
    const { role, userId } = req.user;
    const { id } = req.params;
    const { date, status } = req.body;

    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({ message: 'Agendamento não encontrado.' });
    }

    // Checagem de permissão
    if (role === 'Patient' && appointment.patient.toString() !== userId) {
      return res.status(403).json({ message: 'Acesso negado. Você só pode alterar seus próprios agendamentos.' });
    }
    if (role === 'Doctor' && appointment.doctor.toString() !== userId) {
      return res.status(403).json({ message: 'Acesso negado. Você só pode alterar agendamentos da sua própria agenda.' });
    }

    // Atualiza os campos permitidos
    if (date) appointment.date = new Date(date); // Lógica de remarcação
    if (status) appointment.status = status; // Lógica de mudança de status

    const updatedAppointment = await appointment.save();
    console.log(`[LOG] Consulta ${updatedAppointment._id} atualizada por ${userId}`);
    res.json(updatedAppointment);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar agendamento.', error: error.message });
  }
};

exports.deleteAppointment = async (req, res) => {
  try {
    const { role, userId } = req.user;
    const { id } = req.params;

    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({ message: 'Agendamento não encontrado.' });
    }

    // Checagem de permissão
    if (role === 'Patient' && appointment.patient.toString() !== userId) {
      return res.status(403).json({ message: 'Acesso negado. Você só pode cancelar seus próprios agendamentos.' });
    }

    // Pacientes e Médicos "cancelam" (soft delete), Admins deletam permanentemente (hard delete)
    if (role === 'Patient' || role === 'Doctor') {
        appointment.status = 'Cancelled';
        await appointment.save();
        console.log(`[LOG] Consulta ${appointment._id} cancelada pelo usuário ${userId}`);
        return res.json({ message: 'Agendamento cancelado com sucesso.' });
    }

    if (role === 'Admin') {
        await Appointment.findByIdAndDelete(id);
        console.log(`[LOG] Consulta ${id} deletada permanentemente pelo admin ${userId}`);
        return res.json({ message: 'Agendamento deletado com sucesso.' });
    }

  } catch (error) {
    res.status(500).json({ message: 'Erro ao cancelar/deletar agendamento.', error: error.message });
  }
};

exports.addDocumentToAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { documentName } = req.body;

    if (!documentName) {
        return res.status(400).json({ message: 'Nome do documento é obrigatório.' });
    }

    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({ message: 'Agendamento não encontrado.' });
    }

    // **CORREÇÃO**: Garante que apenas o médico da consulta pode adicionar documentos.
    if (appointment.doctor.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Acesso negado. Você não é o médico responsável por esta consulta.' });
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      { $push: { documents: documentName } },
      { new: true }
    );
    
    if (!updatedAppointment) {
      return res.status(404).json({ message: 'Agendamento não encontrado.' });
    }

    console.log(`[LOG] Documento '${documentName}' adicionado à consulta ${id} pelo médico ${req.user.userId}`);
    res.json(updatedAppointment);

  } catch (error) {
    res.status(500).json({ message: 'Erro ao adicionar documento.', error: error.message });
  }
};