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
 * HTML endpoints
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

/*
 * JSON endpoints
 */

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

//Get all stops for a tour
app.get('/api/tours/:id/stops', function(req,res){
	db.TourStop.find({tour_id: req.params.id}).populate('stop_id').exec(function(err,tourStop){
		if(err){throw err;}
		res.send(tourStop);
	});
});

//Create new stop
app.post('/api/tours/:id/stops', function(req,res){
	var newStop = new db.Stop(req.body);
	newStop.save(function(err,stop){
		if (err){throw err};
		var tourStop = new db.TourStop({
			tour_id: req.params.id,
			stop_id: stop._id
		});
		tourStop.save();
		res.json(newStop);
	});

});

//Create new tour
app.post('/api/tours', function(req,res){
	var newTour = new db.Tour(req.body);
	newTour.save();
	res.send(newTour);
});

// Delete a tour
app.delete('/api/tours/:id', function deleteTour(req, res) {
  db.Tour.findByIdAndRemove(req.params.id, function(err, removeTour){
    if (err) { throw(err) };
    res.json(removeTour);
  });
});

// Update a tour
app.put('/api/tours/:id', function updateTour(req, res) {
  db.Tour.findById(req.params.id, function(err, updateTour){
    if (err) { throw(err) };
    updateTour.name = req.body.name;
    updateTour.author = req.body.author;
    updateTour.city = req.body.city;
    updateTour.description = req.body.description;
    updateTour.imageUrl = req.body.imageUrl;
    updateTour.save();
    res.json(updateTour);
  });
});

/**********
 * SERVER *
 **********/

// listen on port 3000
app.listen(process.env.PORT || 3000, function () {
  console.log('Express server is up and running on http://localhost:3000/');
});
