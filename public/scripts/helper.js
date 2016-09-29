function renderTours(tourArray){
  var source = $('#tour-template').html();
  var template = Handlebars.compile(source);
  var tourHtml = template({ tour : tourArray });
  $('#walking-tours').append(tourHtml);
  console.log(tourHtml);
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
  var pathname = "/api" + $(location).attr('pathname') + "/stops";
  console.log("pathname:",pathname);
  $.ajax({
    method: "GET",
    url: pathname,
    success: renderStops
  });  
}

function renderStops(stopArray){
  var source = $('#stop-template').html();
  var template = Handlebars.compile(source);
  stopArray.forEach(function (stop, index) {
      var stopHtml = template( stop.stop_id );
      $('#tour-stops').append(stopHtml);
      console.log(stopHtml);
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