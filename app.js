const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
require("dotenv").config();
require("./src/config/passport");

const authRoutes = require("./src/routes/authRoutes");

const app = express();
app.use(express.json());
app.use(passport.initialize());

app.use("/auth", authRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Conectado ao MongoDB"))
  .catch((err) => console.error("Erro ao conectar ao MongoDB", err));

module.exports = app;
const consultaRoutes = require("./src/routes/consultaRoutes");
app.use("/consultas", consultaRoutes);
const AgendaRoutes = require("./src/routes/agendaRoutes");
app.use("/Agenda", AgendaRoutes);
const documentoRoutes = require("./src/routes/documentoRoutes");
app.use("/documentos", documentoRoutes);
const adminRoutes = require("./src/routes/adminRoutes");
app.use("/admin", adminRoutes);
const swaggerSpec = require('./src/config/swagger');
const swaggerUi = require('swagger-ui-express');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

