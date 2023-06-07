import express from "express";
import homeController from "../controllers/HomeController";

let router = express.Router();

let initWebRoutes = (app) => {
  router.get("/", homeController.getHomePage);
  router.post("/webhook", homeController.postWebhook);
  router.get("/messaging-webhook", homeController.getMessageWebhook);
  return app.use("/", router);
};

module.exports = initWebRoutes;
