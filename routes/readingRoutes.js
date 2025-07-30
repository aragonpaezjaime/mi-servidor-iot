const express = require("express");
const router = express.Router();

// 1. Importamos el controlador
const readingController = require("../controllers/readingController");

// 2. Definimos las rutas y las asociamos a las funciones del controlador
// Cuando llegue una petición POST a '/', se ejecutará 'createReading'
router.post("/", readingController.createReading);

// Cuando llegue una petición GET a '/', se ejecutará 'getAllReadings'
router.get("/", readingController.getAllReadings);

// 3. Exportamos el router para usarlo en la app principal
module.exports = router;
