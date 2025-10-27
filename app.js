document.addEventListener('DOMContentLoaded', function() {
  // Login e dashboard serão implementados
});
// ...app base...
document.addEventListener('DOMContentLoaded', function() {
  // Função para carregar dados do plano
  async function carregarPlano() {
    try {
      const response = await fetch('database/plano4B2025.json');
      const plano = await response.json();
      montarDashboard(plano);
    } catch (e) {
      document.getElementById('dashboard').innerHTML = '<div class="notification is-danger">Erro ao carregar plano de aulas.</div>';
    }
  }

  // Função para autenticar login
  async function autenticarLogin(usuario, senha) {
    try {
      const response = await fetch('database/login.json');
      const data = await response.json();
      return data.usuarios.some(u => u.usuario === usuario && u.senha === senha);
    } catch (e) {
      return false;
    }
  }

  // Renderiza tela de login
  function renderLogin() {
    const loginContainer = document.getElementById('login-container');
    loginContainer.innerHTML = `
      <div class="box" style="max-width:400px;margin:2rem auto;">
        <h2 class="title is-4 has-text-centered">Login do Instrutor</h2>
        <form id="login-form">
          <div class="field">
            <label class="label">Usuário</label>
            <div class="control">
              <input class="input" type="text" name="usuario" required autocomplete="username">
            </div>
          </div>
          <div class="field">
            <label class="label">Senha</label>
            <div class="control">
              <input class="input" type="password" name="senha" required autocomplete="current-password">
            </div>
          </div>
          <div class="field">
            <button class="button is-primary is-fullwidth" type="submit">Entrar</button>
          </div>
        </form>
        <div id="login-error" class="has-text-danger has-text-centered mt-2"></div>
      </div>
    `;
    document.getElementById('dashboard').style.display = 'none';
    loginContainer.style.display = 'block';
    document.getElementById('login-form').addEventListener('submit', async function(e) {
      e.preventDefault();
      const usuario = e.target.usuario.value;
      const senha = e.target.senha.value;
      const ok = await autenticarLogin(usuario, senha);
      if (ok) {
        localStorage.setItem('instrutorLogado', 'true');
        loginContainer.style.display = 'none';
        carregarPlano();
      } else {
        document.getElementById('login-error').textContent = 'Usuário ou senha inválidos.';
      }
    });
  }

  // Utilitário para obter usuário logado
  function getUsuario() {
    return 'instrutor'; // fixo para este sistema
  }

  // Carregar progresso do backend
  async function carregarProgresso() {
    try {
      const response = await fetch('/api/progresso');
      return await response.json();
    } catch (e) {
      return {};
    }
  }

  // Salvar progresso no backend
  async function salvarProgresso(progresso) {
    await fetch('/api/progresso', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(progresso)
    });
  }

  // Função para montar dashboard
  async function montarDashboard(plano) {
    const progressoData = await carregarProgresso();
    const usuario = getUsuario();
    const progressoUsuario = (progressoData[usuario] && progressoData[usuario].disciplinas) || {};
    const dashboard = document.getElementById('dashboard');
    dashboard.innerHTML = '';
    plano.series.forEach(serieObj => {
      const serieDiv = document.createElement('div');
      serieDiv.className = 'box';
      serieDiv.innerHTML = `<h2 class="title is-4">${serieObj.serie}</h2>`;
      serieObj.disciplinas.forEach(disciplinaObj => {
        const totalConteudos = disciplinaObj.conteudos.length;
        let concluidos = 0;
        const disciplinaKey = `${disciplinaObj.disciplina}_${plano.ano}`;
        const progressoDisciplina = progressoUsuario[disciplinaKey] || {};
        // Verifica progresso salvo
        disciplinaObj.conteudos.forEach((conteudo, idx) => {
          if (progressoDisciplina[`tema${idx}`]) {
            concluidos++;
          }
        });
        const progresso = Math.round((concluidos / totalConteudos) * 100);
        const disciplinaDiv = document.createElement('div');
        disciplinaDiv.className = 'mb-4';
        disciplinaDiv.innerHTML = `
          <h3 class="subtitle is-5">${disciplinaObj.disciplina}</h3>
          <div style="display:flex;align-items:center;gap:1rem;">
            <progress class="progress is-primary" value="${progresso}" max="100" style="flex:1;">${progresso}%</progress>
            <span class="has-text-weight-bold">${progresso}%</span>
          </div>
          <div class="conteudos"></div>
        `;
        // Listar temas
        const conteudosDiv = disciplinaDiv.querySelector('.conteudos');
        disciplinaObj.conteudos.forEach((conteudo, idx) => {
          const temaDiv = document.createElement('div');
          temaDiv.className = 'card mb-2';
          const checked = !!progressoDisciplina[`tema${idx}`];
          temaDiv.innerHTML = `
            <div class="card-content">
              <p><strong>Tema:</strong> ${conteudo.tema || ''}</p>
              <p><strong>Subtema:</strong> ${conteudo.subtema || ''}</p>
              <p><strong>Descrição:</strong> ${conteudo.descrição || ''}</p>
              <p><strong>Atividades:</strong> ${conteudo.atividades || ''}</p>
              <button class="button is-small is-success check-btn" data-serie="${serieObj.serie}" data-disciplina="${disciplinaObj.disciplina}" data-idx="${idx}">
                <span class="icon is-small">
                  <i class="${checked ? 'fas fa-check-square' : 'far fa-square'}"></i>
                </span>
                <span>${checked ? 'Concluída' : 'Marcar como concluída'}</span>
              </button>
            </div>
          `;
          conteudosDiv.appendChild(temaDiv);
        });
        serieDiv.appendChild(disciplinaDiv);
      });
      dashboard.appendChild(serieDiv);
    });
    dashboard.style.display = 'block';
    // Adiciona eventos aos botões de checagem
    document.querySelectorAll('.check-btn').forEach(btn => {
      btn.addEventListener('click', async function() {
        const disciplina = btn.getAttribute('data-disciplina');
        const idx = btn.getAttribute('data-idx');
        const disciplinaKey = `${disciplina}_${plano.ano}`;
        const progressoDataAtual = await carregarProgresso();
        if (!progressoDataAtual[usuario]) progressoDataAtual[usuario] = { disciplinas: {} };
        if (!progressoDataAtual[usuario].disciplinas[disciplinaKey]) progressoDataAtual[usuario].disciplinas[disciplinaKey] = {};
        const checked = !!progressoDataAtual[usuario].disciplinas[disciplinaKey][`tema${idx}`];
        progressoDataAtual[usuario].disciplinas[disciplinaKey][`tema${idx}`] = !checked;
        await salvarProgresso(progressoDataAtual);
        montarDashboard(plano);
      });
    });
  }

  // Exibir login ou dashboard
  if (localStorage.getItem('instrutorLogado') === 'true') {
    document.getElementById('login-container').style.display = 'none';
    carregarPlano();
  } else {
    renderLogin();
  }

  // Atualizar função carregarPlano para passar plano para montarDashboard
  async function carregarPlano() {
    try {
      const response = await fetch('database/plano4B2025.json');
      const plano = await response.json();
      await montarDashboard(plano);
    } catch (e) {
      document.getElementById('dashboard').innerHTML = '<div class="notification is-danger">Erro ao carregar plano de aulas.</div>';
    }
  }
});