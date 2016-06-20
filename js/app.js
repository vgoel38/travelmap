$(function(){

//JSON of all the map locations
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
    },
    {
        name: 'Mumbai',
        position: {lat: 19.0760, lng: 72.8777},
        visible: true
    }
];

//Location class
var Location = function(data, wikiInfo){
    this.name = ko.observable(data.name);
    this.position = ko.observable(data.position);
    this.marker = new Marker(data);
    this.visible = ko.observable(data.visible);
    this.infoWindow = new InfoWindow(data, wikiInfo);
};

//Marker class
var Marker = function(loc){
    this.marker = new google.maps.Marker({
        position: loc.position,
        map: map,
        title: loc.name,
        animation: google.maps.Animation.DROP
    });
};

//InfoWindow Class
var InfoWindow = function(loc, wikiInfo){

    var contentToDisplay =  '<div id="marker-content">'+
                            '<h3>'+loc.name+'</h3>'+
                            '<h5>Top WikiPedia Articles</h5>'+
                            wikiInfo+
                            '</div';

    this.infoWindow = new google.maps.InfoWindow({
        content: contentToDisplay
    });
}

//The ViewModel
var ViewModel = function(){

    var self = this;

    //LocationList Array
    self.locationList = ko.observableArray([]);

    locations.forEach(function(loc){

        //Firing Wikipedia API and collecting info for the loc in wikiInfo
        var wikiInfo='<ul id="wiki-articles">';
        var wikiURL = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + loc.name + '&format=json&callback=wikicallback';

        $.ajax ({
            url: wikiURL,
            dataType: "jsonp"
            }).done(function(response){

                var articleList = response[1];
                for (var i=0; i<articleList.length; i++){
                    articleStr = articleList[i];
                    var url = 'http://en.wikipedia.org/wiki/' + articleStr;
                    wikiInfo+='<li><a href="' + url + '" target="_blank">' + articleStr + '</a></li>';
                };
                wikiInfo+='</ul>';

                //Building the locationList Array
                self.locationList.push(new Location(loc,wikiInfo));
                //Adding Marker Animation and Info Window to each item in LocationList Array
                self.locationList().forEach(function(loc){
                    self.addAnimationAndInfo(loc);
                });
            }).fail(function( jqxhr, textStatus, error ) {
                    //error handling
                    var err = textStatus + ", " + error;
                    console.log( "Request Failed: " + err );
                    wikiInfo+='</ul>Sorry! Wikipedia articles could not be loaded!';
                    //Building the locationList Array
                    self.locationList.push(new Location(loc,wikiInfo));
                    //Adding Marker Animation and Info Window to each item in LocationList Array
                    self.locationList().forEach(function(loc){
                        self.addAnimationAndInfo(loc);
                    });
            });
    });

    //Sets Animation and InfoWindow to a location
    self.animateAndShowInfo = function(loc){

        loc.marker.marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function(){ loc.marker.marker.setAnimation(null); }, 750);
        loc.infoWindow.infoWindow.open(map, loc.marker.marker);
    };

    //Calls animateAndShowInfo on a location marker
    self.addAnimationAndInfo = function(loc){

        loc.marker.marker.addListener('click', function(){
            self.animateAndShowInfo(loc);
        });
    };

    //Setting up filter
    self.filterText = ko.observable();

    //This function is called whenever there is a change in the value of the filterText input field
    self.filterText.subscribe(function(newValue){
        if(newValue)
        {
            //Filtering all locations to display only those that match the filterText value
            self.locationList().forEach(function(loc){
                if(loc.name().toLowerCase().indexOf(newValue.toLowerCase().trim()) > -1){
                    loc.visible(true); //Make location visible in the list
                    loc.marker.marker.setMap(map); //Make marker visible
                }
                else{
                    loc.visible(false);//Disappear location from the list
                    loc.marker.marker.setMap(null); //take marker off the map
                }
            });
        }
        //When the filterText is empty, show all the locations in the list.
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

}());