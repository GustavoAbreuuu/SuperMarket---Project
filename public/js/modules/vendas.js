import { api } from '../services/api.js';

let itensVenda = [];

document.addEventListener('DOMContentLoaded', () => {
    const btnAdicionar = document.getElementById('btnAdicionar');
    const btnFinalizar = document.getElementById('btnFinalizarVenda');
    const inputCodigo = document.getElementById('codigoProduto');
    const inputCpf = document.getElementById('cpfClienteVenda');
    const btnConfig = document.getElementById('btnConfiguracoes');
    
    if(inputCodigo) inputCodigo.focus();

    if (btnAdicionar) {
        btnAdicionar.addEventListener('click', async () => {
            const codigo = inputCodigo.value.trim();
            if (!codigo) return alert('Digite o código do produto!');

            try {
                const produto = await api.get(`/produtos/codigo/${codigo}`);
                
                adicionarItemAoCarrinho(produto);
                
                inputCodigo.value = '';
                inputCodigo.focus();
            } catch (error) {
                alert('Produto não encontrado!');
                console.error(error);
            }
        });
    }

    if (btnFinalizar) {
        btnFinalizar.addEventListener('click', async () => {
            if (itensVenda.length === 0) return alert('Carrinho vazio!');

            const vendaPayload = {
                itens: itensVenda,
                clienteCpf: inputCpf.value.trim()
            };

            try {
                btnFinalizar.textContent = 'Finalizando...';
                btnFinalizar.disabled = true;

                await api.post('/vendas', vendaPayload);
                
                alert('Venda realizada com sucesso! 🎉');

                itensVenda = [];
                atualizarTabela();
                inputCpf.value = '';
            } catch (error) {
                alert('Erro ao finalizar: ' + error.message);
            } finally {
                btnFinalizar.textContent = 'Finalizar Venda';
                btnFinalizar.disabled = false;
            }
        });
    }

    if (btnConfig) {
        btnConfig.addEventListener('click', () => {
            window.location.href = 'menu.html';
        });
    }

    const tabelaBody = document.getElementById('tabelaVendasBody');
    if (tabelaBody) {
        tabelaBody.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete')) {
                const index = e.target.dataset.index;
                removerItem(index);
            }
        });
    }
});

function adicionarItemAoCarrinho(produto) {
    const itemExistente = itensVenda.find(i => i.produtoId === produto._id);

    if (itemExistente) {
        itemExistente.quantidade += 1;
        itemExistente.subtotal = itemExistente.quantidade * itemExistente.precoUnitario;
    } else {
        itensVenda.push({
            produtoId: produto._id,
            nomeProduto: produto.nome,
            quantidade: 1,
            precoUnitario: produto.preco,
            subtotal: produto.preco
        });
    }
    atualizarTabela();
}

function removerItem(index) {
    itensVenda.splice(index, 1);
    atualizarTabela();
}

function atualizarTabela() {
    const tbody = document.getElementById('tabelaVendasBody');
    const spanTotal = document.getElementById('valorTotal');
    tbody.replaceChildren();
    let total = 0;

    itensVenda.forEach((item, index) => {
        total += item.subtotal;
        
        const tr = document.createElement('tr');

        const tdProduto = document.createElement('td');
        tdProduto.textContent = item.nomeProduto;

        const tdPreco = document.createElement('td');
        tdPreco.textContent = `R$ ${item.precoUnitario.toFixed(2)}`;

        const tdQtd = document.createElement('td');
        tdQtd.textContent = item.quantidade;

        const tdSubtotal = document.createElement('td');
        tdSubtotal.textContent = `R$ ${item.subtotal.toFixed(2)}`;

        const tdActions = document.createElement('td');
        
        const btnDelete = document.createElement('button');
        btnDelete.className = 'delete';
        btnDelete.dataset.index = index;
        btnDelete.textContent = 'Remover';

        tdActions.appendChild(btnDelete);
        tr.append(tdProduto, tdPreco, tdQtd, tdSubtotal, tdActions);
        tbody.appendChild(tr);
    });

    if (spanTotal) spanTotal.textContent = total.toFixed(2);
}