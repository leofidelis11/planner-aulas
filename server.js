const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 4567;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const planoPath = path.join(__dirname, 'database', 'plano4B2025.json');
const loginPath = path.join(__dirname, 'database', 'login.json');

// Autenticação simples
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const loginData = JSON.parse(fs.readFileSync(loginPath, 'utf8'));
  const user = loginData.users.find(u => u.username === username && u.password === password);
  if (user) {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, message: 'Usuário ou senha inválidos.' });
  }
});

// Buscar plano de aulas
app.get('/api/plano', (req, res) => {
  const plano = JSON.parse(fs.readFileSync(planoPath, 'utf8'));
  res.json(plano);
});

// Atualizar progresso das aulas
app.post('/api/progresso', (req, res) => {
  const { progresso } = req.body;
  fs.writeFileSync(path.join(__dirname, 'database', 'progresso.json'), JSON.stringify(progresso, null, 2));
  res.json({ success: true });
});

// Buscar progresso
app.get('/api/progresso', (req, res) => {
  const progressoPath = path.join(__dirname, 'database', 'progresso.json');
  if (fs.existsSync(progressoPath)) {
    const progresso = JSON.parse(fs.readFileSync(progressoPath, 'utf8'));
    res.json(progresso);
  } else {
    res.json({});
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
