
$(document).ready(function() {

  showTourInfo();
  showStops();

  // Event Listeners for Buttons on Page
  $('#add-new-stop').on('touchstart click', addNewStopHandler);
  $('#save-stop').on('touchstart click', createNewStop);
  $('#back-to-tours').on('touchstart click', backToTours);
  $('#delete-tour-button').on('touchstart click', deleteTour);
  $('#tour-stops').on('touchstart click', '.delete-stop-button', deleteStop);
  $('#tour-stops').on('touchstart click', '.edit-stop-button', editStop);
  $('#tour-stops').on('touchstart click', '.update-stop-button', updateStop);
  $('.container-fluid').on('mouseenter','.stop', highlightStop);
  $('.title').on('click',backToTours);

  //Init Google Maps API 
  initMap();

});
