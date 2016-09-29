var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var stopSchema = new Schema({
  name: String,
  description: String, 
  googlePlacesId: String //Change later to Schema.Types.ObjectId
});

var Stop = mongoose.model('Stop', stopSchema);

module.exports = Stop;
