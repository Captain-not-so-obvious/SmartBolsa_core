# 💰 SmartBolsa (Open Core)

> **SaaS de Gestão Financeira Pessoal com Arquitetura Freemium.**

## 📋 Sobre o Projeto

O **SmartBolsa** é uma plataforma financeira projetada para ajudar usuários a organizarem suas finanças domésticas. Este repositório contém o **Core (Núcleo)** do sistema, focado na gestão de fluxo de caixa (receitas e despesas), gestão de múltiplas carteiras e visualização de dados.

O projeto foi construído seguindo o modelo **Open Core**, onde as funcionalidades essenciais de gestão financeira são abertas, servindo como base para a versão **SmartBolsa Pro** (repositório privado), que inclui módulos avançados de Investimentos, Robôs de Cotação e Inteligência Artificial.

### 🎯 Funcionalidades Principais (Core)

* **Dashboard Interativo:** Visão geral de saldo, receitas vs. despesas e gráficos de pizza (Recharts).
* **Gestão de Transações:** CRUD completo de lançamentos financeiros com categorização.
* **Múltiplas Carteiras:** Controle de contas bancárias, dinheiro físico e outros fundos.
* **Autenticação Moderna:** Login seguro via **Supabase Auth** (Google e E-mail/Senha).
* **Modelo Freemium:**
* **Free:** Visualização de anúncios (Google AdSense) integrados ao layout.
* **Premium:** Experiência sem anúncios e desbloqueio visual de features futuras.


* **Arquitetura Modular:** Backend Django separado em apps (`core`, `financas`) para fácil escalabilidade.

---

## 🚀 Tecnologias Utilizadas

O projeto utiliza uma stack moderna, focada em performance e DX (Developer Experience):

### Backend (API)

* **Python 3.12+**
* **Django 5 + Django Ninja:** Para criação de APIs rápidas e tipadas (padrão OpenAPI).
* **PostgreSQL (via Supabase):** Banco de dados relacional robusto.
* **Supabase Auth:** Gerenciamento de usuários e JWT.
* **Gunicorn:** Servidor de aplicação WSGI.

### Frontend (SPA)

* **React.js + Vite:** Build ultra-rápido.
* **TailwindCSS + ShadCN/ui:** Design system moderno, responsivo e acessível (Dark Mode nativo).
* **Axios:** Cliente HTTP com interceptors para injeção automática de Token.
* **Recharts:** Biblioteca de gráficos para visualização de dados.
* **Lucide React:** Ícones leves e consistentes.

---

## 📸 Screenshots

*Em breve

---

## 🔧 Como Rodar Localmente

Siga os passos abaixo para ter o ambiente de desenvolvimento rodando na sua máquina.

### Pré-requisitos

* Python 3.10+ e Node.js 18+ instalados.
* Conta no [Supabase](https://supabase.com/) (para Banco de Dados e Auth).

### 1. Configuração do Backend

```bash
# Clone o repositório
git clone https://github.com/SEU_USUARIO/smartbolsa-core.git
cd smartbolsa-core/backend

# Crie e ative o ambiente virtual
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Instale as dependências
pip install -r requirements.txt

# Configure as variáveis de ambiente
# Crie um arquivo .env na pasta backend/ e adicione:
# DATABASE_URL=sua_url_do_transaction_pooler_supabase
# SUPABASE_JWT_SECRET=seu_segredo_jwt_do_supabase

# Execute as migrações
python manage.py migrate

# Inicie o servidor
python manage.py runserver

```

*O Backend estará rodando em `http://localhost:8000/api/docs` (Documentação Swagger Automática).*

### 2. Configuração do Frontend

```bash
# Em outro terminal, navegue até a pasta frontend
cd ../frontend

# Instale as dependências
npm install

# Configure as variáveis de ambiente
# Crie um arquivo .env na pasta frontend/ e adicione:
# VITE_SUPABASE_URL=sua_url_do_projeto_supabase
# VITE_SUPABASE_ANON_KEY=sua_chave_publica_anonima
# VITE_API_URL=http://127.0.0.1:8000/api

# Inicie o servidor de desenvolvimento
npm run dev

```

*O Frontend estará rodando em `http://localhost:5173`.*

---

## 🏗️ Arquitetura do Banco de Dados

O projeto utiliza **PostgreSQL**. Principais tabelas do Core:

* **auth.users (Supabase):** Gerencia credenciais e sessões.
* **core_userprofile:** Extensão do usuário para definir plano (FREE/PREMIUM).
* **financas_carteira:** Contas (Nubank, Cofre, etc.).
* **financas_categoria:** Classificação (Alimentação, Salário, etc.).
* **financas_transacao:** O registro financeiro (valor, data, tipo).

---

## 🔮 Próximos Passos (Roadmap)

Este repositório foca na gestão financeira. O ecossistema SmartBolsa está evoluindo para incluir:

* [ ] **SmartBolsa Pro (Privado):**
* Módulo de Investimentos (Ações, FIIs, Stocks).
* Integração com Redis e Celery para tasks assíncronas.
* Atualização automática de cotações via yfinance.
* Cálculo automático de Preço Médio e Rentabilidade.


* [ ] **Mobile:** Versão PWA ou React Native consumindo a mesma API.

---

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir Issues ou enviar Pull Requests para melhorias no Core.

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](https://www.google.com/search?q=LICENSE) para mais detalhes.

---

**Desenvolvido por [Seu Nome]** 🚀