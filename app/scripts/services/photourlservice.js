'use strict';

app.service('photourlservice', function()
{

	var photourlservice = {};

	photourlservice.resolvePhotoUrl = function(strProfilePhotoUrl,
			strDefaultPhotoUrl)
	{
		var profilePhotoUrl = strProfilePhotoUrl || "";
		var defaultPhotoUrl = strDefaultPhotoUrl || "";

		if (profilePhotoUrl !== "")
		{
			// A String that begins with http or https.
			if (profilePhotoUrl.length >= 5
					&& (profilePhotoUrl.substring(0, 4) === "http"))

			{
				return profilePhotoUrl;
			}
			else
			// Assume it to be a JSON that contains the URL.
			{
				var objProfileURL = angular.fromJson(profilePhotoUrl);

				// Facebook Variation 1.
				if (objProfileURL.data.url)
				{
					return objProfileURL.data.url;
				}
				// Facebook Variation 2.
				else if (objProfileURL.Resources[0].profileUrl)
				{

					var objData = angular
							.fromJson(objProfileURL.Resources[0].profileUrl);

					if (objData.data.url) { return objData.data.url; }

				}

			}// else
		}// if

		return defaultPhotoUrl;

	};//function resolvePhotoUrl

	return photourlservice;
});
