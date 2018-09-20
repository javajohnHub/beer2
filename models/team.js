var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var TeamSchema = new Schema({
  name: String,
  p1: String,
  p2: String,
  score: { type: Number, min: 0 }
});

// Compile model from schema
module.exports = mongoose.model("TeamModel", TeamSchema);
