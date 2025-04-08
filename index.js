const express = require('express');
const app = express();
const PORT = 3000;

// Middleware para permitir JSON no corpo das requisições
app.use(express.json());

// Rota de teste
app.get('/', (req, res) => {
  res.send('API funcionando 🎉');
});

// Rota de exemplo
app.get('/users', (req, res) => {
  res.json([{ id: 1, name: 'João' }, { id: 2, name: 'Maria' }]);
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
