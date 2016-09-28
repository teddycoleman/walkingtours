// require express and other modules
var express = require('express'),
    app = express();

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

app.get('/', function(req,res){
	res.sendFile(__dirname + '/views/index.html');
});

app.get('/api/tours/', function(req,res){
	db.Tour.find(function getAllTours(err,tours){
		res.json(tours);
	});
});

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
