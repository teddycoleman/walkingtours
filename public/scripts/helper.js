// Renders Tours to display on Page
function renderTours(tourArray){
  var source = $('#tour-template').html();
  var template = Handlebars.compile(source);
  var tourHtml = template({ tour : tourArray });
  $('#walking-tours').append(tourHtml);
}

// Creates a new Tour, updates view on Page
function createNewTour(event){
  var newTour = {
    name: $('#tourName').val(),
    author: $('#author').val(),
    city: $('#city').val(),
    description: $('#description').val(),
    imageUrl: $('#image-url').val()
  };

  $.ajax({
    method: "POST",
    url: "/api/tours/",
    data: newTour,
    success: function(json){
      renderTours([json]);
      var id = json._id;
      $('#tour-modal').modal('toggle');
      $(location).attr('href','tours/' + id)
    }
  });
}

// Shows Stops by grabbing from database
function showStops() {
  var partialPathname = $(location).attr('pathname').replace(/\/$/, "") + '/';
  var pathname = "/api" + partialPathname + "stops";
  $.ajax({
    method: "GET",
    url: pathname,
    success: renderStops
  });  
}

// Renders Stops to display on the Page - Text and on Map
function renderStops(stopArray){
  var source = $('#stop-template').html();
  var template = Handlebars.compile(source);


  stopArray.forEach(function (stop, index) {
      console.log(stop);
      
      // Adds Stop Text to Page
      var stopHtml = template( stop.stop_id || stop );
      $('#tour-stops').append(stopHtml);

      // Adds Stop Markers to Map
      var placeId = !!(stop.stop_id) ? stop.stop_id.googlePlacesId : stop.googlePlacesId;
      // Use placeId for the request
      var request = {
        placeId: placeId
      }
      // Use service to grab info for the placeId and put on the map
      service.getDetails(request, function(place, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          var marker = new google.maps.Marker({
            map: map,
            position: place.geometry.location
          });
          google.maps.event.addListener(marker, 'click', function() {
            infowindow.setContent(place.name);
            infowindow.open(map, this);
          });
        }
      });
  });
}

// Shows specific Tour Information on Tour Page
function showTourInfo() {
  var pathname = "/api" + $(location).attr('pathname');
  $.ajax({
    method: "GET",
    url: pathname,
    success: function(data) {
      renderTours([data]);
      $('.edit-tour-button').on('click', editTour);
      $('.update-tour-button').on('click', updateTour);
    }
  }); 
}

// Creates a new Stop, updates view on Page
function createNewStop(event){
  var tourId = $('.tour-container').find('.tour').attr('id');

  var newStop = {
    name: $('#stopName').val(),
    description: $('#description').val(),
    googlePlacesId: currentGooglePlacesId
  };

  $.ajax({
    method: "POST",
    url: "/api/tours/"+ tourId+ "/stops",
    data: newStop,
    success: function(json){
      renderStops([json]);
      $('#stop-modal').modal('toggle');
    }
  })

}

// Deletes Tour from database and redirects user back to HomePage
function deleteTour() {
  var pathname = "/api" + $(location).attr('pathname');
  $.ajax({
    method: 'DELETE',
    url: pathname,
    data: $(this).serializeArray(),
    success: function() {
      $(location).attr('href','/')
    }
  });
}

// Toggles Fields for Editing Tour Information
function toggleEditFields() {
  $('#tourName').toggle();
  $('#update-tourName').toggle();
  $('#tourAuthor').toggle();
  $('#update-tourAuthor').toggle();
  $('#tourCity').toggle();
  $('#update-tourCity').toggle();
  $('#tourDescription').toggle();
  $('#update-tourDescription').toggle();
  $('.update-tour-button').toggle();
  $('.edit-tour-button').toggle();
}

// When Edit Tour button is pressed, toggle Fields
function editTour() {
  toggleEditFields();
}

// When Update Tour button is pressed, toggle Fields and update Tour in database
function updateTour() {
  toggleEditFields();
  var pathname = "/api" + $(location).attr('pathname');
  var formData = {
    name: $('#update-tourName').val(),
    author: $('#update-tourAuthor').val(),
    city: $('#update-tourCity').val(),
    description: $('#update-tourDescription').val(),
    imageUrl: $('#tourImage').val()
  }
  console.log("formData:",formData);
  $.ajax({
    method: 'PUT',
    url: pathname,
    data: formData,
    success: function() {
      console.log("successfully updated!");
    }
  });
}
