
var locations = [
    {
        name: 'New Delhi',
        position: {lat: -25.363, lng: 131.044}
    },
    {
        name: 'Bangalore',
        position: {lat: -20.363, lng: 131.044}
    },
    {
        name: 'Rajasthan',
        position: {lat: -29.363, lng: 131.044}
    },
    {
        name: 'Kerela',
        position: {lat: -40.363, lng: 131.044}
    }
];

var Location = function(data){
    this.name = ko.observable(data.name);
    this.position = ko.observable(data.position);
}

var ViewModel = function(){

    var self = this;

    self.createMarker = function(loc){
        // console.log(loc);
        var marker = new google.maps.Marker({
            position: loc.position,
            map: map,
            title: 'Hello World!'
        });
    };

    self.locationList = ko.observableArray([]);
    locations.forEach(function(loc){
        console.log(loc.name);
        self.locationList.push(new Location(loc));
        self.createMarker(loc);
    });
};

ko.applyBindings(new ViewModel());