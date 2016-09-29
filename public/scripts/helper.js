function renderTours(tourArray){
  var source = $('#tour-template').html();
  var template = Handlebars.compile(source);
  var tourHtml = template({ tour : tourArray });
  $('#walking-tours').append(tourHtml);
}

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

function showStops() {
  var partialPathname = $(location).attr('pathname').replace(/\/$/, "") + '/';
  var pathname = "/api" + partialPathname + "stops";
  $.ajax({
    method: "GET",
    url: pathname,
    success: renderStops
  });  
}

function renderStops(stopArray){
  var source = $('#stop-template').html();
  var template = Handlebars.compile(source);
  console.log(stopArray);

  stopArray.forEach(function (stop, index) {
      console.log(stop);
      //Append to the informational part of the screen
      var stopHtml = template( stop.stop_id || stop );
      $('#tour-stops').append(stopHtml);

      //Append to the maps part of the screen
      var placeId = !!(stop.stop_id) ? stop.stop_id.googlePlacesId : stop.googlePlacesId;
      //Use placeId for the request
      var request = {
        placeId: placeId
      }
      //Use service to grab info for the placeId and put on the map
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

function showTourInfo() {
  var pathname = "/api" + $(location).attr('pathname');
  $.ajax({
    method: "GET",
    url: pathname,
    success: function(data) {
      renderTours([data]);
    }
  }); 
}

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


