
var locations = [
    {
        name: 'New Delhi',
        position: {lat: 28.6139, lng: 77.2090},
        visible: true
    },
    {
        name: 'Bangalore',
        position: {lat: 12.9716, lng: 77.5946},
        visible: true
    },
    {
        name: 'Rajasthan',
        position: {lat: 27.0238, lng: 74.2179},
        visible: true
    },
    {
        name: 'Kerala',
        position: {lat: 10.8505, lng: 76.2711},
        visible: true
    },
    {
        name: 'Hampi',
        position: {lat: 15.3350, lng: 76.4600},
        visible: true
    }
];

var Location = function(data){
    this.name = ko.observable(data.name);
    this.position = ko.observable(data.position);
    this.marker = new Marker(data);
    this.visible = ko.observable(data.visible);
    this.infoWindow = new InfoWindow(data);
};

var Marker = function(loc){
    this.marker = new google.maps.Marker({
        position: loc.position,
        map: map,
        title: loc.name,
        animation: google.maps.Animation.DROP
    });
};

var InfoWindow = function(loc){
    this.infoWindow = new google.maps.InfoWindow({
        content: loc.name
    });
}

var ViewModel = function(){

    var self = this;

    self.locationList = ko.observableArray([]);
    locations.forEach(function(loc){
        console.log(loc.name);
        self.locationList.push(new Location(loc));
        // createInfoWindow(loc);
    });

    self.animateAndShowInfo = function(loc){

        loc.marker.marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function(){ loc.marker.marker.setAnimation(null); }, 750);
        loc.infoWindow.infoWindow.open(map, loc.marker.marker);
    };

    self.addAnimationAndInfo = function(loc){

        loc.marker.marker.addListener('click', function(){
            self.animateAndShowInfo(loc);
        });
    };

    self.locationList().forEach(function(loc){
        self.addAnimationAndInfo(loc);
    });

    self.filterText = ko.observable();

    self.filterText.subscribe(function(newValue){
        if(newValue)
        {
            self.locationList().forEach(function(loc){
                if(loc.name().toLowerCase().indexOf(newValue.toLowerCase().trim()) > -1){
                    loc.visible(true);
                    loc.marker.marker.setMap(map);
                }
                else{
                    loc.visible(false);
                    loc.marker.marker.setMap(null);
                }
            });
        }
        else
        {
            self.locationList().forEach(function(loc){
                loc.visible(true);
                loc.marker.marker.setMap(map);
            });
        }
    });
};

ko.applyBindings(new ViewModel());