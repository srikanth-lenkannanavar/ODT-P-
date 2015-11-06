'use strict';
angular.module('app').controller('RetailerSignupCtrl', function ($scope, $rootScope, $http, $location, $modal, postcodeService, geocodeservice, restservice, modalservice, $routeParams, $window, envconfig, CommonService) {
    $scope.isBankholiay = false;
    $scope.manuallySelected = false;
    $scope.isGo = true;
    $scope.isPostCodeServiceable = false;
    $scope.postCodeValue = 'HA11JU';
    $scope.retailerRegister = {};





    $scope.registerRetailerSave = function (isValid)
    {

        if (!isValid) {
            $scope.manuallySelected = true;
            return;
        }
    }

    $scope.bankholiday = function (val)
    {
        if (val === 'Yes')
        {
            $scope.isBankholiay = true;
        }
        else
        {
            $scope.isBankholiay = false;
        }
    };


    $scope.enterAddress = function ()
    {
        $scope.manuallySelected = true;
    };




    $scope.retailer =
            {
                openTime: '09:30',
                closeTime: '18:00'
            };


    $scope.go = function (path)
    {
        $location.path(path + $scope.mydeliveryuser.postCodeValue);
    };
    $scope.updateDefault = function (value)
    {
        $scope.postCodeValue = value;
        if ($scope.postCodeValue === 'HA11JU')
        {
            $scope.validatePostCode();
            $scope.isGo = false;
            $scope.isPostCodeServiceable = true;
        }
        else
        {
            modalservice.show('lg', 'views/template/modal/retailer/signup-notification.html', 'ModalRetailerSignupCtrl', $scope, 'medium-dialog');
        }
    };


    $scope.edit = function ()
    {
        $scope.isGo = true;
    };


    $scope.validatePostCode = function () // mydeliveryuser
    {
        var flagpostcode = $scope.mydeliveryuser.hiddenpostcodevalue;
        if (flagpostcode == null)
        {
            $scope.mydeliveryuser.hiddenpostcodevalue = $scope.mydeliveryuser.postCodeValue;
            var result = postcodeService.validate($scope.mydeliveryuser.postCodeValue);
            if (result !== false)
            {
                var postcodepart = result.split(" "); // get with url,config,successcallback and
                // errorcallback
                restservice.get(envconfig.get('host') + "/bookings/deliveryAdd/" + postcodepart.join(''), '',
                        function (data, status)
                        {
                            if (data.hasOwnProperty('serviced'))
                            {
                                $location.path(data['uuid'] + "/Booking/Retailers/" + postcodepart.join(''));
                                $scope.mydeliveryuser.hiddenpostcodevalue = '';
                            }
                        },
                        function (data, status)
                        {
                            if (data.hasOwnProperty('enclosedObject') && data.enclosedObject !== null && data.enclosedObject !== '')
                            {
                                $rootScope.noServiceUUID = data.enclosedObject;
                                $scope.mydeliveryuser.hiddenpostcodevalue = null;
                                modalservice.show('md', '../views/template/modal/getquot-notification.html', 'ModalCtrl', $scope, '');
                            }
                        });
            }
            else
            {
                $scope.mydeliveryuser.postCodeValue = null;
                $scope.mydeliveryuser.hiddenpostcodevalue = null;
            }
        }
    };

    // getting the location
    $scope.findAndUseLocation = function (position)
    {
        if (navigator.geolocation)
        {
            navigator.geolocation.getCurrentPosition($scope.getPostalCode);
        }
        else
        {
            $scope.alertfunc('Geolocation is not supported by this browser.');
        }
    }; // getting the postcode

    $scope.geolocate = function (position)
    {
        if (navigator.geolocation)
        {
            navigator.geolocation.getCurrentPosition($scope.getPosition);
        }
        else
        {
            $scope.geolocation = new google.maps.LatLng(51.5072, 0.1275); // By default london lat
            // lng. have to move this to property file.
        }
    };
    $scope.getPosition = function (position)
    {
        $scope.geolocation = new google.maps.LatLng(
                position.coords.latitude,
                position.coords.longitude);
    };
    $scope.geolocate();


    $scope.getAllStates = function (callback)
    {
        callback($scope.allStates);
    };


    var url1 = "http://localhost:8383/app/scripts/json/addressdropdown.json";
    $http.get(url1).
//    $http.get(
//            envconfig.get('host') + '/address/'
//            + $routeParams.uuid).
            success(
                    function (data, status, headers, config)
                    {
                        console.log(angular.fromJson(data.enclosedObject));
                        if (data && data.enclosedObject)
                        {
                            $scope.posts = angular.fromJson(data.enclosedObject);
                            $scope.posts[0].town;
                        }
                    }).error(function (data, status, headers, config)
    {
        // log error
    });

    $scope.person = {};

    $scope.addressSelected = function ()
    {

        $scope.$watch(function ()
        {
            $scope.manuallySelected = true;
            $scope.addressOfRetailer = $scope.person.selected;
        }
        );
    };
});


