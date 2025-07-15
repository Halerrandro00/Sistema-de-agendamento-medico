const jwt = require("jsonwebtoken");

function autenticar(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token não fornecido" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // id e tipo
    next();
  } catch (err) {
    res.status(401).json({ error: "Token inválido" });
  }
}

module.exports = autenticar;
