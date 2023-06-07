import express from "express";
import bodyParser from "body-parser";
import viewEngine from "./configs/viewEngine";
import webRoutes from "./routes/web";

const app = express();
const port = process.env.PORT || 4398;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// config view engine
viewEngine(app);

// config web routes
webRoutes(app);

app.listen(port, () => {
  console.log("App is running on port: " + port);
});
