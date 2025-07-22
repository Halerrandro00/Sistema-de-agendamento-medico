const User = require('../models/User');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar usuários.', error: error.message });
  }
};

exports.getDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ tipo: 'medico' }).select('-password');
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar médicos.', error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { tipo: requesterTipo } = req.user;
    const userToUpdate = await User.findById(req.params.id);

    if (!userToUpdate) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    // Apenas um admin pode alterar o 'tipo' de outro usuário
    if (req.body.tipo && req.body.tipo !== userToUpdate.tipo && requesterTipo !== 'Admin') {
      return res.status(403).json({ message: 'Acesso negado. Apenas administradores podem alterar perfis de usuário.' });
    }

    // Impede que a senha seja atualizada por esta rota
    delete req.body.password;

    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
    console.log(`[LOG] Usuário ${updatedUser._id} atualizado pelo admin ${req.user.id}`);
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar usuário.', error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    // Adiciona uma proteção para impedir que um admin delete a própria conta
    if (req.params.id === req.user.id) {
      return res.status(400).json({ message: 'Não é permitido deletar a própria conta.' });
    }

    const userToDelete = await User.findById(req.params.id);
    if (!userToDelete) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }
    await User.findByIdAndDelete(req.params.id);
    console.log(`[LOG] Usuário ${req.params.id} deletado pelo admin ${req.user.id}`);
    res.json({ message: 'Usuário deletado com sucesso.' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar usuário.', error: error.message });
  }
};
