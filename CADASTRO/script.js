document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
    const nomeInput = document.getElementById('nome');
    const usuarioInput = document.getElementById('usuario');
    const senhaInput = document.getElementById('senha');
    const confirmarSenhaInput = document.getElementById('confirmar-senha');
    const errorMessageDiv = document.getElementById('error-message');

    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        errorMessageDiv.textContent = '';

        const nome = nomeInput.value;
        const usuario = usuarioInput.value;
        const senha = senhaInput.value;
        const confirmarSenha = confirmarSenhaInput.value;

        // Validação simples no front-end
        if (senha !== confirmarSenha) {
            errorMessageDiv.textContent = 'As senhas não coincidem!';
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // Enviamos nome, usuário e senha para o backend
                body: JSON.stringify({ nome, usuario, senha }),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Cadastro realizado com sucesso! Você será redirecionado para a página de login.');
                // Redireciona para a página de login após o sucesso
                window.location.href = '../LOGIN/index.html';
            } else {
                // Exibe a mensagem de erro vinda do servidor
                errorMessageDiv.textContent = data.message || 'Erro ao realizar o cadastro.';
            }
        } catch (error) {
            errorMessageDiv.textContent = 'Não foi possível conectar ao servidor. Tente novamente mais tarde.';
            console.error('Erro na requisição de cadastro:', error);
        }
    });
});

