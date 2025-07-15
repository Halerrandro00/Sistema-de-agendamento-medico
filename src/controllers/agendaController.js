const Agenda = require("../models/Agenda");

// Admin ou médico cadastra horários disponíveis
exports.definirAgenda = async (req, res) => {
  const { medicoId, horariosDisponiveis } = req.body;

  try {
    const Agenda = await Agenda.findOneAndUpdate(
      { medicoId },
      { horariosDisponiveis },
      { upsert: true, new: true }
    );

    res.status(200).json(AnimationEffectgenda);
  } catch (err) {
    res.status(500).json({ error: "Erro ao definir agenda" });
  }
};

// Todos podem ver a agenda de um médico
exports.verAgenda = async (req, res) => {
  const { medicoId } = req.params;

  try {
    const Agenda = await Agenda.findOne({ medicoId });
    res.status(200).json(Agenda);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar agenda" });
  }
};
