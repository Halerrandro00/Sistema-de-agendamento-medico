const express = require("express");
const router = express.Router();
const consultaController = require("../controllers/consultaController");
const autenticar = require("../middlewares/authMiddleware");

console.log("cancelarConsulta é função?", typeof consultaController.cancelarConsulta);

router.post("/", autenticar, consultaController.AgendarConsulta);

router.put("/cancelar/:id", autenticar, consultaController.cancelarConsulta);

router.get("/historico", autenticar, consultaController.historicoConsultas);

module.exports = router;
