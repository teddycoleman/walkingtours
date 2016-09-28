
var sampleTours = [{
  name: "Lily's Tour", 
  author: "Lily Cole", 
  city: "San Francisco", 
  description: "Welcome to my wonderful walking tour of the beautiful city of San Francisco.",
  image_url: "http://www.sftravel.com/sites/sftraveldev.prod.acquia-sites.com/files/field/image/site-photo.jpg"
},
{
  name: "Teddy's Tour", 
  author: "Teddy Coleman", 
  city: "San Francisco", 
  description: "Welcome to my mediocre walking tour of the beautiful city of San Francisco.",
  image_url: "http://kaprizhardwoodfloors.com/wp-content/uploads/2015/12/san-francisco.jpg"
}];


function renderTours(tourArray){
  var source = $('#tour-template').html();
  var template = Handlebars.compile(source);
  var tourHtml = template({ tour: tourArray });

  // append html to the view
  $('#walking-tours').append(tourHtml);
}

renderTours(sampleTours);

