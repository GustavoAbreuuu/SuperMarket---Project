const Usuario = require('../models/usuario');

module.exports = {

    async login(req, res) {
        try {
            const { email, senha } = req.body;
            const usuario = await Usuario.findOne({ email, senha });

            if (!usuario) {
                return res.status(401).json({ message: 'Credenciais inválidas' });
            }

            return res.json({ message: 'Login realizado com sucesso', usuario });
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao efetuar login', error });
        }
    },

    async index(req, res) { 
        try {
            const usuarios = await Usuario.find();
            return res.json(usuarios);
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao buscar usuários', error });
        }
    },

    async store(req, res) {
        try {
            const { nome, email, senha, idade } = req.body;
            const novoUsuario = await Usuario.create({ nome, email, senha, idade });
            return res.status(201).json({ message: 'Usuário cadastrado com sucesso!', usuario: novoUsuario });
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao cadastrar usuário', error });
        }
    },

    async show(req, res) {
        try {
            const usuario = await Usuario.findById(req.params.id);
            if (!usuario) return res.status(404).json({ message: 'Usuário não encontrado' });
            return res.json(usuario);
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao buscar usuário', error });
        }
    },

    async update(req, res) {
        try {
            const { nome, email, senha, idade } = req.body;
            await Usuario.findByIdAndUpdate(req.params.id, { nome, email, senha, idade });
            return res.json({ message: 'Usuário atualizado com sucesso!' });
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao atualizar usuário', error });
        }
    },

    async destroy(req, res) {
        try {
            await Usuario.findByIdAndDelete(req.params.id);
            return res.json({ message: 'Usuário removido com sucesso!' });
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao excluir usuário', error });
        }
    }
};