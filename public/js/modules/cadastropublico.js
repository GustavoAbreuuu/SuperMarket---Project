import { api } from '../services/api.js';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('cadastroUsuarioPublicoForm');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const nome = document.getElementById('nomeUsuarioPub').value;
            const email = document.getElementById('emailUsuarioPub').value;
            const senha = document.getElementById('senhaUsuarioPub').value;
            const idade = document.getElementById('idadeUsuarioPub').value;

            const btnSalvar = form.querySelector('button.save');

            try {
                btnSalvar.textContent = 'Salvando...';
                btnSalvar.disabled = true;

                await api.post('/usuarios', {
                    nome,
                    email,
                    senha,
                    idade: parseInt(idade)
                });

                alert('Usuário cadastrado com sucesso! Faça login.');
                window.location.href = 'login.html';

            } catch (error) {
                console.error(error);
                alert('Erro ao cadastrar: ' + error.message);
            } finally {
                btnSalvar.textContent = 'Salvar';
                btnSalvar.disabled = false;
            }
        });
    }
});