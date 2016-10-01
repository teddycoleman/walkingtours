
$(document).ready(function() {

  showTourInfo();
  showStops();

  // Event Listeners for Buttons on Page
  $('#add-new-stop').on('click', addNewStopHandler);
  $('#save-stop').on('click', createNewStop);
  $('#back-to-tours').on('click', backToTours);
  $('#delete-tour-button').on('click', deleteTour);
  $('#tour-stops').on('click', '.delete-stop-button', deleteStop);
  $('#tour-stops').on('click', '.edit-stop-button', editStop);
  $('#tour-stops').on('click', '.update-stop-button', updateStop);
  $('.container-fluid').on('mouseenter','.stop', highlightStop);

  //Init Google Maps API 
  initMap();

});


