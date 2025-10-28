document.addEventListener('DOMContentLoaded', () => {
  const loginBox = document.getElementById('login-box');
  const dashboard = document.getElementById('dashboard');
  const loginBtn = document.getElementById('login-btn');
  const loginError = document.getElementById('login-error');

  let plano = null;
  let progresso = {};

  loginBtn.onclick = async () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    loginError.textContent = '';
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (res.ok) {
      loginBox.style.display = 'none';
      dashboard.style.display = 'block';
      loadPlano();
    } else {
      loginError.textContent = 'Usuário ou senha inválidos.';
    }
  };

  async function loadPlano() {
    const res = await fetch('/api/plano');
    plano = await res.json();
    const progressoRes = await fetch('/api/progresso');
    progresso = await progressoRes.json();
    renderDashboard();
  }

  function renderDashboard() {
    // Salvar estado dos accordions
    const expandedSeries = {};
    const expandedDisciplinas = {};
    document.querySelectorAll('.accordion').forEach((serieDiv, sIdx) => {
      const serieContent = serieDiv.querySelector('div');
      expandedSeries[sIdx] = serieContent && serieContent.style.display !== 'none';
      if (serieContent) {
        serieContent.querySelectorAll('.card').forEach((cardDiv, dIdx) => {
          const cardContent = cardDiv.querySelector('.card-content');
          expandedDisciplinas[`${sIdx}-${dIdx}`] = cardContent && cardContent.style.display !== 'none';
        });
      }
    });

    dashboard.innerHTML = '';
    plano.series.forEach((serieObj, sIdx) => {
      const serieAccordion = document.createElement('div');
      serieAccordion.className = 'accordion';
      const serieBtn = document.createElement('button');
      serieBtn.className = 'button is-link is-light';
      serieBtn.textContent = serieObj.serie;
      serieAccordion.appendChild(serieBtn);
      const serieContent = document.createElement('div');
      serieContent.style.display = expandedSeries[sIdx] ? 'block' : 'none';
      serieBtn.onclick = () => {
        serieContent.style.display = serieContent.style.display === 'none' ? 'block' : 'none';
      };
      serieObj.disciplinas.forEach((disciplinaObj, dIdx) => {
        const card = document.createElement('div');
        card.className = 'card';
        const cardHeader = document.createElement('header');
        cardHeader.className = 'card-header';
        const disciplinaBtn = document.createElement('button');
        disciplinaBtn.className = 'card-header-title button is-info is-light';
        disciplinaBtn.textContent = disciplinaObj.disciplina;
        cardHeader.appendChild(disciplinaBtn);
        card.appendChild(cardHeader);
        const cardContent = document.createElement('div');
        cardContent.className = 'card-content';
        cardContent.style.display = expandedDisciplinas[`${sIdx}-${dIdx}`] ? 'block' : 'none';
        disciplinaBtn.onclick = () => {
          cardContent.style.display = cardContent.style.display === 'none' ? 'block' : 'none';
        };
        // Barra de progresso
        const total = disciplinaObj.conteudos.length;
        const concluidas = (progresso[serieObj.serie]?.[disciplinaObj.disciplina] || []).length || 0;
        const percent = Math.round((concluidas / total) * 100);
        const progressBar = document.createElement('progress');
        progressBar.className = 'progress is-success';
        progressBar.value = percent;
        progressBar.max = 100;
        cardContent.appendChild(progressBar);
        const progressLabel = document.createElement('span');
        progressLabel.textContent = ` ${percent}% concluído`;
        cardContent.appendChild(progressLabel);
        disciplinaObj.conteudos.forEach((conteudo, idx) => {
          const temaBox = document.createElement('div');
          temaBox.className = 'box';
          temaBox.innerHTML = `<strong>Tema:</strong> ${conteudo.tema}<br>
            <strong>Subtema:</strong> ${conteudo.subtema}<br>
            <strong>Descrição:</strong> ${conteudo.descrição}<br>
            <strong>Atividades:</strong> ${conteudo.atividades}`;
          const checkBtn = document.createElement('button');
          checkBtn.className = 'button is-small check-btn';
          const concluida = (progresso[serieObj.serie]?.[disciplinaObj.disciplina] || []).includes(idx);
          checkBtn.textContent = concluida ? 'Concluída' : 'Marcar como concluída';
          checkBtn.classList.toggle('is-success', !concluida);
          checkBtn.classList.toggle('is-warning', concluida);
          checkBtn.onclick = async (e) => {
            if (!progresso[serieObj.serie]) progresso[serieObj.serie] = {};
            if (!progresso[serieObj.serie][disciplinaObj.disciplina]) progresso[serieObj.serie][disciplinaObj.disciplina] = [];
            if (concluida) {
              progresso[serieObj.serie][disciplinaObj.disciplina] = progresso[serieObj.serie][disciplinaObj.disciplina].filter(i => i !== idx);
            } else {
              progresso[serieObj.serie][disciplinaObj.disciplina].push(idx);
            }
            await fetch('/api/progresso', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ progresso })
            });
            renderDashboard();
          };
          temaBox.appendChild(checkBtn);
          cardContent.appendChild(temaBox);
        });
        card.appendChild(cardContent);
        serieContent.appendChild(card);
      });
      serieAccordion.appendChild(serieContent);
      dashboard.appendChild(serieAccordion);
    });
  }
});
