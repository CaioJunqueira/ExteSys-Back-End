import Project from "../models/projectModel.js";

class projectController {
  // Listar todos os projetos, com filtro por status se fornecido
  static listProjects = async (req, res) => {
    const { status } = req.query;

    try {
      const filter = status ? { status } : {};
      const projects = await Project.find(filter);
      res.status(200).json(projects);
    } catch (error) {
      res.status(500).json({ message: "Erro ao listar projetos", error: error.message });
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
      res.status(500).json({ message: "Erro ao buscar projeto", error: error.message });
    }
  };

  // Criar um novo projeto
  static createProject = async (req, res) => {
    try {
      const newProject = new Project(req.body);
      await newProject.save();
      res.status(201).json(newProject);
    } catch (error) {
      res.status(500).json({ message: "Erro ao criar projeto", error: error.message });
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
      res.status(500).json({ message: "Erro ao deletar projeto", error: error.message });
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
      res.status(500).json({ message: "Erro ao atualizar projeto", error: error.message });
    }
  };
}

export default projectController;
