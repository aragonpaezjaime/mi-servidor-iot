const mongoose = require("mongoose");

const sensorReadingSchema = new mongoose.Schema({
  deviceId: { type: String, required: true, trim: true },
  location: { type: String, required: true, trim: true },
  temperature: { type: Number, required: true },
  humidity: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

sensorReadingSchema.index({ deviceId: 1, timestamp: -1 });

module.exports = mongoose.model("SensorReading", sensorReadingSchema);
