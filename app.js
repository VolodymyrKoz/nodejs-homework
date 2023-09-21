const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const mongoose = require("./config/mongoose");
const multer = require("multer");
const fs = require("fs/promises"); // Import the 'fs/promises' module for file operations

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
    cb(null, "tmp/"); // Store temporary files in the 'tmp' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// File Upload Route
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    // File processing logic here

    // Move the processed file to the 'public/avatars' folder
    const tmpFilePath = req.file.path;
    const destinationPath = `public/avatars/${req.file.filename}`;
    await fs.rename(tmpFilePath, destinationPath);

    // Delete the 'tmp' folder (since the file has been successfully processed)
    await fs.rm("tmp", { recursive: true });

    res.send("File uploaded and processed successfully");
  } catch (error) {
    console.error("Error processing file:", error);
    res.status(500).json({ message: "Error processing file" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
