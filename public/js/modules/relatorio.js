import { api } from '../services/api.js';

document.addEventListener('DOMContentLoaded', () => {
    const btnBuscar = document.getElementById('btnBuscarRelatorio');
    const inputDataIni = document.getElementById('dataInicial');
    const inputDataFim = document.getElementById('dataFinal');

    const hoje = new Date();
    const seteDiasAtras = new Date();
    seteDiasAtras.setDate(hoje.getDate() - 7);

    if (inputDataIni && inputDataFim) {
        inputDataIni.value = seteDiasAtras.toISOString().split('T')[0];
        inputDataFim.value = hoje.toISOString().split('T')[0];
    }

    carregarRelatorio();

    if (btnBuscar) {
        btnBuscar.addEventListener('click', (e) => {
            e.preventDefault();
            carregarRelatorio();
        });
    }
});

async function carregarRelatorio() {
    try {
        const vendas = await api.get('/vendas');

        const dataIni = new Date(document.getElementById('dataInicial').value);
        const dataFim = new Date(document.getElementById('dataFinal').value);

        dataFim.setHours(23, 59, 59);

        const tbody = document.querySelector('#tabela-relatorio tbody');
        const spanTotal = document.getElementById('valorTotal');

        if (!tbody) return;

        tbody.replaceChildren();
        let totalGeral = 0;

        const vendasFiltradas = vendas.filter(venda => {
            const dataVenda = new Date(venda.data);
            return dataVenda >= dataIni && dataVenda <= dataFim;
        });

        vendasFiltradas.forEach(venda => {
            totalGeral += venda.total;
            const dataFormatada = new Date(venda.data).toLocaleDateString('pt-BR');

            venda.itens.forEach(item => {
                const tr = document.createElement('tr');

                const tdData = document.createElement('td');
                tdData.textContent = dataFormatada;

                const tdCpf = document.createElement('td');
                tdCpf.textContent = venda.clienteCpf || 'N/A';

                const tdProduto = document.createElement('td');
                tdProduto.textContent = item.nomeProduto;

                const tdQtd = document.createElement('td');
                tdQtd.textContent = item.quantidade;

                const tdPreco = document.createElement('td');
                tdPreco.textContent = `R$ ${item.precoUnitario.toFixed(2)}`;

                const tdSubtotal = document.createElement('td');
                tdSubtotal.textContent = `R$ ${item.subtotal.toFixed(2)}`;

                tr.append(tdData, tdCpf, tdProduto, tdQtd, tdPreco, tdSubtotal);
                tbody.appendChild(tr);
            });
        });

        if (spanTotal) {
            spanTotal.textContent = totalGeral.toFixed(2);
        }

    } catch (error) {
        console.error('Erro ao carregar relatório:', error);
        alert('Erro ao carregar vendas.');
    }
}