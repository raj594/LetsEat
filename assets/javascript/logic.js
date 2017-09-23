$(document).ready(function() {


$('select').material_select();

var apiKey = "78c3b592f11e635d1163fbb5b3ca7918";
var choice;
var city;
var map;
var service;
var infowindow;
var austin;
var gmarkers = [];
var lastMarker;
var latitude = "";
var longitude = "";
// Number of restaurant options to return during restaurant search
var numOptions = 10;
initialize();


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

  function getRandomNum(min, max) {
    return Math.floor((Math.random() * max) + min);
  }


  $('#pick-restaurant').on('click', function(event){
    event.preventDefault();

    var place = $('#restaurant-type').val()
    var radius = $('#max-distance').val().trim()
    var zip = $("#zipcode").val().trim();
    var geocoder = new google.maps.Geocoder();
    

    geocoder.geocode( { 'address': zip}, function(results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
             latitude = results[0].geometry.location.lat();
             longitude = results[0].geometry.location.lng();
             console.log("Latitude" + latitude+ "longitude" + longitude);
             
            }
           else {alert("Invalid zip code") };

      var request = {
        location: austin,
        radius: radius,
        query: place
      };

          // Use restaurant search to get lists of restaurants
      $.ajax({
        url: "https://developers.zomato.com/api/v2.1/search?count=" + numOptions + "&lat=" + latitude + "&lon=" + longitude + "&radius=" + radius + "&cuisines=" + choice,
        method: "GET",
        headers: {
          "user-key": apiKey
        },
        error: function() {
          alert("Error during getRestaurantOptions");
        }
      }).done( function(response) {
        var randomNum = getRandomNum(0, numOptions - 1);
      
        restaurant = {
          "name": response.restaurants[randomNum].restaurant.name,
          "id": response.restaurants[randomNum].restaurant.id
        };

        request.query = restaurant.name;

        console.log(request.query)

        service = new google.maps.places.PlacesService(map);
        service.textSearch(request, callback);
      });

      

    });

  });

});