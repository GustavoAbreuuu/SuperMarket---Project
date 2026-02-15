const mongoose = require('mongoose');

const ProdutoSchema = new mongoose.Schema({
    codigo: { type: String, unique: true, required: true },
    nome: { type: String, required: true },
    descricao: String,
    preco: { type: Number, required: true },
    quantidadeEstoque: { type: Number, required: true, default: 0 },
    fornecedor: { type: mongoose.Schema.Types.ObjectId, ref: 'Fornecedor' }
}, { timestamps: true }); // Adiciona createdAt e updatedAt automaticamente

module.exports = mongoose.model('Produto', ProdutoSchema);