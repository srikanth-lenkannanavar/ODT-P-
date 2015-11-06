'use strict';

/**
 * @ngdoc function
 * @name app.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the app
 */
angular.module('app')
    .controller('YourQuoteCtrl', function ($scope, $rootScope, $http, $location, $modal, $window, $timeout, $routeParams,$q, restservice, modalservice, $filter, envconfig, YourQuoteService, CommonService) {
        $scope.timeslotsArr = {};
        $scope.times = CommonService.shopOpenningTimes;
        $scope.closetimes = CommonService.closeTimes;
        $scope.shopopen = $scope.times[$scope.times.indexOf('9:30')];
        $scope.shopclose = $scope.closetimes[$scope.closetimes.indexOf('6:30')];
        $scope.packageCollectiondate = "";
        $scope.packageDate = "";
        $scope.deliverydate = "";
        $scope.collectiondateFlag = false;
        $scope.pageLoadFlag = false;
        $scope.dsErorrFlag = false;
        $scope.sevenDays = true;
        $scope.retailerstoreopentime = "";
        $scope.retailerstoreclosetime = "";
        $scope.isValidSubscription = false;

        $scope.itemReadyValid = false;
        $scope.irTodayIsLess = false;
        $scope.pickuptime = "Now";
        $scope.pickuptimeOptions = YourQuoteService.pickuptimeOptions;
        $scope.retailerType = "";
        //$scope.retailerType = "Manual";
        $scope.showMorelimit = 20;
        $scope.showMoreQuantity = 1;

            $scope.zone = 'within';
            $scope.amt = '';

            $scope.uuid = $routeParams.uuid;

            $scope.quoteDate = "today";
            $scope.today = '';
            $scope.noTimeSlots = false;

            $scope.timeSlotStartTime = "";
            $scope.timeSlotendTime = "";

            $scope.serverDate = "";

            $scope.dataArray = [];
            $scope.collectionDate = "";
            $scope.retailerpostcode = "";
            $scope.userpostcode = "";

            $scope.showNoTimeslotsFlag = false;
            

        // Disable the datepicker arrow if the package collection date is less than delivery date
        $scope.isPrevDisabled = false;
        $scope.bookingrequest = function (uuid) {
            restservice.get(
                    envconfig.get('host') + "/bookings/bookingrequest/" + uuid, '',
                function (data, status) {

                        if (data.zone)
                        {
                            $scope.zone = data.zone;
                        }
                        // $scope.zone = data.zone;
                        $scope.dataArray = data;
                        $scope.userpostcode = data.postcode;
                        $scope.retailerpostcode = data.retailerpostalcode;
                        console.log($scope.retailerpostcode);
                        //console.log();
                        //debugger;
                        $scope.retailerType = data.retailertype;

                        if($scope.retailerType != 'Manual' && data.deliveryDate){
                            var day = moment(data.deliveryDate).format('ddd');
                            var getOpenCloseTimeByDay = YourQuoteService.getOpenCloseTimeByDay(day);
                            $scope.retailerstoreopentime = data[getOpenCloseTimeByDay.openTime];
                            $scope.retailerstoreclosetime = data[getOpenCloseTimeByDay.closeTime];
                        }else{
                            $scope.retailerstoreopentime = data.retailerstoreopentime;
                            $scope.retailerstoreclosetime = data.retailerstoreclosetime;

                        }
                        //var postalCode = $scope.userpostcode;
                        $scope.packageDate = data.packagecollectionreadydate;
                        if(data.packagecollectionreadydate){
                            $scope.collectionDate =  moment(data.packagecollectionreadydate).format('DD-MM-YYYY');
                        }else{
                            $scope.collectionDate =  moment().format('DD-MM-YYYY');
                        }


                        $scope.timeSlotStartTime = data.timeslotstart;
                        $scope.timeSlotendTime = data.timeslotend;
                        $scope.currentDate = moment(data.currentDate).format('DD-MM-YYYY HH:mm');
                        $scope.serverDate = data.currentDate;
                        var a = moment.utc($scope.serverDate)
                        var currentDt = moment(a).format('x')
                        var london = moment.tz(Number(currentDt), "Europe/London");
                        var currentTimeDate = london.format("DD-MM-YYYY HH:mm")
                        $scope.currentDate = currentTimeDate;
                        $scope.packageCollectiondate = moment(data.currentDate).format('YYYY-MM-DD');
                        //for timeslot expiry

                        if (data.packagecollectionreadydate != null) {
                            var pkgCollDate = moment(data.packagecollectionreadydate).format('DD-MM-YYYY');
                            $scope.pkgreadyDate = (pkgCollDate + " " + data.packagecollectionreadyfrom);
                            //$scope.currentDate = moment().utc().format('DD-MM-YYYY HH:mm');

                            if ($scope.currentDate >= $scope.pkgreadyDate) {
                                $scope.pickuptime = "Now";
                            } else {
                                $scope.pickuptime = "Later";
                                document.getElementById("label").innerHTML = '<i class="icon icon-onthedot-icons-20"></i> &nbsp;'
                                    + moment(data.packagecollectionreadydate).format('DD-MM-YYYY')
                                    + " - "
                                    + data.packagecollectionreadyfrom;
                            }

                            //setting package ready time from server
                            $scope.packageCollectiondate = moment(data.packagecollectionreadydate).format('YYYY-MM-DD');
                        }



                        var deliveryd = data.deliveryDate;
                        if (deliveryd == null) {
                            deliveryd = moment(new Date()).utc();
                        }


                        $scope.deliverydate = moment(deliveryd).format('DD-MM-YYYY');
                        $('#datetimepicker1').data("DateTimePicker").setDate($scope.deliverydate);




                        //call with the page loads to get time slot
                        $scope.timeslots();
                        //document.getElementById("from").innerHTML = $scope.retailerpostcode;
                        //document.getElementById("to").innerHTML = $scope.userpostcode;
                        //document.getElementById("storeTime").innerHTML = $scope.retailerstoreopentime+" - "+$scope.retailerstoreclosetime;

                        $scope.getLocation();

                    
                }, function (data, status) {
                    // error message

                });

        };


            $scope.bookingrequest($scope.uuid);

            $scope.itemReadyChk = function () {
                $scope.irTodayIsLess = false;
                $scope.itemReadyValid = YourQuoteService.getDurationDiff($scope.packagefrom, $scope.shopopen);
                if (!$scope.itemReadyValid) {
                    $scope.collectiondate = $("#collectiondate").val();
                    $scope.irTodayIsLess = YourQuoteService.getTodayDurationDiff($scope.collectiondate, $scope.packagefrom);
                }
            };

            $scope.timeslotCall = function (wen) {
                var dsDate = $('#datetimepicker1').data("DateTimePicker").getDate();
                //console.log($scope.packageCollectiondate);
                //if ($filter('date')(new Date($scope.packageDate), 'yyyy-MM-dd') == dsDate.format('YYYY-MM-DD') && wen != "next") {
                if ($scope.collectionDate == dsDate.format('YYYY-MM-DD') && wen != "next") {
                    return false;
                }
                var changeDsDate = (wen == "next") ? dsDate.add(1, 'days') : dsDate.subtract(1, 'days');
                $('#datetimepicker1').data("DateTimePicker").setDate(changeDsDate);

                var changeddate = moment(changeDsDate.format('MM/DD/YYYY'));
                var currentDate = moment(moment().format('MM/DD/YYYY'));
                var days = moment.duration(changeddate.diff(currentDate)).asDays();
                /*
                if (days >= 7) {
                    $scope.sevenDays = false;
                }

                else
                {
                    $scope.sevenDays = true;
                }
                */
                $scope.deliverydate = dsDate.format('DD-MM-YYYY');

                //$scope.timeslots();
            }


            $scope.timeslots = function () {

                var fmtpackageCollectionDate = '', fmtdeliverydate = '';
                if ($scope.packageCollectiondate == '')
                {
                    fmtpackageCollectionDate = $filter('date')(new Date(), 'yyyy-MM-dd');
                } else {
                    fmtpackageCollectionDate = $scope.packageCollectiondate;
                }
                if ($scope.deliverydate == '')
                {
                    fmtdeliverydate = $filter('date')(new Date(), 'yyyy-MM-dd');
                } else {

                    fmtdeliverydate = $('#datetimepicker1').data("DateTimePicker").getDate().format('YYYY-MM-DD');
                }


                /* var deliverydate = moment(fmtdeliverydate).format('DD-MM-YYYY');
                var packageCollectionDate =  moment(fmtpackageCollectionDate).format('DD-MM-YYYY');
                var ms = moment(deliverydate,"DD-MM-YYYY").diff(moment(packageCollectionDate,"DD-MM-YYYY"));

                if(ms<0) {
                    alert("packageCollectionDate should be less than delivery date");
                    $scope.timeslotsArr = [];
                    $scope.showMoreFlag = false;
                    $scope.showNoTimeslotsFlag = true;
                    return false;
                } */

                var fmtDelData = moment(fmtdeliverydate).format('DD-MM-YYYY');
                $scope.today = moment().format('DD-MM-YYYY');
                if ($scope.today != fmtDelData) {
                    $scope.quoteDate = fmtDelData;
                   // $scope.isPrevDisabled = false;
                } else {
                    $scope.quoteDate = "today";
                   // $scope.isPrevDisabled = true;
                }
                // alert($scope.request.packagecollectionreadydate + " test "+$scope.request.packagedeliveryDate);
                restservice.get(
                        envconfig.get('host') + "/timeslots/" + $routeParams.uuid + "/" + fmtpackageCollectionDate + "/" + fmtdeliverydate, '',
                        function (data, status) {
                            $scope.timeslotsArr = data;
                            $scope.dsErorrFlag = ($scope.timeslotsArr.length > 0) ? false : true;

                            if (!$scope.dsErorrFlag) {
                                $scope.dsRadio = {
                                    res: $scope.timeslotsArr[0].id
                                };
                            } else {
                                $scope.dsRadio = undefined;
                            }
                            $scope.showNoTimeslotsFlag = false;
                            $scope.showMoreFlag = ($scope.timeslotsArr.length > $scope.showMorelimit) ? (($scope.dsErorrFlag) ? false : true) : false;
                            for (var i = 0; i < $scope.timeslotsArr.length; i++) {
                                if (($scope.timeslotsArr[i].endtime == $scope.timeSlotendTime) && ($scope.timeslotsArr[i].starttime == $scope.timeSlotStartTime)) {
                                    $scope.dsRadio = {
                                        res: $scope.timeslotsArr[i].id
                                    };
                                }
                            }


                             
                        }, function (data, status) {
                    // error message
                    $scope.timeslotsArr = [];
                    $scope.showMoreFlag = false;
                    $scope.showNoTimeslotsFlag = true;
                    $scope.dsRadio = undefined;
                });
                
                if($scope.retailerType != 'Manual') {
                     var day = moment(fmtdeliverydate).format('ddd');
                     var getOpenCloseTimeByDay = YourQuoteService.getOpenCloseTimeByDay(day);
                     
                     var openTime = $scope.dataArray[getOpenCloseTimeByDay.openTime];
                     var closeTime = $scope.dataArray[getOpenCloseTimeByDay.closeTime];  

                     $scope.retailerstoreopentime = openTime;
                     $scope.retailerstoreclosetime = closeTime;
                     //document.getElementById("storeTime").innerHTML = openTime + " - " + closeTime;
                }
                $scope.checkedTimeslot = function (tsId) {
                    $scope.showMoreFlag = ($scope.timeslotsArr.length > $scope.showMorelimit) ? true : false;
                    return $scope.dsRadio.res == tsId;
                }

                $scope.showMoreFlag = "false";
                $scope.showNoTimeslotsFlag = false;

            };








            $scope.getSubscriptions = function () {
                if ($rootScope.userLogged) {
                    restservice.get(envconfig.get('host') + encodeURI("/subscription/" + $rootScope.loggedUser), '',
                            function (data, status) {
                                $scope.subscriptionname = data.subscriptionname;
                                $scope.displayname = data.displayname;
                                $scope.subscriptionenddate = data.subscriptionenddate;
                                $scope.totalbookingsforsubscription = data.totalbookingsforsubscription;
                                $scope.remainingbookingsforsubscription = data.remainingbookingsforsubscription;
                                $scope.isValidSubscription = data.isValidSubscription;
                                $scope.subscriptiondetails = data.subscriptiondetails;
                                $scope.$apply();

                            }, function (data, status) {
                        /**if(status == 401){
                         $location.path( "/register");
                         }else if(status == 204){
                         $scope.isValidSubscription   = "false";
                         }else{
                         alert("internal server error");
                         }  **/
                        $scope.isValidSubscription = false;
                    });
                }

                if ($scope.isValidSubscription == false || $rootScope.userLoggedOut) {
                    restservice.get(envconfig.get('host') + "/subscription",
                            '', function (data, status) {
                                $scope.subscriptions = data;
                            }, function (data, status) {
                        // error message
                    });
                }
            };

            $scope.getSubscriptions();

            $scope.showMore = function () {

                $scope.showMorelimit += $scope.showMoreQuantity;

            };

            $scope.showmodal = function (size, templatename, controller) {
                $scope.subscription = $scope.subscriptions[size];
                modalservice.show('sm', templatename, controller, $scope);

            };


            $scope.hidemodal = function () {

                //$("#pt").val(0);
                $scope.pickuptime = "Now";
                //$scope.pickuptime = $scope.pickuptimeOptions[0];

                modalservice.close();

            };







            //open the modal when the user chooses "later"
            $scope.later = function () {

                if ($scope.pickuptime == "Later") {
                    modalservice.show('lg', 'views/template/modal/later.html', 'ModalCtrl', $scope, 'medium-dialog', 'medium-dialog');

                }

                else {

                    $scope.pickuptime = "Now";
                    $scope.hideText();
                }
            };

            $scope.hideText = function () {
                document.getElementById("label").innerHTML = "";
                $scope.pickuptime = "Now";
                $scope.packageCollectiondate = moment($scope.serverDate).format('YYYY-MM-DD');
                $scope.deliverydate = moment($scope.serverDate).format('DD-MM-YYYY');
                $scope.collectionDate = $scope.deliverydate;
                $('#datetimepicker1').data("DateTimePicker").setDate(moment().format('DD-MM-YYYY'));
                var userData =
                        {
                            uuid: $routeParams.uuid,
                            packagecollectionreadyfrom: moment($scope.serverDate).format('HH:mm'),
                            packagecollectionreadydate: moment($scope.serverDate).format('YYYY-MM-DD')
                        };

                restservice
                        .put(
                                envconfig.get('host')
                                + "/bookings/bookingrequest/updateRetailerAndDates",
                                '',
                                function (data, status)
                                {

                                    $scope.timeslots();

                                    if ($scope.retailerType != 'Manual'){
                                                    if(data){
                                                        var getOpenCloseTimeByDay = YourQuoteService.getOpenCloseTimeByDay(moment(data.deliveryDate).format('ddd'));
                                                        var openTime = data[getOpenCloseTimeByDay.openTime];
                                                        var closeTime = data[getOpenCloseTimeByDay.closeTime];  
                                                    }else{
                                                        var openTime = "Closed";
                                                        var closeTime = "Closed";

                                                    }
                                                    

                                                    document.getElementById("storeTime").innerHTML = openTime + " - " + closeTime;

                                                }

                                }, function (data, status)
                        {
                            // error message
                        }, userData);
            };

            //open the date control popup
            $scope.open = function ($event) {
                $event.preventDefault();
                $event.stopPropagation();

                $scope.opened = true;
            };

            //disabling previous date
            $scope.toggleMin = function () {
                $scope.minDate = $scope.minDate ? null : new Date();
            };
            $scope.toggleMin();

            $scope.dt = new Date();

            //restrict future date to 60days/two months
            var date = new Date();
            $scope.maxDate = date.setDate((new Date()).getDate() + 60);




            $scope.getLocation = function () {
                var geocoder = new google.maps.Geocoder();
                var retailerPostCode = $scope.retailerpostcode
                geocoder.geocode({'address': $scope.userpostcode}, function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        var location = results[0].geometry.location,
                                mapOptions = {
                                    center: location,
                                    zoom: 11,
                                    mapTypeId: google.maps.MapTypeId.ROADMAP
                                },
                        map = new google.maps.Map(document.getElementById("map-container"), mapOptions),
                                marker = new google.maps.Marker({
                                    map: map,
                                    position: results[0].geometry.location,
                                    icon: {
                                        // path: google.maps.SymbolPath.CIRCLE,
                                        // scale: 5,
                                        // fillColor: '#43B02A',
                                        // fillOpacity: 1.0,
                                        // strokeColor: '#43B02A',
                                        // strokeOpacity: 1.0
                                        url: "images/delivery_postcode_pin_start.png" // url
                                    }
                                }),
                                circle = new google.maps.Circle({
                                    center: results[0].geometry.location,
                                    radius: 8047,
                                    map: map,
                                    fillColor: '#43B02A',
                                    fillOpacity: 0.5,
                                    strokeColor: '#43B02A',
                                    strokeOpacity: 0.4
                                });

                        geocoder.geocode({'address': $scope.retailerpostcode}, function (results, status) {
                            if (status == google.maps.GeocoderStatus.OK) {
                                // Place the marker
                                var marker = new google.maps.Marker({
                                    map: map,
                                    position: results[0].geometry.location,
                                    icon: {
                                        // path : google.maps.SymbolPath.CIRCLE,
                                        // scale : 4,
                                        // fillColor : '#43B02A',
                                        // fillOpacity : 1.0,
                                        // strokeColor : '#43B02A',
                                        // strokeOpacity : 1.0
                                        url: "images/delivery_postcode_pin_dest.png" // url
                                    }
                                });
                            } else {
                                alert("plot retailer is not successfull : " + status);
                            }
                        });
                        
                        $scope.reFocus = function () {
                            var latLong = map.center;
                            google.maps.event.trigger(map, "resize");
                            map.setCenter(latLong);
                        };

                        /*google.maps.event.addDomListener(window, "resize", function() {
                            console.log('resize');
                            console.log(map);
                            debugger;
                            var latLong = map.center;
                            google.maps.event.trigger(map, "resize");
                            map.setCenter(latLong);

                            var winWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
                            if(winWidth >= 992 ){
                                $("#map-container").hide().show();
                                $scope.getLocation();
                            }else{
                                $("#map-container").hide();
                            }

                        });*/

                    }
                })
            };
    
            google.maps.event.addDomListener(window, "resize", function() {
               $scope.reFocus();
            });

        $scope.go = function (path) {

            $scope.retailerpostcode = "";
            //$scope.userpostcode = "";
            $location.path($scope.uuid + path + $scope.userpostcode);

            };

            $scope.dpOpen = function () {
                return true;
            }

            var dp1 = $('#datetimepicker1');
            //$scope.collectiondate = moment().format('DD-MM-YYYY');
            if ($scope.pickuptime == "Now") {
                $scope.deliverydate = moment().format('DD-MM-YYYY');
                dp1.datetimepicker({
                    pickTime: false,
                    format: 'DD-MM-YYYY',
                    minDate: moment().format('DD-MM-YYYY'),
                    maxDate: moment().add(7, 'days').format('DD-MM-YYYY')

                });



            }

            $scope.paymentPage = function () {
                //var subscription = $scope.subscriptions[0];
                //var displayName = displayname;
                $scope.noTimeSlots = false;
                if ($scope.dsRadio == undefined) {
                    $scope.noTimeSlots = true;
                    $(document).scrollTop(0);
                }
                if ($scope.dsRadio != undefined) {
                    var subscription = document.querySelector('input[name="subscription"]:checked').value;
                    var timeslotid = $scope.dsRadio.res;
                    var deliverydate = $('#datetimepicker1').data("DateTimePicker").getDate().format('YYYY-MM-DD');

                    var formData = '{"uuid":"' + $scope.uuid + '","subscriptionname":"' + subscription + '","timeslotId":"' + timeslotid + '","deliveryDate":"' + deliverydate + '"}';
                    restservice.post(envconfig.get('host') + "/bookings/subscribe", '',
                            function (data, status) {
                                $location.path($scope.uuid + "/Booking/Subscribe");
                            }, function (data, status) {
                        if (status == 401) {
                            $location.path("/register");
                        } else {
                            alert("internal server error");
                        }
                    }, formData);
                }
            };



            dp1.off("dp.change").on("dp.change", function (e) {

                 $scope.deliverydate = e.date.format('DD-MM-YYYY');

                if(!$scope.collectionDate) {
                    $scope.collectionDate = moment().format("DD-MM-YYYY");
                }
                dp1.data("DateTimePicker").setMinDate($scope.collectionDate);
                if($scope.collectionDate == $scope.deliverydate) {
                    $scope.isPrevDisabled = true;
                } else {
                    $scope.isPrevDisabled = false;
                }
		        $scope.sevenDays =   CommonService.getDayDifFromToday( e.date.format('MM/DD/YYYY'),7);
               
                $scope.newDate = moment(e.date._d).format('DD-MM-YYYY');
                $scope.oldDate = e.date._i;
                //console.log($scope.collectiondateFlag);

                $scope.shopdeliverydate = e.date.format('ddd');
                if (!$scope.collectiondateFlag) {
                    if ($scope.retailerType == "Manual" && $scope.pageLoadFlag)
                    {
                        if ($scope.retailerstoreclosetime == "")
                            $scope.retailerstoreclosetime = "18:30";
                        if ($scope.retailerstoreopentime == "")
                            $scope.retailerstoreopentime == "09:30";
                        modalservice.show('lg', 'views/template/modal/manual-retailer-modal.html', 'ModalCtrl', $scope, 'medium-dialog');
                    }
                    else {
                        $scope.timeslots();
                    }

                } else {
                    $scope.timeslots();
                    $scope.collectiondateFlag = false;
                }

                $scope.pageLoadFlag = true;
            });


            /*
             $('#datetimepicker1').datetimepicker({
             pickTime: false,
             format: 'DD/MM/YYYY',
             
             });
             */
            //$('#datetimepicker1').datetimepicker('show');


            $scope.getQuote = function () {

                var userName = null;
                if ($rootScope.loggedUser != undefined) {
                    userName = $rootScope.loggedUser;
                }
                //userName=null;
                restservice.get(
                        envconfig.get('host') + "/getquote?uuid=" + $routeParams.uuid + "&userName=" + userName, '',
                        function (data, status) {
                            if (data.status == 'success' && data.Amount != "") {
                                $scope.amt = data.Amount;
                                document.getElementById('quotebuttonspan').style.display = "";
                                document.getElementById('quoteAmount').innerHTML = data.Amount;

                            } else {
                                //alert(data.Message);
                                if (data.status == 'failed' && data.Message != 'GET_QUOTE_NOT_CALLED_PER_CONDITION') {
                                    $scope.GetQuoteFailed = true;
                                    $timeout(function () {
                                        $scope.GetQuoteFailed = false;
                                    }, 3000)
                                }

                            }
                        }, function (data, status) {
                });


            };

            $scope.bookNow = function () {
                $scope.noTimeSlots = false;
                if ($scope.dsRadio == undefined) {
                    $scope.noTimeSlots = true;
                }
                if ($scope.dsRadio != undefined) {
                    //save time slot
                    var timeslotid = $scope.dsRadio.res;
                    var timeframe = $('#' + timeslotid).html();
                    var booknow = "true";
                    $scope.arrayTimes = [$('#' + timeslotid).data("start"), $('#' + timeslotid).data("end")];

                    var pickupdet = "";
                    var currentTime = moment($scope.serverDate).format('HH:mm');
                    var currentDt = moment($scope.serverDate).format('x');

                    var a = moment.utc($scope.serverDate)

                    var currentDt = moment(a).format('x')

                    var london = moment.tz(Number(currentDt), "Europe/London");

                    var currentTime = london.format("HH:mm")


                    if ($scope.pickuptime == "Now") {
                        pickupdet = ',"packagecollectionreadydate":"' + currentDt + '","packagecollectionreadyfrom":"' + currentTime + '"';
                    }
                    var deliverydate = $('#datetimepicker1').data("DateTimePicker").getDate().format('YYYY-MM-DD');
                    var userData = '{"uuid":"' + $scope.uuid + '","timeslotId":"' +
                            timeslotid + '","quoteamount":"' + $scope.amt + '","timeslotstart":"' + $scope.arrayTimes[0] + '","timeslotend":"' + $scope.arrayTimes[1] +
                            '","deliveryDate":"' + deliverydate + '"' + pickupdet + '}';
                    restservice.put(
                            envconfig.get('host') + "/bookings/bookingrequest/updateTimeslot", '',
                            function (data, status) {
                                $location.path($routeParams.uuid + '/address-confirmation');
                            }, function (data, status) {

                        alert("internal server error");

                    }, userData);
                }

                /**if($rootScope.loggedUser == undefined){
                 $location.path('register/'+$routeParams.uuid+'/address-confirmation');
                 }else{
                 $location.path($routeParams.uuid+'/address-confirmation');
                 }**/
            }

            $scope.getQuote();

            $scope.saveTimeSlot = function () {
                //var pkgcolldate = $scope.packageCollectiondate;
                //var deldate = $scope.deliverydate;
                //console.log($scope.dsRadio.res);
                //debugger;
                //console.log($scope.deliverydate);
                //debugger;
                $scope.noTimeSlots = false;
                if ($scope.dsRadio == undefined) {
                    $scope.noTimeSlots = true;
                    $(document).scrollTop(0);
                }
                if ($scope.dsRadio != undefined) {
                    var timeslotid = $scope.dsRadio.res;
                    var timeframe = $('#' + timeslotid).html();
                    var quoteamount = "0.0";
                    $scope.arrayTimes = [$('#' + timeslotid).data("start"), $('#' + timeslotid).data("end")];
                    var deliverydate = $('#datetimepicker1').data("DateTimePicker").getDate().format('YYYY-MM-DD');
                    var pickupdet = "";
                    var currentTime = moment($scope.serverDate).format('HH:mm');
                    var currentDt = moment($scope.serverDate).format('x');

                    var a = moment.utc($scope.serverDate)

                    var currentDt = moment(a).format('x')

                    var london = moment.tz(Number(currentDt), "Europe/London");

                    var currentTime = london.format("HH:mm")


                    if ($scope.pickuptime == "Now") {
                        pickupdet = ',"packagecollectionreadydate":"' + currentDt + '","packagecollectionreadyfrom":"' + currentTime + '"';
                    }
                    var userData = '{"uuid":"' + $scope.uuid + '","timeslotstart":"' + $scope.arrayTimes[0] + '","timeslotend":"' + $scope.arrayTimes[1] +
                            '","quoteamount":"' + quoteamount + '","timeslotId":"' + timeslotid + '","deliveryDate":"' + deliverydate + '"' + pickupdet + '}';
                    restservice.put(
                            envconfig.get('host') + "/bookings/bookingrequest/updateTimeslot", '',
                            function (data, status) {
                                $location.path($routeParams.uuid + '/address-confirmation');
                            }, function (data, status) {
                        $scope.errorMsg = data.errorMsg;
                        //  console.log($scope.errorMsg);
                    }, userData);
                }
            }

            $scope.closeNoTimeSlotDiv = function () {
                $scope.noTimeSlots = false;
            }

            /*
            google.maps.event.addDomListener(window, "resize", function () {
                var winWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
                if (winWidth >= 992) {
                    $("#map-container").hide().show();
                    $scope.getLocation();
                } else {
                    $("#map-container").hide();
                }
            });
            */

        });

