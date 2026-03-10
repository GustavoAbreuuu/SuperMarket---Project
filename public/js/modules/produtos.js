import { api } from '../services/api.js';

document.addEventListener('DOMContentLoaded', () => {
    const listaTabela = document.getElementById('listaProdutos');
    const formCadastro = document.getElementById('cadastroProdutoForm');

    if (listaTabela) {
        carregarProdutos();
        const inputFiltro = document.getElementById('filtroProduto');
        
        if (inputFiltro) {
            inputFiltro.addEventListener('input', (e) => carregarProdutos(e.target.value));
        }

        listaTabela.addEventListener('click', async (e) => {
            const btn = e.target;
            const id = btn.dataset.id;

            if (btn.classList.contains('delete')) {
                if (confirm('Excluir este produto?')) {
                    try {
                        await api.delete(`/produtos/${id}`);
                        carregarProdutos();
                        alert('Produto excluído!');
                    } catch (error) {
                        alert('Erro: ' + error.message);
                    }
                }
            } else if (btn.classList.contains('edit')) {
                window.location.href = `cadastroProduto.html?id=${id}`;
            }
        });
    }

    if (formCadastro) {
        const selectFornecedor = document.getElementById('fornecedorProduto');
        carregarFornecedoresSelect(selectFornecedor);

        const urlParams = new URLSearchParams(window.location.search);
        const idEdicao = urlParams.get('id');

        if (idEdicao) {
            document.getElementById('tituloProduto').textContent = 'Editar Produto';
            setTimeout(() => carregarDadosParaEdicao(idEdicao), 100);
        }

        formCadastro.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const payload = {
                codigo: document.getElementById('codigoProduto').value,
                nome: document.getElementById('nomeProduto').value,
                descricao: document.getElementById('descricaoProduto').value,
                preco: parseFloat(document.getElementById('precoProduto').value),
                quantidadeEstoque: parseInt(document.getElementById('estoqueProduto').value),
                fornecedor: selectFornecedor.value || null
            };

            try {
                if (idEdicao) {
                    await api.put(`/produtos/${idEdicao}`, payload);
                    alert('Produto atualizado!');
                } else {
                    await api.post('/produtos', payload);
                    alert('Produto cadastrado!');
                }
                window.location.href = 'listaProdutos.html';
            } catch (error) {
                alert('Erro ao salvar: ' + error.message);
            }
        });
    }
});

async function carregarProdutos(filtro = '') {
    try {
        const produtos = await api.get('/produtos');
        const tbody = document.getElementById('listaProdutos');
        tbody.replaceChildren();

        const filtrados = produtos.filter(p => 
            p.nome.toLowerCase().includes(filtro.toLowerCase())
        );

        filtrados.forEach(p => {
            const tr = document.createElement('tr');

            const tdCodigo = document.createElement('td');
            tdCodigo.textContent = p.codigo;

            const tdNome = document.createElement('td');
            tdNome.textContent = p.nome;

            const tdFornecedor = document.createElement('td');
            tdFornecedor.textContent = p.fornecedor ? p.fornecedor.nome : '-';

            const tdPreco = document.createElement('td');
            tdPreco.textContent = `R$ ${p.preco.toFixed(2)}`;

            const tdEstoque = document.createElement('td');
            tdEstoque.textContent = p.quantidadeEstoque;

            const tdActions = document.createElement('td');
            tdActions.className = 'actions';

            const btnEdit = document.createElement('button');
            btnEdit.className = 'edit';
            btnEdit.dataset.id = p._id;
            btnEdit.setAttribute('aria-label', `Editar produto ${p.nome}`);
            btnEdit.textContent = 'Editar';

            const btnDelete = document.createElement('button');
            btnDelete.className = 'delete';
            btnDelete.dataset.id = p._id;
            btnDelete.setAttribute('aria-label', `Excluir produto ${p.nome}`);
            btnDelete.textContent = 'Excluir';

            tdActions.append(btnEdit, btnDelete);
            tr.append(tdCodigo, tdNome, tdFornecedor, tdPreco, tdEstoque, tdActions);
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error(error);
    }
}

async function carregarFornecedoresSelect(selectElement) {
    try {
        const fornecedores = await api.get('/fornecedores');
        fornecedores.forEach(f => {
            const opt = document.createElement('option');
            opt.value = f._id;
            opt.textContent = f.nome;
            selectElement.appendChild(opt);
        });
    } catch (error) {
        console.error('Erro ao carregar fornecedores:', error);
    }
}

async function carregarDadosParaEdicao(id) {
    try {
        const produto = await api.get(`/produtos/${id}`);
        document.getElementById('produtoId').value = produto._id;
        document.getElementById('codigoProduto').value = produto.codigo;
        document.getElementById('nomeProduto').value = produto.nome;
        document.getElementById('descricaoProduto').value = produto.descricao || '';
        document.getElementById('precoProduto').value = produto.preco;
        document.getElementById('estoqueProduto').value = produto.quantidadeEstoque;
        
        if (produto.fornecedor) {
            document.getElementById('fornecedorProduto').value = produto.fornecedor._id;
        }
    } catch (error) {
        alert('Erro ao carregar produto: ' + error.message);
    }
}