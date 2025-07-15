const Documento = require("../models/documento");

exports.uploadSimulado = async (req, res) => {
  const { consultaId, nomeArquivo, tipo } = req.body;

  try {
    const documento = await Documento.create({
      consultaId,
      medicoId: req.user.id,
      nomeArquivo,
      tipo,
    });

    res.status(201).json({ message: "Documento registrado (simulado)", documento });
  } catch (err) {
    res.status(500).json({ error: "Erro ao simular upload" });
  }
};

exports.listarDocumentosConsulta = async (req, res) => {
  const { consultaId } = req.params;

  try {
    const documentos = await Documento.find({ consultaId });
    res.json(documentos);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar documentos" });
  }
};
