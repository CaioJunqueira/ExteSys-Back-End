import express from 'express';
import userController from '../controllers/userController.js';

const router = express.Router();

router
  .get("/users", userController.listUsers)
  .get("/users/:id", userController.listOneUser)
  .post("/users", userController.createUser)
  .delete("/users/removeOne/:id", userController.deleteUser)
  .put("/users/:id", userController.updateUser)
  .post("/auth/login", userController.loginUser)
  .post("/users/findemail", userController.listUserByEmail);

export default router;