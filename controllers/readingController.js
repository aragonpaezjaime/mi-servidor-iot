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
