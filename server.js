const express = require("express");
const multer = require("multer");

const app = express();
const authenticateToken = require("./src/middleware/verifyToken");
const profileRoutes = require("./src/routes/profileRoutes");
const root = require("./src/routes/root");
const authRoutes = require("./src/routes/authRoutes");
const snackRoutes = require("./src/routes/snackRoutes");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(root);
app.use("/auth", authRoutes);
app.use("/snack", authenticateToken, snackRoutes);
app.use("/profile", authenticateToken, profileRoutes(upload));

// Middleware untuk menangani rute yang tidak ditemukan
app.use((req, res, next) => {
  res.status(404).json({
    status: "fail",
    message: "Route not found",
  });
  next();
});

// Middleware untuk penanganan error global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: "error",
    message: "Internal server error",
  });
  next();
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running ${PORT}`);
});
