# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an IoT project that receives temperature and humidity data from ESP32 devices with DHT11 sensors and stores it in MongoDB. The system consists of:

- **Node.js/Express API server** - Receives and stores sensor data
- **ESP32 firmware** - Collects sensor data and sends it via HTTP POST
- **MongoDB database** - Stores sensor readings with timestamps

## Architecture

### API Structure (MVC Pattern)
- `app.js` - Main Express server setup, MongoDB connection, middleware configuration
- `models/SensorReading.js` - Mongoose schema for sensor data (deviceId, location, temperature, humidity, timestamp)
- `controllers/readingController.js` - Business logic for creating and retrieving sensor readings
- `routes/readingRoutes.js` - API routes: POST `/api/readings` (create), GET `/api/readings` (list all)

### ESP32 Component
- `ESP32/NodeJs_DTH11/src/main.cpp` - Arduino/PlatformIO code for ESP32 
- Reads DHT11 sensor every 2 minutes or on button press
- Sends JSON data to Node.js server via HTTP POST
- Uses WiFi connectivity and ArduinoJson library

## Development Commands

### Node.js Server
```bash
# Start development server
npm start
# or
node app.js

# Install dependencies
npm install
```

### ESP32 Development
```bash
# Build and upload (from ESP32/NodeJs_DTH11/ directory)
pio run --target upload

# Monitor serial output
pio device monitor
```

**Note**: ESP32 now uses Deep Sleep mode - it wakes every 5 minutes or when button is pressed, sends data, then sleeps again to save power.

## Environment Configuration

Create `.env` file in root with:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/iot-sensors
```

ESP32 configuration is hardcoded in `main.cpp` (lines 11-18):
- WiFi credentials
- Server URL (update IP address as needed)
- Device ID and location

## Database Schema

SensorReading model includes:
- `deviceId` (String, required) - Unique identifier for ESP32 device
- `location` (String, required) - Physical location description  
- `temperature` (Number, required) - Temperature in Celsius
- `humidity` (Number, required) - Humidity percentage
- `timestamp` (Date, auto-generated) - When reading was stored

Index on `{deviceId: 1, timestamp: -1}` for efficient queries.

## API Endpoints

- `POST /api/readings` - Create new sensor reading (used by ESP32)
- `GET /api/readings` - Retrieve all readings sorted by timestamp (newest first)
- `GET /` - Health check endpoint

## Dependencies

### Node.js
- express ^5.1.0 - Web framework
- mongoose ^8.16.5 - MongoDB ODM
- dotenv ^17.2.1 - Environment variables
- nodemon ^3.1.10 - Development auto-restart

### ESP32 (PlatformIO)
- ArduinoJson ^7.0.4 - JSON serialization
- DHT sensor library ^1.4.6 - Temperature/humidity sensor
- Adafruit Unified Sensor ^1.1.14 - Sensor abstraction layer