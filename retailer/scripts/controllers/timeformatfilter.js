'use strict';

/**
 * @ngdoc function
 * @name app.controller:datetimefilter
 * @description
 * # datetimefilter
 * Controller of the app
 */

angular.module('uktimefilter', []).filter('uktimefilter', function() {
  return function(input) {
	var london = moment.tz(Number(input), "Europe/London");
    return input ? london.format('HH:mm')  : '';
  };
});
