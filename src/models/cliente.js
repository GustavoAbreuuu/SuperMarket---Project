const mongoose = require('mongoose');

const ClienteSchema = new mongoose.Schema({
  cpf: { type: String, unique: true },
  nome: String,
  telefone: String,
  endereco: String
});

module.exports = mongoose.model('Cliente', ClienteSchema);