const mongoose = require('mongoose');

// Sub-schema para os itens (boa prática manter junto da venda se não for usado separadamente)
const ItemVendaSchema = new mongoose.Schema({
    produtoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Produto', required: true },
    nomeProduto: String,
    quantidade: { type: Number, required: true },
    precoUnitario: Number,
    subtotal: Number,
    fornecedorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Fornecedor' },
    nomeFornecedor: String
});

const VendaSchema = new mongoose.Schema({
    data: { type: Date, default: Date.now },
    itens: [ItemVendaSchema],
    total: { type: Number, required: true },
    clienteCpf: { type: String, default: '' } // Poderia ser um ref para Cliente, mas mantive seu padrão
});

module.exports = mongoose.model('Venda', VendaSchema);