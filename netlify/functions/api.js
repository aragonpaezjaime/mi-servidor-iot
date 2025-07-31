const express = require("express");
const mongoose = require("mongoose");
const serverless = require("serverless-http");

// Importar rutas
const readingRoutes = require("../../routes/readingRoutes");
const sensorRoutes = require("../../routes/sensorRoutes");

const app = express();

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch((err) => console.error("❌ Error al conectar a MongoDB:", err));

// CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(express.json());

// Rutas
app.get("/", (req, res) => {
  res.json({ message: "Servidor IoT funcionando en Netlify!" });
});

app.use("/api/readings", readingRoutes);
app.use("/api/sensors", sensorRoutes);

// Middleware para rutas no encontradas
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`
  });
});

module.exports.handler = serverless(app);