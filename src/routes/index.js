import express from "express";
import users from "./userRoutes.js";
import projects from "./projectRoutes.js"

const routes = (app) => {
  app.use(
    express.json(),
    users,
    projects,
);
};

export default routes;