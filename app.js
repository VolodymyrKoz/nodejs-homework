/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const mongoose = require("./config/mongoose");
const multer = require("multer");
const fs = require("fs/promises");
const nodemailer = require("nodemailer"); // Import nodemailer for sending emails

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

// Define the User model
const userSchema = new mongoose.Schema({
  // ... other user fields
  email: {
    type: String,
    unique: true,
    required: true,
  },
  verify: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
    required: [true, "Verify token is required"],
  },
});

const User = mongoose.model("User", userSchema);

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
    cb(null, "tmp/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// File Upload Route
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const tmpFilePath = req.file.path;
    const destinationPath = `public/avatars/${req.file.filename}`;
    await fs.rename(tmpFilePath, destinationPath);

    await fs.rm("tmp", { recursive: true });

    res.send("File uploaded and processed successfully");
  } catch (error) {
    console.error("Error processing file:", error);
    res.status(500).json({ message: "Error processing file" });
  }
});

// Step 2: Verification Endpoint
app.get("/users/verify/:verificationToken", async (req, res) => {
  const { verificationToken } = req.params;

  try {
    const user = await User.findOneAndUpdate(
      { verificationToken },
      { verify: true, verificationToken: null },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "Verification successful" });
  } catch (error) {
    console.error("Error verifying user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Step 3: Send Verification Email
app.post("/register", async (req, res) => {
  const { email } = req.body;

  try {
    const verificationToken = generateVerificationToken();

    const user = new User({
      email,
      verificationToken,
    });

    await user.save();

    const mailOptions = {
      from: "my-email-username",
      to: email,
      subject: "Verify Your Email",
      text: `Click the following link to verify your email: http://your-app-url/users/verify/${verificationToken}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending verification email:", error);
      } else {
        console.log("Verification email sent:", info.response);
      }
    });

    res
      .status(201)
      .json({ message: "User registered. Verification email sent." });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Step 4: Resend Verification Email
app.post("/users/verify", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.verify) {
      return res
        .status(400)
        .json({ message: "Verification has already been passed" });
    }

    // eslint-disable-next-line no-undef
    const verificationToken = generateVerificationToken();

    user.verificationToken = verificationToken;
    await user.save();

    const mailOptions = {
      from: "my-email-username",
      to: email,
      subject: "Resend Verification Email",
      text: `Click the following link to verify your email: http://your-app-url/users/verify/${verificationToken}`,
    };

    // eslint-disable-next-line no-undef
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending verification email:", error);
      } else {
        console.log("Verification email sent:", info.response);
      }
    });

    res.status(200).json({ message: "Verification email sent" });
  } catch (error) {
    console.error("Error resending verification email:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
