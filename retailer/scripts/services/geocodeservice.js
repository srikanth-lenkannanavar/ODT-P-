'use strict';

app.service('geocodeservice', function() {

	var geocodeservice = {};

	geocodeservice.getPostalCode = function(position, successcallback,
			errorcallback) {
		var lat = position.coords.latitude;
		var lng = position.coords.longitude;
		var latlng = new google.maps.LatLng(lat, lng);
		var geocoder = new google.maps.Geocoder();
		var postalCode;
		geocoder.geocode({
			"location" : latlng
		}, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				var isPostcode = false;
				for (var i = 0; i < results.length; i++) {
					for (var j = 0; j < results[i].address_components.length; j++) {
						var component = results[i].address_components[j];
						if (component.types == "postal_code") {
							postalCode = component.long_name;
							isPostcode = true;
							break;
						}

					}

					if (isPostcode) {
						break;
					}
				}
				successcallback(postalCode);
			} else {
				errorcallback("Your location can't be found. Check and make sure you have good internet connection");
			}
		});
	};

	geocodeservice.getLocation = function(postcode, successcallback,
			errorcallback) {
		 var geocoder = new google.maps.Geocoder();
		 geocoder.geocode( { 'address': postcode,"componentRestrictions":{"country":"UK"}}, function(results, status) {
			  if (status == google.maps.GeocoderStatus.OK) {
				  successcallback(results,status);
			  }else{
				  errorcallback(results,status)
			  }
		  })
	};

	return geocodeservice;
});