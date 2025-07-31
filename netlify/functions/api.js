exports.handler = async (event, context) => {
  // Configurar headers CORS
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
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

  if (event.httpMethod === "GET") {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: "Servidor IoT funcionando en Netlify Functions!",
        timestamp: new Date().toISOString(),
        endpoints: {
          readings: {
            POST: "/api/readings - Crear nueva lectura",
            GET: "/api/readings - Obtener todas las lecturas"
          }
        }
      })
    };
  }

  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({
      success: false,
      message: `Método ${event.httpMethod} no permitido`
    })
  };
};