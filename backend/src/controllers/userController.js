const User = require('../models/User');

// Admin: Criar um novo usuário (qualquer role)
exports.createUser = async (req, res) => {
  try {
    const { email } = req.body;

    if (await User.findOne({ email })) {
      return res.status(400).send({ error: 'Usuário já existe' });
    }

    // A role deve ser 'paciente', 'medico' ou 'admin' (minúsculo) para ser válida.
    const user = await User.create(req.body);
    user.password = undefined; // Não retornar a senha

    return res.status(201).send({ user });
  } catch (err) {
    return res.status(400).send({ error: 'Falha ao criar usuário', details: err.message });
  }
};

// Admin: Listar todos os usuários
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.send({ users });
  } catch (err) {
    res.status(500).send({ error: 'Erro ao buscar usuários', details: err.message });
  }
};

// Admin: Buscar um usuário por ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send({ error: 'Usuário não encontrado' });
    }
    res.send({ user });
  } catch (err) {
    res.status(500).send({ error: 'Erro ao buscar usuário', details: err.message });
  }
};

// Admin: Atualizar um usuário
exports.updateUser = async (req, res) => {
  try {
    // Evita que a senha seja atualizada por esta rota.
    const { password, ...updateData } = req.body;

    const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!user) {
      return res.status(404).send({ error: 'Usuário não encontrado' });
    }
    res.send({ message: 'Usuário atualizado com sucesso', user });
  } catch (err) {
    res.status(400).send({ error: 'Falha ao atualizar usuário', details: err.message });
  }
};

// Admin: Deletar um usuário
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).send({ error: 'Usuário não encontrado' });
    }
    res.send({ message: 'Usuário deletado com sucesso' });
  } catch (err) {
    res.status(500).send({ error: 'Erro ao deletar usuário', details: err.message });
  }
};
