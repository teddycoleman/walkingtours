
$(document).ready(function() {

  $.ajax({
    method: "GET",
    url: "/api/tours/",
    success: function(tours){
      renderTours(tours);
      console.log(tours);
      $('.edit-tour-button').toggle();
    }
  });

  $('#create-new-tour').on('click',function(){
    $('#tour-modal').modal();
  });

  $('#save-tour').on('click', createNewTour);

  $('.container').on('click','.tour', function(){
    console.log("clicked");
    var id = $(this).closest('.tour').attr('id');
    $(location).attr('href','tours/' + id);
  });
});
