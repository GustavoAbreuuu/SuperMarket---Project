# 🛒 SuperMarket Manager

**SuperMarket Manager** é uma aplicação Full Stack de gerenciamento comercial desenvolvida para simular o ecossistema real de um supermercado. O projeto foi arquitetado para demonstrar o domínio sobre o fluxo completo de dados, desde a interação do usuário no Frontend até a persistência segura no Banco de Dados.

O foco principal deste desenvolvimento foi a implementação de uma **Arquitetura MVC (Model-View-Controller)** robusta, a criação de uma **RESTful API** escalável e a **modularização completa** do Frontend utilizando JavaScript Moderno (ES6+).

🔗 **[Clique aqui para acessar o projeto online](https://supermarket-project-83p1.onrender.com)**

## Imagem de Demonstração do Projeto
<img width="1918" height="854" alt="Captura de tela 2026-03-02 151114" src="https://github.com/user-attachments/assets/0f921910-35fd-48b5-9ad5-6ac434d5758a" />

## 🚀 Funcionalidades Principais & Arquitetura

### ⚙️ Backend & API (Server-Side)
* **Arquitetura MVC:** O código foi refatorado de uma estrutura monolítica para o padrão MVC, separando claramente as responsabilidades em:
    * **Models:** Schemas do Mongoose para tipagem e validação de dados (Produtos, Clientes, Vendas, Usuários).
    * **Controllers:** Lógica de negócios isolada, tratamento de erros e respostas HTTP padronizadas.
    * **Routes:** Roteamento organizado e modular para cada entidade da API.
* **RESTful API:** Construção de endpoints padronizados (GET, POST, PUT, DELETE) para comunicação eficiente entre cliente e servidor.
* **Integração com MongoDB Atlas:** Conexão segura com banco de dados em nuvem, utilizando variáveis de ambiente para proteção de credenciais.

### 💻 Frontend (Client-Side)
* **Modularização com ES6 Modules:** Substituição de scripts monolíticos por pequenos módulos focados (`vendas.js`, `clientes.js`, `api.js`), facilitando a manutenção e a leitura do código.
* **Consumo de API:** Camada de serviço (`api.js`) dedicada para realizar chamadas assíncronas (`async/await`) ao Backend, tratando requisições e respostas JSON.
* **Manipulação Dinâmica do DOM:** Interface reativa que atualiza tabelas, formulários e relatórios em tempo real sem a necessidade de recarregar a página (SPA-like feel).
* **Interface Padronizada:** Uso de caminhos absolutos e estrutura de pastas organizada (`public/pages`, `public/css`, `public/js`) para garantir consistência em ambientes de desenvolvimento e produção.

---

## 🛠 Tecnologias Utilizadas

### Backend
* **Node.js:** Ambiente de execução JavaScript para construção do servidor.
* **Express:** Framework para gerenciamento de rotas, middlewares e lógica do servidor.
* **MongoDB & Mongoose:** Banco de dados NoSQL e ODM para modelagem de dados flexível e performática.
* **Dotenv & Cors:** Gerenciamento de variáveis de ambiente e segurança de requisições cross-origin.

### Frontend
* **JavaScript (Vanilla ES6+):** Uso intenso de Modules, Arrow Functions, Fetch API e manipulação de eventos.
* **HTML5 & CSS3:** Estrutura semântica e estilização responsiva com foco em usabilidade.

### DevOps & Deploy
* **Vercel:** Hospedagem da aplicação e servidor Node.js.
* **MongoDB Atlas:** Hospedagem do banco de dados na nuvem (DBaaS).
* **Git & GitHub:** Controle de versão e histórico de refatoração.

---
## Funcionalidades
### 1. Interface de Autenticação - Interface limpa e minimalista para a entrada do usuário no sistema.
Fluxo: Gerenciamento seguro de acesso, validando as credenciais do operador e redirecionando para a tela principal (PDV) ou painel de controle.
<img width="1919" height="875" alt="Captura de tela 2026-03-02 024216" src="https://github.com/user-attachments/assets/66c959cf-e670-4222-9608-32b9cba76806" />

### 2. Sistema de Vendas (PDV) Ágil - Tela de frente de caixa focada em velocidade de operação e redução de cliques.
Visual: Layout em linha otimizado para inserção contínua (Código do Produto e CPF do Cliente), com um grid expansível que exibe o resumo da compra atual.
Lógica de Negócio: Adição de itens via busca automática pelo código, cálculo reativo de quantidade, subtotal por item e soma automática do Total (R$) da venda no canto inferior da tela.
<img width="1918" height="854" alt="Captura de tela 2026-03-02 151114" src="https://github.com/user-attachments/assets/7b2f3e4c-1ac7-4048-b7c4-a04c7b53a16c" />

### 3. Dashboard de Gestão (Menu de Configurações)
Central de roteamento do sistema administrativo.
UX/UI: Botões em bloco, intuitivos e com alto contraste, dividindo a aplicação em domínios claros ( Gerenciar Usuários, Gerenciar Produtos, Gerenciar Fornecedores, Gerenciar Clientes e Relatórios).
Lógica de Navegação: Isola o ambiente de vendas do ambiente administrativo, garantindo que o fluxo de trabalho não seja interrompido.
<img width="1917" height="853" alt="Captura de tela 2026-03-02 141642" src="https://github.com/user-attachments/assets/315749dd-469a-4ce1-a7e2-1adc0ee0848c" />

### 4. Gerenciamento de Usuários - Módulo dedicado ao controle de usuários cadastrado no sistema.
UX/UI: Tabela limpa e direta exibindo Nome, Email e Idade. As ações de manipulação de dados utilizam cores semânticas padrão do sistema (Amarelo para edição, Vermelho para exclusão e botões de inserção em Azul).
Lógica de Negócio: O campo de busca reage em tempo real (on input), permitindo localizar um cadastro instantaneamente tanto pelo Nome quanto pelo Email do operador.
<img width="1919" height="851" alt="Captura de tela 2026-03-02 152237" src="https://github.com/user-attachments/assets/0c62f4d2-e12c-4496-b626-77061956a8e1" />

### 5. Gerenciamento de Produtos - O núcleo do controle de estoque do supermercado, desenhado para visualização rápida de métricas financeiras e de inventário.
UX/UI: Apresenta dados vitais de prateleira: Código de barras, Nome, Preço (formatado em Reais R$) e a Quantidade exata em Estoque.
Lógica de Negócio: Realiza um cruzamento de dados (Relacionamento) com a base de fornecedores. Em vez de exibir um "ID" ilegível, o front-end trata a resposta da API e renderiza o Nome do Fornecedor vinculado àquele produto.
<img width="1919" height="879" alt="Captura de tela 2026-03-02 141820" src="https://github.com/user-attachments/assets/235805dd-39df-4d2b-a56c-536eb9987abd" />

### 6. Gerenciamento de Fornecedores - Cadastro de parceiros comerciais e distribuidores que abastecem o supermercado.
UX/UI: Interface simplificada exibindo apenas os dados essenciais de contato (Nome, Telefone e Email), facilitando a comunicação com os fornecedores no dia a dia.
Lógica de Negócio: Atua como uma entidade base do sistema. Os dados cadastrados aqui alimentam dinamicamente a criação de novos produtos, garantindo que nenhum item seja inserido no estoque sem uma origem de fornecimento válida.
<img width="1919" height="843" alt="Captura de tela 2026-03-02 152418" src="https://github.com/user-attachments/assets/7d4eac88-f05e-468e-87e2-d6d06a9b1a96" />

### 7. Gerenciamento de Clientes - Base de dados do público final, ideal para integração futura com programas de fidelidade ou emissão de notas fiscais.
UX/UI: Estrutura tabular contendo CPF, Nome, Telefone e Endereço. A tela mantém o layout fluido que se adapta perfeitamente em telas maiores.
Lógica de Negócio: Possui um algoritmo de filtragem avançado (.filter()) no front-end que avalia duas condições simultaneamente: o operador do caixa pode buscar o cliente digitando o Nome ou rapidamente bipando/digitando o CPF.
<img width="1917" height="851" alt="Captura de tela 2026-03-02 152451" src="https://github.com/user-attachments/assets/2f320d48-bc84-47bf-ba58-66b227810395" />

## 📂 Estrutura do Projeto

O projeto segue uma organização estrita de arquivos para separar o código público (Frontend) da lógica de servidor (Backend):

```text
supermarket-manager/
│
├── src/                  # Núcleo do Backend
│   ├── config/           # Conexão com Banco de Dados
│   ├── controllers/      # Lógica de Negócios
│   ├── models/           # Schemas do Banco (Mongoose)
│   └── routes/           # Rotas da API
│
├── public/               # Frontend (Arquivos Estáticos)
│   ├── css/              # Estilos globais
│   ├── js/
│   │   ├── modules/      # Lógica específica de cada página
│   │   └── services/     # Comunicação com a API
│   └── pages/            # Arquivos HTML
│
├── server.js             # Ponto de entrada da aplicação
└── package.json          # Dependências e scripts
```
## 👨‍💻 Como rodar o projeto localmente
```bash
git clone https://github.com/GustavoAbreuuu/SuperMarket---Project.git
```
2. Instale as dependências:
```bash
npm install
```
3. Configure as Variáveis de Ambiente:
```bash
MONGO_URI=sua_string_de_conexao_mongodb_atlas
```
4. Inicie o Servidor:
```bash
node server.js
```
5. Acesse: Abra http://localhost:3000 no seu navegador.
