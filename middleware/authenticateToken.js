const jwt = require("jsonwebtoken");
const { User } = require("../models/user");

const authenticateToken = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");

    const decoded = jwt.verify(token, "your-secret-key"); // Replace 'your-secret-key' with your actual JWT secret key

    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });

    if (!user) {
      throw new Error();
    }

    req.user = user;
    req.token = token;

    next(); 
  } catch (error) {
    res.status(401).json({ message: "Not authorized" });
  }
};

module.exports = authenticateToken;
