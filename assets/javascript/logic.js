$(document).ready(function() {
    $('select').material_select();

    // Initialize Firebase
var config = {
  apiKey: "AIzaSyC8pBpKkESNKUIR4jYkAufs3zAUW7PxMw0",
  authDomain: "letseat-b8ae2.firebaseapp.com",
  databaseURL: "https://letseat-b8ae2.firebaseio.com",
  projectId: "letseat-b8ae2",
  storageBucket: "",
  messagingSenderId: "906965442202"
};

var geoCodeAPI = "AIzaSyAk_m4RPckSkWwfT4MVienuZr3Yc4mj6eE";

// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

var map;
var infowindow;
initMap();

function initMap() {
  var austin = {lat: 30.26, lng: -97.7431};

  map = new google.maps.Map(document.getElementById('map'), {
    center: austin,
    zoom: 15
  });

  infowindow = new google.maps.InfoWindow();
  var service = new google.maps.places.PlacesService(map);
  service.nearbySearch({
    location: austin,
    radius: 500,
    type: ['restaurant']
  }, callback);
}

function callback(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      createMarker(results[i]);
    }
  }
}

function createMarker(place) {
  var placeLoc = place.geometry.location;
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location
  });

  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent(place.name);
    infowindow.open(map, this);
  });
}


$('#pick-restaurant').on('click', function(event){
  event.preventDefault();
  var newPlace = $('#pick').val().trim();
  
  var queryURL = "https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=" + geoCodeAPI;
  
  // Creating an AJAX call for the specific gif button being clicked
  $.ajax({
    url: queryURL,
    method: "GET"
  }).done(function(response) {
    console.log(response.results[0].geometry.location)
    var newLat = response.results[0].geometry.location.lat;
    var newLong = response.results[0].geometry.location.lng;
    console.log(response.results[0].geometry.location.lat)
    console.log(response.results[0].geometry.location.lng)

  });
});

});
       