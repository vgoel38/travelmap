var map;

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

var sliderVisible=true;
var widthOfSideBar = $('.side-bar').width();
var hiddenBar = 'translate(-'+widthOfSideBar+'px,0px)';
var visibleBar = 'translate('+widthOfSideBar+'px,0px)';

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