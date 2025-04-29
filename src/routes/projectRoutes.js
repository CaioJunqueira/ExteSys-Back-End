import express from 'express';
import projectController from '../controllers/projectController.js';

const router = express.Router();

router
  .get("/projects", projectController.listProjects)
  .get("/projects/:id", projectController.listOneProject)
  .post("/projects", projectController.createProject)
  .delete("/projects/removeOne/:id", projectController.deleteProject)
  .put("/projects/:id", projectController.updateProject)
  .patch("/projects/:id", projectController.updateProject)

export default router;