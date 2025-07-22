const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.register = async (req, res) => {
  const { nome, email, senha, tipo } = req.body;
  try {
    // 1. Verifica se o email já está em uso para retornar a mensagem correta
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email já cadastrado" });
    }

    const senhaHash = await bcrypt.hash(senha, 10);
    const novoUsuario = await User.create({ nome, email, senha: senhaHash, tipo });
    res.status(201).json({ message: "Usuário registrado com sucesso" });
  } catch (err) {
    // Adicionar log do erro para facilitar a depuração
    console.error("Erro no registro:", err);
    res.status(500).json({ error: "Ocorreu um erro interno ao registrar o usuário." });
  }
};

exports.login = async (req, res) => {
  const { email, senha } = req.body;
  try {
    const usuario = await User.findOne({ email });
    // Por segurança, use uma mensagem genérica para não revelar se um email existe no sistema
    if (!usuario) return res.status(401).json({ error: "Credenciais inválidas" });

    const senhaOk = await bcrypt.compare(senha, usuario.senha);
    if (!senhaOk) return res.status(401).json({ error: "Credenciais inválidas" });

    const token = jwt.sign({ id: usuario._id, tipo: usuario.tipo }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ token });
  } catch (err) {
    console.error("Erro no login:", err);
    res.status(500).json({ error: "Ocorreu um erro interno durante o login." });
  }
};
