const express = require("express");
const bodyParser = require("body-parser");
const viewEngine = require("./configs/viewEngine");
const webRoutes = require("./routes/web");

const app = express();
const port = process.env.PORT || 4398;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// config view engine
viewEngine(app);

// config web routes
webRoutes(app);

app.listen(port, () => console.log(`Server started at port ${port}`));
