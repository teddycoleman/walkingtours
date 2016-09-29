var mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/walkingtours");

var Tour = require('./tour');
var Stop = require('./stop');

module.exports.Tour = Tour;
module.exports.Stop = Stop;

