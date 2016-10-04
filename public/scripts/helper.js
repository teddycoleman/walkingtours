//Declare universal variables
var map;
var markers = [];
var service;
var infowindow;
var currentGooglePlace = {};
var directionsService;
var directionsDisplay;

/*
 * Functions for rendering TOUR on page (some shared by both pages)
 */ 

// Renders Tours to display on Page
function renderTours(tourArray){
  var source = $('#tour-template').html();
  var template = Handlebars.compile(source);
  var tourHtml = template({ tour : tourArray });
  $('#walking-tours').append(tourHtml);
}

// Creates a new Tour, updates view on Page
function createNewTour(event){
  event.preventDefault();
  //Get inputs from modal
  var newTour = {
    name: $('#tourName').val(),
    author: $('#author').val(),
    city: $('#city').val(),
    description: $('#description').val(),
    imageUrl: $('#image-url').val()
  };
  //Post new tour to the server
  $.ajax({
    method: "POST",
    url: "/api/tours/",
    data: newTour,
    success: function(json){
      renderTours([json]);
      var id = json._id;
      $('#tour-modal').modal('toggle');
      //Take user to the newly generated tour page
      $(location).attr('href','tours/' + id)
    }
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
      $('.tour-container').css('cursor','auto');
    }
  }); 
}

// Add Listeners for Tour Edit and Update buttons
function addTourListeners() {
  var fieldsToToggle = ['#tourNameDisplay','#update-tourName',
                        '#tourAuthor','#update-tourAuthor',
                        '#tourCity','#update-tourCity',
                        '#tourDescription', '#update-tourDescription',
                        '.update-tour-button','.edit-tour-button'];
  $('.edit-tour-button').on('touchstart click', function() {
    editButton(fieldsToToggle);
  });
  $('.update-tour-button').on('touchstart click', function() {
    updateTour(fieldsToToggle);
  });
}

/*
 * Functions for STOPS on tourpage 
 */ 

// Shows Stops by grabbing from database
function showStops() {
  var partialPathname = $(location).attr('pathname').replace(/\/$/, "") + '/';
  var pathname = "/api" + partialPathname + "stops";
  //Request stops on tour from server and render on page
  $.ajax({
    method: "GET",
    url: pathname,
    success: renderStops
  });  
}

// Renders Stops to display on the Page - Text and on Map
function renderStops(stopArray){
  //Initialize handlebars
  var source = $('#stop-template').html();
  var template = Handlebars.compile(source);

  stopArray.forEach(function (stop, index) {
    $("#pac-input").val('');  
    
    // Adds Stop Text to Page
    var stopHtml = template( stop.stop_id || stop );
    $('#tour-stops').append(stopHtml);

    // Adds Stop Markers to Map
    var placeId = !!(stop.stop_id) ? stop.stop_id.googlePlacesId : stop.googlePlacesId;
    // Use placeId for the request
    var request = {
      placeId: placeId
    }

    // Use Google service to grab info for the placeId and put on the map
    service.getDetails(request, function(place, status) {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        var marker = new google.maps.Marker({
          map: map,
          position: place.geometry.location
        });

        //Store info in array for later use
        var markersIndex = stopArray.length > 1 ? index : markers.length;
        markers.push({marker: marker, name: place.name, placeId: request.placeId, order: markersIndex});

        //Add markers to the map
        google.maps.event.addListener(marker, 'touchstart click', function() {
          infowindow.setContent(place.name);
          infowindow.open(map, this);
        });
        //Center map on the marker
        map.setCenter(marker.getPosition());

        //Render route only if the last marker has been placed on the map
        if(markers.length >= stopArray.length){
          showRoute();
        }  
      }
    });
  });
}

// Creates a new Stop, updates view on Page
function createNewStop(event){
  var tourId = $('.tour-container').find('.tour').attr('id');

  //Get info from modal
  var newStop = {
    name: $('#stopName').val(),
    description: $('#description').val(),
    googlePlacesId: currentGooglePlace.placeId
  };

  //Hide marker from search functionality
  markers.forEach(function(element){  
    if (element.placeId === currentGooglePlace.placeId){
      element.marker.setMap(null);
    }
  });

  //Clear out modal
  $('.modal').find('#stopName').val('');
  $('.modal').find('#description').val('');

  //Ajax call to post new stop to DB
  $.ajax({
    method: "POST",
    url: "/api/tours/"+ tourId+ "/stops",
    data: newStop,
    success: function(json){
      renderStops([json]);
      $('#stop-modal').modal('toggle');
      map.setZoom(12);
      $(location).attr('href', $(location).attr('pathname')+ '#' + json._id);
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
  //Update new data in the db
  $.ajax({
    method: 'PUT',
    url: pathname,
    data: formData,
    success: updateTourSuccess
  });
}

//Delete stop from tour
function deleteStop(event){
  //Prep url for the ajax call
  var tour_id = $(this).closest('#page').find('.tour').attr('id');
  var stop_id = $(this).closest('.stop').attr('id');
  var place_id = $(this).closest('.stop').find('input').val();
  //Delete from the DB
  $.ajax({
    method: "DELETE",
    url: "/api/tours/" + tour_id + "/stops/" + stop_id,
    success: function(json){
      $('#' + stop_id).remove();
      var eliminate;
      //Remove the marker from the map
      markers.forEach(function(element,index){ 
        if (element.placeId === place_id){
          element.marker.setMap(null);
          map.setZoom(12);
          eliminate = index;
        }
      });
      markers.splice(eliminate,1);
      markers = orderArray(markers);
      showRoute();
    }
  });
}

//Helper function to ensure all elements in the array are ordered properly
function orderArray(array){
  var newArray = [];
  for(i = 0; i < array.length; i++){
    if (array[i].order === i){
      newArray.push(array[i]);
    }
    else{
      var newElement = {
        marker: array[i].marker, 
        name: array[i].name, 
        placeId: array[i].placeId, 
        order: i
      }
      newArray.push(newElement);
    }
  }
  return newArray;
}

// When Update Tour is successful, render updated data to view
function updateTourSuccess(data) {
  $('#tourNameDisplay').html(data.name);
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
function updateStop(event) {
  event.preventDefault();
  var fieldsToToggle = ['#stopNameId','#update-stopName',
                      '#stopDescription','#update-stopDescription',
                      '.edit-stop-button','.update-stop-button'];
  var stop_id = $(this).closest('.stop').attr('id');
  var tour_id = $('.tour').attr('id');
  toggleFields(fieldsToToggle,stop_id);
  var partialPathname = $(location).attr('pathname').replace(/\/$/, "") + '/';
  var pathname = "/api" + partialPathname +'stops/'+stop_id;
  var formData = {
    name: $('#'+stop_id).find('#update-stopName').val(),
    description: $('#'+stop_id).find('#update-stopDescription').val(),
    googlePlacesId: $('#'+stop_id).find('#google-place-id').val(),
    stopId: stop_id
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
  var stop_id = data._id;
  $('#'+stop_id).find('#stopNameId').html(data.name),
  $('#'+stop_id).find('#stopDescription').html(data.description);
}

function backToTours(event){
  $(location).attr('href','/');
}

//When user hovers over the stop container, open the infoWindow on the map
function highlightStop(event){
  var self = this;

  markers.forEach(function(element){
    if(element.placeId === $(self).find('#google-place-id').val()){
      infowindow.setContent('<div><strong>' + element.name + '</strong><br>');
      infowindow.open(map, element.marker);
    }
  });

}

//Open modal and populate with stop name
function addNewStopHandler(){
  if($('#pac-input').val()===""){
    $('#pac-input').focus();
  }
  else{
    $('#stop-modal').modal();
    $('#stop-modal').find('#stopName').val(currentGooglePlace.name);
  }
}

/*
 * Google maps functions 
 */ 

//InitMap function on page load
function initMap() { 
  //Initialize map 
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 37.7749, lng: -122.4194},
    zoom: 12,
    scrollwheel: false
  });

  //Initialize Google directions services
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;
  directionsDisplay.setMap(map);
  directionsDisplay.setOptions( { suppressMarkers: true } );

  //Generate service to convert place_id into data for a stop
  service = new google.maps.places.PlacesService(map);

  //Generate autocomplete search bar for adding a stop
  var input = document.getElementById('pac-input');
  var autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.bindTo('bounds', map);
  document.getElementById('add-stop').appendChild(input);

  //Initialize infowindow
  infowindow = new google.maps.InfoWindow();

  //Make autocomplete functionality
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

    var marker = new google.maps.Marker({
      map: map
    });

    marker.addListener('touchstart click', function() {
      infowindow.open(map, marker);
    });

    // Set the position of the marker using the place ID and location.
    marker.setPlace({
      placeId: place.place_id,
      location: place.geometry.location
    });
    marker.setVisible(true);

    //Open up infowindow when selected
    infowindow.setContent('<div><strong>' + place.name + '</strong><br>');
    currentGooglePlace.placeId = place.place_id;
    currentGooglePlace["placeId"] = place.place_id;
    currentGooglePlace["name"] = place.name;
    infowindow.open(map, marker);
  });
}

//Function to display route on the map
function showRoute(){
  var waypts = [];
  var origin;
  var destination;
  if (markers.length >= 2){
    for (var i = 0; i < markers.length; i++) {
      if(markers[i].order === 0 ){
        origin = {placeId: markers[i].placeId};
      }
      else if(markers[i].order === (markers.length-1) ){
        destination = {placeId: markers[i].placeId};
      }
      else if (markers[i]) {
        waypts.push({
          location: {placeId: markers[i].placeId},
          stopover: true
        });
      }
    }
    directionsService.route({
      origin: origin,
      destination: destination,
      waypoints: waypts,
      optimizeWaypoints: true,
      travelMode: 'WALKING'
    }, function(response, status) {
      if (status === 'OK') {
        directionsDisplay.setDirections(response);
        var route = response.routes[0];
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  }
  else{
    directionsDisplay.setMap(null);
  }
}
