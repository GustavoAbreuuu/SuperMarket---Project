document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('emailLogin').value;
      const senha = document.getElementById('senhaLogin').value;

      try {
        const response = await fetch('http://localhost:3000/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, senha })
        });

        if (!response.ok) {
          const data = await response.json();
          alert(data.message || 'Erro no login');
          return;
        }

        const data = await response.json();
        alert(data.message);
        window.location.href = 'telaPrincipal.html';

      } catch (error) {
        alert('Erro ao fazer login: ' + error);
      }
    });
  }

  const cadastroUsuarioPublicoForm = document.getElementById('cadastroUsuarioPublicoForm');

  if (cadastroUsuarioPublicoForm) {
    cadastroUsuarioPublicoForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const nome = document.getElementById('nomeUsuarioPub').value;
      const email = document.getElementById('emailUsuarioPub').value;
      const senha = document.getElementById('senhaUsuarioPub').value;
      const idade = parseInt(document.getElementById('idadeUsuarioPub').value);

      try {
        const resp = await fetch('http://localhost:3000/usuarios', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nome, email, senha, idade })
        });

        const data = await resp.json();

        if (!resp.ok) {
          alert(data.message || 'Erro ao cadastrar usuário');
          return;
        }

        alert('Usuário cadastrado com sucesso!');
        window.location.href = 'login.html';

      } catch (error) {
        alert('Erro ao cadastrar: ' + error);
      }
    });
  }

  const btnAdicionar = document.getElementById('btnAdicionar');
  const btnFinalizarVenda = document.getElementById('btnFinalizarVenda');
  const btnConfiguracoes = document.getElementById('btnConfiguracoes');
  const tabelaVendasBody = document.getElementById('tabelaVendasBody');
  const valorTotalSpan = document.getElementById('valorTotal');
  const cpfClienteVenda = document.getElementById('cpfClienteVenda');
  let itensVenda = [];

  if (btnAdicionar && tabelaVendasBody && btnFinalizarVenda) {
    
    btnAdicionar.addEventListener('click', async () => {
      const codigoProduto = document.getElementById('codigoProduto').value.trim();

      if (!codigoProduto) {
        alert('Digite o código do produto!');
        return;
      }

      try {
        const resp = await fetch(`http://localhost:3000/produtos/codigo/${codigoProduto}`);

        if (!resp.ok) {
          const data = await resp.json();
          alert(data.message || 'Erro ao buscar produto');
          return;
        }

        const produto = await resp.json();
        const itemExistente = itensVenda.find(i => i.produtoId === produto._id);

        if (itemExistente) {
          itemExistente.quantidade += 1;
          itemExistente.subtotal = itemExistente.quantidade * itemExistente.precoUnitario;
        } else {
          const novoItem = {
            produtoId: produto._id,
            nomeProduto: produto.nome,
            quantidade: 1,
            precoUnitario: produto.preco,
            subtotal: produto.preco
          };
          itensVenda.push(novoItem);
        }

        atualizarTabelaVendas();
        document.getElementById('codigoProduto').value = '';
        document.getElementById('codigoProduto').focus();

      } catch (error) {
        alert('Erro ao buscar produto: ' + error);
      }
    });

    btnFinalizarVenda.addEventListener('click', async () => {
      if (itensVenda.length === 0) {
        alert('Nenhum item na venda!');
        return;
      }

      const dataAtual = new Date();
      const dataFormatada = `${dataAtual.getFullYear()}-${String(dataAtual.getMonth() + 1).padStart(2, '0')}-${String(dataAtual.getDate()).padStart(2, '0')}`;
  
      try {
          const response = await fetch('http://localhost:3000/vendas', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  itens: itensVenda,
                  clienteCpf: cpfClienteVenda.value.trim(),
                  dataVenda: dataFormatada
              })
          });
      
          const data = await response.json();

          if (!response.ok) {
              alert(data.message || 'Erro ao finalizar venda');
              return;
          }

          alert(data.message || 'Venda realizada com sucesso!');
          itensVenda = [];
          atualizarTabelaVendas();
          cpfClienteVenda.value = '';

      } catch (error) {
          alert('Erro ao finalizar venda: ' + error);
      }
    });

    if (btnConfiguracoes) {
        btnConfiguracoes.addEventListener('click', () => {
            window.location.href = 'menu.html';
        });
    }
  }

  function atualizarTabelaVendas() {
    tabelaVendasBody.innerHTML = '';
    let total = 0;

    itensVenda.forEach((item, idx) => {
      total += item.subtotal;
      const tr = document.createElement('tr');
      tr.innerHTML = `
            <td>${item.nomeProduto}</td>
            <td>R$ ${item.precoUnitario.toFixed(2)}</td>
            <td>
                <input
                    type="number"
                    min="1"
                    value="${item.quantidade}"
                    style="width:60px"
                    onchange="atualizarQuantidade(${idx}, this.value)"
                />
            </td>
            <td>R$ ${item.subtotal.toFixed(2)}</td>
            <td>
                <button class="delete" onclick="removerItem(${idx})">Remover</button>
            </td>
        `;
        tabelaVendasBody.appendChild(tr);
    });

    if (valorTotalSpan) {
      valorTotalSpan.textContent = total.toFixed(2);
    }
  }

  window.removerItem = (idx) => {
      itensVenda.splice(idx, 1);
      atualizarTabelaVendas();
  };

  window.atualizarQuantidade = (idx, novaQtd) => {
      const qtd = parseInt(novaQtd);
      if (qtd <= 0) return;

      itensVenda[idx].quantidade = qtd;
      itensVenda[idx].subtotal = itensVenda[idx].precoUnitario * qtd;
      atualizarTabelaVendas();
  };

  if (document.getElementById('listaUsuarios')) {
    carregarUsuarios();
    document.getElementById('filtroUsuario').addEventListener('input', carregarUsuarios);
  }

  if (document.getElementById('cadastroUsuarioForm')) {
      prepararFormularioUsuario();
  }

  if (document.getElementById('listaFornecedores')) {
      carregarFornecedores();
      document.getElementById('filtroFornecedor').addEventListener('input', carregarFornecedores);
  }

  if (document.getElementById('cadastroFornecedorForm')) {
      prepararFormularioFornecedor();
  }

  if (document.getElementById('listaProdutos')) {
      carregarProdutos();
      document.getElementById('filtroProduto').addEventListener('input', carregarProdutos);
  }

  if (document.getElementById('cadastroProdutoForm')) {
      prepararFormularioProduto();
  }

  if (document.getElementById('listaClientes')) {
      carregarClientes();
      document.getElementById('filtroCliente').addEventListener('input', carregarClientes);
  }

  if (document.getElementById('cadastroClienteForm')) {
      prepararFormularioCliente();
  }

  const btnBuscarRelatorio = document.getElementById('btnBuscarRelatorio');
  const btnExportarExcel = document.getElementById('btnExportarExcel');
  const fornecedorFiltro = document.getElementById('fornecedorFiltro');
  const produtoFiltro = document.getElementById('produtoFiltro');

  if (btnBuscarRelatorio) {
      carregarFornecedoresNoSelect(fornecedorFiltro);
      carregarProdutosNoSelect(produtoFiltro);

      btnBuscarRelatorio.addEventListener('click', async () => {
        const dataInicial = document.getElementById('dataInicial').value;
        const dataFinal   = document.getElementById('dataFinal').value;
        const fornecedor  = document.getElementById('fornecedorFiltro').value.trim();
        const produto     = document.getElementById('produtoFiltro').value.trim();
        const cpf         = document.getElementById('cpfFiltro').value.trim();

        carregarRelatorio(dataInicial, dataFinal, fornecedor, produto, cpf);
      });
  }

  if (btnExportarExcel) {
      btnExportarExcel.addEventListener('click', exportarRelatorioParaExcel);
  }
});

async function carregarUsuarios() {
  const filtro = document.getElementById('filtroUsuario').value.toLowerCase();
  const response = await fetch('http://localhost:3000/usuarios');
  const usuarios = await response.json();
  const lista = document.getElementById('listaUsuarios');

  lista.innerHTML = '';

  usuarios.filter(u => u.nome.toLowerCase().includes(filtro) || u.email.toLowerCase().includes(filtro))
  .forEach(user => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
          <td>${user.nome}</td>
          <td>${user.email}</td>
          <td>${user.idade}</td>
          <td class="actions">
              <button class="edit" onclick="editarUsuario('${user._id}')">Editar</button>
              <button class="delete" onclick="deletarUsuario('${user._id}')">Excluir</button>
          </td>
      `;
      lista.appendChild(tr);
  });
}

function editarUsuario(id) {
    window.location.href = `cadastroUsuario.html?id=${id}`;
}

async function deletarUsuario(id) {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
        await fetch(`http://localhost:3000/usuarios/${id}`, { method: 'DELETE' });
        alert('Usuário removido com sucesso!');
        carregarUsuarios();
    }
}

async function prepararFormularioUsuario() {
  const urlParams = new URLSearchParams(window.location.search);
  const usuarioId = urlParams.get('id');

  if (usuarioId) {
    document.getElementById('tituloUsuario').textContent = 'Editar Usuário';
    const response = await fetch(`http://localhost:3000/usuarios/${usuarioId}`);
    const usuario = await response.json();

    if (usuario) {
      document.getElementById('usuarioId').value = usuario._id;
      document.getElementById('nomeUsuario').value = usuario.nome;
      document.getElementById('emailUsuario').value = usuario.email;
      document.getElementById('senhaUsuario').value = usuario.senha || '';
      document.getElementById('idadeUsuario').value = usuario.idade;
    }
  }

document.getElementById('cadastroUsuarioForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('usuarioId').value;
    const nome = document.getElementById('nomeUsuario').value;
    const email = document.getElementById('emailUsuario').value;
    const senha = document.getElementById('senhaUsuario').value;
    const idade = parseInt(document.getElementById('idadeUsuario').value);

    if (id) {
      await fetch(`http://localhost:3000/usuarios/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nome, email, senha, idade })
      });
      alert('Usuário atualizado com sucesso!');
    } else {
      await fetch('http://localhost:3000/usuarios', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nome, email, senha, idade })
      });
      alert('Usuário cadastrado com sucesso!');
    }
    window.location.href = 'listaUsuarios.html';
  });
}

async function carregarFornecedores() {
  const filtro = document.getElementById('filtroFornecedor').value.toLowerCase();
  const response = await fetch('http://localhost:3000/fornecedores');
  const fornecedores = await response.json();
  const lista = document.getElementById('listaFornecedores');

  lista.innerHTML = '';

  fornecedores
  .filter(f => f.nome.toLowerCase().includes(filtro))
  .forEach(forn => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${forn.nome}</td>
      <td>${forn.telefone}</td>
      <td>${forn.email}</td>
      <td class="actions">
        <button class="edit" onclick="editarFornecedor('${forn._id}')">Editar</button>
        <button class="delete" onclick="deletarFornecedor('${forn._id}')">Excluir</button>
      </td>
    `;
    lista.appendChild(tr);
  });
}

function editarFornecedor(id) {
  window.location.href = `cadastroFornecedor.html?id=${id}`;
}

async function deletarFornecedor(id) {
  if (confirm('Tem certeza que deseja excluir este fornecedor?')) {
    await fetch(`http://localhost:3000/fornecedores/${id}`, { method: 'DELETE' });
    alert('Fornecedor removido com sucesso!');
    carregarFornecedores();
  }
}

async function prepararFormularioFornecedor() {
  const urlParams = new URLSearchParams(window.location.search);
  const fornecedorId = urlParams.get('id');

  if (fornecedorId) {
    document.getElementById('tituloFornecedor').textContent = 'Editar Fornecedor';
    const response = await fetch(`http://localhost:3000/fornecedores/${fornecedorId}`);
    const fornecedor = await response.json();

    if (fornecedor) {
      document.getElementById('fornecedorId').value = fornecedor._id;
      document.getElementById('nomeFornecedor').value = fornecedor.nome;
      document.getElementById('telefoneFornecedor').value = fornecedor.telefone;
      document.getElementById('emailFornecedor').value = fornecedor.email;
    }
  }

  document.getElementById('cadastroFornecedorForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('fornecedorId').value;
    const nome = document.getElementById('nomeFornecedor').value;
    const telefone = document.getElementById('telefoneFornecedor').value;
    const email = document.getElementById('emailFornecedor').value;

    if (id) {
        await fetch(`http://localhost:3000/fornecedores/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, telefone, email })
        });
        alert('Fornecedor atualizado com sucesso!');
    } else {
        await fetch('http://localhost:3000/fornecedores', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, telefone, email })
        });
        alert('Fornecedor cadastrado com sucesso!');
    }
    window.location.href = 'listaFornecedores.html';
  });
}

async function carregarProdutos() {
  const filtro = document.getElementById('filtroProduto').value.toLowerCase();
  const response = await fetch('http://localhost:3000/produtos');
  const produtos = await response.json();
  const lista = document.getElementById('listaProdutos');

  lista.innerHTML = '';

  produtos
  .filter(p => p.nome.toLowerCase().includes(filtro))
  .forEach(p => { 
      const fornecedorNome = p.fornecedor ? p.fornecedor.nome : '-';
      const tr = document.createElement('tr');
      tr.innerHTML = `
          <td>${p.codigo}</td>
          <td>${p.nome}</td>
          <td>${fornecedorNome}</td>
          <td>R$ ${p.preco.toFixed(2)}</td>
          <td>${p.quantidadeEstoque}</td>
          <td class="actions">
              <button class="edit" onclick="editarProduto('${p._id}')">Editar</button>
              <button class="delete" onclick="deletarProduto('${p._id}')">Excluir</button>
          </td>
      `;
      lista.appendChild(tr);
  });
}

function editarProduto(id) {
    window.location.href = `cadastroProduto.html?id=${id}`;
}

async function deletarProduto(id) {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
        await fetch(`http://localhost:3000/produtos/${id}`, { method: 'DELETE' });
        alert('Produto removido com sucesso!');
        carregarProdutos();
    }
}

async function prepararFormularioProduto() {
    const selForn = document.getElementById('fornecedorProduto');
    await carregarFornecedoresNoSelect(selForn);

    const urlParams = new URLSearchParams(window.location.search);
    const produtoId = urlParams.get('id');

    if (produtoId) { 
    document.getElementById('tituloProduto').textContent = 'Editar Produto';
    const response = await fetch(`http://localhost:3000/produtos/${produtoId}`);
    const produto = await response.json();

    if (produto) {
      document.getElementById('produtoId').value = produto._id;
      document.getElementById('codigoProduto').value = produto.codigo;
      document.getElementById('nomeProduto').value = produto.nome;
      document.getElementById('descricaoProduto').value = produto.descricao;
      document.getElementById('precoProduto').value = produto.preco;
      document.getElementById('estoqueProduto').value = produto.quantidadeEstoque;
      if (produto.fornecedor) {
        selForn.value = produto.fornecedor._id;
      }
    }
  }

  document.getElementById('cadastroProdutoForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('produtoId').value;
    const codigo = document.getElementById('codigoProduto').value;
    const nome = document.getElementById('nomeProduto').value;
    const descricao = document.getElementById('descricaoProduto').value;
    const preco = parseFloat(document.getElementById('precoProduto').value);
    const quantidadeEstoque = parseInt(document.getElementById('estoqueProduto').value);
    const fornecedor = selForn.value || null;

    if (id) {
      await fetch(`http://localhost:3000/produtos/${id}`, { 
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ codigo, nome, descricao, preco, quantidadeEstoque, fornecedor })
      });
      alert('Produto atualizado com sucesso!');
    } else {
      await fetch('http://localhost:3000/produtos', { 
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ codigo, nome, descricao, preco, quantidadeEstoque, fornecedor })
      });
      alert('Produto cadastrado com sucesso!');
    }
    window.location.href = 'listaProdutos.html';
  });
}

async function carregarClientes() {
  const filtro = document.getElementById('filtroCliente').value.toLowerCase();
  const response = await fetch('http://localhost:3000/clientes');
  const clientes = await response.json();
  const lista = document.getElementById('listaClientes');

  lista.innerHTML = '';

  clientes
  .filter(c =>
      c.nome.toLowerCase().includes(filtro) ||
      c.cpf.toLowerCase().includes(filtro)
  )
  .forEach(cli => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
          <td>${cli.cpf}</td>
          <td>${cli.nome}</td>
          <td>${cli.telefone || ''}</td>
          <td>${cli.endereco || ''}</td>
          <td class="actions">
              <button class="edit" onclick="editarCliente('${cli._id}')">Editar</button>
              <button class="delete" onclick="deletarCliente('${cli._id}')">Excluir</button>
          </td>
      `;
      lista.appendChild(tr);
  });
}

function editarCliente(id) {
    window.location.href = `cadastroCliente.html?id=${id}`;
}

async function deletarCliente(id) {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
        await fetch(`http://localhost:3000/clientes/${id}`, { method: 'DELETE' });
        alert('Cliente removido com sucesso!');
        carregarClientes();
    }
}

async function prepararFormularioCliente() {
  const urlParams = new URLSearchParams(window.location.search);
  const clienteId = urlParams.get('id');

  if (clienteId) {
    document.getElementById('tituloCliente').textContent = 'Editar Cliente';
    const response = await fetch(`http://localhost:3000/clientes/${clienteId}`);
    const cliente = await response.json();

    if (cliente) {
        document.getElementById('clienteId').value = cliente._id;
        document.getElementById('cpfCliente').value = cliente.cpf;
        document.getElementById('nomeCliente').value = cliente.nome;
        document.getElementById('telefoneCliente').value = cliente.telefone;
        document.getElementById('enderecoCliente').value = cliente.endereco;
    }
  }

  document.getElementById('cadastroClienteForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('clienteId').value;
    const cpf = document.getElementById('cpfCliente').value;
    const nome = document.getElementById('nomeCliente').value;
    const telefone = document.getElementById('telefoneCliente').value;
    const endereco = document.getElementById('enderecoCliente').value;

    if (id) {
      await fetch(`http://localhost:3000/clientes/${id}`, { 
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cpf, nome, telefone, endereco }) 
      });
      alert('Cliente atualizado com sucesso!');
    } else {
      await fetch('http://localhost:3000/clientes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cpf, nome, telefone, endereco }) 
      });
      alert('Cliente cadastrado com sucesso!');
    }
    window.location.href = 'listaClientes.html';
  });
}

async function carregarFornecedoresNoSelect(selectElement) {
  const resp = await fetch('http://localhost:3000/fornecedores');
  const fornecedores = await resp.json();

  fornecedores.forEach(f => {
    const opt = document.createElement('option');
    opt.value = f._id;
    opt.textContent = f.nome;
    selectElement.appendChild(opt);
  });
}

async function carregarProdutosNoSelect(selectElement) {
  const resp = await fetch('http://localhost:3000/produtos');
  const produtos = await resp.json();

  produtos.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p._id;
    opt.textContent = p.nome;
    selectElement.appendChild(opt);
  });
}

async function carregarRelatorio(dataInicial = '', dataFinal = '', fornecedor = '', produto = '', cpf = '') {
  try {
    const params = new URLSearchParams();

    if (dataInicial) params.append('dataInicial', dataInicial);
    if (dataFinal) params.append('dataFinal', dataFinal);
    if (fornecedor) params.append('fornecedorNome', fornecedor);
    if (produto) params.append('produtoNome', produto);
    if (cpf) params.append('cpfCliente', cpf);

    const url = `http://127.0.0.1:3000/relatorio/vendas?${params.toString()}`;
    console.log('Carregando relatório:', url);

    const resposta = await fetch(url);

    if (!resposta.ok) {
      throw new Error(`Erro ao buscar relatório. HTTP Status: ${resposta.status}`);
    }

    const vendas = await resposta.json();
    console.log('Vendas recebidas:', vendas);

    const tabela = document.querySelector('#tabela-relatorio tbody');
    tabela.innerHTML = '';

    let somaTotal = 0;

    vendas.forEach(venda => {
      const dataVenda = venda.data ? new Date(venda.data).toLocaleDateString('pt-BR') : '';
      const cpfCliente = venda.clienteCpf || '';
      const valorTotal = venda.total || 0;
      somaTotal += valorTotal;

      if (Array.isArray(venda.itens)) {
        venda.itens.forEach(item => {
          const fornecedorNome = item.nomeFornecedor || '';
          const produtoNome = item.nomeProduto || '';
          const qtd = item.quantidade || 0;
          const sub = item.subtotal || 0;

          const tr = document.createElement('tr');
          tr.innerHTML = `
          <td>${dataVenda}</td>                
          <td>${cpfCliente}</td>               
          <td>${fornecedorNome}</td>           
          <td>${produtoNome}</td>              
          <td>${qtd}</td>                      
          <td>R$ ${sub.toFixed(2)}</td>        
          <td>R$ ${valorTotal.toFixed(2)}</td> 
          `;
          tabela.appendChild(tr);
        });
      }
    });

    const elementoTotal = document.getElementById('valorTotal');
    elementoTotal.textContent = somaTotal.toFixed(2);

  } catch (erro) {
    console.error('Erro ao carregar relatório:', erro);
    alert('Erro ao carregar relatório:\n' + erro.message);
  }
}

document.getElementById('form-filtros').addEventListener('submit', (ev) => {
  ev.preventDefault();
  const di = document.getElementById('dataInicial').value;
  const df = document.getElementById('dataFinal').value;
  const forn = document.getElementById('fornecedor').value.trim();
  const prod = document.getElementById('produto').value.trim();
  const cpf = document.getElementById('cpf').value.trim();

  carregarRelatorio(di, df, forn, prod, cpf);
});

document.addEventListener('DOMContentLoaded', () => {
  const hoje = new Date();
  const seteDiasAtras = new Date();
  seteDiasAtras.setDate(hoje.getDate() - 7);

  const dataIniStr = seteDiasAtras.toISOString().split('T')[0];
  const dataFimStr = hoje.toISOString().split('T')[0];

  document.getElementById('dataInicial').value = dataIniStr;
  document.getElementById('dataFinal').value = dataFimStr;

  carregarRelatorio(dataIniStr, dataFimStr);
});