const User = require("../models/User");
const Consulta = require("../models/Consulta");

exports.getEstatisticas = async (req, res) => {
  try {
    const totalPacientes = await User.countDocuments({ tipo: "paciente" });
    const totalMedicos = await User.countDocuments({ tipo: "medico" });

    const totalConsultas = await Consulta.countDocuments();
    const canceladas = await Consulta.countDocuments({ status: "cancelada" });
    const concluidas = await Consulta.countDocuments({ status: "concluída" });

    // Agrupar por mês
    const porMes = await Consulta.aggregate([
      {
        $group: {
          _id: { $month: "$data" },
          total: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    res.json({
      usuarios: {
        totalPacientes,
        totalMedicos,
      },
      consultas: {
        total: totalConsultas,
        canceladas,
        concluidas,
        porMes,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar estatísticas" });
  }
};
