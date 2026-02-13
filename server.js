const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/meu_supermercado', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB conectado!'))
.catch(err => console.error('Erro ao conectar no MongoDB:', err));

const UsuarioSchema = new mongoose.Schema({ 
  nome: String,
  email: { type: String, unique: true },
  senha: String,
  idade: Number
});
const Usuario = mongoose.model('Usuario', UsuarioSchema);

const FornecedorSchema = new mongoose.Schema({
  nome: String,
  telefone: String,
  email: String
});
const Fornecedor = mongoose.model('Fornecedor', FornecedorSchema);

const ClienteSchema = new mongoose.Schema({
  cpf: { type: String, unique: true },
  nome: String,
  telefone: String,
  endereco: String
});
const Cliente = mongoose.model('Cliente', ClienteSchema);

const ProdutoSchema = new mongoose.Schema({
  codigo: { type: String, unique: true },
  nome: String,
  descricao: String,
  preco: Number,
  quantidadeEstoque: Number,
  fornecedor: { type: mongoose.Schema.Types.ObjectId, ref: 'Fornecedor' }
});
const Produto = mongoose.model('Produto', ProdutoSchema);

const ItemVendaSchema = new mongoose.Schema({
  produtoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Produto' },
  nomeProduto: String,
  quantidade: Number,
  precoUnitario: Number,
  subtotal: Number,
  fornecedorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Fornecedor' },
  nomeFornecedor: String
});

const VendaSchema = new mongoose.Schema({
  data: { type: Date, default: Date.now },
  itens: [ItemVendaSchema],
  total: Number,
  clienteCpf: { type: String, default: '' }
});
const Venda = mongoose.model('Venda', VendaSchema);

app.get('/relatorio/vendas', async (req, res) => {
  try {
    let { dataInicial, dataFinal, fornecedorNome, produtoNome, cpfCliente } = req.query;

    if (!dataInicial || !dataFinal) {
      const hoje = new Date();
      const seteDiasAtras = new Date();
      seteDiasAtras.setDate(hoje.getDate() - 7);

      dataInicial = seteDiasAtras.toISOString().split('T')[0];
      dataFinal = hoje.toISOString().split('T')[0];
    }

    const filtro = { 
      data: { 
        $gte: new Date(`${dataInicial}T00:00:00.000Z`), 
        $lte: new Date(`${dataFinal}T23:59:59.999Z`) 
      }
    };

    if (cpfCliente) {
      filtro.clienteCpf = cpfCliente.trim();
    }

    const filtroItens = [];
    if (fornecedorNome) {
      filtroItens.push({ "itens.nomeFornecedor": new RegExp(fornecedorNome, 'i') });
    }
    if (produtoNome) {
      filtroItens.push({ "itens.nomeProduto": new RegExp(produtoNome, 'i') });
    }
    if (filtroItens.length > 0) {
      filtro.$and = filtroItens;
    }
    
    const vendas = await Venda.find(filtro);
    const vendasFiltradas = vendas.map(venda => {
        const itensFiltrados = venda.itens.filter(item => {
            return (
                (!fornecedorNome || item.nomeFornecedor.match(new RegExp(fornecedorNome, 'i'))) && 
                (!produtoNome || item.nomeProduto.match(new RegExp(produtoNome, 'i')))
            );
        });
        return { ...venda._doc, itens: itensFiltrados };
    }).filter(venda => venda.itens.length > 0); 

    return res.status(200).json(vendasFiltradas);

  } catch (erro) {
    console.error('Erro ao gerar relatório:', erro);
    return res.status(500).json({
      mensagem: 'Erro interno do servidor.',
      erroDetalhado: erro.message
    });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;
    const usuario = await Usuario.findOne({ email, senha });

    if (!usuario) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    return res.json({ 
      message: 'Login realizado com sucesso', 
      usuario 
    });

  } catch (error) {
    return res.status(500).json({ message: 'Erro ao efetuar login', error });
  }
});

app.post('/usuarios', async (req, res) => {
  try {
    const { nome, email, senha, idade } = req.body;
    const novoUsuario = new Usuario({ nome, email, senha, idade });
    await novoUsuario.save();
    res.json({ message: 'Usuário cadastrado com sucesso!' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao cadastrar usuário', error });
  }
});

app.get('/usuarios', async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar usuários', error });
  }
});

app.get('/usuarios/:id', async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar usuário', error });
  }
});

app.put('/usuarios/:id', async (req, res) => {
  try {
    const { nome, email, senha, idade } = req.body;
    await Usuario.findByIdAndUpdate(req.params.id, { nome, email, senha, idade });
    res.json({ message: 'Usuário atualizado com sucesso!' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar usuário', error });
  }
});

app.delete('/usuarios/:id', async (req, res) => {
  try {
    await Usuario.findByIdAndDelete(req.params.id);
    res.json({ message: 'Usuário removido com sucesso!' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao excluir usuário', error });
  }
});

app.get('/usuarios/filtro/:termo', async (req, res) => {
  try {
    const { termo } = req.params;
    const usuarios = await Usuario.find({
      $or: [
        { nome: { $regex: termo, $options: 'i' } },
        { email: { $regex: termo, $options: 'i' } }
      ]
    });
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao filtrar usuários', error });
  }
});

app.post('/fornecedores', async (req, res) => {
  try {
    const { nome, telefone, email } = req.body;
    const novoFornecedor = new Fornecedor({ nome, telefone, email });
    await novoFornecedor.save();
    res.json({ message: 'Fornecedor cadastrado com sucesso!' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao cadastrar fornecedor', error });
  }
});

app.get('/fornecedores', async (req, res) => {
  try {
    const fornecedores = await Fornecedor.find();
    res.json(fornecedores);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar fornecedores', error });
  }
});

app.get('/fornecedores/:id', async (req, res) => {
  try {
    const fornecedor = await Fornecedor.findById(req.params.id);
    res.json(fornecedor);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar fornecedor', error });
  }
});

app.put('/fornecedores/:id', async (req, res) => {
  try {
    const { nome, telefone, email } = req.body;
    await Fornecedor.findByIdAndUpdate(req.params.id, { nome, telefone, email });
    res.json({ message: 'Fornecedor atualizado com sucesso!' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar fornecedor', error });
  }
});

app.delete('/fornecedores/:id', async (req, res) => {
  try {
    await Fornecedor.findByIdAndDelete(req.params.id);
    res.json({ message: 'Fornecedor removido com sucesso!' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao excluir fornecedor', error });
  }
});

app.post('/clientes', async (req, res) => {
  try {
    const { cpf, nome, telefone, endereco } = req.body;
    const novoCliente = new Cliente({ cpf, nome, telefone, endereco });
    await novoCliente.save();
    res.json({ message: 'Cliente cadastrado com sucesso!' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao cadastrar cliente', error });
  }
});

app.get('/clientes', async (req, res) => {
  try {
    const clientes = await Cliente.find();
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar clientes', error });
  }
});

app.get('/clientes/:id', async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.params.id);
    res.json(cliente);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar cliente', error });
  }
});

app.put('/clientes/:id', async (req, res) => {
  try {
    const { cpf, nome, telefone, endereco } = req.body;
    await Cliente.findByIdAndUpdate(req.params.id, { cpf, nome, telefone, endereco });
    res.json({ message: 'Cliente atualizado com sucesso!' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar cliente', error });
  }
});

app.delete('/clientes/:id', async (req, res) => {
  try {
    await Cliente.findByIdAndDelete(req.params.id);
    res.json({ message: 'Cliente removido com sucesso!' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao excluir cliente', error });
  }
});

app.post('/produtos', async (req, res) => {
  try {
    const { codigo, nome, descricao, preco, quantidadeEstoque, fornecedor } = req.body;
    const novoProduto = new Produto({
      codigo,
      nome, 
      descricao,
      preco, 
      quantidadeEstoque,
      fornecedor 
    });
    await novoProduto.save();
    res.json({ message: 'Produto cadastrado com sucesso!' });

  } catch (error) {
    res.status(500).json({ message: 'Erro ao cadastrar produto', error });
  }
});

app.get('/produtos', async (req, res) => {
  try {
    const produtos = await Produto.find().populate('fornecedor');
    res.json(produtos);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar produtos', error });
  }
});

app.get('/produtos/:id', async (req, res) => {
  try {
    const produto = await Produto.findById(req.params.id).populate('fornecedor');
    res.json(produto);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar produto', error });
  }
});

app.put('/produtos/:id', async (req, res) => {
  try {
    const { codigo, nome, descricao, preco, quantidadeEstoque, fornecedor } = req.body;
    await Produto.findByIdAndUpdate(
      req.params.id, 
      { codigo, nome, descricao, preco, quantidadeEstoque, fornecedor } 
    );
    res.json({ message: 'Produto atualizado com sucesso!' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar produto', error });
  }
});

app.delete('/produtos/:id', async (req, res) => {
  try {
    await Produto.findByIdAndDelete(req.params.id);
    res.json({ message: 'Produto removido com sucesso!' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao excluir produto', error });
  }
});

app.get('/produtos/codigo/:codigo', async (req, res) => {
  try {
    const { codigo } = req.params;
    const produto = await Produto.findOne({ codigo }).populate('fornecedor');

    if (!produto) {
      return res.status(404).json({ message: 'Produto não encontrado pelo código' });
    }

    res.json(produto);

  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar produto pelo código', error });
  }
});

app.post('/vendas', async (req, res) => {
  try {
    const { itens, clienteCpf } = req.body;

    if (!itens || itens.length === 0) {
      return res.status(400).json({ message: 'Nenhum item na venda' });
    }

    let total = 0;

    const itensProcessados = await Promise.all(
      itens.map(async (item) => {
        const produto = await Produto.findById(item.produtoId).populate('fornecedor');

        if (!produto) {
          throw new Error(`Produto ${item.produtoId} não encontrado.`);
        }

        if (produto.quantidadeEstoque < item.quantidade) {
          throw new Error(`Estoque insuficiente para o produto ${produto.nome}`); 
        }
        produto.quantidadeEstoque -= item.quantidade;
        await produto.save();
        
        const subtotal = produto.preco * item.quantidade;
        total += subtotal;

        return {
          produtoId: produto._id,
          nomeProduto: produto.nome,
          quantidade: item.quantidade,
          precoUnitario: produto.preco,
          subtotal,
          fornecedorId: produto.fornecedor ? produto.fornecedor._id : null,
          nomeFornecedor: produto.fornecedor ? produto.fornecedor.nome : ''
        };
      })
    );

    const novaVenda = new Venda({
      itens: itensProcessados,
      total,
      clienteCpf: clienteCpf || '',
      data: new Date()
    });
    await novaVenda.save();

    res.json({ message: 'Venda realizada com sucesso!', vendaId: novaVenda._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao processar a venda', error: error.message });
  }
});

app.get('/vendas', async (req, res) => {
  try {
    const vendas = await Venda.find();
    res.json(vendas);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar vendas', error });
  }
});

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});