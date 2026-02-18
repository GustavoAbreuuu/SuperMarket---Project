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

        tbody.innerHTML = '';
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
                tr.innerHTML = `
                    <td>${dataFormatada}</td>
                    <td>${venda.clienteCpf || 'N/A'}</td>
                    <td>${item.nomeProduto}</td>
                    <td>${item.quantidade}</td>
                    <td>R$ ${item.precoUnitario.toFixed(2)}</td>
                    <td>R$ ${item.subtotal.toFixed(2)}</td>
                `;
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