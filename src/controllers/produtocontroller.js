const Produto = require('../models/produto');

module.exports = {
    async index(req, res) {
        try {
            // Populate traz os dados do Fornecedor junto
            const produtos = await Produto.find().populate('fornecedor');
            return res.json(produtos);
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao buscar produtos', error });
        }
    },

    async store(req, res) {
        try {
            const { codigo, nome, descricao, preco, quantidadeEstoque, fornecedor } = req.body;
            const novoProduto = await Produto.create({
                codigo, nome, descricao, preco, quantidadeEstoque, fornecedor
            });
            return res.status(201).json({ message: 'Produto cadastrado!', produto: novoProduto });
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao cadastrar produto', error });
        }
    },

    async show(req, res) {
        try {
            const produto = await Produto.findById(req.params.id).populate('fornecedor');
            if (!produto) return res.status(404).json({ message: 'Produto não encontrado' });
            return res.json(produto);
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao buscar produto', error });
        }
    },

    // IMPORTANTE: Busca pelo Código de Barras (Usado na Venda)
    async getByCodigo(req, res) {
        try {
            const { codigo } = req.params;
            const produto = await Produto.findOne({ codigo }).populate('fornecedor');

            if (!produto) {
                return res.status(404).json({ message: 'Produto não encontrado pelo código' });
            }
            return res.json(produto);
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao buscar produto pelo código', error });
        }
    },

    async update(req, res) {
        try {
            const { codigo, nome, descricao, preco, quantidadeEstoque, fornecedor } = req.body;
            await Produto.findByIdAndUpdate(req.params.id, {
                codigo, nome, descricao, preco, quantidadeEstoque, fornecedor
            });
            return res.json({ message: 'Produto atualizado com sucesso!' });
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao atualizar produto', error });
        }
    },

    async destroy(req, res) {
        try {
            await Produto.findByIdAndDelete(req.params.id);
            return res.json({ message: 'Produto removido com sucesso!' });
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao excluir produto', error });
        }
    }
};