$(document).ready( function() {    
	$("#btn-test").on("click", function() {
		var zipCode = $("#zipCode").val().trim();
		var apiKey = "l606B8AHNrvFcAqG2TcmC6DCfyqmiZzE6zLHIlpwNUbZvBFxvSU8YxKe5bAoa92h";
		// Distance away from the zip code to find restaurants. Initialized to 0 to find only restaurants in the given zip code,
		// but can be changed later to allow user input if we add that functionality
		var distance = 0;
		// Allowed units are "mile" or "km"
		var units = "mile";
		var url = "https://www.zipcodeapi.com/rest/" + apiKey + "/radius.json/" + zipCode + "/" + distance + "/" + units;
		console.log(zipCode);
		// Check that zip code is appropriate length
		if (zipCode.length !== 5)
		{
			// alert("Zip code must have 5 digits");
			var zipLengthErrorModal = $('<div id="modal1" class="modal">');
			zipLengthErrorModal.append('<div class="modal-content">');
			zipLengthErrorModal.append('<h4>Error</h4>');
			zipLengthErrorModal.append('Zip code must have 5 digits');
			$("html").append(zipLengthErrorModal);
		}
		// If zip code is 5 digits, then send ajax get request
		else
		{
			$.ajax({
				// url: "https://www.zipcodeapi.com/rest/l606B8AHNrvFcAqG2TcmC6DCfyqmiZzE6zLHIlpwNUbZvBFxvSU8YxKe5bAoa92h/radius.json/78660/5/mile",
				url: "http://api.zippopotam.us/us/" + zipCode,
				method: "GET",
				error: function() {
					alert("This zip code is invalid");
				}

			}).done( function(response) {
				console.log(response);
			});
		}
	});
});