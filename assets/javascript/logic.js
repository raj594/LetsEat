$(document).ready(function() {


$('select').material_select();

var choice;
var city;
var map;
var service;
var infowindow;
var austin;
var gmarkers = [];
var lastMarker;
var lastSearch = {
  lastPlace: null,
  lastRadius: null,
  lastZip: null,
  lastPrice: null,
  lastUnit: null,
  lastResultsFound: null
}

var restaurantNumber;

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
      for (var i = 0; i < 1; i++) {
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

  function populateRestaurantInfo(restaurant) {
    var picDiv = $("<div id='restaurant-img'><img src='" + restaurant.thumb + "'></div>");
    var nameDiv = $("<div id='restaurant-name'>" + restaurant.name + "</div>");
    var priceRangeDiv = $("<div id='price-range'>" + restaurant.currency + "</div>");
    var addressDiv = $("<div id='address'>" + restaurant.location.address + "</div>");
    $("#restaurantInfo").empty();
    $("#restaurantInfo").append(picDiv);
    $("#restaurantInfo").append(nameDiv);
    $("#restaurantInfo").append(priceRangeDiv);
    $("#restaurantInfo").append(addressDiv);
  }


  $('#pick-restaurant').on('click', function(event){
    event.preventDefault();

    // API key for Zomato
    var apiKey = "78c3b592f11e635d1163fbb5b3ca7918";

    var latitude = "";
    var longitude = "";

    // Number of restaurant options to return during restaurant search
    var numOptions = 20;
    // Number of reviews to return
    var numReviews = 5;
    // Object to hold the selected restaurant's name and zomato id
    var restaurant;

    var queryUrl = "";

    // Zomato id for type of cuisine
    var place = $('#restaurant-type').val();
    var radius = parseFloat($('#max-distance').val().trim());
    var zip = $("#zipcode").val().trim();
    var geocoder = new google.maps.Geocoder();
    var unitMeausre = $("#unit").val();
    var maxPrice = parseInt($("#prices").val());


    if (radius === lastSearch.lastRadius && 
      place === lastSearch.lastPlace && 
      zip === lastSearch.lastZip && 
      unitMeausre === lastSearch.lastUnit && 
      maxPrice === lastSearch.lastPrice &&
      (restaurantNumber + 15) < 90 &&
      (restaurantNumber + 15) < lastSearch.lastResultsFound) { 
      restaurantNumber += 15;
    } else {
      restaurantNumber = 0;
    }

    lastSearch.lastPlace = place;
    lastSearch.lastRadius = radius;
    lastSearch.lastZip = zip;
    lastSearch.lastUnit = unitMeausre;
    lastSearch.lastPrice = maxPrice;




    //converting miles or km to meters
    if(unitMeausre==="1"){
      radius = radius*1609.34;
    }

    else if(unitMeausre==="2"){
      radius = radius*1000;
    }
    

    geocoder.geocode( { 'address': zip}, function(results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            latitude = results[0].geometry.location.lat();
            longitude = results[0].geometry.location.lng();
          } else {
              alert("Invalid zip code")
          };

    var request = {
      location: austin,
      radius: radius,
      query: place,
      openNow: true
    };


    queryUrl = "https://developers.zomato.com/api/v2.1/search?count=" + numOptions + "&start=" + restaurantNumber + "&lat=" + latitude + "&lon=" + longitude + "&radius=" + radius + "&cuisines=" + place;
    console.log(queryUrl)

      // Use restaurant search to get lists of restaurants
      $.ajax({

        url: queryUrl,

        method: "GET",
        headers: {
          "user-key": apiKey
        },
        error: function() {
          alert("Error during getRestaurantOptions");
        }
      }).done( function(response) {
        console.log(response)
        lastSearch.lastResultsFound = response.results_found;
        var restaurants = response.restaurants;
        var randomNum;
        var resultsFound = false;

        // Pick a random restaurant out of the results returned. If that restaurant is outside the specified radius, then cycle through the others to check if there
        // is a restaurant in the returned results that fits the search criteria
        while (restaurants.length > 0) {

          // Pick a random number that will be the index for the restaurant to show the user
          randomNum = getRandomNum(0, restaurants.length - 1);
          restaurant = restaurants[randomNum].restaurant;

          // If the chosen restaurant is within the proper radius, then break out of the while loop
          if (radius === 0 && zip === restaurant.location.zipcode) {
            resultsFound = true;
            break;
          }
          // Added 500 to radius as estimate to account for length and width of zip code area
          else if (Math.abs(restaurant.location.latitude - latitude) <= radius + 500 && Math.abs(restaurant.location.longitude - longitude) <= radius + 500) {
            resultsFound = true;
            break;
          }
          // Remove the restaurant that was found to be out of radius from the restaurants array
          else {
            restaurants.splice(randomNum, 1);
          }
        }


        if (resultsFound) {
          request.query = restaurant.name;

          service = new google.maps.places.PlacesService(map);
          service.textSearch(request, callback);

          populateRestaurantInfo(restaurant);

          // Use reviews search to get reviews for the chosen restaurant
          $.ajax({
            url: "https://developers.zomato.com/api/v2.1/reviews?res_id=" + restaurant.id + "&count=" + numReviews,
            method: "GET",
            headers: {
              "user-key": apiKey
            },
            error: function() {
              alert("Error during review search ajax call");
            }
          }).done( function(response) {
            console.log(response);
            
          });
        }
        else {
          console.log("No results found within specified radius");
        }

      });

    });

  });

});