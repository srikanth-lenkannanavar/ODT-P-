'use strict';
/**
 * @ngdoc function
 * @name app.controller:BookNewDeliveryCtrl
 * @description
 * # BookNewDeliveryCtrl
 * Controller of the retailer app
 */
angular.module('app').controller('EditBookingCtrl', function ($scope, $filter, $rootScope, $http, $location, $timeout, $modal, postcodeService, geocodeservice, restservice, modalservice, $routeParams, $window, envconfig, CommonService, TimeSlotService, VoucherService, BookingService) {
    $scope.isGo = true;
    $scope.showMorelimit = 10;
    $scope.showMoreQuantity = 5;
    $scope.isNextDisabled = false;
    $scope.isPrevDisabled = false;
    $scope.isDeliveryPostcodeComplete = true;
    //$scope.isChooseTimeslotComplete = false;
    $scope.isBuyBundleBook = false;
    $scope.isBankHoliday = false;
    $scope.mydeliveryuser.postCodeValue = "";
    $scope.isShowConfirmDelivery = false;
    $scope.isEditBooking = true;
    $scope.isCollectionDetChanged = false;
    $scope.isInitialLoad = false;
    $scope.noTimeSlots = false;
    var radius = Math.ceil(5 * 1609.344);
    var zoom = 11;
    $rootScope.loadingDiv = true;
    $scope.persistTs = true;
    $scope.timeSlotNotAvilable = false;
    $scope.storeClosedMsg = false;
    $scope.orderId = $routeParams['brJobNumber'];
    $scope.status =
            {
                isChooseTimeslotPanelOpen: true,
                isConfirmDelAddrsOpen: false,
                isFirstDisabled: false
            };
    $scope.promo = {
        voucherCode: ""
    };
    $scope.tsRadio = {
        res: ""
    };
    $scope.subscription = {
        bundle: ""
    };
    $scope.enterAddress = function ()
    {
        $scope.manuallySelected = true;
    };
    $scope.confirmAdd = {
        refNameId: "",
        itemValue: "",
        deliveryInstruction: "",
        emailAdd: ""
    };
    $scope.times = CommonService.closeTimes;
    $scope.retailer = {
        openTime: CommonService.shopOpenningTimes[10] && ""
    };
    $scope.isChooseDiffTsclicked = false;
    /*
     var url1 = "scripts/json/addressdropdown.json";
     restservice.get(url1, '', function (data, status) {
     //console.log(angular.fromJson(data.enclosedObject));
     if (data && data.enclosedObject)
     {
     $scope.posts = angular.fromJson(data.enclosedObject);
     $scope.posts[0].town;
     }
     }, function (data, status)
     {
     });
     */
    $scope.openTimes = CommonService.shopOpenningTimes;
    $scope.shopopenTimes = CommonService.allTimes;
    $scope.address = {};

    CommonService.getMasterTblRadius().then(function (data) {
        $scope.masterTblRadius = Number(data.value) * 1609.344;
    });



    $scope.addressSelected = function ()
    {
        $scope.$watch(function ()
        {
            $scope.manuallySelected = true;
        }
        );
    };
    $scope.updateDeliveryDate = function (dateObj) {
        CommonService.safeApply($scope, function () {


            $scope.mydeliveryuser.deliverydate = dateObj.format('DD-MM-YYYY');
            $scope.mydeliveryuser.deliverydateObj = dateObj;
            if ($scope.isCollectionDetChanged) {
                $scope.hideTimeslot();
            }
            if (!$scope.isInitialLoad) {
                $scope.isInitialLoad = true;
                $scope.isCollectionDetChanged = true;
            }
            $scope.getStoreDetails();
            if (!$scope.persistTs) {
                $scope.getStoreDetails();
            }
        });
    };
    $scope.updateTimeslotDate = function (dateObj, prevFlag, nextFlag) {
        CommonService.safeApply($scope, function () {
            //$scope.resetChooseTimeslot();
            $scope.timeslotDate = dateObj.format('DD-MM-YYYY');
            $scope.timeslotDateObj = dateObj;
            if ($scope.timeslotDate === moment().format('DD-MM-YYYY')) {
                $scope.timeslotDateLabel = "today";
            } else {
                $scope.timeslotDateLabel = $scope.timeslotDate;
            }
            $scope.isPrevDisabled = prevFlag;
            $scope.isNextDisabled = nextFlag;

            var collectionDate = moment($filter("DATEFormat")($scope.mydeliveryuser.deliverydate)).format('DD/MM/YYYY');
            var tsDate = dateObj.format('DD/MM/YYYY');
            var noOfDays = CommonService.getDayDifFromGivenDates(collectionDate, tsDate);

            if (noOfDays >= 0 && !$scope.tsProcess) {

                $scope.timeslotCall();
            }


            if ($scope.isEditPackageCollection) {
                $scope.isEditPackageCollection = false;
            }
        });
    }
    $scope.timeslotCall = function () {
        if (!$scope.timeslotDate) {
            var tsOrPackageCollectionDate = $scope.mydeliveryuser.deliverydate;
        } else {
            var tsOrPackageCollectionDate = $scope.timeslotDate;
        }
        var deliverydateUTC = $filter("DATEFormat")(tsOrPackageCollectionDate);
        //var deliverydateUTC = $filter("UkToUtc")($scope.mydeliveryuser.deliverydateObj.format("YYYY-MM-DD")+"T"+$scope.mydeliveryuser.readyat);
        //;


        var d = new Date().toJSON();
        $scope.currentDate = moment(d).format('DD-MM-YYYY');
        $scope.currentTimeDateSplit = d.split("T");
        $scope.currentTimeSplit = $scope.currentTimeDateSplit[1].split(":");
        $scope.currentTime = $scope.currentTimeSplit[0] + ":" + $scope.currentTimeSplit[1];
        $scope.currentTime =  moment().format("HH:mm");

        if ($scope.mydeliveryuser.readyat === "Now") {
            //$scope.utcReadyAt = $filter("UkToUtc")(deliverydateUTC + "T" + $scope.currentTime + ":00Z");
            $scope.packagecollectionreadyfrom = $scope.currentTime;
        }
        else {
            //$scope.readyAt = $filter("UkToUtc")(deliverydateUTC + "T" + $scope.mydeliveryuser.readyat + ":00Z");
            $scope.packagecollectionreadyfrom = $scope.mydeliveryuser.readyat;
        }


        var postObjData = {
            // "uuid": "49e9c6b2-b1ef-4c12-a3e1-24e72277b836",
            /*
             "consumer": {
             "postCode": $scope.mydeliveryuser.postCodeValue
             },
             */
            "consumer": {
                "address": {
                    "postCode": $scope.mydeliveryuser.postCodeValue.toUpperCase()
                }
            },
            "items": {
                //"readyAt": $scope.readyAt,
                "readyAt": $filter("UkToUtc")($scope.mydeliveryuser.deliverydateObj.format("YYYY-MM-DD") + "T" + $scope.packagecollectionreadyfrom),
                "deliveryDate": deliverydateUTC
            },
            "store": {
                "storeId": $scope.storeDetails.storeId,
                "info": {
                    "openTime": $scope.storeTimes.storeShopOpen,
                    "closeTime": $scope.storeTimes.storeShopClose
                }
                //"openTime": $scope.storeTimes.storeShopOpen,
                //"closeTime": $scope.storeTimes.storeShopClose
            }
        };
        //;
        $scope.retDistHideModal = function ()
        {
            modalservice.close();
        };
        // CommonService.getRetailerTimeslots().then(function (data) {
        $scope.tsProcess = true;
        TimeSlotService.postTimeslot(postObjData).then(function (data) {
            $scope.zone = data.data.zone;
            $scope.uuid = data.data.uuid;
            $scope.storeID = $scope.storeDetails.storeId;
            if ($scope.zone === "within" || $scope.zone === "adhoc")
            {
                $scope.isGo = false;
                $scope.isGoTemp = false;
                $scope.isDeliveryPostcodeComplete = true;
            }
            else {
                $scope.mydeliveryuser.hiddenpostcodevalue = null;
                modalservice.show('lg', 'views/template/modal/retailer/retailer-distance.html', '', $scope, 'medium-dialog');
            }
            $scope.timeslotsArr = data.data.timeslots;
            $scope.tsRadio.res = "";
            if ($scope.timeslotsArr.length > 10) {
                $scope.showMoreFlag = true;
            }
            $scope.noTimeSlots = false;
            $scope.tsProcess = false;
            $scope.timeSlotNotAvilable = false;
            $scope.storeClosedMsg = false;
        }, function (err) {
//            $scope.mydeliveryuser.postCodeValue = "";
//            modalservice.show('lg', 'views/template/modal/retailer/retailer-distance.html', '', $scope, 'medium-dialog');
//            $scope.tsRadio.res = "";
            $scope.timeslotsArr = [];
            $scope.noTimeSlots = true;
            $scope.tsProcess = false;
            $scope.timeslotsArr = [];

            if (Number(err.status) === 404 && err.data.errors[0].errorId === "ET-TIST-001") {
//                $scope.errStatusIDFlag = true;
                $scope.errFlag = false;
                $scope.isDeliveryPostcodeComplete = true;
                $scope.timeSlotNotAvilable = true;
                $scope.storeClosedMsg = false;
            }

            else if (Number(err.status) === 400 && err.data.errors[0].errorId === "ET-TIST-007" && $scope.isDeliveryPostcodeComplete) {
                $scope.noTimeSlots = false;
                $scope.timeSlotNotAvilable = false;
                $scope.storeClosedMsg = true;
                $scope.errFlag = false;
                $scope.errStatusIDFlag = false;
                //return;
            }





        });
    };


//    $scope.hideTimeslotCloseTime = function (shopopen, times, shopclose, closetimes) {
//        $scope.$watch('', function () {
//            if (closetimes.indexOf(shopclose) <= times.indexOf(shopopen)) {
//                $scope.errStatusIDFlag = true;
//            }
//            else {
//                $scope.errStatusIDFlag = false;
//            }
//        });
//        if ($scope.isDeliveryPostcodeComplete) {
//            $scope.getLocation($scope.postcode);
//        }
//        $scope.isTimeSlotChanged = false;
//        $scope.isDeliveryPostcodeComplete = false;
//        $scope.isTimeslotChanged = false;
//        $scope.timeslotDate = false;
//    };


    $scope.storehideTimeslot = function (shopopen, times, shopclose, closetimes) {
        if (shopopen || times || shopclose || closetimes) {
            $scope.$watch('', function () {
                if ((closetimes.indexOf(shopclose) <= times.indexOf(shopopen)) || shopopen === "Closed" || shopclose === "Closed") {
                    $scope.errStatusIDFlag = true;
                }
                else {
                    $scope.errStatusIDFlag = false;
                }
                if (shopopen === "Closed" && shopclose === "Closed") {
                    $scope.errStatusIDFlag = false;
                    $scope.isBankHoliday = true;
                }
            });
            if ($scope.isDeliveryPostcodeComplete) {
                $scope.getLocation($scope.postcode);
            }
            $scope.isTimeSlotChanged = false;
            $scope.isDeliveryPostcodeComplete = false;
            $scope.isTimeslotChanged = false;
            $scope.timeslotDate = false;
            if ($scope.persistTs) {
                $scope.persistTs = false;
            }
        }
    };

    $scope.showMore = function () {
        if ($scope.timeslotsArr.length > $scope.showMorelimit) {
            $scope.showMorelimit += $scope.showMoreQuantity;
            if ($scope.showMorelimit >= $scope.timeslotsArr.length) {
                $scope.showMoreFlag = false;
            }
        } else {
            $scope.showMoreFlag = false;
        }
    };
    $scope.setBookNowPrice = function (StartTime, EndTime, obj) {
        $scope.bookNowPrice = obj.price;
        $scope.bookNowVat = obj.vat;
        $scope.bookNowPriceCopy = angular.copy(obj.price);
        $scope.bookNowVatCopy = angular.copy(obj.vat);
        if ($scope.voucher && $scope.voucher.isvoucherValid) {
            $scope.bookNowPrice = 0;
            $scope.bookNowVat = 0;
        }
        $scope.bookNowStartTime = StartTime;
        $scope.bookNowEndTime = EndTime;
        //
    };
    $scope.savechooseTimeslot = function (isValid) {
        if (!isValid)
            return;
        //console.log("submit");
        //$scope.isChooseTimeslotComplete = true;
        $scope.isBookNowClicked = true;
        $scope.isShowConfirmDelivery = true;
        $scope.status.isChooseTimeslotPanelOpen = false;
        $scope.status.isConfirmDelAddrsOpen = true;
    };
    //      $scope.getStoreDetails();
    $scope.getStoreDetails = function () {
        restservice.get(envconfig.get('host') + "/getStore", '', function (data, status) {
            $scope.storeDetails = data.data;
            $scope.storeTimeDetails = data.data.info.openingHours;
            var d = new Date().toJSON();
            $scope.currentDate = moment(d).format('DD-MM-YYYY');
            var dt = moment($scope.mydeliveryuser.deliverydate, "DD-MM-YYYY");
            var openingDay = dt.format('ddd').toUpperCase();
            $scope.storeTime = $scope.storeTimeDetails[openingDay];
            $scope.timeDay = $scope.storeTime.split("-");
            if ($scope.storeTime === "Closed") {
                $scope.isBankHoliday = true;
                if (CommonService.allTimes.length <= 48)
                {
                    CommonService.allTimes.push("Closed");
                    CommonService.closeTimes.push("Closed");
                }
                $scope.storeTimes = {
                    storeShopOpen: $.trim(CommonService.allTimes[CommonService.allTimes.length - 1]),
                    storeShopClose: $.trim(CommonService.allTimes[CommonService.allTimes.length - 1])
                };
            }
            else {
                $scope.isBankHoliday = false;
                if ($scope.mydeliveryuser.deliverydate === $scope.ebDate) {
                    $scope.storeTimes = {
                        storeShopOpen: $scope.ebOpeningTime,
                        storeShopClose: $scope.ebClosingTime
                    };
                } else {
                    $scope.storeTimes = {
                        storeShopOpen: $.trim($scope.timeDay[0]),
                        storeShopClose: $.trim($scope.timeDay[1])
                    };
                }
            }
//            var Bankurl = "scripts/json/retailer/bankHolidaysList.json";
            //            restservice.get(Bankurl, '',
            restservice.get(envconfig.get('host') + "/getHolidayList", '',
                    function (data1, status) {
                        $scope.bankHolidaysList = data1.data.holidays;
                        for (var i = 0; i < $scope.bankHolidaysList.length; i++) {
                            var holiDayDate = $filter("ISO8601Parse")($scope.bankHolidaysList[i].date, "UK", "DD-MM-YYYY");
                            if ($scope.mydeliveryuser.deliverydate == holiDayDate) {
                                $scope.storeOpenOnHolidayArray = Object.keys($scope.storeDetails.bankHolidayDetails);
                                for (var j = 0; j < $scope.storeOpenOnHolidayArray.length; j++) {
                                    if ($scope.bankHolidaysList[i].name === $scope.storeOpenOnHolidayArray[j])
                                    {
                                        console.log($scope.storeDetails.bankHolidayDetails[$scope.storeOpenOnHolidayArray[j]]);
                                        $scope.storeTime = $scope.storeDetails.bankHolidayDetails[$scope.storeOpenOnHolidayArray[j]];
                                        $scope.timeDay = $scope.storeTime.split("-");
                                        if ($scope.storeTime === "Closed") {
                                            $scope.isBankHoliday = true;
                                            if (CommonService.allTimes.length <= 48)
                                            {
                                                CommonService.allTimes.push("Closed");
                                            }
                                            $scope.storeTimes = {
                                                storeShopOpen: $.trim(CommonService.allTimes[CommonService.allTimes.length - 1]),
                                                storeShopClose: $.trim(CommonService.allTimes[CommonService.allTimes.length - 1])
                                            };
                                        }
                                        else {
                                            $scope.isBankHoliday = false;
                                            $scope.storeTimes = {
                                                storeShopOpen: $.trim($scope.timeDay[0]),
                                                storeShopClose: $.trim($scope.timeDay[1])
                                            };
                                        }
                                    }
                                }
                            }
                        }
                    }, function (data1, status) {
                $scope.errFlag = true;
                $scope.errStatusCode = status;
                if (Number($scope.errStatusCode) === 404) {
                    $scope.errStatusMsg = ", Store not found.";
                }
                //alert("Failed to load Bank holiday list");
            });

            if (!$scope.ebReadyat) {
                $scope.mydeliveryuser.readyat = $scope.openTimes[18];
            }

        }
        , function (data, status) {
            $scope.errFlag = true;
            $scope.errStatusCode = status;
            if (Number($scope.errStatusCode) === 404) {
                $scope.errStatusMsg = ", Store not found.";
            }
        });
    };
    $scope.chooseDiffTs = function () {
        $scope.isChooseDiffTsclicked = !$scope.isChooseDiffTsclicked;
        /* $timeout(function() {
         $('#timeslotDate').data("DateTimePicker").setDate($filter("ISO8601Parse")($scope.bookNowEndTime, "UK", "DD-MM-YYYY"));
         },0);
         */
        if ($scope.isEditPackageCollection) {
            $scope.isDeliveryPostcodeComplete = true;
            $scope.isChooseDiffTsclicked = true;
            var collectionDate = $('#collectionDate').data("DateTimePicker").getDate().format('DD-MM-YYYY');
            $timeout(function () {
                $('#timeslotDate').data("DateTimePicker").setDate(collectionDate);
            }, 0);
        } else {
            $timeout(function () {
                $('#timeslotDate').data("DateTimePicker").setDate($filter("ISO8601Parse")($scope.bookNowEndTime, "UK", "DD-MM-YYYY"));
            }, 0);
        }
    };
    $scope.getLocation = function ()
    {
        var geocoder = new google.maps.Geocoder();
        var retailerPostCode = $scope.mydeliveryuser.postCodeValue;
        geocoder.geocode({'address': $scope.storeDetails.address.postCode},
        function (results, status)
        {
            if (status == google.maps.GeocoderStatus.OK)
            {
                var location = results[0].geometry.location, mapOptions =
                        {
                            center: location,
                            zoom: zoom,
                            mapTypeId: google.maps.MapTypeId.ROADMAP
                        }, map = new google.maps.Map(document.getElementById("map-container"), mapOptions),
                        marker = new google.maps.Marker(
                                {
                                    map: map,
                                    position: results[0].geometry.location,
                                    icon:
                                            {
                                                // path: google.maps.SymbolPath.CIRCLE,
                                                // scale: 5,
                                                // fillColor: '#43B02A',
                                                // fillOpacity: 1.0,
                                                // strokeColor: '#43B02A',
                                                // strokeOpacity: 1.0
                                                url: "images/delivery_postcode_pin_start.png" // url
                                            }
                                }), circle = new google.maps.Circle(
                        {
                            center: results[0].geometry.location,
                            radius: $scope.masterTblRadius || radius,
                            map: map,
                            fillColor: '#43B02A',
                            fillOpacity: 0.5,
                            strokeColor: '#43B02A',
                            strokeOpacity: 0.4
                        });
                var latLong = location;
                geocoder.geocode({'address': $scope.mydeliveryuser.postCodeValue},
                function (results, status)
                {
                    if (status == google.maps.GeocoderStatus.OK)
                    {
                        // Place
                        // the
                        // marker
                        var marker = new google.maps.Marker(
                                {
                                    map: map,
                                    position: results[0].geometry.location,
                                    icon:
                                            {
                                                // path: google.maps.SymbolPath.CIRCLE,
                                                // scale: 4,
                                                // fillColor: '#43B02A',
                                                // fillOpacity: 1.0,
                                                // strokeColor: '#43B02A',
                                                // strokeOpacity: 1.0
                                                url: "images/delivery_postcode_pin_dest.png" // url
                                            }
                                });
                    }
                    else
                    {
                        alert("plot retailer is not successfull : "
                                + status);
                    }
                });
                $scope.reFocus = function () {
                    if (latLong)
                    {
                        map.setCenter(latLong);
                    }
                };
            }
        })
    };
    google.maps.event.addDomListener(window, "resize", function () {
        $scope.reFocus();
    });
    $scope.editPackageCollection = function (isValid, storeTimesOpen, storeTimesClose, errStatusIDFlag) {

        if (!isValid || storeTimesOpen === "Closed" || storeTimesClose == "Closed" || errStatusIDFlag) {
            return;
        }
        //alert("hai");
        var collectionDate = $('#collectionDate').data("DateTimePicker").getDate().format('DD-MM-YYYY');
        var cd = $('#collectionDate').data("DateTimePicker").getDate().format('MM/DD/YYYY');
        var currentDate = moment(moment().format('MM/DD/YYYY'));
        var days = moment.duration(moment(cd).diff(currentDate)).asDays();
        if (days < 0) {
            $scope.isPastCollectionDate = true;
            return false;
        } else {
            $scope.isEditPackageCollection = true;
            $scope.isPastCollectionDate = false;
            moment().format("HH:mm");
            $scope.chooseDiffTs();
        }
    };
    $scope.changeTimeslot = function (openTiming) {
//        if (openTiming)
//        {
//            $scope.times = ['00:00', "00:30", "01:00", "01:30", "02:00", "02:30", "03:00", "03:30", "04:00", "04:30", "05:00", "05:30", "06:00", "06:30", "07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00", "23:30"];
//            for (var i = 0; i < $scope.times.length; i++) {
//                if ($scope.times[i] === openTiming) {
//                    $scope.times.splice(0, i + 1);
//                    $scope.storeTimes.storeShopClose = $scope.times[0];
//                }
//            }
//        }
        $scope.isCollectionDetChanged = true;
        $scope.isDeliveryPostcodeComplete = false;
    };
    $scope.hideTimeslot = function () {
        $scope.isCollectionDetChanged = true;
        $scope.isDeliveryPostcodeComplete = false;
        if($scope.mydeliveryuser.deliverydate !== $scope.ebDate && $scope.openTimes.indexOf("Now") > -1){
            //$scope.openTimes.unshift("Now");
            $scope.openTimes.splice($scope.openTimes.indexOf("Now"),1);
            $scope.mydeliveryuser.readyat = null;
            $scope.mydeliveryuser.readyat = "09:30";
            //debugger;
        }else if($scope.openTimes.indexOf("Now") === -1){
            $scope.openTimes.push("Now");
            $scope.ebReadyat = moment().format("HH:mm");
            $scope.mydeliveryuser.readyat = "Now";

        }
        //"07-10-2015"
        /*
        if ($scope.openTimes.indexOf("Now") > -1) {
            $scope.openTimes.push("Now");
            $scope.openTimes.splice($scope.openTimes.push("Now"), 1);
            $scope.mydeliveryuser.readyat = $scope.openTimes[18];
        }
        */


    }
    $scope.saveConfirmDelAdd = function (isValid) {
        if (!isValid) {
            return;
        }
        //;

        var d = new Date().toJSON();
        $scope.currentDate = moment(d).format('DD-MM-YYYY');
        $scope.currentTimeDateSplit = d.split("T");
        $scope.currentTimeSplit = $scope.currentTimeDateSplit[1].split(":");
        $scope.currentTime = $scope.currentTimeSplit[0] + ":" + $scope.currentTimeSplit[1];



        if ($scope.mydeliveryuser.readyat === "Now") {
            $scope.packagecollectionreadyfrom = $scope.ebReadyat;
        }
        else {
            $scope.packagecollectionreadyfrom = $scope.mydeliveryuser.readyat;
        }



        var editPutObj = {
            //"packagecollectionreadydate": $scope.mydeliveryuser.deliverydateObj.format("YYYY-MM-DD"),
            //"packagecollectionreadyfrom": $scope.mydeliveryuser.readyat,
            //"timeslotstart"  : $scope.bookNowStartTime,
            //"timeslotend" : $scope.bookNowEndTime,
            //"timeslotid": "28971-l6ydbwwwfs0k",
            //"bookingtype": $scope.bookingType,
            "orderType": "1",
            "supplierId": $scope.supplierId,
            "accountNumber": $scope.accountNumber,
            "serviceType": $scope.serviceType,
            "referenceNo": "123",
            "departmentReferenceNo": "2",
            "notificationType": "",
            "webHook": "",
            "orderNo": Number($routeParams['brJobNumber']),
            "timeslot": {
                "timeslotId": $scope.tsRadio.res
            },
            "store": {
                "storeId": $scope.storeDetails.storeId,
                "instruction": "",
                "info": {
                    "openTime": $scope.storeTimes.storeShopOpen,
                    "closeTime": $scope.storeTimes.storeShopClose
                }
            },
            "consumer": {
                "name": $scope.confirmAdd.customerName,
                "email": $scope.confirmAdd.emailAdd,
                "mobileNumber": $scope.confirmAdd.phoneNo,
                "address": {
                    "firstLine": $scope.address.selected.address1,
                    "secondLine": $scope.address.selected.address2,
                    "city": $scope.address.selected.town,
                    "postcode": $scope.address.selected.postcode
                },
                "instruction": $scope.confirmAdd.deliveryInstruction
            },
            "item": {
                "referenceNumber": $scope.confirmAdd.refNameId,
                "itemContentCount": 1,
                "totalValue": Number($scope.confirmAdd.itemValue),
                "weight": 1,
                "height": 1,
                "length": 1,
                //"readyAt": "2015-08-23T08:00:00Z" // send in UTC format
                "readyAt": $filter("UkToUtc")($scope.mydeliveryuser.deliverydateObj.format("YYYY-MM-DD") + "T" + $scope.packagecollectionreadyfrom)
            }
        };
        //;
        //BookingService.editBookingByBrJobNumber(editPutObj, $scope.uuid).then(function (data) {
        BookingService.editBookingByBrJobNumber(editPutObj).then(function (data) {
            console.log(data);
            $location.path("my-deliveries");
        }, function (err) {
            console.log(err);
            //;
        });
    };
    BookingService.getBookingByBrJobNumber($routeParams['brJobNumber']).then(function (data) {

        $rootScope.loadingDiv = false;
        $scope.mydeliveryuser.postCodeValue = data.data.consumer.address.postCode;
        $scope.supplierId = data.data.supplierId;
        $scope.accountNumber = data.data.accountNumber;
        $scope.serviceType = data.data.serviceType;
        $scope.mydeliveryuser.deliverydate = $scope.initalDelveiryDate = $scope.ebDate = $filter("ISO8601Parse")(data.data.item.deliveryDate, "UK", "DD-MM-YYYY");
        //debugger;
        //$scope.readyAt = data.data.item.readyAt;
        $scope.mydeliveryuser.readyat = $scope.readyAt = $filter("ISO8601Parse")(data.data.item.deliveryDate, "UK", "HH:mm");
        //debugger;
        $scope.bookingStoreDetails = data.data.store;
        $scope.bookingType = data.data.bookingType;
        $scope.bookingStatus = data.data.status;
        $scope.confirmAdd.refNameId = data.data.item.referenceNumber;
        $scope.confirmAdd.customerName = data.data.consumer.name;
        $scope.confirmAdd.itemValue = data.data.item.totalValue;
        $scope.confirmAdd.emailAdd = data.data.consumer.email;
        $scope.confirmAdd.phoneNo = data.data.consumer.mobileNumber;
        $scope.editBookingSuccess = data.success.status.toLocaleLowerCase();
        $scope.address = {
            selected: {
                address1: data.data.consumer.address.firstLine,
                address2: data.data.consumer.address.secondLine,
                town: data.data.consumer.address.city,
                postcode: data.data.consumer.address.postCode
            }
        };
        $scope.bookNowStartTime = data.data.timeslot.startTime;
        $scope.bookNowEndTime = data.data.timeslot.endTime;
        $scope.tsRadio.res = data.data.timeslot.timeslotId;
        $scope.uuid = data.data.uuid;
        //;
        $scope.ebOpeningTime = $scope.bookingStoreDetails.info.openTime.split(":")[0] + ":" + $scope.bookingStoreDetails.info.openTime.split(":")[1];
        $scope.ebClosingTime = $scope.bookingStoreDetails.info.closeTime.split(":")[0] + ":" + $scope.bookingStoreDetails.info.closeTime.split(":")[1];
        //$scope.mydeliveryuser.readyat = $scope.ebReadyat = data.data.item.readyAt;
        if ($scope.bookingStatus !== 'Booked') {
            //$scope.ebReadyat = data.data.item.readyAt;
            $scope.mydeliveryuser.readyat = $scope.ebReadyat = $filter("ISO8601Parse")(data.data.item.deliveryDate, "UK", "HH:mm");
            if ($scope.openTimes.indexOf(bookReadyAt) === -1) {

                if($scope.openTimes.indexOf("Now") === -1){
                    $scope.openTimes.push("Now");
                }


                $scope.mydeliveryuser.readyat = "Now";
            }


        }

        if ($scope.bookingStatus === 'Booked') {
            //var bookReadyAt = $filter("ISO8601ParseII")(data.data.item.deliveryDate, "UK", "HH:mm", data.data.item.readyAt);
            //debugger;
            var bookReadyAt = data.data.item.readyAt;
            $scope.ebReadyat = bookReadyAt;
            if ($scope.openTimes.indexOf(bookReadyAt) === -1) {

                if($scope.openTimes.indexOf("Now") === -1){
                    $scope.openTimes.push("Now");
                }

                $scope.ebReadyat = bookReadyAt;
                $scope.mydeliveryuser.readyat = "Now";
            } else {
                $scope.mydeliveryuser.readyat = $scope.ebReadyat = bookReadyAt;
            }

            //
        }

        //debugger;
        $scope.getStoreDetails();
        $scope.confirmAdd.deliveryInstruction = data.data.consumer.instruction;
        if ($scope.editBookingSuccess === 'ok' && ($scope.bookingStatus == 'Booked' || $scope.bookingStatus === 'Amended')) {
            $timeout(function () {
                //;
                if ($scope.bookingType === "Subscription") {
                    CommonService.getRetailerSubscriptions().then(function (data) {
                        //;
                        radius = Math.ceil(Number(data.data.MinMiles) * 1609.344);
                        zoom = 10;
                        $scope.getLocation();
                    }, function (err) {
                        console.log(err);
                        $scope.errFlag = true;
                        $scope.errStatusCode = err.status;
                    });
                } else {
                    $scope.getLocation();
                }
                $('#collectionDate').data("DateTimePicker").setDate($scope.mydeliveryuser.deliverydate);
            }, 2000);
        }
    }, function (err) {
        $rootScope.loadingDiv = false;
        $scope.errFlag = true;
        $scope.errStatusCode = err.status;
    });
});
