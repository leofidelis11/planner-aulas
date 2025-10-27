// Servidor web simples para rodar na porta 4567
const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 4567;

app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Rota para obter progresso
app.get('/api/progresso', (req, res) => {
  const filePath = path.join(__dirname, 'database', 'progresso.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Erro ao ler progresso.' });
    res.json(JSON.parse(data));
  });
});

// Rota para salvar progresso
app.post('/api/progresso', (req, res) => {
  const filePath = path.join(__dirname, 'database', 'progresso.json');
  const progresso = req.body;
  fs.writeFile(filePath, JSON.stringify(progresso, null, 2), 'utf8', err => {
    if (err) return res.status(500).json({ error: 'Erro ao salvar progresso.' });
    res.json({ success: true });
  });
});

app.use(express.static(__dirname));

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
