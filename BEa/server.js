
// Deploy-ready server.js for Azure App Service (Node 20+)
// - Removes dependency on `config` package
// - Reads JWT_PRIVATE_KEY and MONGODB_URI from environment variables
// - Uses Azure-assigned PORT
// - Clean CORS handling

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// =============================
// Environment Variables
// =============================
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;
const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY;
const CORS_ORIGINS = process.env.CORS_ORIGINS || "";

// =============================
// Validate Required Env Vars
// =============================
if (!JWT_PRIVATE_KEY) {
  console.error("FATAL ERROR: JWT_PRIVATE_KEY is not defined.");
  process.exit(1);
}

if (!MONGODB_URI) {
  console.error("FATAL ERROR: MONGODB_URI is not defined.");
  process.exit(1);
}

// =============================
// Middleware
// =============================
app.use(express.json());

// CORS configuration
const allowedOrigins = CORS_ORIGINS.split(",")
  .map(origin => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins.length ? allowedOrigins : true
  })
);

// =============================
// Database Connection
// =============================
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch(err => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// =============================
// Basic Health Route
// =============================
app.get("/", (req, res) => {
  res.status(200).send("API is running ✅");
});

// =============================
// Start Server
// =============================
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
