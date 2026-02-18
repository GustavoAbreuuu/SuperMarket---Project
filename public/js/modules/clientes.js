import { api } from '../services/api.js';

document.addEventListener('DOMContentLoaded', () => {
    const listaTabela = document.getElementById('listaClientes');
    const formCadastro = document.getElementById('cadastroClienteForm');
    const filtroInput = document.getElementById('filtroCliente');

    if (listaTabela) {
        carregarClientes();

        if (filtroInput) {
            filtroInput.addEventListener('input', (e) => carregarClientes(e.target.value));
        }

        listaTabela.addEventListener('click', async (e) => {
            const btn = e.target;
            const id = btn.dataset.id;

            if (btn.classList.contains('delete')) {
                if (confirm('Deseja excluir este cliente?')) {
                    try {
                        await api.delete(`/clientes/${id}`);
                        carregarClientes();
                        alert('Cliente removido!');
                    } catch (error) {
                        alert('Erro: ' + error.message);
                    }
                }
            } else if (btn.classList.contains('edit')) {
                window.location.href = `cadastroCliente.html?id=${id}`;
            }
        });
    }

    if (formCadastro) {
        const urlParams = new URLSearchParams(window.location.search);
        const idEdicao = urlParams.get('id');

        if (idEdicao) {
            document.getElementById('tituloCliente').textContent = 'Editar Cliente';
            carregarDadosEdicao(idEdicao);
        }

        formCadastro.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const payload = {
                cpf: document.getElementById('cpfCliente').value,
                nome: document.getElementById('nomeCliente').value,
                telefone: document.getElementById('telefoneCliente').value,
                endereco: document.getElementById('enderecoCliente').value
            };

            try {
                if (idEdicao) {
                    await api.put(`/clientes/${idEdicao}`, payload);
                    alert('Cliente atualizado!');
                } else {
                    await api.post('/clientes', payload);
                    alert('Cliente cadastrado!');
                }
                window.location.href = 'listaClientes.html';
            } catch (error) {
                alert('Erro ao salvar: ' + error.message);
            }
        });
    }
});

async function carregarClientes(filtro = '') {
    try {
        const clientes = await api.get('/clientes');
        const tbody = document.getElementById('listaClientes');
        tbody.innerHTML = '';

        const filtrados = clientes.filter(c => 
            c.nome.toLowerCase().includes(filtro.toLowerCase()) ||
            c.cpf.includes(filtro)
        );

        filtrados.forEach(c => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${c.cpf}</td>
                <td>${c.nome}</td>
                <td>${c.telefone || '-'}</td>
                <td>${c.endereco || '-'}</td>
                <td class="actions">
                    <button class="edit" data-id="${c._id}">Editar</button>
                    <button class="delete" data-id="${c._id}">Excluir</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error(error);
    }
}

async function carregarDadosEdicao(id) {
    try {
        const cliente = await api.get(`/clientes/${id}`);
        document.getElementById('clienteId').value = cliente._id;
        document.getElementById('cpfCliente').value = cliente.cpf;
        document.getElementById('nomeCliente').value = cliente.nome;
        document.getElementById('telefoneCliente').value = cliente.telefone || '';
        document.getElementById('enderecoCliente').value = cliente.endereco || '';
    } catch (error) {
        alert('Erro ao carregar dados.');
    }
}