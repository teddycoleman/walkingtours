var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var TourSchema = new Schema({
  name: String,
  author: String,
  city: String,
  description: String,
  imageUrl: String
});

var Tour = mongoose.model('Tour', TourSchema);

module.exports = Tour;
