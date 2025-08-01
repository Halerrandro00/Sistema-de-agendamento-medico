const Doctor = require('../models/Doctor');
const User = require('../models/User');

// Admin: Cria um perfil de médico para um usuário com role 'Médico'
exports.createDoctorProfile = async (req, res) => {
    const { userId, specialty, availableSlots } = req.body;
    try {
        const user = await User.findById(userId);
        if (!user || user.role !== 'medico') {
            return res.status(400).send({ error: 'Usuário inválido ou não é um médico.' });
        }

        if (await Doctor.findOne({ user: userId })) {
            return res.status(400).send({ error: 'Este médico já possui um perfil.' });
        }

        const doctor = await Doctor.create({
            user: userId,
            specialty,
            availableSlots: availableSlots || []
        });

        res.status(201).send({ doctor });
    } catch (err) {
        res.status(400).send({ error: 'Falha ao criar perfil de médico', details: err.message });
    }
};

// Rota Pública: Lista todos os médicos com suas especialidades e nomes
exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().populate('user', 'name email');
    res.send({ doctors });
  } catch (err) {
    res.status(500).send({ error: 'Erro ao buscar médicos' });
  }
};

// Rota Pública: Vê a agenda de horários de um médico específico
exports.getDoctorAvailability = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).select('availableSlots');
    if (!doctor) {
      return res.status(404).send({ error: 'Médico não encontrado' });
    }
    res.send({ availability: doctor.availableSlots });
  } catch (err) {
    res.status(500).send({ error: 'Erro ao buscar agenda do médico' });
  }
};

// Rota Protegida (Médico/Admin): Atualiza a própria agenda de horários
exports.updateDoctorAvailability = async (req, res) => {
    try {
        const { availableSlots } = req.body; // Espera um array no formato: [{ date, slots }]
        const doctorId = req.params.id;

        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return res.status(404).send({ error: 'Médico não encontrado' });
        }
        
        const user = await User.findById(req.userId);
        // Apenas o próprio médico ou um admin pode atualizar a agenda
        if (user.role !== 'admin' && doctor.user.toString() !== req.userId) {
            return res.status(403).send({ error: 'Acesso negado.' });
        }

        doctor.availableSlots = availableSlots;
        await doctor.save();

        res.send({ message: 'Agenda atualizada com sucesso', doctor });

    } catch (err) {
        console.error('Erro ao atualizar agenda:', err);
        res.status(500).send({ error: 'Erro ao atualizar agenda.' });
    }
};