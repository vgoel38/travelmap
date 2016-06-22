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

//Animating the side bar
var sliderVisible=false;
var widthOfSideBar = $('.side-bar').width()+40;

$('#slide-button').click(function(){

    if(sliderVisible){
        $('#slide-button').css('left','0');
        $('.side-bar').css('left','-'+widthOfSideBar+'px');
        sliderVisible=false;
    }
    else
    {
        $('#slide-button').css('left',widthOfSideBar+'px');
        $('.side-bar').css('left','0');
        sliderVisible=true;
    }

});