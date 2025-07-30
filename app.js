const express = require("express");
const mongoose = require("mongoose");

require("dotenv").config(); // Carga las variables de entorno del archivo .env

// --- IMPORTAR RUTAS ---
const readingRoutes = require("./routes/readingRoutes");

const app = express();
const port = process.env.PORT || 3000;

// --- CONEXIÓN A MONGODB ---
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch((err) => console.error("❌ Error al conectar a MongoDB:", err));

// --- MIDDLEWARES ---
// Middleware para que Express pueda entender y procesar JSON.
// ¡Esencial para que nuestra API reciba los datos del ESP32!
app.use(express.json());

// --- RUTAS DE LA API ---
app.get("/", (req, res) => {
  res.send("Servidor IoT funcionando. ¡Listo para recibir datos!");
});

// Le decimos a Express que use el router de lecturas para cualquier
// petición que empiece con '/api/readings'.
app.use("/api/readings", readingRoutes);

// --- INICIAR SERVIDOR ---
app.listen(port, () => {
  console.log(`🚀 Servidor escuchando en el puerto: ${port}`);
});
