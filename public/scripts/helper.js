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
      // console.log("stop:",stop);
      
      // Adds Stop Text to Page
      var stopHtml = template( stop.stop_id || stop );
      $('#tour-stops').append(stopHtml);
      // console.log("stopHtml",stopHtml);

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
          markers.push({marker: marker, placeId: request.placeId});
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
      addTourListeners();
    }
  }); 
}

function addTourListeners() {
  var fieldsToToggle = ['#tourName','#update-tourName',
                        '#tourAuthor','#update-tourAuthor',
                        '#tourCity','#update-tourCity',
                        '#tourDescription', '#update-tourDescription',
                        '.update-tour-button','.edit-tour-button'];
  $('.edit-tour-button').on('click', function() {
    editButton(fieldsToToggle);
  });
  $('.update-tour-button').on('click', function() {
    updateTour(fieldsToToggle);
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

  //Hide marker from search functionality
  markers.forEach(function(element){  
    if (element.placeId === currentGooglePlacesId){
      element.marker.setMap(null);
      console.log('hidden');
    }
  });

  $.ajax({
    method: "POST",
    url: "/api/tours/"+ tourId+ "/stops",
    data: newStop,
    success: function(json){
      renderStops([json]);
      $('#stop-modal').modal('toggle');
      map.setZoom(12);
    }
  });

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

// Helper function to toggle fields based on a input array
function toggleFields(fieldArray,id) {
  if(id==undefined) {
    fieldArray.forEach(function(field, index) {
      $(field).toggle();
    });
  } else {
    fieldArray.forEach(function(field, index) {
      $('#'+id).find(field).toggle();
    });
  }
}

// When Edit button is pressed, toggle Fields
function editButton(fieldsToToggle) {
  toggleFields(fieldsToToggle);
}

// When Update Tour button is pressed, toggle Fields and update Tour in database
function updateTour(fieldsToToggle) {
  toggleFields(fieldsToToggle);
  var pathname = "/api" + $(location).attr('pathname');
  var formData = {
    name: $('#update-tourName').val(),
    author: $('#update-tourAuthor').val(),
    city: $('#update-tourCity').val(),
    description: $('#update-tourDescription').val(),
    imageUrl: $('#tourImage').val()
  }
  $.ajax({
    method: 'PUT',
    url: pathname,
    data: formData,
    success: updateTourSuccess
  });
}

//Delete stop from tour
function deleteStop(event){
  dis = this;
  var tour_id = $(this).closest('#page').find('.tour').attr('id');
  var stop_id = $(this).closest('.stop').attr('id');
  var place_id = $(this).closest('.stop').find('input').val();
  $.ajax({
    method: "DELETE",
    url: "/api/tours/" + tour_id + "/stops/" + stop_id,
    success: function(json){
      $('#' + stop_id).remove();
      markers.forEach(function(element){  
        if (element.placeId === place_id){
          element.marker.setMap(null);
          map.setZoom(12);
        }
      });
    }
  });
}

// When Update Tour is successful, render updated data to view
function updateTourSuccess(data) {
  var buttonString = " <button type='button' class='button edit-tour-button'>EDIT  TOUR</button>"
  $('#tourName').html(data.name);
  $('#tourCity').html('City: '+data.city);
  $('#tourAuthor').html('Author: '+data.author);
  $('#tourDescription').text(data.description);
}

// Toggles fields with EDIT STOP button is pressed
function editStop() {
  var fieldsToToggle = ['#stopNameId','#update-stopName',
                      '#stopDescription','#update-stopDescription',
                      '.edit-stop-button','.update-stop-button'];
  var id = $(this).closest('.stop').attr('id');
  toggleFields(fieldsToToggle,id);
}

// Toggles fields and sends data to db when UPDATE STOP is pressed
function updateStop() {
  var fieldsToToggle = ['#stopNameId','#update-stopName',
                      '#stopDescription','#update-stopDescription',
                      '.edit-stop-button','.update-stop-button'];
  var id = $(this).closest('.stop').attr('id');
  toggleFields(fieldsToToggle,id);
  var partialPathname = $(location).attr('pathname').replace(/\/$/, "") + '/';
  var pathname = "/api" + partialPathname +'stops/';
  var formData = {
    name: $('#update-stopName').val(),
    description: $('#update-stopDescription').val(),
    googlePlacesId: $('#google-place-id').val(),
    stopId: id
  }
  $.ajax({
    method: 'PUT',
    url: pathname,
    data: formData,
    success: updateStopSuccess
  });
}

// When Update Stop is successful, render updated data to view
function updateStopSuccess(data) {
  $('#stopNameId').html(data.name),
  $('#stopDescription').html(data.description);
}
