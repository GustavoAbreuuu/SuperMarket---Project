const Venda = require('../models/venda');
const Produto = require('../models/produto');

module.exports = {
    async index(req, res) {
        try {
            const vendas = await Venda.find();
            return res.json(vendas);
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao buscar vendas', error });
        }
    },

    async store(req, res) {
        const { itens, clienteCpf } = req.body;

        if (!itens || itens.length === 0) {
            return res.status(400).json({ message: 'Nenhum item na venda' });
        }

        try {
            let total = 0;
            const itensProcessados = [];

            for (const item of itens) {
                const produto = await Produto.findById(item.produtoId).populate('fornecedor');

                if (!produto) {
                    return res.status(404).json({ message: `Produto ${item.produtoId} não encontrado.` });
                }

                if (produto.quantidadeEstoque < item.quantidade) {
                    return res.status(400).json({ message: `Estoque insuficiente para: ${produto.nome}` });
                }

                produto.quantidadeEstoque -= item.quantidade;
                await produto.save();

                const subtotal = produto.preco * item.quantidade;
                total += subtotal;

                itensProcessados.push({
                    produtoId: produto._id,
                    nomeProduto: produto.nome,
                    quantidade: item.quantidade,
                    precoUnitario: produto.preco,
                    subtotal,
                    fornecedorId: produto.fornecedor?._id || null, // Optional chaining moderno
                    nomeFornecedor: produto.fornecedor?.nome || ''
                });
            }

            const novaVenda = await Venda.create({
                itens: itensProcessados,
                total,
                clienteCpf: clienteCpf || '',
                data: new Date()
            });

            return res.status(201).json({ message: 'Venda realizada!', vendaId: novaVenda._id });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro ao processar venda', error: error.message });
        }
    }
};