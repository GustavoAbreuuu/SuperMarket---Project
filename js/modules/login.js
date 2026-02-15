import { api } from '../services/api.js';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('emailLogin').value;
            const senha = document.getElementById('senhaLogin').value;
            const btn = loginForm.querySelector('button[type="submit"]');

            try {
                btn.textContent = 'Entrando...';
                btn.disabled = true;

                const data = await api.post('/login', { email, senha });

                alert(data.message);
                localStorage.setItem('usuario', JSON.stringify(data.usuario));
                
                window.location.href = 'telaPrincipal.html';

            } catch (error) {
                alert('Erro: ' + error.message);
            } finally {
                btn.textContent = 'Entrar';
                btn.disabled = false;
            }
        });
    }
});