# Planner‑aulas

## Descrição  
**Planner‑aulas** é uma aplicação desenvolvida para auxiliar no planejamento, organização e acompanhamento de aulas e atividades educacionais. A ferramenta permite que professores de cursos acompanhem o plano de aulas por ano e disciplina, visualizem o tema, descrição e atividades de cada aula e acompanhem o progresso do planejamento pedagógico.

## Estrutura do projeto  
A estrutura básica do projeto é a seguinte:

```
/planner-aulas
│
├─ database/              ← scripts ou arquivos de configuração da base de dados  
├─ public/                ← front-end estático (HTML, CSS, JavaScript)  
├─ server.js              ← ponto de entrada / servidor Node.js  
├─ package.json           ← dependências e comandos npm  
├─ package-lock.json      ← lockfile de dependências  
└─ .gitignore             ← arquivos/pastas ignorados no versionamento  

```

### Detalhes:
`database/` — Aqui você encontra os artefatos relacionados à base de dados usada pela aplicação.

`public/` — Contém o front-end da aplicação (arquivos estáticos servidos pelo servidor).

`server.js` — Arquivo principal que inicia o servidor, define rotas, middlewares etc.

`package.json e package-lock.json` — Gerenciamento das dependências (Node.js/npm) e scripts de execução.

`.gitignore` — Arquivos/pastas que não devem ser versionados.



## Como rodar a aplicação  
Siga os passos abaixo para configurar e iniciar o ambiente de desenvolvimento:

1. Clone o repositório:
   ```bash
   git clone https://github.com/leofidelis11/planner‑aulas.git
   ```

2. Acesse o diretório:
   ```bash
   cd planner‑aulas
   ```

3. Instale as dependências:
   ```bash
   npm install
   ```


4. Inicie a aplicação em modo de desenvolvimento:
   ```bash
   npm start
   ```
   Acesse `http://localhost:4567` no navegador para visualizar a aplicação.


## Estratégia e plano de testes  
A estratégia e o plano de testes estão documentados na Wiki do projeto. Acesse a aba **Wiki** no repositório para conferir.  

## Contribuição  
Se você deseja contribuir com este projeto, siga os seguintes passos:
1. Fork este repositório.  
2. Crie uma nova branch: `git checkout -b feature/minha‑nova‑funcionalidade`.  
3. Faça suas alterações e adicione testes apropriados.  
4. Submeta um Pull Request descrevendo o que você alterou e por quê.
