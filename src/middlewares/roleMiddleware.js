function permitirTipos(...tiposPermitidos) {
  return (req, res, next) => {
    if (!tiposPermitidos.includes(req.user.tipo)) {
      return res.status(403).json({ error: "Acesso negado" });
    }
    next();
  };
}

module.exports = permitirTipos;

