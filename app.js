const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const mongoose = require("./config/mongoose");
const multer = require("multer");

const app = express();
const port = process.env.PORT || 3000;

// Middleware configuration
const formatsLogger = app.get("env") === "development" ? "dev" : "short";
app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

// MongoDB connection
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// API Routes
const contactsRouter = require("./routes/api/contacts");
app.use("/api/contacts", contactsRouter);

// 404 Not Found Middleware
app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

// File Upload Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// File Upload Route
app.post("/upload", upload.single("file"), (req, res) => {
  res.send("File uploaded successfully");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
