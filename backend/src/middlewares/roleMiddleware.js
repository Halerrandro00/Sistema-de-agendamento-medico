const User = require('../models/User');

// Este é um "middleware factory". Ele retorna uma função de middleware
// que verifica se o usuário tem uma das roles permitidas.
const checkRole = (roles) => async (req, res, next) => {
  try {
    // req.userRole é adicionado pelo authMiddleware, otimizando a verificação
    // ao evitar uma consulta ao banco de dados em cada requisição.
    if (!req.userRole || !roles.includes(req.userRole)) {
      return res.status(403).send({ error: 'Acesso negado. Permissão insuficiente.' });
    }

    return next();
  } catch (error) {
    res.status(500).send({ error: 'Erro interno ao verificar permissões.' });
  }
};

module.exports = checkRole;
