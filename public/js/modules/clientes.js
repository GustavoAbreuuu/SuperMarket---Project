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
            setTimeout(() => carregarDadosEdicao(idEdicao), 100);
        }

        formCadastro.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Pegamos o valor do CPF e removemos espaços em branco nas pontas
            const cpfDigitado = document.getElementById('cpfCliente').value.trim();

            // Validação: Verifica se o CPF tem exatamente 11 dígitos
            if (cpfDigitado.length !== 11) {
                alert('Atenção: O CPF inserido não possui o número de caracteres suficiente. Digite exatamente 11 números.');
                return; // O 'return' faz o código parar aqui e não envia para o banco
            }

            const payload = {
                cpf: cpfDigitado, // Usa o CPF que já passou na validação
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
        tbody.replaceChildren(); // Forma moderna e segura de limpar a tabela

        const filtrados = clientes.filter(c => 
            c.nome.toLowerCase().includes(filtro.toLowerCase()) ||
            c.cpf.includes(filtro)
        );

        filtrados.forEach(c => {
            const tr = document.createElement('tr');

            const tdCpf = document.createElement('td');
            tdCpf.textContent = c.cpf;

            const tdNome = document.createElement('td');
            tdNome.textContent = c.nome;

            const tdTelefone = document.createElement('td');
            tdTelefone.textContent = c.telefone || '-';

            const tdEndereco = document.createElement('td');
            tdEndereco.textContent = c.endereco || '-';

            const tdActions = document.createElement('td');
            tdActions.className = 'actions';

            const btnEdit = document.createElement('button');
            btnEdit.className = 'edit';
            btnEdit.dataset.id = c._id;
            btnEdit.setAttribute('aria-label', `Editar cliente ${c.nome}`);
            btnEdit.textContent = 'Editar';

            const btnDelete = document.createElement('button');
            btnDelete.className = 'delete';
            btnDelete.dataset.id = c._id;
            btnDelete.setAttribute('aria-label', `Excluir cliente ${c.nome}`);
            btnDelete.textContent = 'Excluir';

            tdActions.append(btnEdit, btnDelete);
            tr.append(tdCpf, tdNome, tdTelefone, tdEndereco, tdActions);
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
        alert('Erro ao carregar cliente: ' + error.message);
    }
}