const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/user.model');

// @desc    Registrar um novo usuário
// @route   POST /api/auth/register
const registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password, role } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'Usuário já existe' });
    }

    user = new User({ name, email, password, role });
    await user.save();

    // Gerar token
    const payload = { id: user.id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

// @desc    Autenticar usuário e obter token
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Credenciais inválidas' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Credenciais inválidas' });
    }

    const payload = { id: user.id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

// @desc    Callback do Google OAuth
const googleCallback = (req, res) => {
  const payload = { id: req.user.id, role: req.user.role };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
  // Aqui você pode redirecionar para o seu frontend com o token
  // res.redirect(`http://seu-frontend.com/dashboard?token=${token}`);
  res.json({ token });
};

module.exports = {
  registerUser,
  loginUser,
  googleCallback,
};