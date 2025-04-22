const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const userRoutes = require('./src/routes/userRoutes');

const app = express();
const PORT = 3000;

// Middleware para permitir JSON no corpo das requisições

app.use(cors());
app.use(express.json());

// Rota de teste
app.get('/', (req, res) => {
  res.send('API funcionando 🎉');
});


// Rota
app.use('/users', userRoutes);

// Conexão MongoDB
mongoose.connect('mongodb+srv://marco13coelho:u6oxq6hvYMSdin5H@extesys.c5jntcx.mongodb.net/?retryWrites=true&w=majority&appName=ExteSys', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB conectado!'))
.catch((error) => console.log('Erro na conexão MongoDB:', error));


// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
