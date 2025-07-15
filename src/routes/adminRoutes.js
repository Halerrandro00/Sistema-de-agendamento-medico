const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const autenticar = require("../middlewares/authMiddleware");
const permitirTipos = require("../middlewares/roleMiddleware");

// Somente admin pode acessar
router.get("/estatisticas", autenticar, permitirTipos("admin"), adminController.getEstatisticas);

module.exports = router;
