
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
