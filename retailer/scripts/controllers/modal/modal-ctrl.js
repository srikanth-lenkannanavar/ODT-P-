'use strict';
angular.module('app').controller('ModalCtrl', function ($scope, modalservice, CommonService, $routeParams, restservice, envconfig, $location, $filter, $cookies, $interval, $rootScope, $route, $timeout, $window, $sce, geocodeservice, YourQuoteService)
{
    var icons = new Array();
    var infowindow = new google.maps.InfoWindow({
        size: new google.maps.Size(150, 50)
    });
    $scope.times = CommonService.shopOpenningTimes;
    $scope.closetimes = CommonService.closeTimes;
    $scope.timesManRetailer = CommonService.shopOpenningTimes;
    $scope.closetimesManRetailer = CommonService.closeTimes;
    $scope.retailClose = $scope.$parent.retailerstoreclosetime;
    $scope.retailOpen = $scope.$parent.retailerstoreopentime;
    $scope.phoneNo = $scope.$parent.currentPhoneNumber;

    $scope.deliveryObj =
            {
                shopDate: null,
                // packageDate : $filter('date')(new Date(),
                // 'YYYY-MM-DD'),
                packageDate: moment().format('DD-MM-YYYY'),
                shopopenManRetailer: $scope.retailOpen,
                shopcloseManRetailer: $scope.retailClose,
                packagefrom: $scope.times[$scope.times
                        .indexOf('09:30')],
                shopclose: $scope.closetimes[$scope.closetimes
                        .indexOf('18:30')],
                shopopen: $scope.times[$scope.times.indexOf('09:30')]
            };
    $scope.editDeliveryObj =
            {
                shopDate: null,
                // packageDate : $filter('date')(new Date(),
                // 'YYYY-MM-DD'),
                packageDate: $filter('date')(
                        $scope.$parent.packageDate, 'dd-MM-yyyy'),
                shopopenManRetailer: $scope.times[$scope.timesManRetailer
                        .indexOf('09:30')],
                shopcloseManRetailer: $scope.closetimesManRetailer[$scope.closetimesManRetailer
                        .indexOf('18:30')],
                packagefrom: $scope.times[$scope.times
                        .indexOf($scope.$parent.packagecollectionreadyfrom)],
                shopclose: $scope.closetimes[$scope.closetimes
                        .indexOf($scope.$parent.retailerstoreclosetime)],
                shopopen: $scope.times[$scope.times.indexOf($scope.$parent.retailerstoreopentime)]
            };
    $scope.test = "test";
    $scope.videoPath = function (url, path) {
        //return url+path;
        //debugger;
        //console.log($sce.trustAsResourceUrl(url+path));
        return $sce.trustAsResourceUrl(url + path);
    };

    $scope.changeHidemodal = function ()
    {
        modalservice.close();
    };
    $scope.retDistHideModal = function ()
    {
        modalservice.close();
        $location.path('/');
    };
    $scope.closeModal = function ()
    {
        modalservice.close();
    };
    $scope.quoteNotifySubmit = function ()
    {
        console.log($scope.userEmail);
        if (!$rootScope.noServiceUUID)
            return;
        var email = $scope.userEmail.trim();
        if (email === "")
            return;
        var userData =
                {
                    "uuid": $rootScope.noServiceUUID,
                    "noserviceemail": email
                };
        restservice.put(envconfig.get('host') + "/bookings/bookingrequest/updateRetailerAdd", '',
                function (data, status)
                {
                    modalservice.close();
                    $location.path('/');
                    modalservice.hide();
                },
                function (data, status)
                {
                    var divDisplayError = document
                            .getElementById("divCommError");
                    if (divDisplayError)
                        divDisplayError.innerHTML = "Communication Failed. Please try again/ later.";
                }
        , userData);
    };
    $scope.retailerManualSave = function (deliveryObj)
    {
        console.log("save");
        $scope.deliveryObj = angular.copy(deliveryObj);
        $scope.parentObj = $scope.$parent;
        var day = $scope.$parent.shopdeliverydate;
        var getOpenCloseTimeByDay = YourQuoteService.getOpenCloseTimeByDay(day);
        var openTime = getOpenCloseTimeByDay.openTime;
        var closeTime = getOpenCloseTimeByDay.closeTime;
        console.log($scope);
        console.log($scope.deliveryObj.shopopenManRetailer);
        console.log($scope.$parent.shopdeliverydate);
        $scope.$parent.retailerstoreopentime = $scope.deliveryObj.shopopenManRetailer;
        $scope.$parent.retailerstoreclosetime = $scope.deliveryObj.shopcloseManRetailer;
        var userData = '{"uuid":"' + $routeParams.uuid + '","'
                + openTime + '":"'
                + $scope.deliveryObj.shopopenManRetailer
                + '","' + closeTime + '":"'
                + $scope.deliveryObj.shopcloseManRetailer
                + '","retailerstoreopentime":"'
                + $scope.deliveryObj.shopopenManRetailer
                + '","retailerstoreclosetime":"'
                + $scope.deliveryObj.shopcloseManRetailer
                + '"}';
        restservice.put(envconfig.get('host') + "/bookings/bookingrequest/updateRetailerAdd", '',
                function (data, status)
                {
                    document.getElementById("storeTime").innerHTML = data.retailerstoreopentime + " - " + data.retailerstoreclosetime;
                    $scope.parentObj.timeslots();
                }, function (data, status)
        {
            // failure
        }, userData);
        console.log(userData);
        modalservice.hide();
    };
    $scope.editBookingManualSave = function (deliveryObj)
    {
        console.log("save");
        $scope.deliveryObj = angular.copy(deliveryObj);
        $scope.parentObj = $scope.$parent;
        var day = $scope.$parent.shopdeliverydate;
        var getOpenCloseTimeByDay = YourQuoteService.getOpenCloseTimeByDay(day);
        var openTime = getOpenCloseTimeByDay.openTime;
        var closeTime = getOpenCloseTimeByDay.closeTime;
        console.log($scope);
        console.log($scope.deliveryObj.shopopenManRetailer);
        console.log($scope.$parent.shopdeliverydate);
        var userData = '{"uuid":"'
                + $routeParams.uuid + '","'
                + openTime + '":"'
                + $scope.deliveryObj.shopopenManRetailer
                + '","' + closeTime + '":"'
                + $scope.deliveryObj.shopcloseManRetailer
                + '","retailerstoreopentime":"'
                + $scope.deliveryObj.shopopenManRetailer
                + '","retailerstoreclosetime":"'
                + $scope.deliveryObj.shopcloseManRetailer
                + '"}';
        restservice.put(envconfig.get('host') + "/bookings/bookingrequest/updateRetailerAdd", '',
                function (data, status)
                {
                    document.getElementById("storeTime").innerHTML = data.retailerstoreopentime + " - " + data.retailerstoreclosetime;
                    $scope.parentObj.timeslots();
                }, function (data, status)
        {
            // failure
        }, userData);
        console.log(userData);
        modalservice.hide();
    };
    $scope.shopclosecalc = function (i)
    {
        if ($.inArray(i, $scope.times) > -1)
        {
            $scope.cutfrom = $scope.times.indexOf(i);
            $scope.closetimes.splice(0, $scope.cutfrom + 1);
            $scope.shopclose = $scope.closetimes[0];
        }
    };
    $scope.saveData = function (deliveryObj)
    {
        $("body").scrollTop(0);
        $scope.$parent.collectiondateFlag = true;
        $scope.$parent.packageCollectiondate = ($(
                '#datetimepicker2').data("DateTimePicker")
                .getDate()).format('YYYY-MM-DD');
        $scope.$parent.deliverydate = ($('#datetimepicker2')
                .data("DateTimePicker").getDate())
                .format('YYYY-MM-DD');
        $scope.deliveryObj = angular.copy(deliveryObj);
        $scope.collectionDate = ($('#datetimepicker2').data(
                "DateTimePicker").getDate())
                .format('DD-MM-YYYY');
        $scope.packageDate = $('#datetimepicker2').data(
                "DateTimePicker").getDate();
        var deliDate = $('#datetimepicker2').data("DateTimePicker")
                .getDate();
        var day = ($('#datetimepicker2').data("DateTimePicker")
                .getDate()).format('ddd');
        var getOpenCloseTimeByDay = YourQuoteService.getOpenCloseTimeByDay(day);
        var openTime = getOpenCloseTimeByDay.openTime;
        var closeTime = getOpenCloseTimeByDay.closeTime;
        var userData = "";
        $scope.$parent.collectionDate = $scope.collectionDate;
        if ($scope.retailerType == 'Manual')
        {
            userData = '{"uuid":"' + $routeParams.uuid
                    + '","packagecollectionreadydate" :"'
                    + $scope.$parent.packageCollectiondate
                    + '","packagecollectionreadyfrom" :"'
                    + $scope.deliveryObj.packagefrom + '","'
                    + openTime + '":"'
                    + $scope.deliveryObj.shopopen + '","'
                    + closeTime + '":"'
                    + $scope.deliveryObj.shopclose
                    + '","retailerstoreopentime":"'
                    + $scope.deliveryObj.shopopen
                    + '","retailerstoreclosetime":"'
                    + $scope.deliveryObj.shopclose + '"}';
        }
        else
        {
            userData =
                    {
                        uuid: $routeParams.uuid,
                        packagecollectionreadydate: $scope.$parent.packageCollectiondate,
                        packagecollectionreadyfrom: $scope.deliveryObj.packagefrom
                    };
        }
        console.log(userData);
        restservice.put(envconfig.get('host') + "/bookings/bookingrequest/updateRetailerAndDates", '',
                function (data, status)
                {
                    document.getElementById("label").innerHTML = '<i class="icon icon-onthedot-icons-20"></i> &nbsp;'
                            + $scope.collectionDate
                            + " - "
                            + $scope.deliveryObj.packagefrom;
                    document.getElementById("storeTime").innerHTML = data.retailerstoreopentime + " - " + data.retailerstoreclosetime;
                    $('#datetimepicker1').data("DateTimePicker").setDate(
                            deliDate);
                    if ($scope.retailerType != 'Manual') {
                        if (data) {
                            var getOpenCloseTimeByDay = YourQuoteService.getOpenCloseTimeByDay(moment(data.packagecollectionreadydate).format('ddd'));
                            var openTime = data[getOpenCloseTimeByDay.openTime];
                            var closeTime = data[getOpenCloseTimeByDay.closeTime];
                        } else {
                            var openTime = "Closed";
                            var closeTime = "Closed";
                        }
                        document.getElementById("storeTime").innerHTML = openTime + " - " + closeTime;
                    }
                }, function (data, status)
        {
            // error message
        }, userData);
        modalservice.close();
    };
    $scope.saveEditData = function (deliveryObj)
    {
        $scope.$parent.collectiondateFlag = true;
        $scope.$parent.packagecollectionreadyfrom = $scope.editDeliveryObj.packagefrom;
        $scope.$parent.packageCollectiondate = moment($("#datetimepicker2 input").val(), "DD-MM-YYYY").format('YYYY-MM-DD');
        $scope.$parent.packageDate = moment($("#datetimepicker2 input").val(), "DD-MM-YYYY").format('YYYY-MM-DD');
        $scope.$parent.deliverydate = moment($("#datetimepicker2 input").val(), "DD-MM-YYYY").format('YYYY-MM-DD');
        $scope.editDeliveryObj = angular.copy(deliveryObj);
        $scope.collectionDate = moment($("#datetimepicker2 input").val(), "DD-MM-YYYY").format('DD-MM-YYYY');
        $scope.packageDate = $('#datetimepicker2').data(
                "DateTimePicker").getDate();
        $('#datetimepicker1').data("DateTimePicker").setDate(moment($("#datetimepicker2 input").val(), "DD-MM-YYYY"));
        var day = moment($("#datetimepicker2 input").val(), "DD-MM-YYYY").format('ddd');
        var getOpenCloseTimeByDay = YourQuoteService.getOpenCloseTimeByDay(day);
        var openTime = getOpenCloseTimeByDay.openTime;
        var closeTime = getOpenCloseTimeByDay.closeTime;
        var userData = "";
        if ($scope.retailerType == 'Manual')
        {
            userData = '{"uuid":"'
                    + $routeParams.uuid
                    + '","packagecollectionreadydate" :"'
                    + $scope.editDeliveryObj.packageDate
                    + '","packagecollectionreadyfrom" :"'
                    + $scope.editDeliveryObj.packagefrom
                    + '","' + openTime + '":"'
                    + $scope.editDeliveryObj.shopopen + '","'
                    + closeTime + '":"'
                    + $scope.editDeliveryObj.shopclose
                    + '","retailerstoreopentime":"'
                    + $scope.editDeliveryObj.shopopen
                    + '","retailerstoreclosetime":"'
                    + $scope.editDeliveryObj.shopclose + '"}';
        }
        else
        {
            userData =
                    {
                        uuid: $routeParams.uuid,
                        packagecollectionreadydate: $scope.$parent.packageDate,
                        packagecollectionreadyfrom: $scope.editDeliveryObj.packagefrom
                    };
        }
        console.log(userData);
        restservice
                .put(
                        envconfig.get('host')
                        + "/bookings/bookingrequest/updateRetailerAndDates",
                        '', function (data, status)
                        {
                            // document.getElementById("label").innerHTML
                            // = $scope.collectionDate;
                            document.getElementById("storeTime").innerHTML = data.retailerstoreopentime + " - " + data.retailerstoreclosetime;
                            $scope.$parent.timeslots();
                        }, function (data, status)
                {
                    // error message
                }, userData);
        modalservice.close();
    };
    function createMarker(map, latlng, label, html, color) {
//        alert("createMarker(" + latlng + "," + label + "," + html + "," + color + ")");
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
    $scope.getLocation = function ()
    {
        var geocoder = new google.maps.Geocoder();
        var directionsDisplay;
        var directionsService = new google.maps.DirectionsService();
        var map;
        directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers: true});
        $scope.retailerpostcode = "FIQQ 1ZZ";
        var start = $scope.bookingObj.store.address.postCode;
        var end = $scope.bookingObj.consumer.address.postCode;
        var loc = new google.maps.LatLng($scope.lat, $scope.lng);
        var myOptions =
                {
                    zoom: 6,
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    center: loc
                };
        //
        var waypts = [
            {
                location: new google.maps.LatLng($scope.lat, $scope.lng),
                stopover: true
            }];
        var PtsArray = [];
        // Give input as postcode/place name as a single string
        // seperated by pipeline character as follows.
        // var mapOptions = "";
        var request =
                {
                    origin: start,
                    destination: end,
                    waypoints: waypts,
                    optimizeWaypoints: false, // set this to true to
                    // get optimized path
                    // else it will plot as
                    // the given input.
                    travelMode: google.maps.DirectionsTravelMode.DRIVING
                            // set your travel mode here (walking,driving..)
                };
        // console.log(mapOptions);
        directionsService.route(request, function (response, status)
        {
            if (status == google.maps.DirectionsStatus.OK)
            {
                var toolTipDetails = "";
                map = new google.maps.Map(document.getElementById("map-container"), myOptions);
                directionsDisplay.setMap(map);
                directionsDisplay.setDirections(response);
                var route = response.routes[0];
                var total = 0;
                var numberLegs = route.legs.length;
                var legs = route.legs;
                for (var i = 0; i < legs.length; i++) {
                    console.log(legs[i]);
                    var markerletter = "A".charCodeAt(0);
                    markerletter += i;
                    markerletter = String.fromCharCode(markerletter);
                    if (i == 0) {
                        var collectFromDet = $scope.bookingObj.store.retailerName + "\n" + $scope.bookingObj.store.address.firstLine + "," + $scope.bookingObj.store.address.city + " | " + $scope.bookingObj.store.address.postCode;
                        toolTipDetails = "Collect from:\n" + collectFromDet;
                    } else {
                        toolTipDetails = "Driver Details:\n" + legs[i].start_address;
                    }
                    //createMarker(directionsDisplay.getMap(),legs[i].start_location,toolTipDetails,markerletter);
                    createMarker(directionsDisplay.getMap(), legs[i].start_location, toolTipDetails, "", markerletter);
                }
                var i = legs.length;
                var markerletter = "A".charCodeAt(0);
                markerletter += i;
                markerletter = String.fromCharCode(markerletter);
                //toolTipDetails = "Delivery to:<br>"+legs[legs.length-1].end_address;
                var destDet = "Delivery to:\n" + $scope.bookingObj.consumer.name + "\n" + $scope.bookingObj.consumer.address.firstLine + "," + $scope.bookingObj.consumer.address.city + " | " + $scope.bookingObj.consumer.address.postCode;
                createMarker(directionsDisplay.getMap(), legs[legs.length - 1].end_location, destDet, "", markerletter);
            }
            else
            {
                //alert("Could not load data.." + status);
                $scope.showError = true;
            }
        });
    };
    if ($scope.trackmap)
    {
        $scope.getLocation();
    }
    // MRS CANCEL BOOKING
    $scope.cancelBooking = function () {
        // var r = confirm("Are you sure you want to cancel this
        // booking?");
        // if (r != true)
        // return;
        $scope.closeModal();
        /*var userid = $scope.userid;
         var bookingStatus = $scope.bookingStatus;
         var transactionDate = $scope.transactionDate;
         if (!userid || userid == '')
         {
         alert('This should not have happened. Arg userid is invalid.');
         return;
         }
         if (!bookingStatus || bookingStatus == '')
         {
         alert('This should not have happened. Arg Booking Status is invalid.');
         return;
         }
         if (!transactionDate || transactionDate == '')
         {
         alert('This should not have happened. Arg Transaction date is invalid.');
         return;
         }
         if (isNaN(transactionDate))
         {
         alert('This should not have happened. Arg Transaction date is not a number.');
         return;
         }*/
        var userData = {};
        var cancelBookingUrl = envconfig.get('host') + "/booking/cancelbooking/" + $scope.orderNo;
        restservice.delete(cancelBookingUrl, '', function (data, status) {
            console.log(status);
            console.log(data);
            location.reload();
        },
                function (data, status) {
                    console.log(status);
                    console.log(data);
                    alert('Sorry! It appears there was a problem with your booking. Please try again…');
                }, userData);
    };
    $scope.triggerNewPinTimer = function ()
    {
        var stop = $interval(function ()
        {
            if ($scope.isEnableNewPin())
            {
                $scope.isPinDisable = false;
                $scope.stopInterval();
            }
            else
            {
                $scope.isEnableNewPin();
            }
        }, 1000);
        $scope.stopInterval = function ()
        {
            if (angular.isDefined(stop))
            {
                $interval.cancel(stop);
                stop = undefined;
            }
        };
    };
    $scope.genNewPin = function ()
    {
        if (!$scope.isPhoneValidate && !$scope.isPinDisable)
        {
            $scope.isPinDisable = true;
            $cookies.smsSentTime = null;
            $cookies.smsSentTime = moment().unix();
            $scope.triggerNewPinTimer();
        }
    };
    $scope.generateNewPin = function ()
    {
        if (!$scope.phoneNoValidatedStatus
                && !$scope.isPinDisable)
        {
            $scope.isPinDisable = true;
            $cookies.smsSentTime = null;
            $cookies.smsSentTime = moment().unix();
            $scope.triggerNewPinTimer();
            $scope.requestPIN();
        }
    };
    $scope.isEnableNewPin = function ()
    {
        if (!$scope.isPhoneValidate && $cookies.smsSentTime)
        {
            var currentTime = moment().unix();
            var diff = currentTime - $cookies.smsSentTime;
            // console.log($cookies.smsSentTime);
            // console.log(currentTime);
            // console.log(diff );
            return (diff >= 180) ? true : false;
        }
        else
        {
            return false;
        }
    };

    $scope.clearErrormsg = function () {
        $scope.failedCode = false;
    };

    if (!$scope.isPhoneValidate && $cookies.smsSentTime)
    {
        $scope.triggerNewPinTimer();
    }

    $scope.verifyPIN = function (isValid)
    {
        if (!isValid) {
            return
        }

        $scope.servicekey = "";
        restservice
                .get(
                        envconfig.get('host')
                        + "/config?key=smsapiservicekey",
                        '',
                        function (data, status)
                        {
                            $scope.servicekey = data.value;
                            // restservice
                            // .get(
                            // envconfig
                            // .get('host')
                            // + "/getUserProfile?userName="
                            // + $rootScope.loggedUser,
                            // '',
                            // function(data,
                            // status)
                            var userProfileUrl = envconfig
                                    .get('host')
                                    + "/user-profile";
                            restservice
                                    .get(
                                            userProfileUrl,
                                            '',
                                            function (data,
                                                    status)
                                            {
                                                $scope.scimId = data.id;
                                                $scope.userName = $rootScope.loggedUser;
                                                $scope.phoneNo = data.telephoneNumber;
                                                $scope.transref = data.smsTransReference;
                                                $scope.pin = $scope.activeCode;
                                                var userData =
                                                        {
                                                            "servicekey": $scope.servicekey,
                                                            "transref": $scope.transref,
                                                            "pin": $scope.pin,
                                                            "scimid": $scope.scimId,
                                                            "username": $scope.userName
                                                        };
                                                restservice
                                                        .post(
                                                                envconfig
                                                                .get('host')
                                                                + "/verifyPin",
                                                                '',
                                                                function (
                                                                        data,
                                                                        status)
                                                                {
                                                                    if (data.status == 'success')
                                                                    {
                                                                        $scope.phoneNoValidatedStatus = true;
                                                                        $timeout(
                                                                                function ()
                                                                                {
                                                                                    modalservice
                                                                                            .close();
                                                                                    $scope.phoneNoValidatedStatus = false;
                                                                                    $location
                                                                                            .path('/my-profile');
                                                                                    $route
                                                                                            .reload();
                                                                                    restservice
                                                                                            .get(
                                                                                                    envconfig
                                                                                                    .get('host')
                                                                                                    + "/phoneNoRedirection?userName="
                                                                                                    + $rootScope.loggedUser,
                                                                                                    '',
                                                                                                    function (
                                                                                                            data,
                                                                                                            status)
                                                                                                    {
                                                                                                        if (data.redirectionUrl != null)
                                                                                                        {
                                                                                                            $window
                                                                                                                    .open(
                                                                                                                            data.redirectionUrl,
                                                                                                                            "_self");
                                                                                                        }
                                                                                                        else
                                                                                                        {
                                                                                                            $location
                                                                                                                    .path('/my-deliveries');
                                                                                                        }
                                                                                                    },
                                                                                                    function (
                                                                                                            data,
                                                                                                            status)
                                                                                                    {
                                                                                                    });
                                                                                },
                                                                                3000);
                                                                        // modalservice.close();
                                                                    }
                                                                    else if (data.status == 'failed')
                                                                    {
                                                                        var reason = data.reason;
                                                                        // alert(reason);
                                                                        if (reason == "EXPIRED")
                                                                        {
                                                                            $scope.expiredCode = true;
                                                                        }
                                                                        else
                                                                        {
                                                                            $scope.failedCode = true;
                                                                        }
                                                                    }
                                                                    /*
                                                                     * $scope.updateSuccess =
                                                                     * true;
                                                                     * $timeout(function() {
                                                                     * $scope.updateSuccess =
                                                                     * false; },
                                                                     * 3000);
                                                                     */
                                                                },
                                                                function (
                                                                        data,
                                                                        status)
                                                                {
                                                                    /*
                                                                     * $scope.updateFailed =
                                                                     * true;
                                                                     * $timeout(function() {
                                                                     * $scope.updateFailed =
                                                                     * false; },
                                                                     * 3000);
                                                                     */
                                                                },
                                                                userData);
                                            }, function (data,
                                            status)
                                    {
                                        // error message
                                    });
                        }, function (data, status)
                {
                    // error message
                });
    }
});
