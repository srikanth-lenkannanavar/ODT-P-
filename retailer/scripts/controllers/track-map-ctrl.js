'use strict';
/**
 * @ngdoc function
 * @name app.controller:TrackMapCtrl
 * @description # TrackMapCtrl Controller of the app
 */
angular.module('app').controller('TrackMapCtrl', function ($scope, $rootScope, $modal, $interval, restservice, modalservice, $routeParams, envconfig, geocodeservice, $location) {
//alert("TrackMapCtrl");
    $scope.trackDetails = {};
    $scope.jobgps = {};
    $rootScope.standAloneMapHeader = true;
    $scope.showError = null;
    var i = 0;
    var gmarkers = [];
    var icons = new Array();
    var infowindow = new google.maps.InfoWindow(
            {
                size: new google.maps.Size(150, 50)
            });
    function createMarker(map, latlng, label, html, color) {
        // alert("createMarker("+latlng+","+label+","+html+","+color+")");
        //var contentString = '<b>'+label+'</b><br>'+html;
        var contentString = '<b>' + label + '</b><br>';
        var marker = new google.maps.Marker({
            position: latlng,
            map: map,
            icon: getMarkerImage(color),
            title: label,
            zIndex: Math.round(latlng.lat() * -100000) << 5
        });
        marker.myname = label;
        google.maps.event.addListener(marker, 'mouseover', function (e) {
//            this.Lf.title = "";
            infowindow.setContent(contentString);
            infowindow.open(map, marker);
        });
        return marker;
    }
    function getMarkerImage(iconStr) {
        if ((typeof (iconStr) == "undefined") || (iconStr == null)) {
            iconStr = "red";
        }
        if (!icons[iconStr]) {
            if (iconStr === "C") {
                icons[iconStr] = new google.maps.MarkerImage("images/delivery_postcode_pin_dest.png");
            } else if (iconStr === "B") {
                icons[iconStr] = new google.maps.MarkerImage("images/driver.png");
            } else if (iconStr === "A") {
                icons[iconStr] = new google.maps.MarkerImage("images/delivery_postcode_pin_start.png");
            }
//icons[iconStr] =  (iconStr === "C") ? new google.maps.MarkerImage("images/delivery_postcode_pin_white.png") : new google.maps.MarkerImage("images/delivery_postcode_pin_green.png") ;
        }
        return icons[iconStr];
    }
    $scope.track = function (job, storeId) {
        if (job != null) {
            restservice.get(envconfig.get('host') + "/track/" + storeId + "/" + job, '', function (data, status) {
                if (data.latitude === "" || data.longitude === "")
                {
                    $scope.showError = true;
                    return;
                }
                $scope.jobgps = {
                    "lat": data.latitude,
                    "lng": data.longitude
//                    "lat": 51.444611,
//                    "lng": -2.49115
                };
                $scope.drawmap();
            }, function (data, status) {
                // error message
                //  console.log(data);
            });
        }
    };
    $scope.getMapDetails = function ()
    {
//        $scope.track(job, $scope.trackDetails.accountNumber);
        var job = $location.search().job;
        if ($routeParams.trackstring != null) {
            var requestData = {
//                'track': "MDPtjJaLFG9dfqvF7vdtPmB*sk3YBnCqomKlujoE2cA~",
//                'job': "17393903"
                'track': $routeParams.trackstring,
                'job': job
            };
            restservice.post(envconfig.get('host') + "/track/getbookings",
                    // restservice.get("scripts/trackheader.json",
                    '', function (data, status) {
                        //var job = 17299227;
                        $scope.headerMap.showHeader = true;
                        $scope.trackDetails = data;
                        $scope.$parent.headerMap = data;
                        $scope.track(job, $scope.trackDetails.storeId);
                    }, function (data, status) {
                // error message
                $scope.showError = true;
                $scope.headerMap.showHeader = null;
                console.log(data);
            }, requestData);
        }
    };
    $scope.drawmap = function ()
    {        //$scope.mydeliveryuser.latlong = results[0].geometry.location;
        var directionsDisplay;
        var directionsService = new google.maps.DirectionsService();
        var map;
        directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers: true});
        var start = $scope.trackDetails.collect;
        var end = $scope.trackDetails.delivery;
//        var start = "HA8 9DJ";
//        var end = "EC2A 4PH";
//        var loc = new google.maps.LatLng(51.52335, -0.08038);
        var loc = new google.maps.LatLng($scope.jobgps.lat, $scope.jobgps.lng);
        var myOptions = {
            zoom: 0,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            center: loc}
        var waypts = [{location: loc,
                stopover: true}];
        var request = {
            origin: start,
            destination: end,
            waypoints: waypts,
            optimizeWaypoints: false, //set this to true to get optimized path else it will plot as the given input.
            travelMode: google.maps.DirectionsTravelMode.DRIVING//set your travel mode here (walking,driving..)
        };
        //console.log(mapOptions);
        directionsService.route(request, function (response, status) {
            //$("map-container").hide();
            if (status == google.maps.DirectionsStatus.OK) {
                var toolTipDetails = "";
                map = new google.maps.Map(document.getElementById("map-container"), myOptions);
                directionsDisplay.setMap(map);
                directionsDisplay.setDirections(response);
                var route = response.routes[0];
                var total = 0;
                var numberLegs = route.legs.length;
                var legs = route.legs;
                //
                for (var i = 0; i < legs.length; i++) {
                    console.log(legs[i]);
                    var markerletter = "A".charCodeAt(0);
                    markerletter += i;
                    markerletter = String.fromCharCode(markerletter);
                    if (i == 0) {
                        var collDet = $scope.headerMap.collectFrom + " | " + $scope.headerMap.collect;
                        toolTipDetails = "Collect from:<br>" + collDet;
                    } else {
                        toolTipDetails = "Driver Details:<br>" + legs[i].start_address;
                    }
                    //createMarker(directionsDisplay.getMap(),legs[i].start_location,toolTipDetails,markerletter);
                    createMarker(directionsDisplay.getMap(), legs[i].start_location, toolTipDetails, "", markerletter);
                }
                var i = legs.length;
                var markerletter = "A".charCodeAt(0);
                markerletter += i;
                markerletter = String.fromCharCode(markerletter);
                var delDet = $scope.headerMap.deliveryTo + " | " + $scope.headerMap.delivery;
                toolTipDetails = "Delivery to:<br>" + delDet;
                //createMarker(directionsDisplay.getMap(),legs[legs.length-1].end_location,i,toolTipDetails,markerletter);
                createMarker(directionsDisplay.getMap(), legs[legs.length - 1].end_location, toolTipDetails, "", markerletter);
                //createMarker(loc,$scope.trackDetails.deliveryTo,$scope.trackDetails.delivery,"red",map);
                //$("map-container").fadeIn("slow");
            }
            else {
                alert("Could not load data.." + status);
            }
        });
    };
    $scope.getMapDetails();
    var stop = $interval(function () {
        i++;
        if (i < 10) {
            $scope.getMapDetails();
        } else {
            $scope.stopInterval();
        }
    }, 60000);
    $scope.stopInterval = function () {
        if (angular.isDefined(stop)) {
            $interval.cancel(stop);
            stop = undefined;
        }
    };
});
