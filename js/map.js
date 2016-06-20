var map;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 22.9734, lng: 78.6569},
      zoom: 5
    });
};