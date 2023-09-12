// models/user.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// User schema
const userSchema = new Schema({
  password: {
    type: String,
    required: [true, "Set password for user"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter",
  },
  token: String,
});

// Contact schema
const contactSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name is required for a contact"],
  },
  phone: {
    type: String,
    required: [true, "Phone number is required for a contact"],
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User", 
  },
});

const Contact = mongoose.model("Contact", contactSchema);
const User = mongoose.model("User", userSchema);

module.exports = { User, Contact };
