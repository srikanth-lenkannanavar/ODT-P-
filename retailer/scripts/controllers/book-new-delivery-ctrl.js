'use strict';
/**
 * @ngdoc function
 * @name app.controller:BookNewDeliveryCtrl
 * @description
 * # BookNewDeliveryCtrl
 * Controller of the retailer app
 */
angular.module('app').controller('BookNewDeliveryCtrl', function ($scope, $filter, $rootScope, $http, $location, $modal, postcodeService, geocodeservice, restservice, modalservice, $routeParams, $window, $timeout, envconfig, CommonService, TimeSlotService, VoucherService, BookingService) {
    $scope.isGo = true;
    $scope.showMorelimit = 10;
    $scope.showMoreQuantity = 5;
    $scope.isNextDisabled = false;
    $scope.isPrevDisabled = false;
    $scope.isDeliveryPostcodeComplete = false;
    //$scope.isChooseTimeslotComplete = false;
    $scope.isBuyBundleBook = false;
    $scope.isBankHoliday = false;
    $scope.mydeliveryuser.postCodeValue = "";
    $scope.isShowConfirmDelivery = false;
    $scope.errStatusIDFlag = false;
    $scope.errStatusIDFlag = false;
    $scope.isCreateBooking = true;
    $scope.noTimeSlots = false;
    $scope.currentDate = '';
    $scope.readyAtTimes = null;
    $scope.isCurrentDay = true;
    $scope.storeClosedMsg = false;
    $scope.persistTsDateshow = false;
    $scope.timeSlotNotAvilable = false;
    $scope.bookBtnDisabled = false;
    if ($routeParams['uuid']) {
        $scope.persistTs = true;
    } else {
        $scope.persistTs = false;
    }
    $scope.status =
            {
                isChooseTimeslotPanelOpen: true,
                isConfirmDelAddrsOpen: false,
                isFirstDisabled: false
            };
//    $scope.mydeliveryuser = {
//        readyat: null
//    };
    $scope.promo = {
        voucherCode: ""
    };
    $scope.tsRadio = {
        res: ""
    };
    $scope.subscription = {
        bundle: ""
    };
    $scope.voucher = {
        valid: ""
    };
    $scope.enterAddress = function ()
    {
        $scope.manuallySelected = true;
        $scope.$watch(function () {
            if($('#address-line-3').is('[readonly]')) {
                $('#address-line-3, #address-line-4').removeAttr('readonly');
                $('#address-line-3, #address-line-4').removeAttr('onfocus');                
            }
         });
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
    $scope.openTimes = CommonService.shopOpenningTimes;
//    $scope.readyAtTimes = CommonService.readyAtTime;
    $scope.address = {};
    $scope.addressSelected = function ()
    {
        $scope.$watch(function ()
        {
            $scope.manuallySelected = true;
        }
        );
    };
    CommonService.getMasterTblRadius().then(function (data) {
        $scope.masterTblRadius = Number(data.value) * 1609.344;
    });
    //get location call
    $scope.getLocation = function (postCode) {
        var postalCode = $scope.postcode;
        geocodeservice.getLocation(postCode, $scope.drawmap, function (results, status) {
            $scope.$apply(function () {
                $scope.postcodeInvalid = true;
            });
        });
    };
    //draw map
    $scope.drawmap = function (results, status) {
        $scope.mydeliveryuser.latlong = results[0].geometry.location;
        /*restservice.get(envconfig.get('host')
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
         });*/
        //
        var radius = $scope.masterTblRadius || Math.ceil(5 * 1609.344);
        var zoom = 11;
        var zoom = CommonService.getZoomValue(radius);

        if ($scope.subscriptions && $scope.subscriptions.minMiles) {
            radius = Math.ceil(Number($scope.subscriptions.minMiles) * 1609.344);
            zoom =  CommonService.getZoomValue(radius);
            //radius =  Math.ceil(5 * 1609.344);
            //var m = 5 * 1609.344;
        }
        var location = results[0].geometry.location, mapOptions =
                {
                    center: location,
                    zoom: zoom,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                }, map = new google.maps.Map(document
                .getElementById("map-container"), mapOptions), marker = new google.maps.Marker(
                {
                    map: map,
                    position: results[0].geometry.location,
                    icon:
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
                    center: results[0].geometry.location,
                    //radius: 8047,
                    radius: radius,
                    map: map,
                    fillColor: '#43B02A',
                    fillOpacity: 0.5,
                    strokeColor: '#43B02A',
                    strokeOpacity: 0.4
                });
        google.maps.event.addDomListener(window, "resize", function () {
            var latLong = map.center;
            google.maps.event.trigger(map, "resize");
            map.setCenter(latLong);
        });
    };
    $scope.setCollectionDate = function (data) {
        if ($('#collectionDate').length > 0) {
            $('#collectionDate').data("DateTimePicker").setDate(moment(data.packagecollectionreadydate).format('DD-MM-YYYY'));
            $scope.isDeliveryPostcodeComplete = true;
            $scope.persistTs = true;
            $scope.isTimeslotChanged = true;
            if(!$scope.readyAtTimes){
                var readyAtTimesArr =  $scope.readyAtTimesOtherday;
            }else{
                //var readyAtTimesArr =  $scope.mydeliveryuser.readyat = $scope.readyAtTimes[0];
                var readyAtTimesArr =  $scope.readyAtTimes;
            }

            if(readyAtTimesArr.indexOf(data.packagecollectionreadyfrom) === -1){
                $scope.mydeliveryuser.readyat = "Now";
            }else{
                $scope.mydeliveryuser.readyat = data.packagecollectionreadyfrom;
            }


            $scope.storeTimes = {
                storeShopOpen: CommonService.shopOpenningTimes[CommonService.shopOpenningTimes.indexOf(data.retailerstoreopentime)],
                storeShopClose: CommonService.shopOpenningTimes[CommonService.shopOpenningTimes.indexOf(data.retailerstoreclosetime)]
            };
        } else {
            $timeout(function () {
                $scope.setCollectionDate(data);
            }, 1);

        }
    }
    if ($routeParams['uuid']) {
        $rootScope.loadingDiv = true;
        $scope.persistTsDateshow = true;
        BookingService.getBookingRequest($routeParams['uuid']).then(function (data) {
            $scope.mydeliveryuser.postCodeValue = data.postcode;
            //
            $scope.storeTimes = {
                storeShopOpen: CommonService.shopOpenningTimes[CommonService.shopOpenningTimes.indexOf(data.retailerstoreopentime)],
                storeShopClose: CommonService.shopOpenningTimes[CommonService.shopOpenningTimes.indexOf(data.retailerstoreclosetime)]
            };
            //
            //$filter("UkToUtc")(data.packagecollectionreadydate + "T" + data.packagecollectionreadyfrom + ":00Z");
            //
            $scope.persistTsReadyAt = data.packagecollectionreadyfrom;
            //
            $scope.timeslotId = data.timeslotId;
            $scope.persistTsStart = data.timeslotstart;
            $scope.persistTsEnd = data.timeslotend;
            $scope.persistTsPackageCollectionDate = data.packagecollectionreadydate;

            $scope.persistTsDeliveryDate = $filter("ISO8601Parse")(data.timeslotend, "UK", "DD-MM-YYYY");
            restservice.get(envconfig.get('host') + "/address/postcode/" + $scope.mydeliveryuser.postCodeValue, '', function (data, status) {
                if (data && data.data)
                {
                    $scope.posts = data.data;
                }
            }, function (data, status) {
            });







            //
            //| ISO8601Parse : "UK" : "HH:mm"
            //
            //$scope.isDeliveryPostcodeComplete = true;
            //$scope.timeslotCall();
            //$scope.storeDetails.storeid =  data.storeid;
            //
            $timeout(function () {
                $scope.setCollectionDate(data);

                $rootScope.loadingDiv = false;
                //$scope.timeslotCall();
            }, 2);
            //$filter("ISO8601Parse")(data.timeslotend, "UK", "DD-MM-YYYY");
            $scope.retailerPostcode = data.retailerpostalcode;
            $scope.getNewLocation();
            //            $scope.storeTimes.storeShopOpen =  ;
            //            $scope.storeTimes.storeShopClose =  ;
            //
            //$scope.timeslotCall();
        }, function () {
            $rootScope.loadingDiv = false;
            $scope.errFlag = true;
            $scope.errStatusCode = err.status;
        });
    }
    $scope.saveConfirmDelAdd = function (isValid) {
        if (!isValid) {
            return;
        }
        $rootScope.loadingDiv = true;
        $scope.bookBtnDisabled = true;
        var collertRefArr = [];
        var collectRefObj = {
            id: $scope.confirmAdd.refNameId,
            itemDescription: "",
            itemValue: Number($scope.confirmAdd.itemValue),
            recieptNo: "",
            cardHolderName: $scope.confirmAdd.customerName
        };

        if($scope.confirmAdd.itemValue.length > 0 ){
            collectRefObj["itemValue"] =  Number($scope.confirmAdd.itemValue)
        }
        //debugger;

        $scope.address.selected = {
            address1: $scope.address.selected.address1,
            address2: $scope.address.selected.address2,
            town: $scope.posts[0].town,
            postcode: $scope.posts[0].postcode
        }
        //collertRefArr.push(collectRefObj);
        collertRefArr.push(JSON.stringify(collectRefObj));
        /*
         var putObjOld = {
         "bookingtype": $scope.bookingType,
         "retailercity": $scope.address.selected.town,
         "deliveryrefphoneno": $scope.confirmAdd.phoneNo,
         "collectionreferences": collertRefArr,
         "sundayBranchStoreClosingTime": "17:00",
         "deliveryrefname": $scope.confirmAdd.refNameId,
         "createdate": 1435668127648,
         "saturdayBranchStoreOpenTime": "09:00",
         "noserviceemail": null,
         "branchInstoreTime": null,
         "timeslotstart": $scope.bookNowStartTime,
         "fridayBranchStoreClosingTime": "18:00",
         "username": $rootScope.loggedUser,
         "cbservicecenterdesc": "LONDON SAMEDAY SERVICECENTRE",
         "tuesdayBranchStoreClosingTime": "18:00",
         "cbservicecenterenabled": "true",
         "cbservicecenteraddress6": "EC2A 4PH",
         "deliveryDate": $scope.timeslotDateObj.format("YYYY-MM-DD"),
         "cbservicecenteraddress7": "GBR",
         "cbservicecenteraddress1": "CITYSPRINT COURIERS",
         "cbservicecenteraddress2": "58-62 SCRUTTON STREET",
         "cbservicecenteraddress4": "LONDON",
         "mondayBranchStoreOpenTime": "09:00",
         "subscriptionServiceCode": null,
         "subscriptionCollectionLeadTime": null,
         "customertotal": $scope.bookNowTotal,
         "postcode": $scope.address.selected.postcode,
         "packagecollectionreadydate": $scope.mydeliveryuser.deliverydateObj.format("YYYY-MM-DD"),
         "retaileraddressline1": "86 Westbourne Grove",
         "retaileraddressline2": null,
         "retailername": "Lords",
         "serviced": null,
         "sundayBranchStoreOpenTime": "11:00",
         "deliveryrefaddress1": $scope.address.selected.address1,
         "fridayBranchStoreOpenTime": "09:00",
         "deliveryrefaddress2": $scope.address.selected.address2,
         "vatamount": $scope.bookNowVat || "",
         "email": $scope.confirmAdd.emailAdd,
         "deliveryrefcompany": "LORO PIANA (GB) LTD",
         "uuid": $scope.uuid,
         "tuesdayBranchStoreOpenTime": "09:00",
         "bankHolidaySet": null,
         "retailerpostalcode": "W25RT",
         "jobreference": "017381165501",
         "cbservicecenterthirdparty": "false",
         "retailertype": "OnBoarded",
         "packagecollectionreadyfrom": $scope.mydeliveryuser.readyat,
         "updateddate": 1435891474280,
         "cbpostcodevalidationmessage": null,
         "timeslotId": $scope.tsRadio.res,
         "subscriptionname": null,
         "deliveryrefaddresscounty": null,
         "thursdayBranchStoreOpenTime": "09:00",
         "thursdayBranchStoreClosingTime": "18:00",
         "timeslotend": $scope.bookNowEndTime,
         "cbservicecentercode": "WO-SD",
         "retailerlatlong": null,
         "retailerBranchName": "Lords (Westbourne Grove)W25RT",
         "retailerstoreopentime": "09:00",
         "wednesdayBranchStoreOpenTime": "09:00",
         "deliveryrefaddresstown": "LONDON",
         "quoteamount": $scope.bookNowPrice,
         "packageshopclosetime": null,
         "saturdayBranchStoreClosingTime": "18:30",
         "packageshopopentime": null,
         "jobnumber": "",
         "mondayBranchStoreClosingTime": "18:00",
         "vouchercode": $scope.promo.voucherCode,
         "officecode": null,
         "wednesdayBranchStoreClosingTime": "18:00",
         "retailerstoreclosetime": "18:00",
         "zone": $scope.zone,
         "storeid": $scope.storeID,
         "accountnumber": "",
         "storeinstruction": ""
         };
         */


        var voucherCode =   ($scope.bookingType === "Voucher")  ? $scope.promo.voucherCode : "";

        var putObj = {
            "bookingtype": $scope.bookingType,
            "retailercity": $scope.storeDetails.address.city, // store city we have to bind
            "deliveryrefphoneno": $scope.confirmAdd.phoneNo,
            "collectionreferences": collertRefArr,
            //"sundayBranchStoreClosingTime": "17:00",
            "deliveryrefname": $scope.confirmAdd.refNameId,
            //"createdate": 1435668127648,
            //"saturdayBranchStoreOpenTime": "09:00",
            //"noserviceemail": null,
            //"branchInstoreTime": null,
            "timeslotstart": $scope.bookNowStartTime,
            //"fridayBranchStoreClosingTime": "18:00",
            "username": $rootScope.loggedUser,
            //"cbservicecenterdesc": "LONDON SAMEDAY SERVICECENTRE",
            //"tuesdayBranchStoreClosingTime": "18:00",
            //"cbservicecenterenabled": "true",
            //"cbservicecenteraddress6": "EC2A 4PH",
            "deliveryDate": $scope.timeslotDateObj.format("YYYY-MM-DD"),
            //"cbservicecenteraddress7": "GBR",
            //"cbservicecenteraddress1": "CITYSPRINT COURIERS",
            //"cbservicecenteraddress2": "58-62 SCRUTTON STREET",
            //"cbservicecenteraddress4": "LONDON",
            //"mondayBranchStoreOpenTime": "09:00",
            //"subscriptionServiceCode": null,
            //"subscriptionCollectionLeadTime": null,
            "customertotal": $scope.bookNowTotal, // payg only we have to pass otherwise 0.0
            "postcode": $scope.address.selected.postcode,
            "packagecollectionreadydate": $scope.mydeliveryuser.deliverydateObj.format("YYYY-MM-DD"),
            "retaileraddressline1": $scope.storeDetails.address.firstLine || "", // bind store address I
            "retaileraddressline2": $scope.storeDetails.address.secondline || "", // bind store address II
            "retailername": $scope.storeDetails.retailerName, // bind store name (check)
            //"serviced": null,
            //"sundayBranchStoreOpenTime": "11:00",
            "deliveryrefaddress1": $scope.address.selected.address1,
            //"fridayBranchStoreOpenTime": "09:00",
            "deliveryrefaddress2": $scope.address.selected.address2,
            "vatamount": $scope.bookNowVat || "",
            //"deliveryrefcompany": "LORO PIANA (GB) LTD",
            "uuid": $scope.uuid,
            //"tuesdayBranchStoreOpenTime": "09:00",
            //"bankHolidaySet": null,
            "retailerpostalcode": $scope.storeDetails.address.postCode, // store postal code bind
            //"jobreference": "017381165501",
            //"cbservicecenterthirdparty": "false",
            //"retailertype": "OnBoarded",
            "packagecollectionreadyfrom": $scope.packagecollectionreadyfrom,
            //"updateddate": 1435891474280,
            //"cbpostcodevalidationmessage": null,
            "timeslotId": $scope.tsRadio.res,
            "subscriptionname": $scope.subscriptions.displayname || "", // If subscription booking
            //"deliveryrefaddresscounty": null,
            //"thursdayBranchStoreOpenTime": "09:00",
            //"thursdayBranchStoreClosingTime": "18:00",
            "timeslotend": $scope.bookNowEndTime,
            //"cbservicecentercode": "WO-SD",
            //"retailerlatlong": null,
            //"retailerBranchName": "Lords (Westbourne Grove)W25RT",  // check
            "retailerstoreopentime": $scope.storeTimes.storeShopOpen, // bind value
            "retailerstoreclosetime": $scope.storeTimes.storeShopClose, // bind value
            //"wednesdayBranchStoreOpenTime": "09:00",
            "deliveryrefaddresstown": $scope.address.selected.town, // bind
            "quoteamount": $scope.bookNowPrice,
            //"packageshopclosetime": null,
            //"saturdayBranchStoreClosingTime": "18:30",
            //"packageshopopentime": null,
            //"jobnumber": "",
            //"mondayBranchStoreClosingTime": "18:00",
            "vouchercode": voucherCode,
            //"officecode": null,
            //"wednesdayBranchStoreClosingTime": "18:00",
            "zone": $scope.zone,
            "storeid": $scope.storeID,
            //"accountnumber": "",
            //"storeinstruction": $scope.confirmAdd.deliveryInstruction //  specifying instruction bind
            "storeinstruction": "" //  specifying instruction bind
        };
        if ($scope.confirmAdd.emailAdd.length > 0) {
            putObj["email"] = $scope.confirmAdd.emailAdd;
        }
        BookingService.updateBookingRequest(putObj).then(function (data) {
            var postObj = {
                "orderType": "1",
                "webhook": "",
                "supplierId": "CitySprint",
                "accountNumber": "",
                "serviceType": "",
                "referenceNo": "",
                "departmentReferenceNo": "",
                "notificationType": "",
                "timeslot": {
                    "timeslotId": $scope.tsRadio.res
                },
                "store": {
                    "storeId": $scope.storeID,
                    "instruction": ""
                },
                "consumer": {
                    "name": $scope.confirmAdd.customerName,
                    "email": $scope.confirmAdd.emailAdd,
                    "mobileNumber": $scope.confirmAdd.phoneNo,
                    "address": {
                        "firstLine": $scope.address.selected.address1,
                        "secondLine": $scope.address.selected.address2,
                        "city": $scope.address.selected.town,
                        "postCode": $scope.mydeliveryuser.postCodeValue
                    },
                    "instruction": $scope.confirmAdd.deliveryInstruction
                },
                "item": {
                    "referenceNumber": $scope.confirmAdd.refNameId,
                    "itemContentCount": 1,
                    "totalValue": Number($scope.confirmAdd.itemValue) || 0,
                    "weight": 0,
                    "height": 0,
                    "length": 0,
                    "description": ""
                }
            };

            /*
            if($scope.confirmAdd.itemValue.length > 0 ){
                postObj["item"]["totalValue"] = Number($scope.confirmAdd.itemValue);
            }
            */


            //debugger;

            //
            if ($scope.bookingType === "PAYG") {
                BookingService.getRealex($scope.uuid).then(function (data) {
                    console.log(data);
                    //
                    var createform = document.createElement('form');
                    createform.setAttribute("action", envconfig.get('payment'));
                    createform.setAttribute("method", "post");
                    createform.setAttribute("name", "abcde");
                    createform.setAttribute("id", "myForm");
                    var inputelement = document.createElement('input');
                    inputelement.setAttribute("type", "hidden");
                    inputelement.setAttribute("name", "MERCHANT_ID");
                    inputelement.setAttribute("value", data.merchantId);
                    createform.appendChild(inputelement);
                    var inputelement1 = document.createElement('input');
                    inputelement1.setAttribute("type", "hidden");
                    inputelement1.setAttribute("name", "ORDER_ID");
                    inputelement1.setAttribute("value", data.orderId);
                    createform.appendChild(inputelement1);
                    var inputelement2 = document.createElement('input');
                    inputelement2.setAttribute("type", "hidden");
                    inputelement2.setAttribute("name", "ACCOUNT");
                    inputelement2.setAttribute("value", data.subaccount);
                    createform.appendChild(inputelement2);
                    var inputelement3 = document.createElement('input');
                    inputelement3.setAttribute("type", "hidden");
                    inputelement3.setAttribute("name", "AMOUNT");
                    inputelement3.setAttribute("value", data.amount);
                    createform.appendChild(inputelement3);
                    var inputelement4 = document.createElement('input');
                    inputelement4.setAttribute("type", "hidden");
                    inputelement4.setAttribute("name", "CURRENCY");
                    inputelement4.setAttribute("value", data.currency);
                    createform.appendChild(inputelement4);
                    var inputelement5 = document.createElement('input');
                    inputelement5.setAttribute("type", "hidden");
                    inputelement5.setAttribute("name", "TIMESTAMP");
                    inputelement5.setAttribute("value", data.timestamp);
                    createform.appendChild(inputelement5);
                    var inputelement6 = document.createElement('input');
                    inputelement6.setAttribute("type", "hidden");
                    inputelement6.setAttribute("name", "SHA1HASH");
                    inputelement6.setAttribute("value", data.sha1hash);
                    createform.appendChild(inputelement6);
                    var inputelement7 = document.createElement('input');
                    inputelement7.setAttribute("type", "hidden");
                    inputelement7.setAttribute("name", "MERCHANT_RESPONSE_URL");
                    inputelement7.setAttribute("value", data.MERCHANT_RESPONSE_URL);
                    createform.appendChild(inputelement7);
                    var inputelement8 = document.createElement('input');
                    inputelement8.setAttribute("type", "hidden");
                    inputelement8.setAttribute("name", "COMMENT1");
                    inputelement8.setAttribute("value", data.COMMENT1);
                    createform.appendChild(inputelement8);
                    var inputelement9 = document.createElement('input');
                    inputelement9.setAttribute("type", "hidden");
                    inputelement9.setAttribute("name", "COMMENT2");
                    inputelement9.setAttribute("value", data.COMMENT2);
                    createform.appendChild(inputelement9);
                    var inputelement10 = document.createElement('input');
                    inputelement10.setAttribute("type", "hidden");
                    inputelement10.setAttribute("name", "WORKFLOW");
                    inputelement10.setAttribute("value", data.WORKFLOW);
                    createform.appendChild(inputelement10);
                    var inputelement11 = document.createElement('input');
                    inputelement11.setAttribute("type", "hidden");
                    inputelement11.setAttribute("name", "PROD_ID");
                    inputelement11.setAttribute("value", data.PROD_ID);
                    createform.appendChild(inputelement11);
                    var inputelement12 = document.createElement('input');
                    inputelement12.setAttribute("type", "hidden");
                    inputelement12.setAttribute("name", "USER");
                    inputelement12.setAttribute("value", data.USER);
                    createform.appendChild(inputelement12);
                    var inputelement13 = document.createElement('input');
                    inputelement13.setAttribute("type", "hidden");
                    inputelement13.setAttribute("name", "UUID");
                    inputelement13.setAttribute("value", data.UUID);
                    createform.appendChild(inputelement13);
                    var inputelement14 = document.createElement('input');
                    inputelement14.setAttribute("type", "hidden");
                    inputelement14.setAttribute("name", "BOOKINGTYPE");
                    inputelement14.setAttribute("value", data.BOOKINGTYPE);
                    createform.appendChild(inputelement14);
                    var inputelement15 = document.createElement('input');
                    inputelement15.setAttribute("type", "hidden");
                    inputelement15.setAttribute("name", "SUCCESSURL");
                    inputelement15.setAttribute("value", data.SUCCESSURL);
                    createform.appendChild(inputelement15);
                    var inputelement16 = document.createElement('input');
                    inputelement16.setAttribute("type", "hidden");
                    inputelement16.setAttribute("name", "FAILUREURL");
                    inputelement16.setAttribute("value", data.FAILUREURL);
                    createform.appendChild(inputelement16);
                    var inputelement17 = document.createElement('input');
                    inputelement17.setAttribute("type", "hidden");
                    inputelement17.setAttribute("name", "DISPLAYNAME");
                    inputelement17.setAttribute("value", "Single delivery");
                    createform.appendChild(inputelement17);
                    var inputelement18 = document.createElement('input');
                    inputelement18.setAttribute("type", "hidden");
                    inputelement18.setAttribute("name", "AUTO_SETTLE_FLAG");
                    inputelement18.setAttribute("value", "1");
                    createform.appendChild(inputelement18);
                    var inputelement19 = document.createElement('input');
                    inputelement19.setAttribute("type", "hidden");
                    inputelement19.setAttribute("name", "DOMAIN");
                    inputelement19.setAttribute("value", data.DOMAIN);
                    createform.appendChild(inputelement19);
                    var inputelement20 = document.createElement('input');
                    inputelement20.setAttribute("type", "hidden");
                    inputelement20.setAttribute("name", "CHANNEL");
                    inputelement20.setAttribute("value", data.CHANNEL);
                    createform.appendChild(inputelement20);
                    var inputelement21 = document.createElement('input');
                    inputelement21.setAttribute("type", "hidden");
                    inputelement21.setAttribute("name", "STOREID");
                    inputelement21.setAttribute("value", data.STOREID);
                    //inputelement21.setAttribute("value", "8083");
                    createform.appendChild(inputelement21);
                    var inputelement22 = document.createElement('input');
                    inputelement22.setAttribute("type", "hidden");
                    inputelement22.setAttribute("name", "SUBSCRIPTION_COST");
                    inputelement22.setAttribute("value", data.SUBSCRIPTION_COST);
                    createform.appendChild(inputelement22);
                    var inputelement23 = document.createElement('input');
                    inputelement23.setAttribute("type", "hidden");
                    inputelement23.setAttribute("name", "SUBSCRIPTION_VAT_COST");
                    inputelement23.setAttribute("value", data.SUBSCRIPTION_VAT_COST);
                    createform.appendChild(inputelement23);
                    var inputelement24 = document.createElement('input');
                    inputelement24.setAttribute("type", "hidden");
                    inputelement24.setAttribute("name", "PAYG_BOOKING_JSON");
                    inputelement24.setAttribute("value", JSON.stringify(postObj));
                    createform.appendChild(inputelement24);
                    var inputelement25 = document.createElement('input');
                    inputelement25.setAttribute("type", "hidden");
                    inputelement25.setAttribute("name", "ROLE");
                    inputelement25.setAttribute("value", "Retailer");
                    createform.appendChild(inputelement25);
                    // console.log(createform);
                    document.body.appendChild(createform);
                    document.getElementById("myForm").style.visibility = "none";
                    createform.submit();
                    $rootScope.loadingDiv = false;
                }, function (err) {
                    //console.log(err);
                    $rootScope.loadingDiv = false;
                    $scope.errFlag = true;
                    $scope.errStatusCode = err.status;
                });
            }
            if ($scope.bookingType !== "PAYG") {
                //$location.path("payment-success").search('brJobNumber', 'CQRRL70');
                BookingService.saveBookingRequest(postObj, $scope.uuid).then(function (data) {
                    //console.log(data);
                    //
                    if ($scope.bookingType === "Subscription") {
                        $rootScope.loadingDiv = false;
                        $location.path("payment-success").search('brJobNumber', data.orderNo);
                    }
                    if ($scope.bookingType === "Voucher") {
                        $rootScope.loadingDiv = false;
                        $location.path("payment-success").search('brJobNumber', data.orderNo);
                    }
                }, function (err) {
                    $scope.errFlag = true;
                    $rootScope.loadingDiv = false;
                    $scope.bookBtnDisabled = false;
                    $scope.errStatusCode = err.status;
                    if ($scope.bookingType === "Subscription") {
                        //$location.path("payment-success").search('brJobNumber', 'CQRRL71');
                    }
                    if ($scope.bookingType === "Voucher") {
                        //$location.path("payment-success").search('brJobNumber', 'CQRRL72');
                    }
                });
            }
        }, function (err) {
            $scope.bookBtnDisabled = false;
            $rootScope.loadingDiv = false;
            $scope.errFlag = true;
            $scope.errStatusCode = err.status;
        });
    };
    CommonService.getRetailerSubscriptions().then(function (data) {
        $scope.subscriptions = data.data;
        //
    }, function (err) {
        console.log(err);
        $scope.errFlag = true;
        $scope.errStatusCode = err.status;
    });
    $scope.go = function (path) {
        $location.path(path + $scope.mydeliveryuser.postCodeValue);
    };
    $scope.updateDefault = function (isValid, pCode, errStatusIDFlag, storeShopOpen, storeShopClose)
    {
        if (!isValid || errStatusIDFlag || storeShopOpen == "Closed" || storeShopClose == "Closed") {
            return;
        }
        $rootScope.loadingDiv = true;
        $scope.validatePostCode();
        $scope.mydeliveryuser.postCodeValue = $scope.mydeliveryuser.postCodeValue.toUpperCase();
        restservice.get(envconfig.get('host') + "/address/postcode/" + pCode, '', function (data, status) {
            if (data && data.data)
            {
                $scope.posts = data.data;
                /*$scope.address.selected = {
                 town: $scope.posts[0].town,
                 postcode: $scope.posts[0].postcode
                 }*/
            }
        }, function (data, status) {
            //alert("Failed to load Bank holiday list");
        });
        //  $scope.postCodeValue = value;
    };
    $scope.edit = function ()
    {
        $scope.isGo = false;
        modalservice.show('lg', 'views/template/modal/retailer/signup-edit-notification.html', 'SignupEditNotificationCtrl', $scope, 'medium-dialog');
    };
    $scope.editNotifySubmit = function ()
    {
        modalservice.close();
        $scope.mydeliveryuser.postCodeValue = null;
        $scope.mydeliveryuser.hiddenpostcodevalue = null;
        $window.location.reload();
    };
    var d = new Date().toJSON();
    $scope.currentDate = moment(d).format('DD-MM-YYYY');
    $scope.currentTimeDateSplit = d.split("T");
    $scope.currentTimeSplit = $scope.currentTimeDateSplit[1].split(":");
    $scope.currentTime = $scope.currentTimeSplit[0] + ":" + $scope.currentTimeSplit[1];
    $scope.currentTime =  moment().format("HH:mm");
    $scope.validatePostCode = function () // mydeliveryuser
    {
        $scope.mydeliveryuser.hiddenpostcodevalue = $scope.mydeliveryuser.postCodeValue;
        var result = postcodeService.validate($scope.mydeliveryuser.postCodeValue);
//        var deliverydateUTC = $filter("UTCISOParse")($scope.mydeliveryuser.deliverydate);
//        var dt = $filter("ISO8601Parse")(deliverydateUTC, "Asia/Kolkata", "DD-MM-YYYY");
//        var dt = $filter("ISO8601Parse")(deliverydateUTC, "UK", "DD-MM-YYYY");
//        var dt = dt1.slice(0, dt1.lastIndexOf("T"));
//        var dt = moment($scope.mydeliveryuser.deliverydate).format(,UK,'YYYY-DD-MM');
        var deliverydateUTC = $filter("DATEFormat")($scope.mydeliveryuser.deliverydate);
        if ($scope.mydeliveryuser.readyat === "Now") {
            $scope.readyAt = $filter("UkToUtc")(deliverydateUTC + "T" + $scope.currentTime);
            $scope.packagecollectionreadyfrom = $scope.currentTime;
        }
        else {
            //$scope.readyAt = $filter("UkToUtc")(deliverydateUTC + "T" + $scope.mydeliveryuser.readyat + ":00Z");
            $scope.readyAt = $filter("UkToUtc")(deliverydateUTC + "T" + $scope.mydeliveryuser.readyat);
            $scope.packagecollectionreadyfrom = $scope.mydeliveryuser.readyat;
        }
        $scope.getNewLocation();
        if (result !== false)
        {
            var postcodepart = result.split(" ");
            $scope.mydeliveryuser.postCodeValue = postcodepart[0] + postcodepart[1];
            $scope.timeslotCall();
            //
            /*
             var postObjData = {
             //                "uuid": "49e9c6b2-b1ef-4c12-a3e1-24e72277b836",
             "consumer": {
             "postCode": $scope.mydeliveryuser.postCodeValue
             },
             "items": {
             "readyAt": $scope.readyAt,
             "deliveryDate": deliverydateUTC
             },
             "store": {
             //                    "storeId": "123",
             "storeId": $scope.storeDetails.storeId,
             "openTime": $scope.storeTimes.storeShopOpen,
             "closeTime": $scope.storeTimes.storeShopClose
             }
             };
             */
//=========================================
            /*
             TimeSlotService.postTimeslot(postObjData).then(function (data)
             {
             $scope.zone = data.data.zone;
             if ($scope.zone === "within" || $scope.zone === "adhoc")
             {
             $scope.isGo = false;
             $scope.isGoTemp = false;
             $scope.isDeliveryPostcodeComplete = true;
             }
             else {
             $scope.mydeliveryuser.hiddenpostcodevalue = null;
             modalservice.show('lg', 'views/template/modal/retailer/signup-notification.html', 'ModalRetailerSignupCtrl', $scope, 'medium-dialog');
             }
             }, function (err)
             {
             $scope.errFlag = true;
             $scope.errStatusCode = err.status;
             });
             */
//=========================================
        }
        else
        {
            $scope.mydeliveryuser.postCodeValue = null;
            $scope.mydeliveryuser.hiddenpostcodevalue = null;
        }
    };
//        restservice.post(CommonService.getRetailerTimeslots().then(function (data) {
//            $scope.zone = data.data.zone;
//
//            if ($scope.zone === "within")
//            {
//                $scope.isGo = false;
//                $scope.isGoTemp = false;
//                $scope.isDeliveryPostcodeComplete = true;
//            }
//            else {
//                $scope.mydeliveryuser.hiddenpostcodevalue = null;
//                modalservice.show('lg', 'views/template/modal/retailer/signup-notification.html', 'ModalRetailerSignupCtrl', $scope, 'medium-dialog');
//            }
//        }), '',
//                function (data, status)
//                {
////                            if (data.hasOwnProperty('isServiced'));
//                },
//                function (data, status)
//                {
////                            if (data.hasOwnProperty('error') && data.errors.error !== null)
////                            {
////                                $rootScope.noServiceUUID = data.enclosedObject;
////                                $scope.mydeliveryuser.hiddenpostcodevalue = null;
////                                modalservice.show('lg', 'views/template/modal/retailer/signup-notification.html', 'ModalRetailerSignupCtrl', $scope, 'medium-dialog');
////                            }
//                }, postObj);
//        }
//        else
//        {
//            $scope.mydeliveryuser.postCodeValue = null;
//            $scope.mydeliveryuser.hiddenpostcodevalue = null;
//        }
    //        }
    //    };
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
    $scope.getPosition = function (position) {
        $scope.geolocation = new google.maps.LatLng(position.coords.latitude,
                position.coords.longitude);
    };
//    $scope.geolocate();
    $scope.getAllStates = function (callback)
    {
        callback($scope.allStates);
    };
    $scope.resetChooseTimeslot = function () {
        //$scope.isChooseTimeslotComplete = false;
        $scope.isBookNowClicked = false;
        $scope.status.isChooseTimeslotPanelOpen = true;
        $scope.tsRadio.res = "";
        $scope.showMorelimit = 10;
        $scope.showMoreFlag = false;
    };
//    $scope.changeTimeslot = function (openTiming) {
////        if (openTiming)
////        {
////            $scope.times = ['00:00', "00:30", "01:00", "01:30", "02:00", "02:30", "03:00", "03:30", "04:00", "04:30", "05:00", "05:30", "06:00", "06:30", "07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00", "23:30"];
////            for (var i = 0; i < $scope.times.length; i++) {
////                if ($scope.times[i] === openTiming) {
////                    $scope.times.splice(0, i + 1);
////                    $scope.storeTimes.storeShopClose = $scope.times[0];
////                }
////            }
////        }
//        if ($scope.isDeliveryPostcodeComplete) {
//            //$scope.getLocation($scope.postcode);
//        }
//        $scope.isTimeSlotChanged = false;
//        $scope.isDeliveryPostcodeComplete = false;
//        $scope.isTimeslotChanged = false;
//        $scope.timeslotDate = false;
//    };
    $scope.hideTimeslot = function (shopopen, times, shopclose, closetimes) {
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
                //$scope.getLocation($scope.postcode);
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
    $scope.updateDeliveryDate = function (dateObj) {
        CommonService.safeApply($scope, function () {
            $scope.mydeliveryuser.deliverydate = dateObj.format('DD-MM-YYYY');
            $scope.mydeliveryuser.deliverydateObj = dateObj;
            $scope.hideTimeslot();
            //
            //
            if (!$scope.persistTs) {
                $scope.getStoreDetails();
            }
            //$scope.getStoreDetails();
        });
    };
    $scope.timeslotCall = function () {
        //$scope.timeslotDate = $scope.mydeliveryuser.deliverydate;
        //
        if (!$scope.timeslotDate) {
            var tsOrPackageCollectionDate = $scope.mydeliveryuser.deliverydate;
        } else {
            var tsOrPackageCollectionDate = $scope.timeslotDate;
        }
        //
        if ($scope.persistTs) {

            $scope.packagecollectionreadyfrom = $scope.persistTsReadyAt;
            //= $scope.persistTsPackageCollectionDate;
            //
            //debugger;
            //$scope.readyAt = $scope.persistTsPackageCollectionDate + "T" + $scope.packagecollectionreadyfrom + ":00Z";
            $scope.readyAt = $filter("UkToUtc")($scope.persistTsPackageCollectionDate + "T" + $scope.packagecollectionreadyfrom);

        }
        var deliverydateUTC = $filter("DATEFormat")(tsOrPackageCollectionDate);
        var postObjData = {
            // "uuid": "49e9c6b2-b1ef-4c12-a3e1-24e72277b836",
            "consumer": {
                "address": {
                    //"postCode": $scope.mydeliveryuser.postCodeValue.toUpperCase()
                    "postCode": $scope.mydeliveryuser.postCodeValue.toUpperCase()
                }
            },
            "items": {
                "readyAt": $scope.readyAt,
                "deliveryDate": deliverydateUTC
            },
            "store": {
                "storeId": $scope.storeDetails.storeId,
                "info": {
                    "openTime": $scope.storeTimes.storeShopOpen,
                    "closeTime": $scope.storeTimes.storeShopClose
                }
            }
        };
        $scope.retDistHideModal = function ()
        {
            modalservice.close();
        };
        // CommonService.getRetailerTimeslots().then(function (data) {
        $scope.tsProcess = true;
        TimeSlotService.postTimeslot(postObjData).then(function (data) {
            $rootScope.loadingDiv = false;
            $scope.zone = data.data.zone;
            $scope.uuid = data.data.uuid;
            $scope.storeID = $scope.storeDetails.storeId;
            $scope.errStatusIDFlag = false;
            $scope.noTimeSlots = false;
            $scope.storeClosedMsg = false;
            $scope.timeSlotNotAvilable = false;
            $scope.timeslotsArr = data.data.timeslots;
            $scope.tsRadio.res = "";
            if ($scope.persistTs) {
                $scope.tsRadio.res = _.result(_.find($scope.timeslotsArr, {'startTime': $scope.persistTsStart, 'endTime': $scope.persistTsEnd}), 'timeslotId') || "";
                var quote = _.result(_.find($scope.timeslotsArr, {'startTime': $scope.persistTsStart, 'endTime': $scope.persistTsEnd}), 'quote') || "";
                $scope.setBookNowPrice($scope.persistTsStart, $scope.persistTsEnd, quote);
                $scope.persistTsDateshow = false;
                $scope.persistTs = false;
            }
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
            if ($scope.timeslotsArr.length > 10) {
                $scope.showMoreFlag = true;
            }
            $scope.tsProcess = false;
        }, function (err) {
            $rootScope.loadingDiv = false;
//            $scope.noTimeSlots = true;
            $scope.tsProcess = false;
            $scope.errStatusCode = err.status;
            if (err.data.errors[0]) {
                $scope.errStatusID = err.data.errors[0].errorId;
            }
            $scope.timeslotsArr = [];
            if (Number($scope.errStatusCode) === 404 && $scope.errStatusID === "ET-TIST-001") {
//                $scope.errStatusIDFlag = true;
                $scope.errFlag = false;
                $scope.isDeliveryPostcodeComplete = true;
                $scope.timeSlotNotAvilable = true;
            }
            else if (Number($scope.errStatusCode) === 400 && $scope.errStatusID === "ET-ST-008") {
                $scope.errFlag = false;
//                $scope.errStatusIDFlag = false;
                modalservice.show('lg', 'views/template/modal/retailer/retailer-distance.html', '', $scope, 'medium-dialog');
            }
            else if (Number($scope.errStatusCode) === 400 && $scope.errStatusID === "ET-TIST-007" && $scope.isDeliveryPostcodeComplete) {
                //
                //$scope.errFlag = true;
                //$scope.errStatusIDFlag = false;
                //$scope.errStatusCode = $scope.errStatusCode + " (" + $scope.bankHolidayName + ")";
                $scope.timeSlotNotAvilable = false;
                $scope.storeClosedMsg = true;
                $scope.errFlag = false;
                $scope.errStatusIDFlag = false;
                //
                //return;
            }
            else if (Number($scope.errStatusCode) === 400 && $scope.errStatusID === "ET-TIST-007" && !$scope.isDeliveryPostcodeComplete) {
                //
                $scope.errFlag = true;
                $scope.errStatusIDFlag = false;
                $scope.isDeliveryPostcodeComplete = false;
                $scope.errStatusCode = $scope.errStatusCode + " (" + $scope.bankHolidayName + ")";
            }
            else {
                //$scope.errFlag = true;
                $scope.noTimeSlots = true;
                $scope.storeClosedMsg = false;
            }
            $scope.tsRadio.res = "";
        });
    };
    $scope.getNewLocation = function () {
        var radius = $scope.masterTblRadius || Math.ceil(5 * 1609.344);
        var zoom = CommonService.getZoomValue(radius);
        //
        if ($scope.subscriptions && $scope.subscriptions.minMiles) {
            radius = Math.ceil(Number($scope.subscriptions.minMiles) * 1609.344);
            zoom = CommonService.getZoomValue(radius);
            //radius =  Math.ceil(5 * 1609.344);
            //var m = 5 * 1609.344;
        }
        var geocoder = new google.maps.Geocoder();
        $scope.userpostcode = $scope.mydeliveryuser.postCodeValue;
        geocoder.geocode({'address': $scope.retailerPostcode}, function (results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
                var location = results[0].geometry.location,
                        mapOptions = {
                            center: location,
                            zoom: zoom,
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
                            radius: radius,
                            map: map,
                            fillColor: '#43B02A',
                            fillOpacity: 0.5,
                            strokeColor: '#43B02A',
                            strokeOpacity: 0.4
                        });
                geocoder.geocode({'address': $scope.userpostcode}, function (results, status) {
                    if (status === google.maps.GeocoderStatus.OK) {
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
//                        alert("plot retailer is not successfull : " + status);
                    }
                });
                /*$scope.reFocus = function () {
                 var latLong = map.center;
                 google.maps.event.trigger(map, "resize");
                 map.setCenter(latLong);
                 };*/
                /*google.maps.event.addDomListener(window, "resize", function() {
                 console.log('resize');
                 console.log(map);
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
        });
    };
    $scope.updateTimeslotDate = function (dateObj, prevFlag, nextFlag) {
        CommonService.safeApply($scope, function () {
            $scope.resetChooseTimeslot();
            //
            $scope.timeslotDate = dateObj.format('DD-MM-YYYY');
            $scope.timeslotDateObj = dateObj;
            if ($scope.timeslotDate === moment().format('DD-MM-YYYY')) {
                $scope.timeslotDateLabel = "today";
            } else {
                $scope.timeslotDateLabel = $scope.timeslotDate;
            }
            $scope.isPrevDisabled = prevFlag;
            $scope.isNextDisabled = nextFlag;
            if ($scope.timeslotDate !== $scope.mydeliveryuser.deliverydate) {
                $scope.isTimeslotChanged = true;
            }
            if ($scope.isDeliveryPostcodeComplete && $scope.isTimeslotChanged) {
                $scope.timeslotCall();
                //
            }
        });
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
        if (obj) {
            $scope.bookNowPrice = obj.price;
            $scope.bookNowVat = obj.vat;
            $scope.bookNowTotal = obj.total;
            $scope.bookNowPriceCopy = angular.copy(obj.price);
            $scope.bookNowVatCopy = angular.copy(obj.vat);
            $scope.bookNowTotalCopy = angular.copy(obj.total);
            if (($scope.voucher && $scope.voucher.valid) || ($scope.subscriptions.isActive && $scope.zone !== 'adhoc')) {
                $scope.bookNowPrice = 0;
                $scope.bookNowVat = 0;
                $scope.bookNowTotal = 0;
            }
        }
        $scope.bookNowStartTime = StartTime;
        $scope.bookNowEndTime = EndTime;
        //
    };
    $scope.savechooseTimeslot = function (isValid) {
        if (!isValid)
            return;
        console.log("submit");
        //$scope.isChooseTimeslotComplete = true;
        $scope.isBookNowClicked = true;
        $scope.isShowConfirmDelivery = true;
        $scope.status.isChooseTimeslotPanelOpen = false;
        $scope.status.isConfirmDelAddrsOpen = true;
        //        PAYG
        //        Voucher
        //        Credit
        //        Subscription
        if ($scope.subscriptions.isActive && $scope.zone !== 'adhoc') {
            $scope.bookingType = "Subscription";
        }
        if ($scope.voucher.valid) {
            $scope.bookingType = "Voucher";
        }
        if (!$scope.voucher.valid && !$scope.subscriptions.isActive) {
            $scope.bookingType = "PAYG";
        }
        if ($scope.zone === 'adhoc') {
            $scope.bookingType = "PAYG";
        }
        //
    };
    $scope.$watch("status.isChooseTimeslotPanelOpen", function (newValue) {
        if (newValue) {
            $scope.isChooseTimeslotComplete = false;
            $scope.status.isChooseTimeslotPanelOpen = true;
            $scope.status.isConfirmDelAddrsOpen = !$scope.status.isChooseTimeslotPanelOpen;
            $scope.status.isConfirmDelAddrsOpen = false;
        }
    });
    $scope.$watch("status.isConfirmDelAddrsOpen", function (newValue) {
        if (newValue) {
            $scope.status.isChooseTimeslotPanelOpen = !$scope.status.isConfirmDelAddrsOpen;
        }
    });
    $scope.getStoreDetails = function () {
        //
        restservice.get(envconfig.get('host') + "/getStore", '', function (data, status) {
            $scope.storeDetails = data.data;
            $scope.storeTimeDetails = data.data.info.openingHours;
            $scope.errStatusIDFlag = false;
//            var d = new Date().toJSON();
//            $scope.currentDate = moment(d).format('DD-MM-YYYY');
            if ($scope.mydeliveryuser.deliverydate) {
                var dt = moment($scope.mydeliveryuser.deliverydate, "DD-MM-YYYY");
                var openingDay = dt.format('ddd').toUpperCase();
                $scope.storeTime = $scope.storeTimeDetails[openingDay];
                $scope.timeDay = $scope.storeTime.split("-");
            }
            if ($scope.storeTime === "Closed") {
                $scope.isBankHoliday = true;
                if (CommonService.shopOpenningTimes.length <= 48)
                {
                    CommonService.shopOpenningTimes.push("Closed");
                    CommonService.closeTimes.push("Closed");
                }
                $scope.storeTimes = {
                    storeShopOpen: $.trim(CommonService.shopOpenningTimes[CommonService.shopOpenningTimes.length - 1]),
                    storeShopClose: $.trim(CommonService.shopOpenningTimes[CommonService.shopOpenningTimes.length - 1])
                };
            }
            else {
                $scope.isBankHoliday = false;
                //
                if (!$scope.persistTs) {
                    $scope.storeTimes = {
                        storeShopOpen: $.trim($scope.timeDay[0]),
                        storeShopClose: $.trim($scope.timeDay[1])
                    };
                }
            }
            $scope.retailerPostcode = $scope.storeDetails.address.postCode;
            if (!$routeParams['uuid']) {
                $scope.getLocation($scope.retailerPostcode);
            }
//            var Bankurl = "scripts/json/retailer/bankHolidaysList.json";
            //            restservice.get(Bankurl, '',
            restservice.get(envconfig.get('host') + "/getHolidayList", '',
                    function (data1, status) {
                        $scope.bankHolidaysList = data1.data.holidays;
                        for (var i = 0; i < $scope.bankHolidaysList.length; i++) {
                            var holiDayDate = $scope.bankHolidaysList[i].date.split("T")[0];
                            holiDayDate = moment(holiDayDate).format("DD-MM-YYYY");
                            if ($scope.mydeliveryuser.deliverydate === holiDayDate) {
                                $scope.bankHolidayName = $scope.bankHolidaysList[i].name;
                                $scope.storeOpenOnHolidayArray = Object.keys($scope.storeDetails.info.bankHolidayDetails);
                                for (var j = 0; j < $scope.storeOpenOnHolidayArray.length; j++) {
                                    if ($scope.bankHolidaysList[i].name === $scope.storeOpenOnHolidayArray[j])
                                    {
                                        $scope.storeTime = $scope.storeDetails.info.bankHolidayDetails[$scope.storeOpenOnHolidayArray[j]];
                                        $scope.timeDay = $scope.storeTime.split("-");
                                        if ($scope.storeTime === "Closed") {
                                            $scope.isBankHoliday = true;
                                            if (CommonService.shopOpenningTimes.length <= 48)
                                            {
                                                CommonService.shopOpenningTimes.push("Closed");
                                            }
                                            $scope.storeTimes = {
                                                storeShopOpen: $.trim(CommonService.shopOpenningTimes[CommonService.shopOpenningTimes.length - 1]),
                                                storeShopClose: $.trim(CommonService.shopOpenningTimes[CommonService.shopOpenningTimes.length - 1])
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
            //$scope.mydeliveryuser.readyat = CommonService.readyAtTime[0];
        }
        , function (data, status) {
            $scope.errFlag = true;
            $scope.errStatusCode = status;
            if (Number($scope.errStatusCode) === 404) {
                $scope.errStatusMsg = ", Store not found.";
            }
        });
    };
    $scope.getStoreDetails();
    var count = 1;
    var tempCount = 0;
    $scope.$watch("mydeliveryuser.deliverydate", function (newValue) {
//        if (newValue && $scope.currentDate !== '') {
        if (newValue === $scope.currentDate) {
            $scope.isCurrentDay = true;
            $scope.readyAtTimes = null;
            $scope.readyAtTimes = CommonService.readyAtTime;
            if ($scope.currentTime) {
                count = 0;
                for (var i = 0; i < $scope.readyAtTimes.length; i++) {
                    if ($scope.currentTime !== $scope.readyAtTimes[i]) {
                        var CurrentTimeArray = $scope.currentTime.split(":");
//                        var CurrentTimeArray = ["07", "29"]
                        var readyAtTimeArray = $scope.readyAtTimes[i].split(":");
                        if (CurrentTimeArray[0] === readyAtTimeArray[0]) {
                            if (parseInt(CurrentTimeArray[1]) >= 0 && parseInt(CurrentTimeArray[1]) < 30) {
                                if (tempCount < 1) {
                                    $scope.readyAtTimes.splice(1, i);
                                    tempCount++;
                                }
                            }
                            if (parseInt(CurrentTimeArray[1]) >= 30 && parseInt(CurrentTimeArray[1]) < 60) {
                                $scope.readyAtTimes.splice(1, i + 1);
                            }
                        }
                    }
                }
            }
//            CommonService.readyAtTime.unshift("Now");
            $scope.readyAtTimes = CommonService.readyAtTime;
            $scope.mydeliveryuser.readyat = $scope.readyAtTimes[0];
//            count--;
        }
        else {
            if (count === 0) {
                count = 1;
                $scope.readyAtTimes = null;
                $scope.isCurrentDay = false;
                $scope.mydeliveryuser.readyat = null;
                $scope.readyAtTimesOtherday = [];
//                $scope.mydeliveryuser.readyat = CommonService.allTimes[1];
                $scope.readyAtTimesOtherday = ['00:00', "00:30", "01:00", "01:30", "02:00", "02:30", "03:00", "03:30", "04:00", "04:30", "05:00", "05:30", "06:00", "06:30", "07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00", "23:30"];
                $scope.mydeliveryuser.readyat = $scope.readyAtTimesOtherday[19];
            }
        }
//        }
//        else {
//            $scope.readyAtTimes = CommonService.readyAtTime;
//        }
    });
    $scope.paymentPage = function (isValid) {
        $scope.isBuyBundleBook = true;
        if (!$scope.subscription.bundle || !$scope.timeslotDate || !isValid) {
            return;
        }
        $rootScope.loadingDiv = true;
        var putObj = {
            "timeslotstart": $scope.bookNowStartTime,
            "username": $rootScope.loggedUser,
            "postcode": $scope.mydeliveryuser.postCodeValue,
            "deliveryDate": $scope.timeslotDateObj.format("YYYY-MM-DD"),
            "packagecollectionreadydate": $scope.mydeliveryuser.deliverydateObj.format("YYYY-MM-DD"),
            "retaileraddressline1": $scope.storeDetails.address.firstLine || "", // bind store address I
            "retaileraddressline2": $scope.storeDetails.address.secondline || "", // bind store address II
            "retailername": $scope.storeDetails.retailerName, // bind store name (check)
            "uuid": $scope.uuid,
            "retailerpostalcode": $scope.storeDetails.address.postCode, // store postal code bind
            "packagecollectionreadyfrom": $scope.packagecollectionreadyfrom,
            "timeslotId": $scope.tsRadio.res,
            "timeslotend": $scope.bookNowEndTime,
            "retailerstoreopentime": $scope.storeTimes.storeShopOpen, // bind value
            "retailerstoreclosetime": $scope.storeTimes.storeShopClose, // bind value
            "storeid": $scope.storeID
        };
        BookingService.updateBookingRequest(putObj).then(function (data) {
            //        console.log($scope.tsRadio.res);
            //        console.log($scope.timeslotDate);
            //        console.log($scope.subscription.bundle);
            $rootScope.loadingDiv = false;
            var subscription = $scope.subscription.bundle;
            var timeslotid = $scope.tsRadio.res;
            var deliverydate = $filter("DATEFormat")($scope.timeslotDate);
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
        }, function () {
            $rootScope.loadingDiv = false;
        });
    };
    $scope.redeemVoucher = function () {
        //isRedeem
        $scope.isClickedRedeemVoucher = true;
        if ($scope.promo.voucherCode) {
            var voucherObj = {
                voucherCode: $scope.promo.voucherCode
            };
            $rootScope.loadingDiv = true;
            VoucherService.isVoucherValid($scope.promo.voucherCode).then(function (data) {
                $rootScope.loadingDiv = false;
                $scope.voucher = data.data;
                $scope.voucher.status = data.success.status.toLowerCase();
                var redeemObj = {"uuid": $scope.uuid, "vouchercode": $scope.promo.voucherCode};
                if ($scope.voucher.valid) {
                    VoucherService.voucherRedeem(redeemObj).then(function (data) {
                        console.log(data);
                        $scope.bookNowPrice = 0;
                        $scope.bookNowVat = 0;
                        $scope.bookNowTotal = 0;
                        if ($scope.voucher.valid) {
                            $scope.bookingType = "Voucher";
                        }
                    }, function (err) {
                        //$scope.errFlag = true;
                        //$scope.errStatusCode = err.status;
                    });
                }
            }, function (err) {
                $rootScope.loadingDiv = false;
                //$scope.errFlag = true;
                //$scope.errStatusCode = err.status;
            });
        }
    };
    $scope.cancelVoucher = function () {
        if ($scope.promo.voucherCode) {
            var cancelObj = {
                "uuid": $scope.uuid,
                "user": $rootScope.loggedUser
            };
            $rootScope.loadingDiv = true;
            VoucherService.voucherCancel(cancelObj).then(function (data) {
                $rootScope.loadingDiv = false;
                $scope.voucher = data.data;
                //$scope.tsRadio.res = "";
                $scope.bookNowPrice = $scope.bookNowPriceCopy;
                $scope.bookNowVat = $scope.bookNowVatCopy;
                $scope.bookNowTotal = $scope.bookNowTotalCopy;
                $scope.bookNowTotal = $scope.bookNowTotalCopy;
                $scope.promo.voucherCode = "";
                $scope.isClickedRedeemVoucher = false;
            }, function (err) {
                $rootScope.loadingDiv = false;
                $scope.errFlag = true;
                $scope.errStatusCode = err.status;
            });
        }
    };
    VoucherService.getIsVoucherUsed().then(function (data) {
        $scope.voucherDetails = data.data;
    },
            function (err) {
                // $scope.errFlag = true;
                // $scope.errStatusCode = err.status;
            });
    /*
     CommonService.getServerTime().then(function (data) {
     },
     function (err) {
     $scope.errFlag = true;
     $scope.errStatusCode = err.status;
     });
     */
});
