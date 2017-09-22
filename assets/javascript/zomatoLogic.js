$(document).ready( function() {

	var apiKey = "78c3b592f11e635d1163fbb5b3ca7918";
	// What type of food, i.e. Mexican, Italian
	var choice;
	var city;
	var latitude = 30.4484517308;
	var longitude = -97.6369159113;
	// Number of restaurant options to return during restaurant search
	var numOptions = 10;
	// Radius in which to search measured in meters from latitude and longitude
	var radius = 8000;
	var restaurant;

	// Submit button click handler
	$("#pick-restaurant").on("click", function() {
		var city = $("#zipCode").val().trim();

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
			var randomNum = getRandomNum(0, response.restaurants.length - 1);
			console.log(response);
			restaurant = {
				"name": response.restaurants[randomNum].restaurant.name,
				"id": response.restaurants[randomNum].restaurant.id
			};
			console.log(restaurant);
		});
	});

	function getRandomNum(min, max) {
		return Math.floor((Math.random() * max) + min);
	}

});