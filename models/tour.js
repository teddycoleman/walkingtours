var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var tourSchema = new Schema({
  name: String,
  author: String,
  city: String,
  description: String,
  imageUrl: String
});

var Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
