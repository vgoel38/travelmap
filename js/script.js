var map;

//Initializing the map
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 21.2787, lng: 81.8661},
      zoom: 4,
      mapTypeControl: true,
      mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
        position: google.maps.ControlPosition.TOP_RIGHT
      }
    });
};

//called when google map does not load
var googleError = function(){
    alert("Sorry! Google Maps could not be loaded. Please try again later.")
};