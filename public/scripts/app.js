
$(document).ready(function() {

  $.ajax({
    method: "GET",
    url: "/api/tours/",
    success: function(tours){
      renderTours(tours);
      console.log(tours);
    }
  });

  $('#create-new-tour').on('click',function(){
    $('#tour-modal').modal();
  });

  $('#save-tour').on('click', createNewTour);
});

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
      console.log("added :" + json);
      $('#tour-modal').modal();
    }
  });

  //TODO: Send to new page for creating tour
}