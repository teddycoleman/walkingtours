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


db.Tour.remove({}, function(err, albums){

  db.Tour.create(sampleTours, function(err, tours){
    if (err) { return console.log('ERROR', err); }
    console.log("all tours:", tours);
    console.log("created", tours.length, "tours");
    process.exit();
  });

});
