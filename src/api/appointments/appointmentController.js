const Appointment = require('../models/Appointment'); // Certifique-se que o modelo Appointment existe

// Placeholder para a função de criar agendamento que o frontend já usa
exports.createAppointment = async (req, res) => {
    try {
        const { doctor, patient, date } = req.body;
        const newAppointment = new Appointment({ doctor, patient, date, status: 'agendada' });
        await newAppointment.save();
        res.status(201).json(newAppointment);
    } catch (error) {
        res.status(400).json({ message: 'Erro ao criar agendamento', error: error.message });
    }
};

// Função para buscar horários disponíveis
exports.getAvailableSlots = async (req, res) => {
    try {
        const { doctorId } = req.params;

        // Configurações da agenda
        const WORK_DAY_START_HOUR = 9; // 9:00
        const WORK_DAY_END_HOUR = 17; // 17:00 (último horário começa às 16:00)
        const DAYS_TO_CHECK = 7; // Verificar horários para os próximos 7 dias

        // Define a janela de tempo para a busca
        const searchStartDate = new Date();
        searchStartDate.setHours(0, 0, 0, 0);

        const searchEndDate = new Date(searchStartDate);
        searchEndDate.setDate(searchStartDate.getDate() + DAYS_TO_CHECK);

        // Busca todas as consultas já agendadas para o médico na janela de tempo
        const existingAppointments = await Appointment.find({
            doctor: doctorId,
            date: { $gte: searchStartDate, $lt: searchEndDate },
        }).select('date');

        const bookedTimes = new Set(
            existingAppointments.map(app => new Date(app.date).toISOString())
        );

        const availableSlots = [];
        const now = new Date();

        // Gera todos os horários possíveis e filtra os que já estão ocupados ou no passado
        for (let i = 0; i < DAYS_TO_CHECK; i++) {
            const currentDay = new Date(searchStartDate);
            currentDay.setDate(searchStartDate.getDate() + i);

            for (let hour = WORK_DAY_START_HOUR; hour < WORK_DAY_END_HOUR; hour++) {
                const slotTime = new Date(currentDay);
                slotTime.setHours(hour, 0, 0, 0);

                if (slotTime > now && !bookedTimes.has(slotTime.toISOString())) {
                    availableSlots.push(slotTime.toISOString());
                }
            }
        }

        res.status(200).json(availableSlots);
    } catch (error) {
        console.error('Erro ao buscar horários disponíveis:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};