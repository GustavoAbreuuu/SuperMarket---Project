const Cliente = require('../models/cliente');

module.exports = {
    async index(req, res) {
        try {
            const clientes = await Cliente.find();
            return res.json(clientes);
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao buscar clientes', error });
        }
    },

    async store(req, res) {
        try {
            const { cpf, nome, telefone, endereco } = req.body;
            await Cliente.create({ cpf, nome, telefone, endereco });
            return res.status(201).json({ message: 'Cliente cadastrado com sucesso!' });
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao cadastrar cliente', error });
        }
    },

    async show(req, res) {
        try {
            const cliente = await Cliente.findById(req.params.id);
            if (!cliente) return res.status(404).json({ message: 'Cliente não encontrado' });
            return res.json(cliente);
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao buscar cliente', error });
        }
    },

    async update(req, res) {
        try {
            const { cpf, nome, telefone, endereco } = req.body;
            await Cliente.findByIdAndUpdate(req.params.id, { cpf, nome, telefone, endereco });
            return res.json({ message: 'Cliente atualizado com sucesso!' });
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao atualizar cliente', error });
        }
    },

    async destroy(req, res) {
        try {
            await Cliente.findByIdAndDelete(req.params.id);
            return res.json({ message: 'Cliente removido com sucesso!' });
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao excluir cliente', error });
        }
    }
};