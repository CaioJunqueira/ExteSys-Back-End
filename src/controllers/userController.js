import User from "../models/userModel.js";
import { hashPassword } from "../../helpers/encryption.js";

class userController {
  // Controller para listar todos os usuários
  static listUsers = async (req, res) => {
    try {
      const users = await User.find(); // Busca todos os usuários
      res.status(200).json(users);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erro ao listar usuários", error: error.message });
    }
  };

  // Controller para listar um usuário pelo ID
  static listOneUser = async (req, res) => {
    const { id } = req.params;

    try {
      const user = await User.findById(id); // Busca o usuário pelo ID
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
      const existingUser = await User.findOne({ email }); // Verifica se o email já existe
      if (existingUser) {
        return res.status(400).json({ message: "Email já cadastrado" });
      }

      const hashedPassword = await hashPassword(password); // Criptografa a senha

      const newUser = new User({ name, email, password: hashedPassword, role });
      await newUser.save(); // Salva o usuário no banco de dados
      res.status(201).json(newUser);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erro ao criar usuário", error: error.message });
    }
  };

// Controller para deletar um usuário pelo user_id (UUID)
static deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findOneAndDelete({ user_id: id });
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }
    res.status(200).json({ message: "Usuário deletado com sucesso" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao deletar usuário", error: error.message });
  }
};


  // Controller para atualizar um usuário pelo ID
  static updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, password, role } = req.body;

    try {
      const user = await User.findByIdAndUpdate(
        id,
        { name, email, password, role },
        { new: true }
      );
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

  // Controller para login do usuário (autenticação)
  static loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email }); // Busca usuário pelo email
      if (!user || user.password !== password) {
        // Verifica se a senha é válida
        return res.status(401).json({ message: "Email ou senha inválidos" });
      }
      res.status(200).json({ message: "Login bem-sucedido", userId: user._id });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erro ao fazer login", error: error.message });
    }
  };

  // Controller para buscar um usuário por e-mail
  static listUserByEmail = async (req, res) => {
    const { email } = req.body;

    try {
      const user = await User.findOne({ email }); // Busca usuário pelo email
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
}

export default userController;
