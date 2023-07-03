const express = require("express");
const homeController = require("../controllers/HomeController");

let router = express.Router();

let initWebRoutes = (app) => {
  router.get("/", homeController.getHomePage);
  router.post("/messaging-webhook", homeController.postWebhook);
  router.get("/messaging-webhook", homeController.getMessageWebhook);
  return app.use("/", router);
};

module.exports = initWebRoutes;
