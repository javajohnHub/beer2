var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var TeamSchema = new Schema({
  name: String,
  p1: String,
  p2: String,
  score: Number
});

// Compile model from schema
module.exports = mongoose.model("Team", TeamSchema);
