# 🛒 SuperMarket Manager

**SuperMarket Manager** é uma aplicação Full Stack de gerenciamento comercial desenvolvida para simular o ecossistema real de um supermercado. O projeto foi arquitetado para demonstrar o domínio sobre o fluxo completo de dados, desde a interação do usuário no Frontend até a persistência segura no Banco de Dados.

O foco principal deste desenvolvimento foi a implementação de uma **Arquitetura MVC (Model-View-Controller)** robusta, a criação de uma **RESTful API** escalável e a **modularização completa** do Frontend utilizando JavaScript Moderno (ES6+).

🔗 **[Clique aqui para acessar o projeto online](https://super-market-project-71yg.vercel.app/pages/login.html)**

---

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
