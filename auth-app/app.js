require("dotenv/config");

require("./db");

const express = require("express");

const hbs = require("hbs");

const app = express();

//Añadimos la config de session
require("./config/session.config")(app)  //4. Configuración de sesión
require("./config")(app);


const projectName = "auth-app";
const capitalized = (string) => string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)} created with IronLauncher`;



///////////// Añadimos las rutas

const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes);

const index = require("./routes/index");
app.use("/", index);

require("./error-handling")(app);

module.exports = app;
