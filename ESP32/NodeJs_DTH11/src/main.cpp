#include <Arduino.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <WiFiClientSecure.h>
#include <ArduinoJson.h>

// Librerías de Adafruit para el sensor
#include <Adafruit_Sensor.h>
#include <DHT.h>

// --- CONFIGURACIÓN DE TU PROYECTO ---
const char* WIFI_SSID = "Michillo";
const char* WIFI_PASSWORD = "1qaz2wsx";
const char* SERVER_URL = "https://iot-mx.netlify.app/api/readings"; 
#define DHT_PIN 15
#define DHT_TYPE DHT11
#define BUTTON_PIN 4
const char* DEVICE_ID = "esp32-exterior-01";
const char* DEVICE_LOCATION = "Cochera";
// --- FIN DE LA CONFIGURACIÓN ---

// Configuración de Deep Sleep (5 minutos = 300 segundos)
#define SLEEP_TIME_SECONDS 300
#define uS_TO_S_FACTOR 1000000  // Factor de conversión de microsegundos a segundos

// Variable para almacenar la razón del despertar
RTC_DATA_ATTR int bootCount = 0;

// Inicialización de objetos (ahora usando el tipo de la librería de Adafruit)
DHT dht(DHT_PIN, DHT_TYPE);
WiFiClientSecure client;
HTTPClient http;

void print_wakeup_reason() {
  esp_sleep_wakeup_cause_t wakeup_reason;
  wakeup_reason = esp_sleep_get_wakeup_cause();

  switch(wakeup_reason) {
    case ESP_SLEEP_WAKEUP_EXT0: 
      Serial.println("Despertado por botón"); 
      break;
    case ESP_SLEEP_WAKEUP_TIMER: 
      Serial.println("Despertado por timer (5 minutos)"); 
      break;
    default: 
      Serial.printf("Despertado por otra causa: %d\n", wakeup_reason); 
      break;
  }
}

bool connectToWiFi() {
  Serial.print("Conectando a WiFi: ");
  Serial.println(WIFI_SSID);
  
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nWiFi conectado!");
    Serial.print("Dirección IP: ");
    Serial.println(WiFi.localIP());
    return true;
  } else {
    Serial.println("\nError: No se pudo conectar a WiFi");
    return false;
  }
}

void sendSensorData() {
  float humidity = dht.readHumidity();
  float temperature = dht.readTemperature();
  
  if (isnan(humidity) || isnan(temperature)) {
    Serial.println("Error al leer del sensor DHT!");
    digitalWrite(19, HIGH);
    return;
  }
  
  Serial.print("Humedad: ");
  Serial.print(humidity);
  Serial.print("%\t");
  Serial.print("Temperatura: ");
  Serial.print(temperature);
  Serial.println(" °C");

  JsonDocument doc;
  doc["deviceId"] = DEVICE_ID;
  doc["location"] = DEVICE_LOCATION;
  doc["temperature"] = temperature;
  doc["humidity"] = humidity;

  String jsonPayload;
  serializeJson(doc, jsonPayload);
  Serial.println("JSON a enviar: " + jsonPayload);

  client.setInsecure(); // Deshabilitar verificación SSL
  http.begin(client, SERVER_URL);
  http.addHeader("Content-Type", "application/json");

  int httpResponseCode = http.POST(jsonPayload);

  if (httpResponseCode > 0) {
    String responsePayload = http.getString();
    Serial.print("Código de respuesta HTTP: ");
    Serial.println(httpResponseCode);
    Serial.print("Respuesta del servidor: ");
    Serial.println(responsePayload);
    digitalWrite(19, LOW); // LED apagado = éxito
  } else {
    Serial.print("Error en la petición HTTP: ");
    Serial.println(httpResponseCode);
    digitalWrite(19, HIGH); // LED encendido = error
  }

  http.end();
}

void goToSleep() {
  Serial.println("Configurando modo Deep Sleep...");
  
  // Configurar timer de 5 minutos para despertar
  esp_sleep_enable_timer_wakeup(SLEEP_TIME_SECONDS * uS_TO_S_FACTOR);
  
  // Configurar botón como fuente de despertar (nivel bajo)
  esp_sleep_enable_ext0_wakeup(GPIO_NUM_4, 0);
  
  // Desconectar WiFi para ahorrar energía
  WiFi.disconnect(true);
  WiFi.mode(WIFI_OFF);
  
  Serial.println("Entrando en Deep Sleep...");
  Serial.println("=================================");
  delay(100);
  
  // Entrar en Deep Sleep
  esp_deep_sleep_start();
}

void setup() {
  Serial.begin(115200);
  pinMode(19, OUTPUT);
  pinMode(BUTTON_PIN, INPUT_PULLUP);
  digitalWrite(19, LOW);
  
  // Incrementar contador de arranques
  ++bootCount;
  Serial.println("Boot número: " + String(bootCount));
  
  // Mostrar razón del despertar
  print_wakeup_reason();
  
  // Inicializar sensor
  dht.begin();
  
  // Intentar conectar a WiFi
  if (connectToWiFi()) {
    // Enviar datos del sensor
    sendSensorData();
  } else {
    // Si no se puede conectar, encender LED de error
    digitalWrite(19, HIGH);
  }
  
  // Esperar un poco antes de dormir
  delay(2000);
  
  // Ir a dormir
  goToSleep();
}

void loop() {
  // El loop() está vacío porque todo el trabajo se hace en setup()
  // y luego el ESP32 entra en Deep Sleep
}