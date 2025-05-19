
const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema({
  name: String,
  city: String,
  details: String,
  map: String,
  image: String,
});




module.exports = mongoose.model("Restaurant", restaurantSchema);
