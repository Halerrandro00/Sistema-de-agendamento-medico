const express = require("express");
const router = express.Router();
const agendaController = require("../controllers/agendaController");
const autenticar = require("../middlewares/authMiddleware");
const permitirTipos = require("../middlewares/roleMiddleware");

// Médico/Admin define agenda
router.post("/", autenticar, permitirTipos("medico", "admin"), agendaController.definirAgenda);

// Qualquer um pode ver a agenda do médico
router.get("/:medicoId", agendaController.verAgenda);

module.exports = router;

