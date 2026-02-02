# SmartBolsa: Seu Gestor Financeiro e de Investimentos Completo

## Visão Geral do Projeto

O **SmartBolsa** é uma plataforma inovadora de Gestão Financeira Pessoal e de Investimentos, projetada para auxiliar usuários a controlar suas finanças domésticas e otimizar seus investimentos em um único lugar. Com a missão de capacitar indivíduos a entender e gerenciar seu patrimônio, o SmartBolsa oferece funcionalidades detalhadas de acompanhamento de despesas, receitas, e uma poderosa análise de carteira de investimentos com integração de dados do mercado financeiro. O sistema será disponibilizado como um **SAAS (Software as a Service)**, com aplicativos dedicados para iOS e Android.

## Modelo de Negócio (Monetização SAAS)

O SmartBolsa opera com um modelo de monetização híbrido:

* **Usuários Free:** Terão acesso às funcionalidades básicas com a exibição de **anúncios**. Haverá um limite de operações (transações financeiras e de investimento) para usuários gratuitos.
    * **Regra de Anúncios:** Um anúncio será exibido a cada transação cadastrada no módulo de investimentos. No módulo de despesas e receitas, um anúncio será exibido a cada três transações cadastradas.
* **Usuários Premium:** Através de uma **assinatura mensal**, usuários Premium desfrutarão de uma experiência sem anúncios, limites de operações ilimitados e acesso a relatórios e análises exclusivas.

## Funcionalidades Principais

### Gestão Financeira Doméstica

1.  **Categorias de Despesas e Receitas:**
    * Sistema robusto de categorias padrão para ganhos e despesas.
    * **Personalização:** Usuários poderão adicionar novas categorias, editar ou excluir as predefinidas para adequar ao seu estilo de vida financeiro.
2.  **Sistema de Transações:**
    * **CRUD Completo:** Adicionar, editar e remover despesas e receitas de forma intuitiva.
    * **Cálculo de Saldo:** O sistema calculará e exibirá o saldo total do usuário com base nas transações registradas.

### Gestão de Investimentos

1.  **CRUD de Investimentos:**
    * Permitir ao usuário adicionar, remover e editar ações/ativos de sua carteira.
    * **Atualização Automática de Custo Médio e Dividend Yield:** Ao adicionar uma ação já existente na carteira, o sistema recalculará automaticamente o custo médio do ativo e o Dividend Yield total da carteira.
2.  **Integração com Yahoo Finance:**
    * **Preços Atuais:** Obtenção de cotações em tempo real.
    * **Variação Diária:** Acompanhamento da performance diária dos ativos.
3.  **Relatórios de Rentabilidade:**
    * **Relatório Padrão:** Ao acessar o módulo de investimentos, será exibida a rentabilidade da carteira para os últimos **12 meses**.
    * **Relatórios Personalizados (Premium):** Usuários Premium poderão gerar relatórios de rentabilidade baseados em períodos estipulados por eles.
    * **Comparativos de Performance:** O sistema comparará a performance da carteira do usuário contra índices de mercado como **IPCA, IGPM, Ibovespa e S&P 500**.
4.  **Questionário de Investimento:**
    * No primeiro acesso ao módulo de investimentos, um questionário será apresentado.
    * Se o usuário confirmar que investe, poderá inserir o **custo médio** e a **quantidade de ações** que possui para inicializar o cálculo de rentabilidade da carteira.

### Relatórios e Análises (Recursos Premium)

1.  **Balanço Mensal:**
    * Relatório detalhado, frequentemente acompanhado de **gráficos**, mostrando as principais despesas e receitas, e sua representatividade percentual no orçamento total.
2.  **Gráfico de Despesas por Categoria:**
    * Visualização clara das despesas por categoria, com opção de **ordenação por valor**.
    * **Comparativo Mensal:** Análise de despesas e receitas mês a mês.
3.  **Análise de Tendências (Futuro com ML):**
    * Aspiramos a um sistema de Machine Learning que aprenderá os padrões de gastos do usuário.
    * **Previsão de Gastos:** O aplicativo poderá ajudar a identificar onde o usuário está excedendo nos gastos e onde está performando bem.
    * **Evolução do Balanço:** Relatório sobre a evolução do patrimônio e a gestão de despesas.
    * **Comparativo Anual:** Comparação do desempenho financeiro ano a ano (para usuários com mais de dois anos de dados).

## Tecnologias Utilizadas

### Backend
* **Linguagem/Framework:** Node.js com Express.js
* **Banco de Dados:** PostgreSQL (principal)
* **Cache:** Redis
* **Autenticação:** JWT (implementação customizada com `jsonwebtoken` e `bcrypt.js`)
* **Integração API Financeira:** Yahoo Finance

### Frontend
* **Mobile (iOS & Android):** React Native
* **Web (SAAS Platform):** React.js

### Infraestrutura & Deploy
* **Provedor de Nuvem:** Amazon Web Services (AWS)
* **Contêineres:** Docker
* **CI/CD:** GitHub Actions

## Como Rodar o Projeto (Desenvolvimento)

### Pré-requisitos
* Node.js (versão LTS recomendada)
* npm ou Yarn
* PostgreSQL instalado e rodando
* pgAdmin (recomendado para gerenciamento do BD)
* Expo Go app no seu dispositivo móvel (para testes do frontend)

### Configuração do Backend

1.  Navegue até a pasta `backend`:
    ```bash
    cd SmartBolsa/backend
    ```
2.  Inicialize o projeto Node.js e instale as dependências:
    ```bash
    npm init -y
    npm install express pg dotenv jsonwebtoken bcryptjs # (Futuramente outras libs)
    ```
3.  Crie um arquivo `.env` na raiz da pasta `backend` com suas credenciais do PostgreSQL:
    ```dotenv
    DB_USER=postgres
    DB_HOST=localhost
    DB_DATABASE=smartbolsa_db
    DB_PASSWORD=sua_senha_do_postgres
    DB_PORT=5432
    ```
    **ATENÇÃO:** Substitua `sua_senha_do_postgres` pela sua senha real. Este arquivo não deve ser versionado no Git!
4.  Crie a pasta `config` e o arquivo `db.js` (conforme instruções anteriores para conexão com PostgreSQL).
5.  Para iniciar o servidor:
    ```bash
    node server.js
    ```
    O servidor estará acessível em `http://localhost:3000`.

### Configuração do Frontend

1.  Navegue até a pasta `frontend`:
    ```bash
    cd SmartBolsa/frontend
    ```
2.  Crie o projeto React Native (se ainda não o fez):
    ```bash
    npx create-expo-app . --template
    # Escolha 'Default - includes tools recommended for most app developers'
    ```
3.  Para iniciar o aplicativo:
    ```bash
    npx expo start
    ```
    Escaneie o QR Code com o aplicativo Expo Go no seu celular ou use um emulador.

## Contribuição

Interessado em contribuir para o SmartBolsa? Entre em contato!

## Licença

[A ser definida]

---