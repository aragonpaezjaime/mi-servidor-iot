const mongoose = require("mongoose");

// Importar el modelo directamente
const SensorReading = require("../../models/SensorReading");

// Conectar a MongoDB (solo si no está conectado)
const connectDB = async () => {
  if (mongoose.connections[0].readyState) {
    return;
  }
  
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Conectado a MongoDB");
  } catch (error) {
    console.error("❌ Error conectando a MongoDB:", error);
    throw error;
  }
};

exports.handler = async (event, context) => {
  // Configurar CORS
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  // Manejar preflight requests
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: "",
    };
  }

  try {
    await connectDB();

    if (event.httpMethod === "POST") {
      // Crear nueva lectura
      const { deviceId, location, temperature, humidity } = JSON.parse(event.body);

      const newReading = new SensorReading({
        deviceId,
        location,
        temperature,
        humidity,
      });

      const savedReading = await newReading.save();

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({
          success: true,
          data: savedReading,
          message: "Lectura guardada exitosamente",
        }),
      };
    }

    if (event.httpMethod === "GET") {
      // Obtener todas las lecturas
      const readings = await SensorReading.find().sort({ timestamp: -1 });

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          data: readings,
          count: readings.length,
        }),
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({
        success: false,
        message: "Método no permitido",
      }),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: "Error interno del servidor",
        error: error.message,
      }),
    };
  }
};