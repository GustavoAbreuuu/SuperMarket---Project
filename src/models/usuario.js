const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({ 
  nome: String,
  email: { type: String, unique: true, required: true },
  senha: { type: String, required: true },
  idade: Number
});

module.exports = mongoose.model('Usuario', UsuarioSchema);