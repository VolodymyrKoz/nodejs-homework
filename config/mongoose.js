// mongoose.js

const mongoose = require('./mongoose');


mongoose
  .connect("mongodb://localhost/contacts-db", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("Database connection successful");
  })
  .catch((error) => {
    console.error("Database connection error:", error);
    process.exit(1);
  });

module.exports = mongoose; 
