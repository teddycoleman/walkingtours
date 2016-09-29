
$(document).ready(function() {

  showTourInfo();
  showStops();

  $('#add-new-stop').on('click', function(){
    $('#stop-modal').modal();
  });

  $('#save-stop').on('click', createNewStop);
  $('#delete-tour-button').on('click', deleteTour);

  //Init Google Maps API 
  initMap();

  var currentGooglePlacesId = "";

});


//Refactor TODO: change this to jQuery
function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 37.7749, lng: -122.4194},
    zoom: 13
  });

  var input = document.getElementById('pac-input');

  var autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.bindTo('bounds', map);

  document.getElementById('add-stop').appendChild(input);

  var infowindow = new google.maps.InfoWindow();
  var marker = new google.maps.Marker({
    map: map
  });
  marker.addListener('click', function() {
    infowindow.open(map, marker);
  });

  autocomplete.addListener('place_changed', function() {
    infowindow.close();
    var place = autocomplete.getPlace();
    if (!place.geometry) {
      return;
    }

    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17);
    }

    // Set the position of the marker using the place ID and location.
    marker.setPlace({
      placeId: place.place_id,
      location: place.geometry.location
    });
    marker.setVisible(true);

    infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
        'Place ID: ' + place.place_id + '<br>' +
        place.formatted_address);
    currentGooglePlacesId = place.place_id;
    infowindow.open(map, marker);
  });
}

