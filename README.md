# Portfólio Profissional Interativo | Sabrina Furtado

Aplicação web full-stack para apresentação da trajetória profissional, competências técnicas e projetos de Sabrina Furtado, com portfólio público e painel administrativo para gerenciamento de conteúdo.

O projeto combina uma interface moderna e responsiva com uma API REST, autenticação administrativa e persistência de dados, permitindo atualizar informações profissionais sem precisar alterar diretamente o código-fonte a cada mudança.

---

## 1. Visão Geral e Arquitetura

O sistema utiliza uma arquitetura cliente-servidor modular, separando a interface do usuário, as regras de negócio e a persistência de dados.

### Frontend
- React 19 com TypeScript.
- Tailwind CSS v4 para estilização.
- Lucide Icons para ícones.
- Framer Motion para animações.
- Interface responsiva com tema dark graphite/navy e detalhes em ciano e azul.
- Organização baseada em componentes reutilizáveis.

### Backend
- Node.js com Express e TypeScript.
- API REST para comunicação entre frontend e backend.
- Autenticação administrativa baseada em JWT.
- Validação de dados no servidor.
- Medidas de proteção para os endpoints administrativos, conforme a implementação do projeto.

### Banco de Dados
- SQLite com `better-sqlite3`.
- Persistência local em `data/portfolio.db`.
- Utilização do modo WAL (Write-Ahead Logging) e de chaves estrangeiras, conforme a configuração do banco.

### Armazenamento de Mídia
- Diretório `uploads/` para arquivos enviados pelo painel administrativo.
- Validação de arquivos e limites de tamanho configurados no backend.
- Disponibilização das imagens por meio do servidor Express.

### Diagrama da Arquitetura

```text
┌──────────────────────────────────────────────┐
│                Navegador Web                 │
│                                              │
│   ┌────────────────┐  ┌──────────────────┐   │
│   │ Portfólio      │  │ Painel           │   │
│   │ Público        │  │ Administrativo   │   │
│   └────────┬───────┘  └────────┬─────────┘   │
└────────────┼───────────────────┼─────────────┘
             │                   │
             ▼                   ▼
┌──────────────────────────────────────────────┐
│               Servidor Express               │
│                                              │
│  ┌─────────────────┐  ┌──────────────────┐   │
│  │ API Pública     │  │ API Administrativa│  │
│  │                 │  │                  │   │
│  │ Portfólio       │  │ Login             │  │
│  │ Contato         │  │ Projetos          │  │
│  │ Conteúdo público│  │ Habilidades       │  │
│  │                 │  │ Experiências      │  │
│  │                 │  │ Perfil e uploads  │  │
│  └─────────────────┘  └──────────────────┘   │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│             Persistência de Dados            │
│                                              │
│  Banco SQLite: data/portfolio.db             │
│  Arquivos de mídia: uploads/                 │
└──────────────────────────────────────────────┘
```

---

## 2. Tecnologias Utilizadas

| Camada | Tecnologia | Finalidade |
|---|---|---|
| Frontend | React 19 | Construção da interface |
| Linguagem | TypeScript | Tipagem estática e manutenção do código |
| Estilização | Tailwind CSS v4 | Desenvolvimento da interface visual |
| Ícones | Lucide Icons | Elementos visuais da interface |
| Animações | Framer Motion | Transições e animações |
| Backend | Node.js | Execução do servidor |
| Framework HTTP | Express | Criação da API REST |
| Banco de Dados | SQLite | Persistência relacional |
| Biblioteca SQLite | better-sqlite3 | Acesso ao banco de dados |
| Autenticação | JWT | Autenticação baseada em tokens |
| Hash de senhas | bcryptjs | Armazenamento de senhas por hash |
| Uploads | Multer | Processamento de arquivos enviados |
| Testes | TypeScript | Verificação automatizada de funcionalidades |

---

## 3. Pré-requisitos

Antes de executar o projeto, instale:

- Node.js 20.x ou superior.
- npm 10.x ou superior.
- Git, caso deseje clonar o repositório.

As versões indicadas representam os requisitos documentados para o projeto. Consulte o `package.json` para verificar as versões efetivamente utilizadas.

---

## 4. Como Executar Localmente

### 4.1. Clonar o repositório

```bash
git clone <URL_DO_REPOSITORIO>
cd portfolio-sabrina-furtado
```

Substitua `<URL_DO_REPOSITORIO>` pelo endereço real do repositório.

### 4.2. Instalar as dependências

```bash
npm install
```

### 4.3. Configurar as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto utilizando o `.env.example` como referência.

Configure os valores necessários para o ambiente local, conforme as instruções da seção seguinte.

### 4.4. Iniciar a aplicação

```bash
npm run dev
```

Se o script de desenvolvimento estiver configurado para iniciar o servidor na porta 3000, acesse:

`http://localhost:3000`

**Observação:** os comandos dependem dos scripts definidos no `package.json` e da configuração efetiva do projeto.

---

## 5. Configuração das Variáveis de Ambiente

O projeto utiliza variáveis de ambiente para separar configurações da aplicação e credenciais sensíveis do código-fonte.

### 5.1. Arquivo de exemplo

Mantenha um arquivo `.env.example` no repositório para documentar as variáveis necessárias, utilizando apenas valores fictícios:

```env
# Porta do servidor HTTP
PORT=3000

# Chave secreta para assinatura dos tokens JWT
JWT_SECRET=SUBSTITUA_POR_UMA_CHAVE_ALEATORIA_SEGURA

# E-mail da conta administradora inicial
ADMIN_EMAIL=admin@example.com

# Senha inicial da conta administradora
ADMIN_INITIAL_PASSWORD=DEFINA_UMA_SENHA_FORTE

# URL base da aplicação
APP_URL=http://localhost:3000
```

Os valores acima são exemplos e não devem ser utilizados como credenciais reais.

### 5.2. Arquivo `.env`

Crie o arquivo `.env` localmente e configure os valores apropriados para seu ambiente.

**Nunca publique no GitHub o arquivo `.env` com credenciais reais.**

O arquivo `.env` deve estar incluído no `.gitignore`:

```gitignore
# Variáveis de ambiente e segredos
.env
.env.*
!.env.example

# Dependências
node_modules/

# Arquivos de build
dist/

# Banco de dados e arquivos auxiliares
data/*.db
data/*.db-shm
data/*.db-wal

# Arquivos enviados pela aplicação
uploads/*
!uploads/.gitkeep

# Logs
*.log
npm-debug.log*
```

Adapte as regras ao funcionamento real do projeto. Se o banco de dados ou os arquivos de mídia precisarem ser versionados por algum motivo específico, revise essas exclusões antes de aplicá-las.

**Importante:** adicionar um arquivo ao `.gitignore` não remove arquivos que já estejam versionados. Se credenciais ou dados privados já foram publicados, é necessário tratar a exposição separadamente.

### 5.3. Boas práticas de segurança

- Utilize uma chave JWT forte, aleatória e exclusiva para cada ambiente.
- Não reutilize credenciais de desenvolvimento em produção.
- Não compartilhe senhas administrativas em documentação pública.
- Não inclua tokens, senhas ou chaves privadas no código-fonte.
- Armazene os segredos de produção em variáveis de ambiente protegidas ou em um gerenciador de segredos.
- Gere uma nova chave JWT caso a anterior tenha sido exposta.
- Utilize HTTPS em ambientes públicos de produção.
- Nunca envie arquivos `.env` para o repositório.

---

## 6. Banco de Dados e Inicialização

O projeto utiliza SQLite para armazenar os dados estruturados da aplicação.

O banco de dados local é documentado no seguinte caminho:

```text
data/portfolio.db
```

Conforme a implementação do backend, a inicialização pode criar automaticamente as tabelas necessárias.

Entre as entidades previstas estão:

- `administrators`: contas administrativas.
- `portfolio_profile`: informações do perfil profissional.
- `skill_categories`: categorias de habilidades.
- `skills`: competências técnicas.
- `experiences`: experiências profissionais.
- `projects`: projetos apresentados no portfólio.
- `contact_messages`: mensagens de contato.

Os dados iniciais podem ser inseridos automaticamente pelo processo de inicialização, conforme as regras implementadas no projeto.

**Atenção:** a criação das tabelas, os dados iniciais e a estratégia de migração devem corresponder ao código efetivamente disponível no repositório.

---

## 7. Acesso ao Painel Administrativo

O painel administrativo permite gerenciar as informações exibidas no portfólio sem a necessidade de editar manualmente os arquivos do frontend.

O acesso deve ser realizado por uma conta administrativa provisionada de acordo com a configuração do backend.

### Funcionalidades previstas

- Autenticação administrativa.
- Gerenciamento de projetos.
- Gerenciamento de habilidades.
- Atualização das experiências profissionais.
- Atualização das informações do perfil.
- Envio de imagens.
- Publicação e despublicação de projetos.

### Primeiro acesso

1. Configure as variáveis de ambiente necessárias.
2. Inicie o servidor.
3. Acesse a rota administrativa configurada pela aplicação, por exemplo, `/admin`.
4. Utilize as credenciais provisionadas de maneira segura.
5. Caso exista uma funcionalidade de alteração de senha, defina uma nova senha após o primeiro acesso.

O comportamento de criação da conta inicial e a existência de uma tela para alteração de senha dependem da implementação do backend.

**Segurança:** não mantenha senhas administrativas padrão em produção. O provisionamento inicial deve utilizar credenciais seguras, e o acesso administrativo deve ser restrito por autenticação e autorização no servidor.

---

## 8. Armazenamento de Imagens e Uploads

O sistema utiliza o diretório `uploads/` para armazenar arquivos enviados pelo painel administrativo.

A configuração documentada prevê suporte aos seguintes formatos:

- JPEG/JPG.
- PNG.
- WebP.
- SVG, caso seja permitido pela implementação e pelos controles de segurança.

O limite de tamanho documentado para cada arquivo é de 5 MB.

Os arquivos podem ser disponibilizados pelo backend em uma rota semelhante a:

```text
/uploads/<nome-do-arquivo>
```

### Cuidados de segurança

- Validar o tipo real do arquivo no servidor, e não apenas sua extensão.
- Definir limites de tamanho para os uploads.
- Gerar nomes de arquivos controlados pelo servidor.
- Impedir a gravação de arquivos fora do diretório autorizado.
- Avaliar os riscos específicos de arquivos SVG antes de permitir sua publicação.
- Garantir que apenas usuários autorizados possam enviar ou modificar arquivos.
- Manter backups dos arquivos necessários para a aplicação.

A configuração definitiva deve refletir os validadores e as permissões implementados no backend.

---

## 9. Testes Automatizados

O projeto prevê testes automatizados para validar as funcionalidades essenciais da aplicação.

Caso o script de testes esteja configurado no `package.json`, execute:

```bash
npm test
```

A suíte de testes descrita para o projeto contempla os seguintes cenários:

1. Acesso ao portfólio público.
2. Exibição dos projetos publicados.
3. Funcionamento dos links dos projetos.
4. Bloqueio de usuários não autenticados nas operações administrativas.
5. Proteção das operações de criação, edição e exclusão.
6. Autenticação administrativa e emissão de tokens JWT.
7. Rejeição de requisições sem autenticação válida.
8. Rejeição de tokens inválidos ou expirados.
9. Criação de projetos.
10. Edição de projetos.
11. Publicação e despublicação de projetos.
12. Exclusão de projetos.
13. Persistência de uploads.
14. Persistência dos dados no SQLite.
15. Comportamento responsivo da interface.
16. Validação de formulários e endereços de e-mail.
17. Restrição da exibição pública de projetos não publicados.

A existência e a cobertura de cada teste devem ser confirmadas nos arquivos de teste do repositório. A lista descreve os cenários previstos, não uma garantia de que todos já estejam implementados ou aprovados.

---

## 10. Build e Deploy em Produção

Antes de publicar a aplicação, configure as variáveis de ambiente de produção e revise as permissões de acesso, o armazenamento de dados e os mecanismos de segurança.

### 10.1. Gerar o build

```bash
npm run build
```

### 10.2. Iniciar em produção

```bash
npm start
```

O comando deve ser executado no ambiente configurado para produção. Caso a aplicação dependa da variável `NODE_ENV`, defina-a conforme a plataforma utilizada.

Em sistemas compatíveis com Linux e macOS, por exemplo:

```bash
NODE_ENV=production npm start
```

No Windows, a definição da variável pode exigir outra sintaxe ou uma ferramenta como `cross-env`, caso esteja instalada e configurada no projeto.

### 10.3. Configurar um domínio próprio

Para utilizar um domínio personalizado:

1. Configure o domínio no provedor de hospedagem.
2. Ajuste os registros DNS conforme as instruções da plataforma.
3. Configure um certificado TLS válido.
4. Atualize a variável `APP_URL` para o endereço público da aplicação.
5. Configure as variáveis secretas diretamente no ambiente de hospedagem.
6. Verifique se o banco de dados e os arquivos enviados permanecem disponíveis após reinicializações e novos deploys.

**Importante:** ambientes de hospedagem efêmeros podem perder arquivos locais durante novos deploys. Antes de publicar, confirme se a plataforma oferece armazenamento persistente ou configure um serviço de armazenamento apropriado.

---

## 11. Backup e Recuperação de Dados

O banco de dados e os arquivos de mídia podem exigir backups independentes, dependendo da infraestrutura utilizada.

Em um ambiente Linux com os diretórios locais disponíveis, um exemplo de compactação é:

```bash
tar -czvf backup-portfolio-$(date +%Y%m%d).tar.gz data/ uploads/
```

Para restaurar um backup:

```bash
tar -xzvf backup-portfolio-YYYYMMDD.tar.gz
```

Substitua `YYYYMMDD` pela data correspondente ao arquivo de backup.

### Recomendações

- Realize backups periódicos.
- Armazene cópias em local separado do servidor principal.
- Proteja os backups contra acesso não autorizado.
- Teste periodicamente a restauração dos dados.
- Considere as particularidades do SQLite em modo WAL ao definir a estratégia de backup.

Não publique backups que contenham informações pessoais, mensagens privadas, credenciais ou outros dados sensíveis.

---

## 12. Segurança e Privacidade

A segurança da aplicação depende tanto da arquitetura quanto da implementação e da configuração do ambiente.

As principais práticas recomendadas para este projeto são:

- Manter segredos fora do controle de versão.
- Proteger os endpoints administrativos com autenticação e autorização no servidor.
- Utilizar senhas armazenadas por meio de hash seguro.
- Validar dados recebidos pelo backend.
- Aplicar limites e controles às operações de upload.
- Utilizar HTTPS em produção.
- Evitar a exposição de dados privados nas respostas da API.
- Manter dependências atualizadas.
- Fazer backups protegidos.
- Revisar os logs para evitar o registro de senhas, tokens e outros segredos.

A documentação descreve as medidas previstas para o projeto. A confirmação de sua efetiva implementação depende da revisão do código e da configuração da aplicação.

---

## 13. Estrutura Geral do Projeto

A organização esperada dos principais diretórios é:

```text
portfolio-sabrina-furtado/
├── server/
│   └── Código do backend
├── src/
│   └── Código do frontend
├── tests/
│   └── Testes automatizados
├── data/
│   └── Banco de dados local
├── uploads/
│   └── Arquivos de mídia
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

A estrutura apresentada é ilustrativa. Os nomes e os diretórios devem ser ajustados conforme a organização real do repositório.

---

## 14. Objetivo do Projeto

Este projeto demonstra a aplicação prática de conhecimentos em desenvolvimento web full-stack, organização de APIs, persistência de dados, autenticação e construção de interfaces responsivas.

A proposta é reunir informações profissionais, competências e projetos em uma aplicação que facilite a apresentação da trajetória técnica e permita a evolução contínua do conteúdo por meio de um painel administrativo.

---

**Desenvolvido por Sabrina Furtado.**
