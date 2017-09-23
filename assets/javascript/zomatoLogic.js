$(document).ready( function() {
	// Submit button click handler

	$("#pick-restaurant").on("click", function() {

		var apiKey = "78c3b592f11e635d1163fbb5b3ca7918";

		var city = $("#zipCode").val().trim();
		// ID for the type of cuisine
		var choice;
		console.log("choice = " + choice);
		var city;
		var latitude = 30.4484517308;
		var longitude = -97.6369159113;
		// Number of restaurant options to return during restaurant search
		var numOptions = 10;
		// Number of reviews to return
		var numReviews = 5;
		// Radius in which to search measured in meters from latitude and longitude
		var radius = 8000;
		var restaurant;

		// Use restaurant search to get lists of restaurants
		$.ajax({
			url: "https://developers.zomato.com/api/v2.1/search?count=" + numOptions + "&lat=" + latitude + "&lon=" + longitude + "&radius=" + radius + "&cuisines=" + choice,
			method: "GET",
			headers: {
				"user-key": apiKey
			},
			error: function() {
				alert("Error during search restaurants ajax call");
			}
		}).done( function(response) {
			var randomNum = getRandomNum(0, response.restaurants.length - 1);
			console.log(response);
			restaurant = {
				"name": response.restaurants[randomNum].restaurant.name,
				"id": response.restaurants[randomNum].restaurant.id
			};
			console.log(restaurant);

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
		});
	});

	function getRandomNum(min, max) {
		return Math.floor((Math.random() * max) + min);
	}

});