// This file allows us to seed our application with data
// simply run: `node seed.js` from the root of this project folder.

var db = require("./models");

var sampleTours = [{
  name: "Ferry Building and Filbert Steps", 
  author: "Lily Cole", 
  city: "San Francisco", 
  description: "Journey from the bustling Ferry Building up the Filbert Steps to Coit Tower and back down to historic North Beach for great food, dining and people-watching!",
  imageUrl: "http://i.imgur.com/zJasBoN.jpg"
},
{
  name: "Bridge to Beaches", 
  author: "Teddy Coleman", 
  city: "San Francisco", 
  description: "Start your tour marveling at the beauty of the famous Golden Gate Bridge the wind your way down the Coastal Trail past a SF's breathtaking beaches, through Land's End and end at the historical Sutro Baths.",
  imageUrl: "http://www.sftravel.com/sites/sftraveldev.prod.acquia-sites.com/files/field/image/site-photo.jpg"
},
{
  name: "Haight and Heights",
  author: "Cole and Coleman",
  city: "San Francisco",
  description: "Hippies, hiking, and SF history is all included on this city walk!",
  imageUrl: "https://static1.squarespace.com/static/5257119ee4b0d94e6ffa1641/5526e83ee4b0f620d0c7a39d/5526e898e4b0f3861cdda410/1428613277709/04HaightToHeights-HaightVictorians.jpg"
},
{
  name: "Puppy Playtime",
  author: "Theo",
  city: "San Francisco",
  description: "Check out a pup's favorite places in SF!",
  imageUrl: "http://i.imgur.com/1XnlmtB.png"
}];

var ferryFilbertStops = [
 {
  name: "San Francisco Ferry Building",
  description: "Browse the various local stands and go on Tuesdays, Thursday and Saturdays for the outdoor Farmer's Market!",
  googlePlacesId: "ChIJu1XQjGaAhYAR966C7JnAu5w"
},
{
  name: "Exploratorium",
  description: "If you have time, stop by and place with Science at this museum great for both children and adults.",
  googlePlacesId: "ChIJk2vl5NSGhYARwPGvs_ubIws"
},
 {
  name: "Filbert Street Steps",
  description: "Trek up the 284 wooden steps through this hidden garden neighborhood. Don't forget to wear your hiking shoes.",
  googlePlacesId: "ChIJQ88A9PaAhYAR0f5SuyAsC6U"
},
 {
  name: "Coit Tower",
  description: "Atop Telegraph Hill, this is a great place for scenic views!",
  googlePlacesId: "ChIJS8gL3_aAhYARJJZhueLHPWQ"
},
 {
  name: "Mario's Bohemian Cigar Store Cafe",
  description: "Stop in for a drink and one of their famous meatball subs on fresh focaccia from Liguria Bakery.",
  googlePlacesId: "ChIJr6IFZPGAhYAR5e3y0GGJp8w"
},
 {
  name: "Vesuvio Cafe",
  description: "Another great bar for people watching and atmosphere. A favorite stop for the Beat Poets that defined the generation.",
  googlePlacesId: "ChIJT2cmiPSAhYARwyhb3VgcriM"
}];

var bridgeBeachesStops = [
 {
  name: "Golden Gate Bridge",
  description: "Start at the Southern viewpoint of the Golden Gate Bridge and marvel at this engineering beauty.",
  googlePlacesId: "ChIJ5wYsQ5CGhYARvbU9mB9gyfo"
},
{
  name: "Marshall's Beach",
  description: "Hike down to this secluded beach with views of the ocean and Golden Gate Bridge.",
  googlePlacesId: "ChIJV4g15e-GhYARjj6jFkR4b7Q"
},
 {
  name: "Baker Beach",
  description: "This long stretch of beach is one of SF's finest! Stop and chat with local fisherman and crabbers. Beware of the 'clothing optional' North end. ;)",
  googlePlacesId: "ChIJp_hAi_yGhYARGdXAfU1rPYs"
},
 {
  name: "Eagle's Point",
  description: "Once you enter Land's End, take a breather at Eagle's Point for another great vista.",
  googlePlacesId: "ChIJF0vT1aqHhYARd3eXfOZLYYI"
},
 {
  name: "Sutro Baths",
  description: "Site of the once-elaborate famous bathing house. Walk in an among the ruins as the waves wash up at your feet.",
  googlePlacesId: "ChIJszBPbLWHhYARfrlLxEb3GuA"
},
 {
  name: "Cliff House",
  description: "Treat yourself to a well-deserved cocktail with a view. Hopefully you can coordinate this drink with the setting sun, to get a great oceanside sunset.",
  googlePlacesId: "ChIJ7dtznbWHhYAR81fEwzi58F4"
}];

var haightHeightsStops = [
 {
  name: "Decades Of Fashion",
  description: "Relive the fashion of the Summer of Love with authentic vintage duds!",
  googlePlacesId: "ChIJwcCmSlKHhYARdN4Ikve1FaI"
},
{
  name: "Ben & Jerry's",
  description: "Located on this iconic corner, get that postcard photo and a tasty treat at the same time.",
  googlePlacesId: "ChIJsbMzM1OHhYAR-htwK_E89Ro"
},
 {
  name: "Piedmont Boutique",
  description: "Your one-stop costume shop with all clothing made in-house. So fabulous you have to see it to believe it!",
  googlePlacesId: "ChIJwW2UzqyAhYARLN-vF230nsE"
},
 {
  name: "Buena Vista Park",
  description: "Hike this peaceful green hilltop to get fantastic views of the city.",
  googlePlacesId: "ChIJc-fv16uAhYARQNxL3WZRYHw"
},
 {
  name: "Corona Heights Park",
  description: "Summit one last peak for a view that you will never forget. We promise; it's worth it.",
  googlePlacesId: "ChIJX3DWQgJ-j4ARxWqSTDOy_CU"
},
 {
  name: "Hot Cookie",
  description: "Now that you've reached the Castro and topped two sizable hills, reward yourself with a fresh-based cookie.",
  googlePlacesId: "ChIJnRGRVht-j4AR8meAbWNMBFw"
}];

var puppyPlaytimeStops = [
 {
  name: "Corona Heights Park",
  description: "Corona Heights is great for humans and pups alike -- boasting some of SF's greatest views and complete with fenced in puppy-park for the furries.",
  googlePlacesId: "ChIJX3DWQgJ-j4ARxWqSTDOy_CU"
},
{
name: "Bernal Heights Park",
description: "Dogs can run off-leash on top of Bernal -- and so many do! Weave up and around the many winding paths of Bernal and let your dog romp with all the other doggie pals.",
googlePlacesId: "ChIJjTkBklp-j4AR07A96zWiYfY"
},
 {
  name: "Fort Funston",
  description: "Another perfect off-leash haven for our four-legged friends. Roll around in the sand and get your feet wet in the beautiful Pacific Ocean!",
  googlePlacesId: "ChIJazyNlAR9j4ARzE6pzUtJWyw"
},
 {
  name: "Jay'n Bee Club",
  description: "Stop off for a drink at Jay'n Bee where they're known for their love of furry friends!",
  googlePlacesId: "ChIJIymP8jZ-j4ARG2AaZxrmZec"
}];

db.Tour.remove({});
db.Stop.remove({});
db.TourStop.remove({});

db.Tour.create(sampleTours, function(err, tours){
  if (err) { return console.log('ERROR', err); }

  var tourStops = [];

  db.Stop.create(ferryFilbertStops, function(err, stops){
    if (err) { return console.log('ERROR', err); }

    for (i = 0; i < 6; i++){
      tourStops.push({
        tour_id: tours[0]._id, //tours[0] = Ferry Building and Filbert Steps
        stop_id: stops[i]._id,
        ord_num: i
      });
    }
    // end ferry
    db.Stop.create(bridgeBeachesStops, function(err, stops){
      if (err) { return console.log('ERROR', err); }

      for (i = 0; i < 6; i++){
        tourStops.push({
          tour_id: tours[1]._id, //tours[1] = Bridge to Beaches
          stop_id: stops[i]._id,
          ord_num: i
        });
      }
      // end bridge
      db.Stop.create(haightHeightsStops, function(err, stops){
        if (err) { return console.log('ERROR', err); }

        for (i = 0; i < 6; i++){
          tourStops.push({
            tour_id: tours[2]._id, //tours[2] = Haight to Heights
            stop_id: stops[i]._id,
            ord_num: i
          });
        }
        // end haight
        db.Stop.create(puppyPlaytimeStops, function(err, stops){
        if (err) { return console.log('ERROR', err); }

        for (i = 0; i < 4; i++){
          tourStops.push({
            tour_id: tours[3]._id, //tours[3] = Puppy Playtime
            stop_id: stops[i]._id,
            ord_num: i
          });
        }
        // end puppy
          db.TourStop.create(tourStops, function(err, stops){
            if (err) { return console.log('ERROR', err); }
          });
        }); //end puppy
      }); //end haight
    }); //end beaches
  }); //end ferry

});
