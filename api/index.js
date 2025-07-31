const express = require("express");
const mongoose = require("mongoose");

require("dotenv").config(); // Carga las variables de entorno del archivo .env

// --- IMPORTAR RUTAS ---
const readingRoutes = require("../routes/readingRoutes");
const sensorRoutes = require("../routes/sensorRoutes");

const app = express();
const port = process.env.PORT || 3000;

// --- CONEXIÓN A MONGODB ---
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch((err) => console.error("❌ Error al conectar a MongoDB:", err));

// --- MIDDLEWARES ---
// CORS para permitir peticiones desde cualquier origen
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  
  // Responder a peticiones OPTIONS (preflight)
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Middleware para que Express pueda entender y procesar JSON.
// ¡Esencial para que nuestra API reciba los datos del ESP32!
app.use(express.json());

// Middleware para manejo de errores 404
app.use((req, res, next) => {
  if (!res.headersSent) {
    console.log(`404 - Ruta no encontrada: ${req.method} ${req.path}`);
  }
  next();
});

// --- RUTAS DE LA API ---
app.get("/", (req, res) => {
  res.send("Servidor IoT funcionando. ¡Listo para recibir datos!");
});

// Le decimos a Express que use el router de lecturas para cualquier
// petición que empiece con '/api/readings'.
app.use("/api/readings", readingRoutes);

// Rutas para endpoints de sensores
app.use("/api/sensors", sensorRoutes);

// Middleware para manejo de rutas no encontradas
app.use("*", (req, res) => {
  console.log(`405 - Método no permitido: ${req.method} ${req.originalUrl}`);
  res.status(405).json({
    success: false,
    message: `Método ${req.method} no permitido para ${req.originalUrl}`,
    allowedMethods: req.method === "GET" ? ["GET"] : ["POST", "GET"]
  });
});

// --- EXPORTAR PARA VERCEL ---
module.exports = app;
