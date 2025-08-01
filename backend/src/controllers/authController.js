const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

function generateToken(params = {}) {
  return jwt.sign(params, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  });
}

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (await User.findOne({ email })) {
      return res.status(400).send({ error: 'Usuário já existe' });
    }

    // Ignora qualquer role enviada e força o role para "Paciente"
    const user = await User.create({ name, email, password, role: 'paciente' });

    user.password = undefined;

    const token = generateToken({ id: user.id, role: user.role });

    return res.send({ user, token });
  } catch (err) {
    return res.status(400).send({ error: 'Falha no registro', details: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(400).send({ error: 'Usuário não encontrado' });
    }

    if (!await bcrypt.compare(password, user.password)) {
      return res.status(400).send({ error: 'Senha inválida' });
    }

    user.password = undefined;

    const token = generateToken({ id: user.id, role: user.role });

    return res.send({ user, token });
  } catch (err) {
    return res.status(500).send({ error: 'Erro interno no servidor', details: err.message });
  }
};
