// This file allows us to seed our application with data
// simply run: `node seed.js` from the root of this project folder.

var db = require("./models");

var sampleTours = [{
  name: "Lily's Tour", 
  author: "Lily Cole", 
  city: "San Francisco", 
  description: "Welcome to my wonderful walking tour of the beautiful city of San Francisco.",
  imageUrl: "http://www.sftravel.com/sites/sftraveldev.prod.acquia-sites.com/files/field/image/site-photo.jpg"
},
{
  name: "Teddy's Tour", 
  author: "Teddy Coleman", 
  city: "San Francisco", 
  description: "Welcome to my mediocre walking tour of the beautiful city of San Francisco.",
  imageUrl: "http://kaprizhardwoodfloors.com/wp-content/uploads/2015/12/san-francisco.jpg"
}];

var sampleStops = [{
  name: "Coit Tower",
  description: "This is Coit Tower",
  googlePlacesId: "ChIJbyyyIfeAhYARmg3wBb7t4Ww"
},
{
  name: "Fort Mason",
  description: "This is Fort Mason",
  googlePlacesId: "ChIJl41BG9-AhYARQMAmg26toWo"
}];


db.Tour.remove();
db.Stop.remove();
db.TourStop.remove();

db.Tour.create(sampleTours, function(err, tours){
  if (err) { return console.log('ERROR', err); }

  db.Stop.create(sampleStops, function(err, stops){
    if (err) { return console.log('ERROR', err); }

    var tourStops = [{
      tour_id: tours[0]._id,
      stop_id: stops[0]._id,
      ord_num: 1
    },
    {
      tour_id: tours[0]._id,
      stop_id: stops[1]._id,
      ord_num: 2
    },
    {
      tour_id: tours[1]._id,
      stop_id: stops[0]._id,
      ord_num: 1
    }];

    db.TourStop.create(tourStops, function(err, stops){
      if (err) { return console.log('ERROR', err); }
    });
  });
});




