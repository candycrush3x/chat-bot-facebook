const express = require("express");
const HomeController = require("../controllers/home.controllers");

let router = express.Router();

let initWebRoutes = (app) => {
  router.get("/", HomeController.getHomePage);

  // Setup get started button, whitelisted_domains
  router.post("/setup-profile", HomeController.setupProfile);

  // Setup persistent menu
  router.post("/setup-persistent-menu", HomeController.setupPersistentMenu);

  // Handle response message
  router.post("/messaging-webhook", HomeController.postWebhook);
  router.get("/messaging-webhook", HomeController.getMessageWebhook);
  return app.use("/", router);
};

module.exports = initWebRoutes;
