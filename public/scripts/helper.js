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
  // console.log(stopArray);
  stopArray.forEach(function (stop, index) {
      // console.log(stop);
      var stopHtml = template( stop.stop_id || stop );
      $('#tour-stops').append(stopHtml);
  });
}

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

function editTour() {
  toggleEditFields();
}

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
