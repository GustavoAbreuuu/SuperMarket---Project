const Fornecedor = require('../models/fornecedor');

module.exports = {
    async index(req, res) {
        try {
            const fornecedores = await Fornecedor.find();
            return res.json(fornecedores);
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao buscar fornecedores', error });
        }
    },

    async store(req, res) {
        try {
            const { nome, telefone, email } = req.body;
            await Fornecedor.create({ nome, telefone, email });
            return res.status(201).json({ message: 'Fornecedor cadastrado com sucesso!' });
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao cadastrar fornecedor', error });
        }
    },

    async show(req, res) {
        try {
            const fornecedor = await Fornecedor.findById(req.params.id);
            if (!fornecedor) return res.status(404).json({ message: 'Fornecedor não encontrado' });
            return res.json(fornecedor);
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao buscar fornecedor', error });
        }
    },

    async update(req, res) {
        try {
            const { nome, telefone, email } = req.body;
            await Fornecedor.findByIdAndUpdate(req.params.id, { nome, telefone, email });
            return res.json({ message: 'Fornecedor atualizado com sucesso!' });
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao atualizar fornecedor', error });
        }
    },

    async destroy(req, res) {
        try {
            await Fornecedor.findByIdAndDelete(req.params.id);
            return res.json({ message: 'Fornecedor removido com sucesso!' });
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao excluir fornecedor', error });
        }
    }
};