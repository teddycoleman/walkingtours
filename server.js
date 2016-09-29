// require express and other modules
var express = require('express'),
    app = express();
app.set('view engine', 'ejs');

// parse incoming urlencoded form data
// and populate the req.body object
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

/************
 * DATABASE *
 ************/

var db = require('./models');

/**********
 * ROUTES *
 **********/

// Serve static files from the `/public` directory:
// i.e. `/images`, `/scripts`, `/styles`
app.use(express.static('public'));

/*
 * HTML endpoint
 */

//Get homepage
app.get('/', function(req,res){
	res.render(__dirname + '/views/pages/index');
});

//Get tour specific page
app.get('/tours/:id', function(req,res){
	db.Tour.findOne({_id: req.params.id}, function getOneTours(err,tour){
		res.render(__dirname + '/views/pages/tour', {tour: tour});
	});
});

//Get JSON for all tours
app.get('/api/tours/', function(req,res){
	db.Tour.find(function getAllTours(err,tours){
		res.json(tours);
	});
});

//Get info for one specific tour
app.get('/api/tours/:id', function(req,res){
	db.Tour.findOne({_id: req.params.id}, function getOneTours(err,tour){
		res.json(tour);
	});
});

//TODO : add route to get all stops for a tour
app.get('/api/tours/:id/stops', function(req,res){
	db.TourStops.find({tour_id: req.params.id}, function getTourStops(err,tourStops){
		res.json(tourStops);
	});
});

//Create new tour
app.post('/api/tours', function(req,res){
	var newTour = new db.Tour(req.body);
	newTour.save();
	res.send(newTour);
});


/**********
 * SERVER *
 **********/

// listen on port 3000
app.listen(process.env.PORT || 3000, function () {
  console.log('Express server is up and running on http://localhost:3000/');
});
