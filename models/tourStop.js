var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var tourStopSchema = new Schema({
  tour_id: String,
  stop_id: String,
  ord_num: Number
});

var TourStop = mongoose.model('TourStop', tourStopSchema);

module.exports = TourStop;