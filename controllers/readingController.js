const SensorReading = require("../models/SensorReading");

// Controlador para crear una nueva lectura de sensor
// Esta será la función que se ejecute cuando el ESP32 envíe datos
exports.createReading = async (req, res) => {
  try {
    // 1. Extraemos los datos del cuerpo (body) de la petición
    // El ESP32 enviará estos datos en formato JSON
    console.log(req.body);
    const { deviceId, location, temperature, humidity } = req.body;

    // 2. Creamos un nuevo documento con el modelo
    const newReading = new SensorReading({
      deviceId,
      location,
      temperature,
      humidity,
    });

    // 3. Guardamos el documento en la base de datos
    await newReading.save();

    // 4. Respondemos al cliente (al ESP32) que todo salió bien
    res.status(201).json({
      message: "Lectura guardada exitosamente",
      data: newReading,
    });
  } catch (error) {
    // Si algo sale mal, enviamos una respuesta de error
    console.error("Error al guardar la lectura:", error);
    res.status(500).json({
      message: "Error en el servidor",
      error: error.message,
    });
  }
};

// Controlador para obtener todas las lecturas (útil para pruebas)
exports.getAllReadings = async (req, res) => {
  try {
    const readings = await SensorReading.find().sort({ timestamp: -1 });
    res.status(200).json({
      count: readings.length,
      data: readings,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las lecturas" });
  }
};

// Obtener últimos datos de todos los sensores
exports.getRecentReadings = async (req, res) => {
  try {
    const pipeline = [
      { $sort: { deviceId: 1, timestamp: -1 } },
      {
        $group: {
          _id: "$deviceId",
          latestReading: { $first: "$$ROOT" }
        }
      },
      { $replaceRoot: { newRoot: "$latestReading" } },
      { $sort: { timestamp: -1 } }
    ];
    
    const recentReadings = await SensorReading.aggregate(pipeline);
    res.status(200).json({
      count: recentReadings.length,
      data: recentReadings,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener lecturas recientes", error: error.message });
  }
};

// Obtener datos históricos por horas
exports.getHistoricalReadings = async (req, res) => {
  try {
    const hours = parseInt(req.params.hours) || 24;
    const hoursAgo = new Date(Date.now() - hours * 60 * 60 * 1000);
    
    const readings = await SensorReading.find({
      timestamp: { $gte: hoursAgo }
    }).sort({ timestamp: -1 });
    
    res.status(200).json({
      count: readings.length,
      hours: hours,
      data: readings,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener datos históricos", error: error.message });
  }
};

// Obtener datos de un sensor específico
exports.getDeviceReadings = async (req, res) => {
  try {
    const { deviceId } = req.params;
    const limit = parseInt(req.query.limit) || 100;
    
    const readings = await SensorReading.find({ deviceId })
      .sort({ timestamp: -1 })
      .limit(limit);
    
    res.status(200).json({
      deviceId,
      count: readings.length,
      limit,
      data: readings,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener datos del dispositivo", error: error.message });
  }
};

// Obtener estadísticas generales
exports.getStats = async (req, res) => {
  try {
    const pipeline = [
      {
        $group: {
          _id: "$deviceId",
          totalReadings: { $sum: 1 },
          avgTemperature: { $avg: "$temperature" },
          minTemperature: { $min: "$temperature" },
          maxTemperature: { $max: "$temperature" },
          avgHumidity: { $avg: "$humidity" },
          minHumidity: { $min: "$humidity" },
          maxHumidity: { $max: "$humidity" },
          firstReading: { $min: "$timestamp" },
          lastReading: { $max: "$timestamp" },
          location: { $first: "$location" }
        }
      },
      { $sort: { _id: 1 } }
    ];
    
    const deviceStats = await SensorReading.aggregate(pipeline);
    
    const totalReadings = await SensorReading.countDocuments();
    const totalDevices = deviceStats.length;
    
    res.status(200).json({
      summary: {
        totalDevices,
        totalReadings
      },
      deviceStats
    });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener estadísticas", error: error.message });
  }
};
