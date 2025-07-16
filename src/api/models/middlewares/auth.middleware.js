const passport = require('passport');

// Middleware para verificar se o usuário está autenticado usando a estratégia JWT
const isAuthenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(401).json({ message: 'Acesso não autorizado. Token inválido ou expirado.' });
    }
    req.user = user;
    return next();
  })(req, res, next);
};

// Middleware para verificar o papel (role) do usuário
const hasRole = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Acesso proibido. Você não tem permissão para este recurso.' });
  }
  next();
};

module.exports = {
  isAuthenticated,
  hasRole,
};