import { api } from '../services/api.js';

document.addEventListener('DOMContentLoaded', () => {
    const listaTabela = document.getElementById('listaUsuarios');
    const formCadastro = document.getElementById('cadastroUsuarioForm');
    const filtroInput = document.getElementById('filtroUsuario');
    
    if (listaTabela) {
        carregarUsuarios();

        if (filtroInput) {
            filtroInput.addEventListener('input', (e) => carregarUsuarios(e.target.value));
        }

        listaTabela.addEventListener('click', async (e) => {
            const btn = e.target;
            const id = btn.dataset.id;

            if (btn.classList.contains('delete')) {
                if (confirm('Tem certeza que deseja excluir este usuário?')) {
                    try {
                        await api.delete(`/usuarios/${id}`);
                        carregarUsuarios();
                        alert('Usuário removido!');
                    } catch (error) {
                        alert('Erro ao excluir: ' + error.message);
                    }
                }
            } else if (btn.classList.contains('edit')) {
                window.location.href = `cadastroUsuario.html?id=${id}`;
            }
        });
    }

    if (formCadastro) {
        const urlParams = new URLSearchParams(window.location.search);
        const idEdicao = urlParams.get('id');

        if (idEdicao) {
            document.querySelector('#tituloUsuario').textContent = 'Editar Usuário';
            setTimeout(() => carregarDadosParaEdicao(idEdicao), 100);
        }

        formCadastro.addEventListener('submit', async (e) => {
            e.preventDefault();

            const payload = {
                nome: document.getElementById('nomeUsuario').value,
                email: document.getElementById('emailUsuario').value,
                idade: parseInt(document.getElementById('idadeUsuario').value)
            };

            const senha = document.getElementById('senhaUsuario').value;
            if (senha) payload.senha = senha;

            try {
                if (idEdicao) {
                    await api.put(`/usuarios/${idEdicao}`, payload);
                    alert('Usuário atualizado!');
                } else {
                    if (!senha) return alert('Senha é obrigatória para novo usuário!');
                    await api.post('/usuarios', payload);
                    alert('Usuário cadastrado!');
                }
                window.location.href = 'listaUsuarios.html';
            } catch (error) {
                alert('Erro ao salvar: ' + error.message);
            }
        });
    }
});

async function carregarUsuarios(filtro = '') {
    try {
        const usuarios = await api.get('/usuarios');
        const tbody = document.getElementById('listaUsuarios');
        tbody.innerHTML = '';

        const filtrados = usuarios.filter(u => 
            u.nome.toLowerCase().includes(filtro.toLowerCase()) || 
            u.email.toLowerCase().includes(filtro.toLowerCase())
        );

        filtrados.forEach(u => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${u.nome}</td>
                <td>${u.email}</td>
                <td>${u.idade}</td>
                <td class="actions">
                    <button class="edit" data-id="${u._id}" aria-label="Editar usuário ${u.nome}">Editar</button>
                    <button class="delete" data-id="${u._id}" aria-label="Excluir usuário ${u.nome}">Excluir</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Erro ao listar usuários:', error);
    }
}

async function carregarDadosParaEdicao(id) {
    try {
        const usuario = await api.get(`/usuarios/${id}`);
        document.getElementById('nomeUsuario').value = usuario.nome;
        document.getElementById('emailUsuario').value = usuario.email;
        document.getElementById('idadeUsuario').value = usuario.idade;
    } catch (error) {
        alert('Erro ao carregar usuário: ' + error.message);
    }
}