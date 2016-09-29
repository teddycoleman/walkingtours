var mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/walkingtours");

var Tour = require('./tour');
var Stop = require('./stop');
var TourStop = require('./tourStop');

module.exports.Tour = Tour;
module.exports.Stop = Stop;
module.exports.TourStop = TourStop;

