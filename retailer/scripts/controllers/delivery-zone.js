'use strict';

/**
 * @ngdoc function
 * @name app.controller:AboutCtrl
 * @description # AboutCtrl Controller of the app
 */
angular
    .module('app')
    .controller(
    'DeliveryZoneCtrl',
    function($scope, $rootScope, $http, $location, $modal,
             postcodeService, geocodeservice, restservice,
             modalservice, $routeParams,$window, envconfig, CommonService)
    {

        $scope.times = CommonService.shopOpenningTimes;
        $scope.closetimes = CommonService.closeTimes;
        $scope.shopopen = $scope.times[$scope.times.indexOf('09:30')];
        $scope.shopclose = $scope.closetimes[$scope.closetimes
            .indexOf('18:30')];

        $scope.uuid = $routeParams.uuid;
        $scope.retailers = '';
        $scope.postcodeInvalid=false;

        if (!$routeParams.uuid && $routeParams.userpostcode)
        {

            restservice.get(envconfig.get('host')
                + "/bookings/deliveryAdd/"
                + $routeParams.userpostcode.replace(/ /g, ""), '', function(data,
                                                                            status)
            {

                $location.path(data.uuid + '/Booking/Retailers/'
                    + $routeParams.userpostcode);
                // console.log(envconfig.get('home')
                // +data.uuid+"/booking/Retailers/"+$routeParams.userpostcode);
            }, function(data, status)
            {
                // console.log(data);
            });
        }

        // $scope.imageClick1();
        $scope.search =
        {
            content : ""
        };

        $scope.names = "";
        $scope.isAddressEmpty = false;

        $scope.retailer =
        {
            openTime : '09:30',
            closeTime : '18:00',
            pickupTime : '',
            pickupPoint : '',
            addressLine1 : '',
            city : '',
            postalCode : ''
        }

        $scope.alerts = [];
        $scope.predictionArray = [];

        $scope.mymodal =
        {
            modalInstance : ''
        };

        $scope.uuid = $routeParams.uuid;

        $scope.mydeliveryuser =
        {
            postCodeValue : '',
            hiddenpostcodevalue : null
        };

        function partition(arr, size)
        {
            var newArr = [];
            for (var i = 0; i < arr.length; i += size)
            {
                newArr.push(arr.slice(i, i + size));
            }
            return newArr;
        }

        $scope.oneAtATime = true;

        $scope.addItem = function()
        {
            var newItemNo = $scope.items.length + 1;
            $scope.items.push('Item ' + newItemNo);
        };

        $scope.status =
        {
            isFirstOpen : false,
            isSecondOpen : true,
            isFirstDisabled : false
        };

        $scope.partitionedData = [];

        $scope.getLocation = function(postCode)
        {
            var postalCode = $routeParams.userpostcode;

            $scope.mydeliveryuser.postCodeValue = postalCode.replace(/ /g, "").toUpperCase();

            geocodeservice.getLocation(postCode, $scope.drawmap,
                function(results, status)
                {
                    $scope.$apply(function(){
                        $scope.postcodeInvalid = true;
                    });
                });

        };
        $scope.drawmap = function(results, status)
        {
            $scope.mydeliveryuser.latlong = results[0].geometry.location;

            restservice.get(envconfig.get('host')
                    + "/retailer/getretailers?postCode="
                    + $scope.mydeliveryuser.postCodeValue.replace(/ /g, "")
                    + "&latLong="
                    + $scope.mydeliveryuser.latlong.lat() + ","
                    + $scope.mydeliveryuser.latlong.lng()
                    + "&userName=" + $rootScope.loggedUser, '',
                // envconfig.get('host')+"/retailer/getretailers", '',
                function(data, status)
                {
                    $scope.retailers = data;
                    $scope.partitionedData = partition(
                        $scope.retailers, 3);
                    if ($scope.partitionedData.length)
                    {

                        $scope.status =
                        {
                            isFirstOpen : true,
                            isSecondOpen : false
                        };
                    }
                    $scope
                        .bookingrequest($scope.uuid,
                        $scope.retailers);

                }, function(data, status)
                {
                    // error message
                });

            var location = results[0].geometry.location, mapOptions =
            {
                center : location,
                zoom : 11,
                mapTypeId : google.maps.MapTypeId.ROADMAP
            }, map = new google.maps.Map(document
                .getElementById("map-container"), mapOptions), marker = new google.maps.Marker(
                {
                    map : map,
                    position : results[0].geometry.location,
                    icon :
                    {
                        // path : google.maps.SymbolPath.CIRCLE,
                        // scale : 5,
                        // fillColor : '#43B02A',
                        // fillOpacity : 1.0,
                        // strokeColor : '#43B02A',
                        // strokeOpacity : 1.0
                        url: "images/delivery_postcode_pin_start.png" // url
                    }
                }), circle = new google.maps.Circle(
                {
                    center : results[0].geometry.location,
                    radius : 8047,
                    map : map,
                    fillColor : '#43B02A',
                    fillOpacity : 0.5,
                    strokeColor : '#43B02A',
                    strokeOpacity : 0.4
                });


            google.maps.event.addDomListener(window, "resize", function() {
                var latLong = map.center;
                google.maps.event.trigger(map, "resize");
                map.setCenter(latLong);
            });                

        };

        function partition(arr, size)
        {
            var newArr = [];
            for (var i = 0; i < arr.length; i += size)
            {
                newArr.push(arr.slice(i, i + size));
            }
            return newArr;
        }

        $scope.imageClick = function(object)
        {
            var cid = object.target.attributes['data-cid'].value;
            var rowindex = object.target.attributes['data-rowid'].value;
            var flipPanel = cid.split("-")[0];

            $("#flip" + rowindex + "-panel").html("");
            $("#flip" + rowindex + "-panel").append(
                $("#" + cid).html());
            $(".show-panel").hide();
            $(".retailer-logo img").removeClass("active");
            $(object.target).addClass("active");
            $("#flip" + rowindex + "-panel").slideDown("slow");
        }

        $scope.getLocation($routeParams.userpostcode);

        $scope.bookingrequest = function(uuid, retailers)
        {
            restservice
                .get(
                    envconfig.get('host')
                    + "/bookings/bookingrequest/"
                    + uuid,
                '',
                function(data, status)
                {

                    $scope.retailerType = data.retailertype;
                    if ($scope.retailerType == 'Manual')
                    {

                        $scope.retailerDataPresent = CommonService
                            .retailerPresent(
                            retailers, data);

                        // console.log($scope.retailerDataPresent);
                        if ($scope.retailerDataPresent)
                        {
                            $scope.retailer.postalCode = data.retailerpostalcode;
                            $scope.retailer.openTime = data.retailerstoreopentime;
                            $scope.retailer.closeTime = data.retailerstoreclosetime;
                            $scope.retailer.pickupPoint = data.retailername;
                            $scope.retailer.addressLine1 = data.retaileraddressline1;
                            $scope.retailer.city = data.retailercity;
                            $scope.status =

                                $scope.status =
                                {
                                    isFirstOpen : false,
                                    isSecondOpen : true
                                };
                        }
                    }

                }, function(data, status)
                {
                    // error while fetching
                    // failure
                });
        };

        $scope.addressdropdown = function()
        {
            // restservice
            // .get(
            // envconfig.get('host')
            // + "/getUserProfile?userName="
            // + $rootScope.loggedUser,
            // '',
            // function(data, status)

            var userProfileUrl = envconfig.get('host')
                + "/user-profile";

            restservice
                .get(userProfileUrl,
                '',
                function(data, status)
                {
                    if (data.address == null
                        || data.address == '')
                    {
                        $scope.isAddressEmpty = false;
                    }
                    else
                    {
                        // console.log(data)
                        $scope.names = angular
                            .fromJson(data.address);
                        // $scope.selectedOption =
                        // $scope.names[1];
                        if ($scope.names.length > 0)
                        {
                            $scope.isAddressEmpty = true;
                        }
                        else
                        {
                            $scope.isAddressEmpty = false;
                        }
                        for (var i = 0; i < $scope.names.length; i++)
                        {
                            if ($scope.names[i].postalcode
                                .toUpperCase() == $scope.mydeliveryuser.postCodeValue
                                .toUpperCase())
                            {
                                $scope.selectedOption = $scope.names[i];
                            }
                        }
                    }
                }, function(data, status)
                {
                    $scope.isAddressEmpty = false;
                    // failure
                });

        };

        $scope.updateDefault = function(value)
        {
            $scope.validatePostCode();
            var flag = true;
            for (var i = 0; i < $scope.names.length; i++)
            {
                if ($scope.names[i].postalcode.toUpperCase() == value
                    .toUpperCase())
                {
                    flag = false;
                    $scope.selectedOption = $scope.names[i];
                }
            }
            if (flag)
            {
                $scope.selectedOption = 'New';
            }
        };

        $scope.postValueChange = function(selectedOption)
        {

            if ($scope.selectedOption == null)
            {
                $scope.mydeliveryuser.postCodeValue = '';
            }
            $scope.mydeliveryuser.postCodeValue = $scope.selectedOption.postalcode
                .toUpperCase();
        };

        if ($rootScope.userLogged)
        {
            $scope.addressdropdown();
        }
        else
        {
            $scope.isAddressEmpty = false;
        }

        $scope.go = function(path)
        {
            $location.path(path
                + $scope.mydeliveryuser.postCodeValue);

        };

        $scope.navigate = function(path)
        {
            $location.path($scope.uuid + path);

        };

        $scope.validatePostCode = function() // mydeliveryuser
        {
            /*
             * for (var i = 0; i < $scope.names.length; i++) { if
             * ($scope.names[i].postalcode == mydeliveryuser) {
             * $scope.selectedOption = $scope.names[i]; } }
             */

            var flagpostcode = $scope.mydeliveryuser.hiddenpostcodevalue;
            if (flagpostcode == null)
            {
                $scope.mydeliveryuser.hiddenpostcodevalue = $scope.mydeliveryuser.postCodeValue;
                var result = postcodeService
                    .validate($scope.mydeliveryuser.postCodeValue);

                if (result !== false)
                {
                    var postcodepart = result.split(" ");

                    // get with url,config,successcallback and
                    // errorcallback
                    restservice
                        .get(
                            envconfig.get('host')
                            + "/bookings/deliveryAdd/"
                            + postcodepart.join(''),
                        '',
                        function(data, status)
                        {

                            if (data
                                .hasOwnProperty('serviced'))
                            {
                                $location
                                    .path(data['uuid']
                                        + "/Booking/Retailers/"
                                        + postcodepart
                                            .join(''));
                                $scope.mydeliveryuser.hiddenpostcodevalue = '';
                            }

                        },
                        function(data, status)
                        {
                            if (data
                                .hasOwnProperty('enclosedObject')
                                && data.enclosedObject !== null
                                && data.enclosedObject !== '')
                            {
                                $rootScope.noServiceUUID = data.enclosedObject;
                                $scope.mydeliveryuser.hiddenpostcodevalue = null;
                                modalservice
                                    .show(
                                    'md',
                                    'views/template/modal/getquot-notification.html',
                                    'ModalCtrl',
                                    $scope,
                                    '');
                            }
                        });

                }
                else
                {
                    $scope.mydeliveryuser.postCodeValue = null;
                    $scope.mydeliveryuser.hiddenpostcodevalue = null;
                    // document.getElementById('postcode').focus();
                    // $scope.alertfunc("Please enter a valid post
                    // code");
                }
            }
        };

        // getting the location
        $scope.findAndUseLocation = function(position)
        {
            if (navigator.geolocation)
            {
                navigator.geolocation
                    .getCurrentPosition($scope.getPostalCode);

            }
            else
            {
                $scope
                    .alertfunc('Geolocation is not supported by this browser.');

            }
        };

        // getting the postcode
        $scope.getPostalCode = function(position)
        {
            geocodeservice.getPostalCode(position,
                $scope.updatepostcode, $scope.alertfunc);
        };

        // updating the ui after getting the results from service
        $scope.updatepostcode = function(postcode)
        {
            $scope.mydeliveryuser.postCodeValue = postcode;
            $scope.$apply();
        };

        $scope.showmodal = function()
        {
            modalservice.show('', 'myModalContent.html',
                'DeliveryZoneCtrl')
        };

        $scope.hidemodal = function()
        {
            modalservice.hide();
        };

        // updating the ui after getting the results from service
        $scope.alertfunc = function(message)
        {
            $scope.alerts = [];
            $scope.alerts.push(
                {
                    type : 'danger',
                    msg : message
                });
        };

        // start - this is a reduntant code. committing now.will
        // need some time to correct
        $scope.geolocate = function(position)
        {
            if (navigator.geolocation)
            {
                navigator.geolocation
                    .getCurrentPosition($scope.getPosition);
            }
            else
            {
                $scope.geolocation = new google.maps.LatLng(
                    51.5072, 0.1275); // By default london lat
                // lng. have to move
                // this to property
                // file.
            }
        }

        $scope.getPosition = function(position)
        {
            $scope.geolocation = new google.maps.LatLng(
                position.coords.latitude,
                position.coords.longitude);
        };
        $scope.geolocate();

        // end

        $scope.predict = function()
        {
            $scope.searchcontent = $scope.search.content;
            $scope.dropDownVal = [];
            $scope.placeResultArray = [];
            // hide the autosuggest
            /*
            if ($scope.searchcontent.length == 0)
            {
                results.style.display = "none";
            }*/

            if($scope.searchcontent.length > 0){
                var service = new google.maps.places.AutocompleteService();
                return service.getPlacePredictions(
                    {
                        input : $scope.searchcontent,
                        componentRestrictions :
                        {
                            country : 'uk'// move this to cassandra
                        },
                        radius : 8047,// move this to cassandra
                        location : $scope.mydeliveryuser.latlong
                    }, $scope.pcallback);

            }

        }

        $scope.pcallback = function(predictions, status)
        {
            $scope.predictionArray = predictions;
            if (status != google.maps.places.PlacesServiceStatus.OK) { return; }
            document.getElementById('results');
            // show the autosuggest
            //$scope.results.style.display = "block";
            $scope.dropDownVal = [];
            $scope.placeResultArray = [];
            $scope.populateDropDown();
        }

        $scope.populateDropDown = function()
        {

            for (var i = 0, prediction; prediction = $scope.predictionArray[i]; i++)
            {
                var placeservice = new google.maps.places.PlacesService(document.getElementById('pickup-point'));
                placeservice.getDetails(
                    {
                        placeId : prediction.place_id
                    }, $scope.fill);
            }

        }
        $scope.fill = function(placeResult, status)
        {
            //var retailer = $scope.searchcontent;
            var retailer = "";
            if (placeResult != null && placeResult.name != null
                && placeResult.name != ''
                && placeResult.formatted_address != null
                && placeResult.formatted_address != '')
            {

                retailer = placeResult.name;

                var retaileraddress = placeResult.formatted_address;
                var array = retaileraddress.split(",");
                //console.log(array);
                if (/\d/.test(retaileraddress))
                {
                    var addressLine = '';
                    for (var i = 0; i < array.length - 1; i++)
                    {
                        addressLine += array[i];
                    }
                    var data =
                    {
                        name : retailer,
                        address : addressLine
                    };

                    // var data =
                    // {name:retailer,address:retaileraddress};
                    $scope.dropDownVal.push(data);

                    $scope.placeResultArray.push(placeResult);
                    //console.log($scope.dropDownVal);
                    //console.log($scope.placeResultArray);
                    if($scope.dropDownVal){
                        document.getElementById('results').style.display = "block";
                    }else{
                        document.getElementById('results').style.display = "none";
                    }
                    $scope.$apply();
                }
            }
        }

        $scope.populate = function(index)
        {
            var prediction = $scope.dropDownVal[index];
            var result = $scope.placeResultArray[index];
            //console.log(prediction);

            $scope.search.content = prediction.name+ "," + prediction.address;
            //$scope.results.style.display = "none";
            $scope.fillInAddress(result);
            $scope.retailer.openTime = '09:30';
            $scope.retailer.closeTime = '18:00';
            $scope.predictionArray = [];
            $scope.dropDownVal = [];
            // var placeservice = new
            // google.maps.places.PlacesService(document.getElementById('pickup-point'));
            // placeservice.getDetails({placeId:
            // prediction.place_id},$scope.fillInAddress);
        }

        $scope.fillInAddress = function(placeResult)
        {

            $scope.retailer.pickupPoint = '';
            $scope.retailer.addressLine1 = '';
            // $scope.addressLine2 = '';
            $scope.retailer.city = '';
            $scope.retailer.postalCode = '';
            $scope.retailer.lat = placeResult.geometry.location.lat();
            $scope.retailer.lng = placeResult.geometry.location.lng();

            $scope.retailer.pickupPoint = placeResult.name;
            for (var i = 0; i < placeResult.address_components.length; i++)
            {
                var component = placeResult.address_components[i];
                if (component.types[0] == "street_number")
                {
                    var val = component.long_name;
                    $scope.retailer.addressLine1 = $scope.retailer.addressLine1
                        + " " + val;
                }
                else if (component.types[0] == "point_of_interest")
                {
                    var val = component.long_name;
                    $scope.retailer.addressLine1 = $scope.retailer.addressLine1
                        + " " + val;
                }

                else if (component.types[0] == "premise")
                {
                    var val = component.long_name;
                    $scope.retailer.addressLine1 = $scope.retailer.addressLine1
                        + " " + val;
                }
                else if (component.types[0] == "route")
                {
                    var val = component.long_name;
                    $scope.retailer.addressLine1 = $scope.retailer.addressLine1
                        + " " + val;
                }
                else if (component.types[0] == "postal_town")
                {
                    var val = component.long_name;
                    $scope.retailer.city = val;
                }
                else if (component.types[0] == "postal_code")
                {
                    var val = component.long_name;
                    $scope.retailer.postalCode = val;
                }
            }

            if ($scope.retailer.addressLine1 == ''
                || $scope.retailer.city == ''
                || $scope.retailer.postalCode == '')
            {

                var formattedAddress = placeResult.formatted_address;
                var array = formattedAddress.split(",");
                // document.getElementById('jsonText1').value =
                // array.length;
                var country = array[array.length - 1];
                var citypostcode = array[array.length - 2];
                var array1 = citypostcode.split(" ");
                var postalcode = array1[array1.length - 2] + " "
                    + array1[array1.length - 1];
                var city = '';
                for (var i = 0; i <= array1.length - 3; i++)
                {
                    city += array1[i];
                }
                var addressLine = '';
                for (var i = 0; i <= array.length - 3; i++)
                {
                    addressLine += array[i];
                }

                if ($scope.retailer.addressLine1 == '')
                {

                    $scope.retailer.addressLine1 = addressLine;
                }
                if ($scope.retailer.city == '')
                {
                    $scope.retailer.city = city;
                }
                if ($scope.retailer.postalCode == '')
                {
                    $scope.retailer.postalCode = $scope.retailer.postalcode;
                }
            }

            /*******************************************************
             * if ($scope.reatiler.pickupPoint == undefined ||
             * $scope.reatiler.pickupPoint=='') {
                         * //$scope.reatiler.pickupPoint.$setViewValue($scope.reatiler.pickupPoint.$viewValue);
                         * }if ($scope.reatiler.addressLine1=='') {
                         * //$scope.reatiler.addressLine1.$setViewValue($scope.addRetailers.addressLine1.$viewValue); }
             * if ( $scope.reatiler.city=='') { //
                         * $scope.addRetailers.city.$setViewValue($scope.addRetailers.city.$viewValue); }
             * if ($scope.reatiler.postalCode=='') { //
                         * $scope.addRetailers.postalCode.$setViewValue($scope.addRetailers.postalCode.$viewValue);
                         * }if ($scope.reatiler.openTime=='') {
                         * //$scope.addRetailers.openTime.$setViewValue($scope.addRetailers.openTime.$viewValue);
                         * }if ($scope.reatiler.closeTime=='') {
                         * //$scope.addRetailers.closeTime.$setViewValue($scope.addRetailers.closeTime.$viewValue); }
             ******************************************************/
            // $scope.$apply();
        }

        $scope.saveRetailerAddress = function(isValid)
        {
            if (!isValid)
                return;
            // TODO have to find a angular way to do this

            // console.log($scope.addRetailers);

            if (isValid)
            {

                geocodeservice.getLocation(
                    $scope.retailer.postalCode.replace(/ /g, ""),
                    $scope.setRetailerLatLong, function(
                        results, status)
                    {
                        $scope.$apply(function(){
                            $scope.postcodeInvalid = true;
                        });
                    });

                // $location.path($scope.uuid+'/Booking/timeslots);
                // TODO :Explore on a way to get formData in below
                // format using Angular
                /*
                 * var formData = '{"uuid":"' + $routeParams.uuid +
                 * '","retailername":"' +
                 * $scope.retailer.pickupPoint +
                 * '","retaileraddressline1":"' +
                 * $scope.retailer.addressLine1 +
                 * '","retailercity":"' + $scope.retailer.city +
                 * '","retailerpostalcode":"' +
                 * $scope.retailer.postalCode +
                 * '","retailerstoreopentime":"' +
                 * $scope.retailer.openTime +
                 * '","retailerstoreclosetime":"' +
                 * $scope.retailer.closeTime + '"}';
                 *
                 * restservice .put( envconfig.get('host') +
                 * '/bookings/bookingrequest/updateRetailerAdd', '',
                 * function(data, status) { $location
                 * .path($routeParams.uuid + '/Booking/timeslots'); },
                 * function(data, status) { alert("Failed to save
                 * retailer!"); }, formData);
                 */


            }

        }
        /*
         * $scope.saveRetailerAddress = function(){ // TODO have to
         * find a angular way to do this var isValid = true;
         *
         * debugger; if ($scope.retailer.pickupPoint == undefined ||
         * $scope.retailer.pickupPoint=='') {
         * $scope.addRetailers.pickupPoint.$setViewValue($scope.addRetailers.pickupPoint.$viewValue);
         * isValid = false; } if ($scope.retailer.addressLine1 ==
         * undefined || $scope.addressLine1=='') {
         * $scope.addRetailers.addressLine1.$setViewValue($scope.addRetailers.addressLine1.$viewValue);
         * isValid = false; } if ( $scope.retailer.city == undefined ||
         * $scope.retailer.city=='') {
         * $scope.addRetailers.city.$setViewValue($scope.addRetailers.city.$viewValue);
         * isValid = false; } if ($scope.retailer.postalCode ==
         * undefined || $scope.retailer.postalCode=='') {
         * $scope.addRetailers.postalCode.$setViewValue($scope.addRetailers.postalCode.$viewValue);
         * isValid = false; }if ($scope.retailer.openTime ==
         * undefined ||$scope.retailer.openTime=='') {
         * $scope.addRetailers.openTime.$setViewValue($scope.addRetailers.openTime.$viewValue);
         * isValid = false; }if ($scope.retailer.closeTime ==
         * undefined ||$scope.retailer.closeTime=='') {
         * $scope.addRetailers.closeTime.$setViewValue($scope.addRetailers.closeTime.$viewValue);
         * isValid = false; } if(isValid){
         * //$location.path($scope.uuid+'/Booking/timeslots); //
         * TODO :Explore on a way to get formData in below format
         * using Angular var formData = '{"uuid":"'+ $rootScope.uuid +
         * '","retailername":"' + $scope.pickupPoint +
         * '","retaileraddressline1":"'+ $scope.addressLine1 +
         * '","retailercity":"'+ $scope.city
         * +'","retailerpostalcode":"'+ $scope.postalCode
         * +'","retailerstoreopentime":"'+ $scope.openTime
         * +'","retailerstoreclosetime":"'+ $scope.closeTime +'"}';
         *
         * restservice.put(envconfig.get('host')+
         * '/bookings/bookingrequest/updateRetailerAdd','',
         * function(data, status) {
         * $location.path($scope.uuid+'/Booking/timeslots); },
         * function(data, status) { alert("Failed to save
         * retailer!"); },formData); } }
         */

        $scope.showRetailerDetails = function(branch)
        {

            $scope.getLocation($scope.mydeliveryuser.postCodeValue.replace(/ /g, ""));

            $rootScope.retailerType = branch.retailerType;

            var day = moment().utc().format('ddd');
            var openTime = "";
            var closeTime = "";

            if (day == 'Mon')
            {
                openTime = branch.mondayBranchStoreOpenTime;
                closeTime = branch.mondayBranchStoreClosingTime;
            }
            else if (day == 'Tue')
            {
                openTime = branch.tuesdayBranchStoreOpenTime;
                closeTime = branch.tuesdayBranchStoreClosingTime;
            }
            else if (day == 'Wed')
            {
                openTime = branch.wednesdayBranchStoreOpenTime;
                closeTime = branch.wednesdayBranchStoreClosingTime;
            }
            else if (day == 'Thu')
            {
                openTime = branch.thursdayBranchStoreOpenTime;
                closeTime = branch.thursdayBranchStoreClosingTime;
            }
            else if (day == 'Fri')
            {
                openTime = branch.fridayBranchStoreOpenTime;
                closeTime = branch.fridayBranchStoreClosingTime;
            }
            else if (day == 'Sat')
            {
                openTime = branch.saturdayBranchStoreOpenTime;
                closeTime = branch.saturdayBranchStoreClosingTime;
            }
            else if (day == 'Sun')
            {
                openTime = branch.sundayBranchStoreOpenTime;
                closeTime = branch.sundayBranchStoreClosingTime;
            }

            $scope.userData =
            {
                "uuid" : $routeParams.uuid,
                "postcode" : $scope.mydeliveryuser.postCodeValue.replace(/ /g, ""),
                "retailername" : branch.retailerName,
                "retaileraddressline1" : branch.streetName,
                "retailercity" : branch.retailerCity,
                "retailerpostalcode" : branch.postCode,
                "retailertype" : branch.retailerType,
                "username" : branch.userName,
                "retailerBranchName" : branch.retailerBranchName,
                "mondayBranchStoreOpenTime" : branch.mondayBranchStoreOpenTime,
                "mondayBranchStoreClosingTime" : branch.mondayBranchStoreClosingTime,
                "tuesdayBranchStoreOpenTime" : branch.tuesdayBranchStoreOpenTime,
                "tuesdayBranchStoreClosingTime" : branch.tuesdayBranchStoreClosingTime,
                "wednesdayBranchStoreOpenTime" : branch.wednesdayBranchStoreOpenTime,
                "wednesdayBranchStoreClosingTime" : branch.wednesdayBranchStoreClosingTime,
                "thursdayBranchStoreOpenTime" : branch.thursdayBranchStoreOpenTime,
                "thursdayBranchStoreClosingTime" : branch.thursdayBranchStoreClosingTime,
                "fridayBranchStoreOpenTime" : branch.fridayBranchStoreOpenTime,
                "fridayBranchStoreClosingTime" : branch.fridayBranchStoreClosingTime,
                "saturdayBranchStoreOpenTime" : branch.saturdayBranchStoreOpenTime,
                "saturdayBranchStoreClosingTime" : branch.saturdayBranchStoreClosingTime,
                "sundayBranchStoreOpenTime" : branch.sundayBranchStoreOpenTime,
                "sundayBranchStoreClosingTime" : branch.sundayBranchStoreClosingTime,
                "retailerstoreopentime" : openTime,
                "retailerstoreclosetime" : closeTime,
                "zone" : "within"
            };

            if (branch.retailerType == 'Manual')
            {
                $scope.branch = branch;
                $scope.today_date = moment().format('DD/MM/YYYY');
                modalservice
                    .show(
                    'md',
                    'views/template/modal/retailer-shop-modal.html',
                    'DeliveryZoneCtrl', $scope);

            }

            if (branch.retailerType != 'Manual')
            {

                restservice
                    .put(
                        envconfig.get('host')
                        + "/bookings/bookingrequest/updateRetailerAndDates",
                    '',
                    // "http://localhost/BookingModule/services/bookings",'',
                    // envconfig.get('host')+"/retailer/getretailers",
                    // '',
                    function(data, status)
                    {
                        // navigate to next page
                        $location.path($routeParams.uuid
                            + '/Booking/timeslots');
                    }, function(data, status)
                    {
                        // failure
                    }, $scope.userData);                

            }

        }

        $scope.saveOpenAndCloseTime = function()
        {

            modalservice.hide();

            var day = moment().format('ddd');
            var openTime = "";
            var closeTime = "";

            if (day == 'Mon')
            {
                openTime = "mondayBranchStoreOpenTime";
                closeTime = "mondayBranchStoreClosingTime"
            }
            else if (day == 'Tue')
            {
                openTime = "tuesdayBranchStoreOpenTime";
                closeTime = "tuesdayBranchStoreClosingTime"
            }
            else if (day == 'Wed')
            {
                openTime = "wednesdayBranchStoreOpenTime";
                closeTime = "wednesdayBranchStoreClosingTime"
            }
            else if (day == 'Thu')
            {
                openTime = "thursdayBranchStoreOpenTime";
                closeTime = "thursdayBranchStoreClosingTime"
            }
            else if (day == 'Fri')
            {
                openTime = "fridayBranchStoreOpenTime";
                closeTime = "fridayBranchStoreClosingTime"
            }
            else if (day == 'Sat')
            {
                openTime = "saturdayBranchStoreOpenTime";
                closeTime = "saturdayBranchStoreClosingTime"
            }
            else if (day == 'Sun')
            {
                openTime = "sundayBranchStoreOpenTime";
                closeTime = "sundayBranchStoreClosingTime"
            }

            var userData = '{"uuid":"' + $routeParams.uuid
                + '","postcode":"'
                + $scope.mydeliveryuser.postCodeValue
                + '","retailername":"'
                + $scope.branch.retailerName
                + '","retaileraddressline1":"'
                + $scope.branch.streetName
                + '","retailerlatlong":"'
                + $scope.branch.retailerLatLong
                + '","retailercity":"'
                + $scope.branch.retailerCity
                + '","zone":"within","retailerpostalcode":"'
                + $scope.branch.postCode + '","retailertype":"'
                + $scope.branch.retailerType + '","username":"'
                + $scope.branch.userName + '","' + openTime
                + '":"' + $scope.shopopen + '","' + closeTime
                + '":"' + $scope.shopclose
                + '","retailerstoreopentime":"'
                + $scope.shopopen
                + '","retailerstoreclosetime":"'
                + $scope.shopclose + '"}';
            // alert($scope.shopopen);

            /*
             * $scope.userData = { "uuid": $routeParams.uuid,
             * "postcode": $scope.mydeliveryuser.postCodeValue,
             * "retailername": $scope.branch.retailerName,
             * "retaileraddressline1": $scope.branch.streetName,
             * "retailercity":$scope.branch.retailerCity,
             * "retailerpostalcode":$scope.branch.postCode,
             * "retailertype":$scope.branch.retailerType,
             * "username": $scope.branch.userName, "'+openTime+'":
             * $scope.shopopen, closeTime: $scope.shopclose };
             */

            // alert(data);
            restservice.put(envconfig.get('host')
                    + "/bookings/bookingrequest/updateRetailerAdd",
                '',
                // "http://localhost/BookingModule/services/bookings",'',
                // envconfig.get('host')+"/retailer/getretailers",
                // '',
                function(data, status)
                {
                    // navigate to next page
                    $location
                        .path($routeParams.uuid + '/Booking/timeslots');
                }, function(data, status)
                {
                    // failure
                }, userData);            

        }

        $scope.setRetailerLatLong = function(results, status)
        {
            $scope.retailer.lat = results[0].geometry.location
                .lat();
            $scope.retailer.lng = results[0].geometry.location
                .lng();
            $scope.calcDistAndSaveRetailer();
        }

        $scope.calcDistAndSaveRetailer = function()
        {
            var userLat = $scope.mydeliveryuser.latlong.lat();
            var userLong = $scope.mydeliveryuser.latlong.lng();
            var retailerLat = $scope.retailer.lat;
            var retailerLong = $scope.retailer.lng;
            var retailerLatLong = retailerLat + "," + retailerLong;
            var maxDeliveryDistance = "";
            var radius = 6371; // km
            var userName = null;
            if ($rootScope.loggedUser != undefined)
            {
                userName = $rootScope.loggedUser;
            }

            var latDiff = retailerLat - userLat;
            var dLat = latDiff * (Math.PI / 180);
            var longDiff = retailerLong - userLong;
            var dLon = longDiff * (Math.PI / 180);
            var a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(retailerLat * (Math.PI / 180))
                * Math.cos(userLat * (Math.PI / 180))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            var distanceInKms = radius * c;
            var distanceInMiles = distanceInKms / 1.60934;

            restservice
                .get(
                    envconfig.get('host')
                    + "/config?key=radius",
                '',
                function(data, status)
                {
                    radius = data.value;
                    restservice
                        .get(
                            envconfig
                                .get('host')
                            + "/config?key=maxdeliverydistance",
                        '',
                        function(data,
                                 status)
                        {
                            maxDeliveryDistance = data.value;
                            if (distanceInMiles > maxDeliveryDistance)
                            {
                                modalservice
                                    .show(
                                    'md',
                                    'views/template/modal/retailer-distance.html',
                                    'ModalCtrl',
                                    $scope,
                                    '');
                            }
                            else
                            {
                                var zone = "within";
                                if (distanceInMiles > radius
                                    && distanceInMiles < maxDeliveryDistance)
                                {
                                    zone = "betweenradiusandmax";
                                }
                                // persist
                                // retailer-latlong,zone,retailertype
                                // and
                                // username
                                // along
                                // with
                                // retailer
                                // details
                                // in
                                // booking
                                // request
                                // and
                                // navigate
                                // to next
                                // page

                                var day = moment().utc().format('ddd');
                                var openTime = "";
                                var closeTime = "";

                                if (day == 'Mon')
                                {
                                    openTime = "mondayBranchStoreOpenTime";
                                    closeTime = "mondayBranchStoreClosingTime"
                                }
                                else if (day == 'Tue')
                                {
                                    openTime = "tuesdayBranchStoreOpenTime";
                                    closeTime = "tuesdayBranchStoreClosingTime"
                                }
                                else if (day == 'Wed')
                                {
                                    openTime = "wednesdayBranchStoreOpenTime";
                                    closeTime = "wednesdayBranchStoreClosingTime"
                                }
                                else if (day == 'Thu')
                                {
                                    openTime = "thursdayBranchStoreOpenTime";
                                    closeTime = "thursdayBranchStoreClosingTime"
                                }
                                else if (day == 'Fri')
                                {
                                    openTime = "fridayBranchStoreOpenTime";
                                    closeTime = "fridayBranchStoreClosingTime"
                                }
                                else if (day == 'Sat')
                                {
                                    openTime = "saturdayBranchStoreOpenTime";
                                    closeTime = "saturdayBranchStoreClosingTime"
                                }
                                else if (day == 'Sun')
                                {
                                    openTime = "sundayBranchStoreOpenTime";
                                    closeTime = "sundayBranchStoreClosingTime"
                                }
                                var formData = '{"uuid":"'
                                    + $routeParams.uuid
                                    + '","retailername":"'
                                    + $scope.retailer.pickupPoint
                                    + '","retaileraddressline1":"'
                                    + $scope.retailer.addressLine1
                                    + '","retailercity":"'
                                    + $scope.retailer.city
                                    + '","retailerpostalcode":"'
                                    + $scope.retailer.postalCode
                                    + '","retailerstoreopentime":"'
                                    + $scope.retailer.openTime
                                    + '","retailerstoreclosetime":"'
                                    + $scope.retailer.closeTime
                                    + '","' + openTime
                                    + '":"' + $scope.retailer.openTime + '","' + closeTime
                                    + '":"' + $scope.retailer.closeTime
                                    + '","zone":"'
                                    + zone
                                    + '","retailerlatlong":"'
                                    + retailerLatLong
                                    + '","retailertype":"Manual","username":"'
                                    + userName
                                    + '"}';
                                restservice
                                    .put(
                                        envconfig
                                            .get('host')
                                        + '/bookings/bookingrequest/updateRetailerAdd',
                                    '',
                                    // "http://localhost/BookingModule/services/bookings",'',
                                    function(
                                        data,
                                        status)
                                    {
                                        $location
                                            .path($routeParams.uuid
                                                + '/Booking/timeslots');
                                    },
                                    function(
                                        data,
                                        status)
                                    {
                                        alert("Failed to save retailer!");
                                    },
                                    formData);

                            }
                        }, function(data,
                                    status)
                        {
                            // error message
                        });

                }, function(data, status)
                {
                    // error message
                });

        }

        /*
        google.maps.event.addDomListener(window, "resize", function() {
            var winWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
            if(winWidth >= 992 ){
                $("#map-container").hide().show();
                $scope.getLocation($scope.mydeliveryuser.postCodeValue.replace(/ /g, ""));
            }else{
                $("#map-container").hide();
            }
        });
*/

//        var w = angular.element($window);
//        w.bind('resize', function (e) {
//            var winWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
//            if(winWidth){
//                $scope.getLocation($scope.mydeliveryuser.postCodeValue.replace(/ /g, ""));
//            }
//
//        });


    });
