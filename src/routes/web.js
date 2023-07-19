const express = require("express");
const HomeController = require("../controllers/home.controllers");

let router = express.Router();

let initWebRoutes = (app) => {
  router.get("/", HomeController.getHomePage);
  router.post("/setup-profile", HomeController.setupProfile);
  router.post("/messaging-webhook", HomeController.postWebhook);
  router.get("/messaging-webhook", HomeController.getMessageWebhook);
  return app.use("/", router);
};

module.exports = initWebRoutes;
