const mongoose = require('mongoose');

const FornecedorSchema = new mongoose.Schema({
  nome: String,
  telefone: String,
  email: String
});

module.exports = mongoose.model('Fornecedor', FornecedorSchema);