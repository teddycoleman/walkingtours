var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Tour = require('./tour');
var Stop = require('./stop');

var tourStopSchema = new Schema({
  tour_id: {type: Schema.Types.ObjectId, ref: 'Tour'},
  stop_id: {type: Schema.Types.ObjectId, ref: 'Stop'},
  ord_num: Number
});

var TourStop = mongoose.model('TourStop', tourStopSchema);

module.exports = TourStop;