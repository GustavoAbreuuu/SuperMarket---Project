const express = require('express');
const routes = express.Router();

const VendaController = require('../controllers/vendacontroller');
const UsuarioController = require('../controllers/usuariocontroller');
const ProdutoController = require('../controllers/produtocontroller');
const ClienteController = require('../controllers/clientecontroller');
const FornecedorController = require('../controllers/fornecedorcontroller');

routes.post('/login', UsuarioController.login);
routes.get('/usuarios', UsuarioController.index);
routes.post('/usuarios', UsuarioController.store);
routes.get('/usuarios/:id', UsuarioController.show);
routes.put('/usuarios/:id', UsuarioController.update);
routes.delete('/usuarios/:id', UsuarioController.destroy);

routes.get('/produtos', ProdutoController.index);
routes.post('/produtos', ProdutoController.store);
routes.get('/produtos/:id', ProdutoController.show);
routes.put('/produtos/:id', ProdutoController.update);
routes.delete('/produtos/:id', ProdutoController.destroy);
routes.get('/produtos/codigo/:codigo', ProdutoController.getByCodigo);

routes.get('/clientes', ClienteController.index);
routes.post('/clientes', ClienteController.store);
routes.get('/clientes/:id', ClienteController.show);
routes.put('/clientes/:id', ClienteController.update);
routes.delete('/clientes/:id', ClienteController.destroy);

routes.get('/fornecedores', FornecedorController.index);
routes.post('/fornecedores', FornecedorController.store);
routes.get('/fornecedores/:id', FornecedorController.show);
routes.put('/fornecedores/:id', FornecedorController.update);
routes.delete('/fornecedores/:id', FornecedorController.destroy);


routes.get('/vendas', VendaController.index);
routes.post('/vendas', VendaController.store);

module.exports = routes;