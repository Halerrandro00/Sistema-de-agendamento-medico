const express = require('express');
const router = express.Router();

// Rota de Login: POST /api/auth/login
router.post('/login', (req, res) => {
    // Os dados enviados pelo front-end chegam em 'req.body'
    const { usuario, senha } = req.body;

    console.log(`[BACKEND] Recebida tentativa de login com usuário: "${usuario}"`);

    // --- LÓGICA DE AUTENTICAÇÃO (exemplo simples) ---
    // No futuro, aqui você consultaria seu banco de dados.
    if (usuario === 'admin' && senha === '12345') {
        console.log('[BACKEND] Login bem-sucedido.');
        // Responde com sucesso (status 200)
        res.status(200).json({ message: 'Login bem-sucedido!' });
    } else {
        console.log('[BACKEND] Credenciais inválidas.');
        // Responde com erro de "Não Autorizado" (status 401)
        res.status(401).json({ message: 'Usuário ou senha inválidos.' });
    }
});

// Rota de Cadastro: POST /api/auth/register
router.post('/register', (req, res) => {
    // Os dados enviados pelo front-end chegam em 'req.body'
    const { nome, usuario, senha } = req.body;

    console.log(`[BACKEND] Recebida tentativa de cadastro com os dados:`);
    console.log({ nome, usuario, senha });

    // --- LÓGICA DE CADASTRO ---
    // Aqui você adicionaria a lógica para salvar o novo usuário no banco de dados.
    // Por enquanto, vamos apenas simular o sucesso.
    // Futuramente, você deve verificar se o usuário já existe antes de salvar.

    // Responde com sucesso (status 201 - Created)
    res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
});

module.exports = router;