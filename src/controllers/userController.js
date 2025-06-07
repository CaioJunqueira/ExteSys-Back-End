import User from "../models/userModel.js";
import { hashPassword } from "../../helpers/encryption.js";
import AuthService from "../../services/Auth.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
import { v4 as uuidv4 } from "uuid"; // Para gerar UUIDs

const transporter = nodemailer.createTransport({
  service: "gmail", // ou outro provedor
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const tempUsers = {}; // Armazena usuários temporários para verificação por e-mail

class userController {
  // Controller para listar todos os usuários
  static listUsers = async (req, res) => {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erro ao listar usuários", error: error.message });
    }
  };

  // Controller para listar um usuário pelo user_id (não pelo _id do Mongo)
  static listOneUser = async (req, res) => {
    const { id } = req.params;

    try {
      const user = await User.findOne({ user_id: id });
      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }
      res.status(200).json(user);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erro ao buscar usuário", error: error.message });
    }
  };

  // Controller para criar um novo usuário
  static createUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email já cadastrado" });
      }

      const hashedPassword = await hashPassword(password);

      const newUser = new User({ name, email, password: hashedPassword, role });
      await newUser.save();
      res.status(201).json(newUser);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erro ao criar usuário", error: error.message });
    }
  };

  // Controller para deletar um usuário pelo user_id
  static deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
      const user = await User.findOneAndDelete({ user_id: id });
      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }
      res.status(200).json({ message: "Usuário deletado com sucesso" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erro ao deletar usuário", error: error.message });
    }
  };

  // Controller para atualizar um usuário pelo user_id
  static updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, password, role } = req.body;

    try {
      const updateData = { name, email, role };

      if (password) {
        updateData.password = await hashPassword(password);
      }

      const user = await User.findOneAndUpdate({ user_id: id }, updateData, {
        new: true,
      });
      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }
      res.status(200).json(user);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erro ao atualizar usuário", error: error.message });
    }
  };

  // Controller para login usando o AuthService
  static loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
      const result = await AuthService.login({ email, password });

      res.status(200).json({
        message: "Login bem-sucedido",
        accessToken: result.accessToken,
        user: result.userDb,
      });
    } catch (error) {
      res.status(401).json({ message: error.message });
    }
  };

  // Controller para buscar um usuário por e-mail
  static listUserByEmail = async (req, res) => {
    const { email } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }
      res.status(200).json(user);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erro ao buscar usuário", error: error.message });
    }
  };

  static verifyEmail = async (req, res) => {
    const { name, email } = req.body;
    const code = Math.floor(100000 + Math.random() * 900000).toString(); // código 6 dígitos
    const tempId = uuidv4(); // ID temporário

    tempUsers[tempId] = {
      name,
      email,
      code,
      expiresAt: Date.now() + 15 * 60 * 1000,
    }; // 15 min

    // Envie e-mail com o código
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verificação de E-mail",
      html: `<p>Seu código de verificação é:</p> <p><strong>${code}</strong></p>`,
    });

    res.json({ tempId }); // Retorna o ID para o frontend continuar o fluxo
  };

  static verifyCode = async (req, res) => {
    // Adicione no topo do controller
    setInterval(() => {
      const now = Date.now();
      for (const [id, user] of Object.entries(tempUsers)) {
        if (user.expiresAt < now) {
          delete tempUsers[id];
        }
      }
    }, 60 * 1000); // Limpeza a cada 1 minuto

    const { tempId, code } = req.body;
    const tempUser = tempUsers[tempId];

    if (!tempUser)
      return res.status(400).json({ error: "Código expirado ou inválido" });
    if (tempUser.code !== code)
      return res.status(400).json({ error: "Código incorreto" });
    if (Date.now() > tempUser.expiresAt)
      return res.status(400).json({ error: "Código expirado" });

    tempUser.verified = true; // Marca como verificado
    res.json({ success: true });
  };
}

export default userController;
