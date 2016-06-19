var map;

function initMap() {
    var geocoder = new google.maps.Geocoder();

    map = new google.maps.Map(document.getElementById('map'), {
      center: getLatitudeLongitude(geocoder,"New Delhi"),
      // center: {lat: -25.363, lng: 131.044},
      zoom: 4
    });

    // console.log(getLatitudeLongitude(geocoder,"New Delhi"));
};

function getLatitudeLongitude(geocoder,address) {
    // var geocoder = new google.maps.Geocoder();
    // console.log("1");
    if (geocoder) {
        // console.log("2");
        geocoder.geocode( {'address': address}, function (results, status) {
            // console.log("3");
            if (status == google.maps.GeocoderStatus.OK) {
                var position = {
                    lat: results[0].geometry.location.lat(),
                    lng: results[0].geometry.location.lng()
                };
                // console.log(position);
                return position;
            }
        });
    }
};