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
    },
    {
        name: 'Kashmir',
        position: {lat: 34.0837, lng: 74.7973},
        visible: true
    },
    {
        name: 'Pondicherry',
        position: {lat: 11.9139, lng: 79.8145},
        visible: true
    },
    {
        name: 'Pehalgam',
        position: {lat: 34.0161, lng: 75.3150},
        visible: true
    },
    {
        name: 'Gulmarg',
        position: {lat: 34.0476, lng: 74.3854},
        visible: true
    },
    {
        name: 'Singapore',
        position: {lat: 1.3521, lng: 103.8198},
        visible: true
    },
    {
        name: 'Malaysia',
        position: {lat: 4.2105, lng: 101.9758},
        visible: true
    },
    {
        name: 'Manali',
        position: {lat: 32.2396, lng: 77.1887},
        visible: true
    },
    {
        name: 'Nainital',
        position: {lat: 29.3803, lng: 79.4636},
        visible: true
    },
    {
        name: 'Shimla',
        position: {lat: 31.1048, lng: 77.1734},
        visible: true
    },
    {
        name: 'Rishikesh',
        position: {lat: 30.0869, lng: 78.2676},
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

    //Toggling sidebar
    var sliderVisible = false;
    self.widthOfSideBar = $('.side-bar').width()+40;
    self.toggleSideBar = function(){
        if(sliderVisible){
            $('#slide-button').css('left','0');
            $('.side-bar').css('left','-'+self.widthOfSideBar+'px');
            sliderVisible=false;
        }
        else
        {
            $('#slide-button').css('left',self.widthOfSideBar+'px');
            $('.side-bar').css('left','0');
            sliderVisible=true;
        }
    }
    self.hideSideBar = function(){
        if(sliderVisible){
            $('#slide-button').css('left','0');
            $('.side-bar').css('left','-'+self.widthOfSideBar+'px');
            sliderVisible=false;
        }
    }

    locations.forEach(function(loc){

        //Firing Wikipedia API and collecting info for the loc in wikiInfo
        var wikiInfo='<ul id="wiki-articles">';
        var wikiURL = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + loc.name + '&format=json&callback=wikicallback';

        //Since the wikipedia info is received by the browser asynchronously, the markers and list have to be
        //created only after the wiki info is received. Therefore, the locationList Array is built within the
        //ajax request.
        //The above method won't be a good option in case there are too many locations because the user will
        //have to wait till all the markers have been added to the map.
        //The alternative is to make ajax request only when a marker is clicked. This way, more than one API can
        //be used as well.
        $.ajax ({
            url: wikiURL,
            dataType: "jsonp",
            timeout: 2000
        }).done(function(response){
            var articleList = response[1];
            //Showing at most 4 articles of each location
            for (var i=0; i<4 && i<articleList.length; i++){
                articleStr = articleList[i];
                var url = 'http://en.wikipedia.org/wiki/' + articleStr;
                wikiInfo+='<li><a href="' + url + '" target="_blank">' + articleStr + '</a></li>';
            };
            wikiInfo+='</ul>';

            //Building the locationList Array
            self.locationList.push(new Location(loc,wikiInfo));
            //Adding Marker Animation and Info Window to the last item in the array
            self.addAnimationAndInfo(self.locationList()[self.locationList().length-1]);

        }).fail(function( jqxhr, textStatus, error ) {
            //error handling
            var err = textStatus + ", " + error;
            console.log( "Request Failed: " + err );
            wikiInfo+='</ul>Sorry! Wikipedia articles could not be loaded!';
            //Building the locationList Array
            self.locationList.push(new Location(loc,wikiInfo));
            //Adding Marker Animation and Info Window to the last item in the array
            self.addAnimationAndInfo(self.locationList()[self.locationList().length-1]);
        });
    });

    //Sets Animation and InfoWindow to a location marker
    self.animateAndShowInfo = function(loc){

        loc.marker.marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function(){ loc.marker.marker.setAnimation(null); }, 750);
        loc.infoWindow.infoWindow.open(map, loc.marker.marker);

        //Only one infoWindow can be open at one time.
        //Also clicking a marker should both open/close an infoWindow
        if(self.openedLoc){
            self.openedLoc.infoWindow.infoWindow.close();
            if(self.openedLoc !== loc)
                self.openedLoc=loc;
            else
                self.openedLoc=null;
        }
        else
            self.openedLoc=loc;

        //Hide the sidebar when a location in list or a marker is clicked.
        self.hideSideBar();
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
                    //Make location visible in the list
                    loc.visible(true);
                    //Make marker visible
                    loc.marker.marker.setMap(map);
                }
                else {
                    //Disappear location from the list
                    loc.visible(false);
                    //take marker off the map
                    loc.marker.marker.setMap(null);
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

    // self.filteredLoc = ko.computed(function(){
    // });
};

ko.applyBindings(new ViewModel());