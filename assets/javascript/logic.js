$('select').material_select();


var map;
var service;
var infowindow;
var austin;
var gmarkers = [];
var lastMarker;

function initialize() {
  austin = new google.maps.LatLng(30.2672,-97.7431);

  map = new google.maps.Map(document.getElementById('map'), {
      center: austin,
      zoom: 15
    });

  var request = {
    location: austin,
    radius: '500',
    query: 'restaurant'
  };

  service = new google.maps.places.PlacesService(map);
}

function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    if (results.length === 1){
      map.setZoom(15)
    } else if ( results.length > 1){
      map.setZoom(13);
    }
    for (var i = 0; i < results.length; i++) {
      var place = results[i];
      createMarker(results[i]);
    }
  }
}

function createMarker(place) {
  // If lastMarker exists, hide it to draw new one
  if (lastMarker) {
    lastMarker.setMap(null);
  }

  // Center map on new restaurant result
  map.panTo(place.geometry.location);

  // Code to create and draw new marker
  // extracting data from the place object passed to create marker
  var placeLoc = place.geometry.location;
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location
  });

  // array holding all the markers we have placed
  // potentially used to make sure we dont show the same place twice later
  gmarkers.push(marker);

  // save current marker to be able to hide it at the top of createMarker
  lastMarker = marker;

  // create the infoWindow incase the user clicks on the marker
  infowindow = new google.maps.InfoWindow();
  google.maps.event.addListener(marker, 'click', function() {
      infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
          'Place ID: ' + place.place_id + '<br>' +
          place.formatted_address + '</div>');
      infowindow.open(map, this);
  });
}


$('#pick-restaurant').on('click', function(event){
  event.preventDefault();

  var place = $('#test-restaurant').val().trim()
  var radius = $('#maxDist').val().trim()
  console.log(place)
  console.log(radius)
  var request = {
    location: austin,
    radius: radius,
    query: place
  };

  service = new google.maps.places.PlacesService(map);
  service.textSearch(request, callback);

});

