const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const root = require("./src/routes/root");
const authRoutes = require("./src/routes/authRoutes");
const snackRoutes = require("./src/routes/snackRoutes");

app.use(root);
app.use("/auth", authRoutes);
app.use("/snack", snackRoutes);

// Middleware untuk menangani rute yang tidak ditemukan
app.use((req, res, next) => {
  res.status(404).json({
    status: "fail",
    message: "Rute tidak ditemukan",
  });
  next();
});

// Middleware untuk penanganan error global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: "error",
    message: "Terjadi kesalahan pada server",
  });
  next();
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});
