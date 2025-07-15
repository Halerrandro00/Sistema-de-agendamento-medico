const express = require("express");
const router = express.Router();
const documentoController = require("../controllers/documentoController");
const autenticar = require("../middlewares/authMiddleware");
const permitirTipos = require("../middlewares/roleMiddleware");

router.post("/upload", autenticar, permitirTipos("medico"), documentoController.uploadSimulado);

router.get("/consulta/:consultaId", autenticar, documentoController.listarDocumentosConsulta);

module.exports = router;
