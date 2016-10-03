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
app.get(['/', '/tours'], function(req,res){
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

// '/api' API Endpoints
app.get('/api', function api_index(req, res) {
  res.json({
    message: "Here is the documentation for our Walking Tour Application",
    documentationUrl: "README.md", // Change this
    baseUrl: "", // Change this
    endpoints: [
      {method: "GET", path: "/api", description: "Describes all available endpoints"},
      {method: "GET", path: "/api/tours", description: "JSON for all tours"}, 
      {method: "GET", path: "/api/tours/:tour_id", description: "JSON info for one specific tour"}, 
      {method: "POST", path: "/api/tours", description: "Create a new tour"},
      {method: "PUT", path: "/api/tours/:tour_id", description: "Update a tour"},
      {method: "DELETE", path: "/api/tours/:tour_id", description: "Delete a tour"}, 
      {method: "GET", path: "/api/tours/:tour_id/stops", description: "JSON for all stops in a tour"},
      {method: "GET", path: "/api/tours/:tour_id/stops/:stop_id", description: "Get a specific stop"},
      {method: "POST", path: "/api/tours/:tour_id/stops", description: "Create a new stop"}, 
      {method: "PUT", path: "/api/tours/:tour_id/stops/:stop_id", description: "Update a stop"},
      {method: "DELETE", path: "/api/tours/:tour_id/stops/:stop_id", description: "Delete a stop"}
    ]
  })
});

//Get JSON for all tours
app.get('/api/tours/', function(req,res){
	db.Tour.find(function getAllTours(err,tours){
		res.json(tours);
	});
});

//Get info for one specific tour
app.get('/api/tours/:tour_id', function(req,res){
	db.Tour.findOne({_id: req.params.tour_id}, function getOneTours(err,tour){
		res.json(tour);
	});
});

//Create new tour
app.post('/api/tours', function(req,res){
  var newTour = new db.Tour(req.body);
  newTour.save();
  res.send(newTour);
});

// Update a tour
app.put('/api/tours/:tour_id', function updateTour(req, res) {
  db.Tour.findById(req.params.tour_id, function(err, updateTour){
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

// Delete a tour
app.delete('/api/tours/:tour_id', function deleteTour(req, res) {
  db.Tour.findByIdAndRemove(req.params.tour_id, function(err, removeTour){
    if (err) { throw(err) };
    res.json(removeTour);
  });
});

// Get all stops for a tour
app.get('/api/tours/:tour_id/stops', function(req,res){
	db.TourStop.find({tour_id: req.params.tour_id}).populate('stop_id').exec(function(err,tourStop){
		if(err){throw err;}
		res.send(tourStop);
	});
});

// Get a specific stop
app.get('/api/tours/:tour_id/stops/:stop_id', function findStop(req, res) {
  db.Stop.findOne({_id: req.params.stop_id}, function (err,stop){
    res.json(stop);
  });
});

//Create new stop
app.post('/api/tours/:tour_id/stops', function(req,res){
	var newStop = new db.Stop(req.body);
	newStop.save(function(err,stop){
		if (err){throw err};
		var tourStop = new db.TourStop({
			tour_id: req.params.tour_id,
			stop_id: stop._id
		});
		tourStop.save();
		res.json(newStop);
	});

});

// Update a stop
app.put('/api/tours/:tour_id/stops/:stop_id', function updateStop(req, res) {
  db.Stop.findById(req.params.stop_id, function(err, updateStop){
    if (err) { throw(err) };
    updateStop.name = req.body.name;
    updateStop.description = req.body.description;
    updateStop.googlePlacesId = req.body.googlePlacesId;
    updateStop.save();
    console.log("UpdateStop:",updateStop);  
    res.json(updateStop);
  });
});

//Delete a stop
app.delete('/api/tours/:tour_id/stops/:stop_id', function deleteStop(req, res) {
  db.Stop.findByIdAndRemove(req.params.stop_id, function(err, removeStop){
    if (err) { throw(err) };
    db.TourStop.findOneAndRemove({tour_id: req.params.tour_id , stop_id: req.params.stop_id}, function(err,removeTourStop){
    	if (err) { throw(err) };
    	res.json(204);
    });
  });
});


/**********
 * SERVER *
 **********/

// listen on port 3000
app.listen(process.env.PORT || 3000, function () {
  console.log('Express server is up and running on http://localhost:3000/');
});
