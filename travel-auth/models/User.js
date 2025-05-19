const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  mobile: String,
  email: { type: String, required: true, unique: true },
  pin: { type: String, required: true }, // Store hashed PIN
  plainPin: String // ⚠️ Only for testing!
});


module.exports = mongoose.model("User", userSchema);
