// Aguarda o conteúdo da página ser totalmente carregado
document.addEventListener('DOMContentLoaded', () => {
    // Seleciona os elementos do formulário pelos IDs que definimos no HTML
    const loginForm = document.getElementById('login-form');
    const usuarioInput = document.getElementById('usuario');
    const senhaInput = document.getElementById('senha');
    const errorMessageDiv = document.getElementById('error-message');

    // Adiciona um "ouvinte" para o evento de 'submit' do formulário
    loginForm.addEventListener('submit', async (event) => {
        // Previne o comportamento padrão do formulário, que é recarregar a página
        event.preventDefault();

        // Limpa mensagens de erro anteriores
        errorMessageDiv.textContent = '';

        // Pega os valores dos campos de input
        const usuario = usuarioInput.value;
        const senha = senhaInput.value;

        // Tenta fazer a requisição para o back-end
        try {
            // Envia os dados para o endpoint de login do seu back-end
            // A URL agora aponta para o seu servidor na porta 3000 e para a rota de autenticação correta.
            const response = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST', // O método HTTP para enviar dados
                headers: {
                    'Content-Type': 'application/json', // Informa que estamos enviando dados em formato JSON
                },
                body: JSON.stringify({ usuario, senha }), // Converte os dados para uma string JSON
            });

            // Pega a resposta do servidor em formato JSON
            const data = await response.json();

            if (response.ok) {
                // Se a resposta for bem-sucedida (status 2xx)
                // Redireciona o usuário para a página de dashboard.
                // Usamos '../' para voltar um nível de diretório, saindo da pasta LOGIN.
                window.location.href = '../dashboard.html';
            } else {
                // Se o servidor retornar um erro (status 4xx ou 5xx)
                errorMessageDiv.textContent = data.message || 'Erro ao fazer login.';
            }
        } catch (error) {
            // Se houver um erro de rede ou o servidor estiver offline
            errorMessageDiv.textContent = 'Não foi possível conectar ao servidor. Tente novamente mais tarde.';
            console.error('Erro na requisição:', error);
        }
    });
});