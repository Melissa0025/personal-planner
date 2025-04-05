// server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Serve static files (e.g., uploaded attachments)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const fileRoutes = require("./routes/fileRoutes");

app.use("/auth", authRoutes);      // Matches frontend like /auth/login or /auth/register
app.use("/tasks", taskRoutes);     // Matches /tasks exactly as frontend uses
app.use("/files", fileRoutes);     // If you use file upload in the future

// Default PORT fallback
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
