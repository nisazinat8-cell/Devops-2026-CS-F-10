const mongoose = require("mongoose");

let isConnected = false;

async function connectDB() {
  const uri =
    process.env.MONGO_URI ||
    "mongodb://127.0.0.1:27017/careerconnect";

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000,
    });
    isConnected = true;
    console.log("MongoDB connected:", mongoose.connection.name);
  } catch (error) {
    isConnected = false;
    console.warn("⚠️ MongoDB connection notice:", error.message);
    console.warn(
      "Server will continue running. For full database persistence, ensure MongoDB is started or set MONGO_URI in .env."
    );
  }
}

function isDBConnected() {
  return isConnected && mongoose.connection.readyState === 1;
}

module.exports = { connectDB, isDBConnected };
