const Consulta = require("../models/Consulta");
const Agenda = require("../models/Agenda");
const { enviarNotificacao } = require("../services/notificacaoService");

exports.AgendarConsulta = async (req, res) => {
  // seu código para agendar consulta (igual ao que já está)
};

exports.cancelarConsulta = async (req, res) => {
  const { id } = req.params;

  try {
    const consulta = await Consulta.findById(id);

    if (!consulta) {
      return res.status(404).json({ error: "Consulta não encontrada" });
    }

    if (consulta.pacienteId.toString() !== req.user.id) {
      return res.status(403).json({ error: "Você não tem permissão para cancelar esta consulta" });
    }

    consulta.status = "cancelada";
    await consulta.save();

    res.status(200).json({ message: "Consulta cancelada com sucesso" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao cancelar consulta" });
  }
};

exports.historicoConsultas = async (req, res) => {
  try {
    const consultas = await Consulta.find({ pacienteId: req.user.id }).sort({ data: -1 });
    res.status(200).json(consultas);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar histórico de consultas" });
  }
};
