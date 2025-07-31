const mongoose = require("mongoose");

// Importar el modelo directamente
const SensorReading = require("../../models/SensorReading");

// Variable para controlar la conexión
let cachedConnection = null;

// Conectar a MongoDB
const connectDB = async () => {
  if (cachedConnection) {
    return cachedConnection;
  }
  
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    cachedConnection = connection;
    console.log("✅ Conectado a MongoDB");
    return connection;
  } catch (error) {
    console.error("❌ Error conectando a MongoDB:", error);
    throw error;
  }
};

exports.handler = async (event, context) => {
  // Configurar headers CORS
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Accept",
    "Content-Type": "application/json"
  };

  // Manejar preflight requests
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: ""
    };
  }

  try {
    await connectDB();

    if (event.httpMethod === "POST") {
      // Crear nueva lectura
      const data = JSON.parse(event.body || "{}");
      const { deviceId, location, temperature, humidity } = data;

      // Validar datos requeridos
      if (!deviceId || !location || temperature === undefined || humidity === undefined) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            success: false,
            message: "Faltan campos requeridos: deviceId, location, temperature, humidity"
          })
        };
      }

      const newReading = new SensorReading({
        deviceId,
        location,
        temperature: Number(temperature),
        humidity: Number(humidity)
      });

      const savedReading = await newReading.save();

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({
          success: true,
          data: savedReading,
          message: "Lectura guardada exitosamente"
        })
      };
    }

    if (event.httpMethod === "GET") {
      // Obtener todas las lecturas
      const readings = await SensorReading.find()
        .sort({ timestamp: -1 })
        .limit(100); // Limitar a 100 registros más recientes

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          data: readings,
          count: readings.length
        })
      };
    }

    // Método no permitido
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({
        success: false,
        message: `Método ${event.httpMethod} no permitido`
      })
    };

  } catch (error) {
    console.error("Error en función readings:", error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: "Error interno del servidor",
        error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
      })
    };
  }
};