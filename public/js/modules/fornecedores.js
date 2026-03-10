import { api } from '../services/api.js';

document.addEventListener('DOMContentLoaded', () => {
    const listaTabela = document.getElementById('listaFornecedores');
    const formCadastro = document.getElementById('cadastroFornecedorForm');

    if (listaTabela) {
        carregarFornecedores();

        const inputFiltro = document.getElementById('filtroFornecedor');
        if (inputFiltro) {
            inputFiltro.addEventListener('input', (e) => carregarFornecedores(e.target.value));
        }

        listaTabela.addEventListener('click', async (e) => {
            const btn = e.target;
            const id = btn.dataset.id;

            if (btn.classList.contains('delete')) {
                if (confirm('Tem certeza que deseja excluir?')) {
                    try {
                        await api.delete(`/fornecedores/${id}`);
                        carregarFornecedores();
                        alert('Fornecedor removido!');
                    } catch (error) {
                        alert('Erro ao excluir: ' + error.message);
                    }
                }
            } else if (btn.classList.contains('edit')) {
                window.location.href = `cadastroFornecedor.html?id=${id}`;
            }
        });
    }

    if (formCadastro) {
        const urlParams = new URLSearchParams(window.location.search);
        const idEdicao = urlParams.get('id');

        if (idEdicao) {
            document.getElementById('tituloFornecedor').textContent = 'Editar Fornecedor';
            setTimeout(() => carregarDadosParaEdicao(idEdicao), 100);
        }

        formCadastro.addEventListener('submit', async (e) => {
            e.preventDefault();

            const payload = {
                nome: document.getElementById('nomeFornecedor').value,
                telefone: document.getElementById('telefoneFornecedor').value,
                email: document.getElementById('emailFornecedor').value
            };

            try {
                if (idEdicao) {
                    await api.put(`/fornecedores/${idEdicao}`, payload);
                    alert('Fornecedor atualizado!');
                } else {
                    await api.post('/fornecedores', payload);
                    alert('Fornecedor cadastrado!');
                }
                window.location.href = 'listaFornecedores.html';
            } catch (error) {
                alert('Erro ao salvar: ' + error.message);
            }
        });
    }
});

async function carregarFornecedores(filtro = '') {
    try {
        const fornecedores = await api.get('/fornecedores');
        const tbody = document.getElementById('listaFornecedores');
        tbody.replaceChildren();

        const filtrados = fornecedores.filter(f => 
            f.nome.toLowerCase().includes(filtro.toLowerCase())
        );

        filtrados.forEach(f => {
            const tr = document.createElement('tr');

            const tdNome = document.createElement('td');
            tdNome.textContent = f.nome;

            const tdTelefone = document.createElement('td');
            tdTelefone.textContent = f.telefone;

            const tdEmail = document.createElement('td');
            tdEmail.textContent = f.email || '-';

            const tdActions = document.createElement('td');
            tdActions.className = 'actions';

            const btnEdit = document.createElement('button');
            btnEdit.className = 'edit';
            btnEdit.dataset.id = f._id;
            btnEdit.setAttribute('aria-label', `Editar fornecedor ${f.nome}`);
            btnEdit.textContent = 'Editar';

            const btnDelete = document.createElement('button');
            btnDelete.className = 'delete';
            btnDelete.dataset.id = f._id;
            btnDelete.setAttribute('aria-label', `Excluir fornecedor ${f.nome}`);
            btnDelete.textContent = 'Excluir';

            tdActions.append(btnEdit, btnDelete);
            tr.append(tdNome, tdTelefone, tdEmail, tdActions);
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Erro ao listar:', error);
    }
}

async function carregarDadosParaEdicao(id) {
    try {
        const fornecedor = await api.get(`/fornecedores/${id}`);
        document.getElementById('fornecedorId').value = fornecedor._id;
        document.getElementById('nomeFornecedor').value = fornecedor.nome;
        document.getElementById('telefoneFornecedor').value = fornecedor.telefone;
        document.getElementById('emailFornecedor').value = fornecedor.email || '';
    } catch (error) {
        alert('Erro ao carregar fornecedor: ' + error.message);
    }
}