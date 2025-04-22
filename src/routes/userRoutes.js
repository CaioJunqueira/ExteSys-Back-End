const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Cadastrar novo usuário
router.post('/', async (req, res) => {
  const { email, senha } = req.body;
  try {
    const newUser = new User({ email, senha });
    await newUser.save();
    res.status(201).json({ message: 'Usuário criado com sucesso!' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar usuário', error });
  }
});

// Listar todos usuários
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar usuários', error });
  }
});

module.exports = router;