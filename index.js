const express = require("express");
const cors = require("cors");
const fs = require("fs");
const { checkConnection } = require("./utils/dbConnection");
const {
  getJoyas,
  getFilteredJoyas,
  prepararHATEOAS,
} = require("./controllers/joya.controller.js");

const app = express();
app.use(express.json());
app.use(cors());

function consoleRoute(req, res, next) {
  const route = req.route.path;
  let archivoPrevio = fs.readFileSync("routes.log", "utf-8");
  let nuevoArchivo = (archivoPrevio += ` RUTA CONSULTADA A LAS ${Date.now()} - ${route}`);
  fs.writeFileSync("routes.log", nuevoArchivo);
  next();
}

app.listen(3000, async () => {
  console.log("🟢 Servidor iniciado con éxito en http://localhost:3000");
  try {
    const hora = await checkConnection();
    console.log("💾 Base de datos conectada y funcionando a las " + hora);
  } catch (error) {
    console.log("🔴 Error en la conexión a la BD: ", error.message);
  }
});

app.get("/joyas", consoleRoute, async (req, res) => {
  try {
    const joyas = await getJoyas(req.query);
    const HATEOAS = prepararHATEOAS(joyas);
    res.json(HATEOAS);
  } catch (error) {
    res.status(500).send("Error obteniendo las joyas: " + error.message);
  }
});


app.get("/joyas/filtros", consoleRoute, async (req, res) => {
  try {
    const joyas = await getFilteredJoyas(req.query);
    res.json(joyas);
  } catch (error) {
    res.status(500).send("Error filtrando las joyas: " + error.message);
  }
});

app.get("*", (req, res) => {
  res.status(404).send("Esta ruta no existe");
});
