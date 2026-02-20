const express = require('express');
const routes = express.Router();

const authRoutes = require('./authRoutes');
const usuarioRoutes = require('./usuarioRoutes');
const produtoRoutes = require('./produtoRoutes');
const clienteRoutes = require('./clienteRoutes');
const fornecedorRoutes = require('./fornecedorRoutes');
const vendaRoutes = require('./vendaRoutes');

routes.use('/', authRoutes)
routes.use('/usuarios', usuarioRoutes);
routes.use('/produtos', produtoRoutes);
routes.use('/clientes', clienteRoutes);
routes.use('/fornecedores', fornecedorRoutes);
routes.use('/vendas', vendaRoutes);

module.exports = routes;