const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const authenticateToken = require("./middleware/authenticateToken");

const app = express();

mongoose.connect("mongodb://localhost/your-database-name", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());

app.use("/users", authRoutes); 
app.use("/users", authenticateToken, userRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
