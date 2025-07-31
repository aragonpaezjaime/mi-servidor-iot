const express = require("express");
const router = express.Router();

const readingController = require("../controllers/readingController");

// GET /api/sensors/recent - Últimos datos de todos los sensores
router.get("/recent", readingController.getRecentReadings);

// GET /api/sensors/historical/:hours - Datos históricos
router.get("/historical/:hours", readingController.getHistoricalReadings);

// GET /api/sensors/stats - Estadísticas generales
router.get("/stats", readingController.getStats);

// GET /api/sensors/:deviceId - Datos de un sensor específico
router.get("/:deviceId", readingController.getDeviceReadings);

module.exports = router;