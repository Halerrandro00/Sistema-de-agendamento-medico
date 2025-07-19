const User = require('../models/User');

exports.getAllUsers = async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar usuários.', error: error.message });
  }
};

exports.getDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: 'Doctor' }).select('-password');
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar médicos.', error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
  res.json(user);
  try {
    const { role: requesterRole } = req.user;
    const userToUpdate = await User.findById(req.params.id);

    if (!userToUpdate) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    // Apenas um admin pode alterar o 'role' de outro usuário
    if (req.body.role && req.body.role !== userToUpdate.role && requesterRole !== 'Admin') {
      return res.status(403).json({ message: 'Acesso negado. Apenas administradores podem alterar perfis de usuário.' });
    }

    // Impede que a senha seja atualizada por esta rota
    delete req.body.password;

    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
    console.log(`[LOG] Usuário ${updatedUser._id} atualizado pelo admin ${req.user.userId}`);
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar usuário.', error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'User deleted' });
  try {
    const userToDelete = await User.findById(req.params.id);
    if (!userToDelete) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }
    await User.findByIdAndDelete(req.params.id);
    console.log(`[LOG] Usuário ${req.params.id} deletado pelo admin ${req.user.userId}`);
    res.json({ message: 'Usuário deletado com sucesso.' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar usuário.', error: error.message });
  }
};

