const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authenticateToken");

router.get("/current", authenticateToken, async (req, res) => {
  try {
    const { email, subscription } = req.user;

    res.status(200).json({ email, subscription });
  } catch (error) {
    res.status(401).json({ message: "Not authorized" });
  }
});

module.exports = router;
