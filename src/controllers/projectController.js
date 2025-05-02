import Project from "../models/projectModel.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail", // ou outro provedor
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

class projectController {
  // Listar todos os projetos, com filtro por status se fornecido
  static listProjects = async (req, res) => {
    const { status } = req.query;

    try {
      const filter = status ? { status } : {};
      const projects = await Project.find(filter);
      res.status(200).json(projects);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erro ao listar projetos", error: error.message });
    }
  };

  // Listar um projeto específico pelo project_id
  static listOneProject = async (req, res) => {
    const { id } = req.params;

    try {
      const project = await Project.findOne({ project_id: id });
      if (!project) {
        return res.status(404).json({ message: "Projeto não encontrado" });
      }
      res.status(200).json(project);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erro ao buscar projeto", error: error.message });
    }
  };

  // Criar um novo projeto
  static createProject = async (req, res) => {
    try {
      const newProject = new Project(req.body);
      await newProject.save();
      res.status(201).json(newProject);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erro ao criar projeto", error: error.message });
    }
  };

  // Deletar um projeto pelo project_id
  static deleteProject = async (req, res) => {
    const { id } = req.params;

    try {
      const project = await Project.findOneAndDelete({ project_id: id });
      if (!project) {
        return res.status(404).json({ message: "Projeto não encontrado" });
      }
      res.status(200).json({ message: "Projeto deletado com sucesso" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erro ao deletar projeto", error: error.message });
    }
  };

  // Atualizar dados de um projeto (put ou patch) pelo project_id
  static updateProject = async (req, res) => {
    const { id } = req.params;

    try {
      const updatedProject = await Project.findOneAndUpdate(
        { project_id: id },
        req.body,
        { new: true }
      );

      if (!updatedProject) {
        return res.status(404).json({ message: "Projeto não encontrado" });
      }

      res.status(200).json(updatedProject);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erro ao atualizar projeto", error: error.message });
    }
  };

  static approveProject = async (req, res) => {
    const { id } = req.params;

    try {
      const project = await Project.findOne({ project_id: id });

      if (!project) {
        return res.status(404).json({ message: "Projeto não encontrado" });
      }

      // Atualiza status para "disponível"
      project.status = "disponível";
      await project.save();

      // Envia e-mail de aprovação
      const { creatorName, creatorEmail, project_theme } = project;

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: creatorEmail,
        subject: `Projeto "${project_theme}" aprovado`,
        html: `
          <p>Olá <strong>${creatorName}</strong>,</p>
          <p>Seu projeto <strong>"${project_theme}"</strong> foi <span style="color:green;"><strong>aprovado</strong></span> e agora está disponível para todos os alunos.</p>
          <br>
          <p>Parabéns! Em breve os alunos poderão se inscrever.</p>
        `,
      });

      res
        .status(200)
        .json({ message: "Projeto aprovado e e-mail enviado com sucesso." });
    } catch (error) {
      console.error("Erro ao aprovar projeto:", error);
      res
        .status(500)
        .json({ message: "Erro ao aprovar projeto", error: error.message });
    }
  };

  static rejectProject = async (req, res) => {
    const { id } = req.params;
    const { rejectionReason, creatorName, creatorEmail, project_theme } =
      req.body;

    try {
      const project = await Project.findOne({ project_id: id });
      if (!project) {
        return res.status(404).json({ message: "Projeto não encontrado" });
      }

      // Atualiza status e motivo
      project.status = "rejeitado";
      project.rejectionReason = rejectionReason;
      await project.save();

      // Envia e-mail
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: creatorEmail,
        subject: `Projeto "${project_theme}" reprovado`,
        html: `
        <p>Olá <strong>${creatorName}</strong>,</p>
        <p>Seu projeto <strong>"${project_theme}"</strong> foi <span style="color:red;"><strong>reprovado</strong></span>.</p>
        <p><strong>Motivo:</strong> ${rejectionReason}</p>
        <br>
        <p>Se tiver dúvidas, entre em contato com a coordenação.</p>
      `,
      });

      res
        .status(200)
        .json({ message: "Projeto reprovado e e-mail enviado com sucesso." });
    } catch (error) {
      console.error("Erro ao reprovar projeto:", error);
      res
        .status(500)
        .json({ message: "Erro ao reprovar projeto", error: error.message });
    }
  };

  static expressInterest = async (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;
    try {
      const project = await Project.findOne({ project_id: id });
      if (!project) {
        return res.status(404).json({ message: "Projeto não encontrado" });
      }

      // envia e‑mail ao professor
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: project.responsibleTeacherEmail,
        subject: `Interesse em "${project.project_theme}"`,
        html: `
          <p>Olá <strong>${project.responsible_teacher}</strong>,</p>
          <p>O aluno <strong>${name}</strong> demonstrou interesse no projeto <em>"${project.project_theme}"</em>.</p>
          <p><strong>E‑mail do aluno:</strong> ${email}</p>
          <br>
          <p>Entre em contato com ele para prosseguir.</p>
        `,
      });

      res
        .status(200)
        .json({
          message: "Interesse registrado e e‑mail enviado ao professor.",
        });
    } catch (error) {
      console.error("Erro ao registrar interesse:", error);
      res
        .status(500)
        .json({
          message: "Erro interno ao processar interesse",
          error: error.message,
        });
    }
  };
}

export default projectController;
