
$(document).ready(function() {

  $('#create-new-tour').on('click',function(){
    $('#tour-modal').modal();
  });

  $('#save-tour').on('click', createNewTour);
});
