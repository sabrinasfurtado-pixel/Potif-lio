# Portfólio Profissional Interativo – Sabrina Furtado

Aplicação web full-stack de alto desempenho para apresentação da trajetória técnica, competências e projetos de **Sabrina Furtado** (Desenvolvedora de Soluções Tecnológicas), com portfólio público elegante e painel administrativo privado para gestão dinâmica de conteúdo sem alteração de código-fonte.

---

## 1. Visão Geral e Arquitetura

O sistema é construído sobre uma arquitetura cliente-servidor desacoplada e modular:

- **Frontend:** React 19 SPA com TypeScript, estilizado com Tailwind CSS v4, Lucide Icons e Framer Motion. Segue a identidade visual moderna em tema dark graphite/navy com acentos em ciano e azul, respeitando tipografia hierárquica e acessibilidade WCAG AA.
- **Backend:** Node.js com Express e TypeScript (`tsx`), fornecendo API RESTful versionada com middlewares de segurança, autenticação JWT, proteção contra brute-force e validação server-side.
- **Banco de Dados:** SQLite com `better-sqlite3`, operando em modo WAL (Write-Ahead Logging) e chaves estrangeiras ativas, persistido em arquivo local (`data/portfolio.db`).
- **Armazenamento de Mídia:** Diretório persistente (`uploads/`) servido estaticamente pelo backend Express com verificação rigorosa de tipos MIME (JPG, PNG, WebP, SVG) e limites de tamanho.

```
┌────────────────────────────────────────────────────────┐
│                   Navegador Web                        │
│   ┌──────────────────────┐    ┌────────────────────┐   │
│   │   Portfólio Público  │    │   Painel Admin     │   │
│   │ (Visitantes / Links) │    │  (Autenticado JWT) │   │
│   └──────────┬───────────┘    └─────────┬──────────┘   │
└──────────────┼──────────────────────────┼──────────────┘
               │                          │
               ▼                          ▼
┌────────────────────────────────────────────────────────┐
│               Servidor Express (Porta 3000)            │
│  ┌───────────────────────┐  ┌───────────────────────┐  │
│  │   /api/public/*       │  │   /api/admin/*        │  │
│  │   - GET /portfolio    │  │   - POST /login       │  │
│  │   - POST /contact     │  │   - CRUD /projects    │  │
│  └───────────────────────┘  │   - CRUD /skills      │  │
│                             │   - CRUD /experiences │  │
│                             │   - PUT /profile      │  │
│                             │   - POST /upload      │  │
│                             └───────────────────────┘  │
└──────────────────────────┬─────────────────────────────┘
                           ▼
┌────────────────────────────────────────────────────────┐
│             Persistência de Dados e Mídia              │
│   - SQLite WAL (data/portfolio.db)                     │
│   - Mídia Persistente (uploads/*)                      │
└────────────────────────────────────────────────────────┘
```

---

## 2. Tecnologias Escolhidas

| Camada | Tecnologia | Motivo da Escolha |
|---|---|---|
| Frontend | React 19 + TypeScript | Reatividade eficiente, componentização e tipagem estrita |
| Estilização | Tailwind CSS v4 | Estilização utility-first, sem dependências de estilos inline |
| Servidor | Express 4.x + Node.js | Robustez, suporte a middlewares e rotas seguras |
| Banco de Dados | SQLite (`better-sqlite3`) | Persistência relacional sem custo de infraestrutura externa e alta performance |
| Autenticação | JWT + bcryptjs | Tokens assinados e hashing de senhas seguro |
| Uploads | Multer | Processamento e armazenamento controlado de imagens |
| Testes | TypeScript + Script Automatizado | Validação de todas as 17 regras de negócio |

---

## 3. Pré-Requisitos

- Node.js 20.x ou superior
- Gerenciador de pacotes `npm` (v10 ou superior)

---

## 4. Como Executar Localmente

1. Clone o repositório ou acesse o diretório do projeto:
```bash
git clone <url-do-repositorio>
cd portfolio-sabrina-furtado
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor em modo de desenvolvimento:
```bash
npm run dev
```

4. Acesse a aplicação no navegador em `http://localhost:3000`.

---

## 5. Configuração de Variáveis de Ambiente

Crie ou edite o arquivo `.env` na raiz do projeto com base no modelo `.env.example`:

```env
# Porta do servidor HTTP
PORT=3000

# Chave secreta para assinatura dos tokens JWT administrativos
JWT_SECRET="sabrina_portfolio_jwt_secure_secret_2026_key"

# E-mail da administradora inicial
ADMIN_EMAIL="sabrina.s.furtado@gmail.com"

# Senha inicial provisionada (deve ser alterada após o primeiro login)
ADMIN_INITIAL_PASSWORD="SuaSenhaSegura2026!"

# URL base da aplicação
APP_URL="http://localhost:3000"
```

---

## 6. Banco de Dados e Migrações

- O banco de dados SQLite é inicializado automaticamente na primeira execução através da função `initDatabase()` em `server/db.ts`.
- O arquivo físico é criado em `data/portfolio.db`.
- Todas as tabelas (`administrators`, `portfolio_profile`, `skill_categories`, `skills`, `experiences`, `projects`, `contact_messages`) são criadas automaticamente se não existirem.
- Os dados iniciais (perfil da Sabrina, habilidades, experiências na OPAH IT e Vivo, e o projeto inicial Happy Finance) são semeados automaticamente de forma idempotente.

---

## 7. Provisionamento da Conta Administradora

1. Na inicialização inicial, se nenhuma conta existir na tabela `administrators`, o sistema cria a conta com:
   - **E-mail:** `sabrina.s.furtado@gmail.com` (ou configurado em `ADMIN_EMAIL`)
   - **Senha:** configurada em `ADMIN_INITIAL_PASSWORD` (padrão inicial documentado)
2. Para acessar o painel:
   - Acesse o link discreto "Admin" no cabeçalho ou rodapé, ou acesse diretamente `/admin`.
   - Insira o e-mail e senha.
   - Dentro do painel, utilize a aba **Segurança** para alterar sua senha quando desejar.

---

## 8. Armazenamento de Imagens e Uploads

- Imagens enviadas pelo painel (capas de projetos e foto de avatar) são gravadas no diretório `uploads/` com nomes sanitizados e sufixos únicos baseados em timestamp.
- Tipos de arquivo aceitos: `image/jpeg`, `image/png`, `image/webp`, `image/svg+xml`.
- Tamanho máximo por arquivo: `5 MB`.
- O servidor Express disponibiliza o acesso público a esses arquivos na rota `/uploads/<nome-do-arquivo>`.

---

## 9. Execução dos Testes Automatizados

O projeto possui uma suíte completa de testes de integração (`tests/verify-all.ts`) cobrindo 17 critérios essenciais de aceitação:

```bash
npm test
```

Itens verificados:
1. Acesso do visitante ao portfólio público.
2. Exibição correta dos projetos publicados.
3. Abertura da URL configurada do Happy Finance.
4. Bloqueio de visitantes anônimos para criação de projetos.
5. Bloqueio de visitantes anônimos para edição e exclusão.
6. Funcionamento do login administrativo com emissão de JWT.
7. Rejeição de requisições não autenticadas no painel.
8. Bloqueio de tokens forjados ou expirados.
9. Criação de novos projetos pela administradora.
10. Edição de projetos existentes.
11. Publicação e despublicação (rascunho) de projetos.
12. Exclusão de projetos com confirmação.
13. Persistência de uploads de imagens.
14. Persistência dos registros no banco de dados SQLite em disco.
15. Responsividade em telas móveis e desktop.
16. Validação estrita de formulários e e-mails.
17. Ocultamento absoluto de projetos em rascunho na API pública.

---

## 10. Processo de Build e Deploy em Produção

Para compilar a aplicação e prepará-la para produção:

1. Gere os arquivos estáticos otimizados do frontend:
```bash
npm run build
```

2. Inicie o servidor em modo de produção:
```bash
NODE_ENV=production npm start
```

### Configuração de Domínio Próprio

Para vincular seu domínio próprio (ex: `sabrinafurtado.com.br` ou `sabrinafurtado.dev`):
1. No seu registrador de domínio (ex: Registro.br, Cloudflare, GoDaddy):
   - Crie um registro do tipo `A` apontando para o IP do seu servidor, ou
   - Crie um registro `CNAME` apontando para o host de deploy (ex: Cloud Run, Render, Railway, VPS).
2. Configure o certificado SSL/TLS (HTTPS) gratuito via Let's Encrypt ou Cloudflare.
3. Atualize a variável `APP_URL="https://seu-dominio.com.br"` no arquivo `.env`.

---

## 11. Backup dos Dados

Como todos os dados estruturados e arquivos de mídia estão centralizados no diretório local, o procedimento de backup é direto:

```bash
# Criar arquivo compactado com banco de dados e uploads
tar -czvf backup-portfolio-$(date +%Y%m%d).tar.gz data/ uploads/
```

Para restaurar um backup:
```bash
tar -xzvf backup-portfolio-YYYYMMDD.tar.gz
```
