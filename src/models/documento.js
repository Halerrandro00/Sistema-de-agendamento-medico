const mongoose = require("mongoose");

const documentoSchema = new mongoose.Schema({
  consultaId: { type: mongoose.Schema.Types.ObjectId, ref: "Consulta", required: true },
  medicoId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  nomeArquivo: String,
  tipo: { type: String, enum: ["receita", "exame", "outro"], default: "outro" },
  criadoEm: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Documento", documentoSchema);
