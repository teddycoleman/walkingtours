var mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/walkingtours");

var Tour = require('./tour');

module.exports.Tour = Tour;

