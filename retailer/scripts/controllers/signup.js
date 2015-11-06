'use strict';
angular.module('app').controller('RetailerSignupCtrl', function ($scope, $route, $rootScope, $http, $location, $modal, postcodeService, geocodeservice, restservice, modalservice, $routeParams, $window, envconfig, CommonService, $timeout) {
    if ($rootScope.loggedUser) {
        $location.path('/my-deliveries');
    }
    $scope.isBankholiay = false;
    $scope.manuallySelected = false;
    $scope.isGo = true;
    $scope.isGoTemp = true;
    $scope.isPostCodeServiceable = false;
    //$scope.mydeliveryuser.postCodeValue = '';
    $scope.postCodeValue = '';
    $scope.uuid = '';
    $scope.retailerRegister = {};
    $scope.bankHolidays = [];
    $scope.bankHolidaysOpenClose = {};
    $scope.ifSocialRegisterSuccess = false;
    $scope.ifSocialRegisterFailed = false;
    $scope.ifSocialRegisterNewUser = false;
    $scope.ifPostcodeError = false;
    $scope.userType = 'Login';
    
    $rootScope.isImageAdded = false;
    $rootScope.isImageRemoved = false;
    
    $scope.retailerRegisterObj = {
        firstName: "",
        secondName: "",
        email: "",
        phoneNo: "",
        storeName: "",
        storeDescription: "",
        storeContactNo: "",
        storeWebsite: "",
        defaultOpenTime: "",
        defaultCloseTime: "",
        bankingHolidayStatus: 0,
        partnerRole: 1,
        storeType: 0,
        shippingDetail: 0,
        havePortal: 2
    };
    $scope.addressOfRetailer = {
        address1: "",
        address2: "",
        town: "",
        postcode: ""
    };
    $scope.socialParams = $location.search();
    $scope.loginLink = "/MyDeliveryPortal/samllogin?return=home"; //when usual login 'Login' href should be this
    //$('#postcode').focus();
    /*angular.element(document).ready(function () {
     $('input[autofocus]').focus()
     });*/
    //collects postcode based on the usercode
    $scope.collectAddresses = function (pCode) {
        pCode = pCode.replace(/ /g,'').toLowerCase();
        restservice.get(envconfig.get('host') + "/address/postcode/" + pCode, '', function (data, status) {
            if (data && data.data)
            {
                $scope.posts = data.data;
                if(data.data.length==0) {
                    $scope.$watch(function () {
                        if($('#city').is('[readonly]')) {
                            $('#city, #postalCode').removeAttr('readonly');
                            $('#city, #postalCode').removeAttr('onfocus');                
                        }
                     });
                }
                /*$scope.posts[0].town;
                $scope.posts[0].postcode;*/
            }
        }, function (data, status) {
            //alert("Failed to load Bank holiday list");
        });
    };
    //gets bank holiday list
    $scope.getBankHolidayList = function () {
        restservice.get(envconfig.get('host') + "/getHolidayList", '',
                function (data1, status) {
                    $scope.bankHolidaysList = data1.data.holidays;
                    for (var key in $scope.bankHolidaysList) {
                        if ($scope.bankHolidaysList.hasOwnProperty(key)) {
                            if ($scope.bankHolidaysList[key].name)
                                $scope.bankHolidays.push({"name": $scope.bankHolidaysList[key].name, "availability": true, "opentime": "09:30", "closetime": "18:00", "id": $scope.bankHolidaysList[key].holidayId});
                        }
                    }
                    var length = $scope.bankHolidays.length;
                    if ((length % 2) != 0) {
                        length++;
                        $scope.bankHolidays.push({"name": "", "availability": "", "opentime": "", "closetime": "", "id": ''})
                        //$scope.showEmptyRow = true;
                    }
                    var numbers = length / 2;
                    $scope.partitionedData = partition($scope.bankHolidays, numbers);
                }, function (data1, status) {
            //alert("Failed to load Bank holiday list");
        });
    };
    if (!$.isEmptyObject($scope.socialParams)) {
        $scope.loginLink = "/MyDeliveryPortal/samllogout";  //when social login 'Login' href should be this
        if (!$scope.socialParams.error == 'newuser' || !$scope.socialParams.error == 'consumer') {
            //
        }
        $scope.collectAddresses(localStorage.postCode);
        $scope.getBankHolidayList();
        $scope.isGo = false;
        $scope.mydeliveryuser = {
            postCodeValue: localStorage.postCode
        };
        $scope.isPostCodeServiceable = true;
        $scope.ifSocialRegisterSuccess = true;
        if ($scope.socialParams.error == 'consumer') {
            $scope.ifSocialRegisterFailed = true;
        } else if ($scope.socialParams.error == 'newuser') {
            $scope.ifSocialRegisterNewUser = true;
            $scope.ifSocialRegisterSuccess = false;
            $timeout(function () {
                $(".transist-up").fadeOut();
            }, 5000);
            $scope.isGo = true;
            $scope.isPostCodeServiceable = false;
            $scope.mydeliveryuser = {
                postCodeValue: ""
            };
        } else {
            $scope.userType = 'Social';
            $scope.retailerRegisterObj.firstName = $scope.socialParams.fn;
            $scope.retailerRegisterObj.secondName = $scope.socialParams.ln;
            $scope.retailerRegisterObj.email = $scope.socialParams.email;
            $scope.retailerRegisterObj.id = $scope.socialParams.id;
            //to hide the social info after few seconds
            $timeout(function () {
                $(".transist-up").fadeOut();
            }, 5000);
        }
    }
    //$scope.hello= {};
    $scope.PostcodeIsvalid = false;
    $scope.isConfirm = false;
    $scope.registerRetailerSave = function (isValid) {
        if (!isValid) {
            $scope.manuallySelected = true;
            return;
        } else {
            if (!$scope.addressOfRetailer.address1) {
                $scope.manuallySelected = true;
                if (!$.isEmptyObject($scope.person)) {
                    $scope.addressOfRetailer.address1 = $scope.person.selected.address1;
                    $scope.addressOfRetailer.address2 = $scope.person.selected.address2;
                    $scope.addressOfRetailer.town = $scope.posts[0].town;
                    $scope.addressOfRetailer.postcode = $scope.posts[0].postcode.replace(/ /g,'')
                    /*restservice.get(envconfig.get('host') + "/geocode/" + angular.lowercase($scope.addressOfRetailer.postcode), "", function (data, status){
                     //success
                     $scope.addressOfRetailer.latitude = data.lat;
                     $scope.addressOfRetailer.longitude = data.long;
                     }, function (data, status){
                     //failure
                     $scope.UserRegFailed = true;
                     });*/
                }
                else {
                    $('html, body').animate({scrollTop: $('#basic-addon1').offset().top}, "slow");
                    return;
                }
            }
            $rootScope.loadingDiv = true;
            $scope.isConfirm = true;
            if ($scope.isBankholiay != true) {
                var bankHolidaySum = "{";
                for (var i = 0; i < $scope.bankHolidays.length; i++) {
                    if ($scope.bankHolidays[i].name) {
                        bankHolidaySum += '"' + $scope.bankHolidays[i].name + '":"' + "Closed" + '",';
                    }
                }
                //bankHolidaySum = bankHolidaySum.slice(0, -1);
                //bankHolidaySum += "}";
                //var bankHolidaySum = null;
                //var bankHolidayDetails = angular.fromJson(bankHolidaySum);
            } else {
                var bankHolidaySum = "{";
                for (var i = 0; i < $scope.bankHolidays.length; i++) {
                    if ($scope.bankHolidays[i].name) {
                        if ($scope.bankHolidays[i].availability == true) {
                            bankHolidaySum += '"' + $scope.bankHolidays[i].name + '":"' + $scope.bankHolidays[i].opentime + ' - ' + $scope.bankHolidays[i].closetime + '",';
                        } else {
                            bankHolidaySum += '"' + $scope.bankHolidays[i].name + '":"Closed",';
                        }
                    }
                }
            }
            bankHolidaySum = bankHolidaySum.slice(0, -1);
            bankHolidaySum += "}";
            var bankHolidayDetails = angular.fromJson(bankHolidaySum);
            var weekDaySum = "{";
            for (var i = 0; i < $scope.weekDaysAvail.length; i++) {
                if ($scope.weekDaysAvail[i].name) {
                    if ($scope.weekDaysAvail[i].availability == true) {
                        weekDaySum += '"' + angular.uppercase(($scope.weekDaysAvail[i].name).slice(0, 3)) + '":"' + $scope.weekDaysAvail[i].opentime + ' - ' + $scope.weekDaysAvail[i].closetime + '",';
                    } else {
                        weekDaySum += '"' + angular.uppercase(($scope.weekDaysAvail[i].name).slice(0, 3)) + '":"Closed",';
                    }
                }
            }
            weekDaySum = weekDaySum.slice(0, -1);
            weekDaySum += "}";
            var weekDaySumDetails = angular.fromJson(weekDaySum);
            //var loc = $scope.getLocation($scope.retailerRegister.postalCode.$viewValue);
            $scope.manuallySelected = true;
            $scope.UserRegSuccess = false;
            $scope.isConfirm = false;
            $scope.UserRegFailed = false;
            $scope.storeCreationSuccess = false;
            $scope.storeCreationFailure = false;
            /*if ($scope.addressOfRetailer.address1 == '' || $scope.addressOfRetailer.address1 == undefined) {
             $scope.UserRegFailed = true;
             return
             }*/
            /*if($scope.retailerRegisterObj.partnerRole =="0") {
             $scope.retailerRegisterObj.partnerRole = 0;
             } else {
             $scope.retailerRegisterObj.partnerRole = 1;
             }*/
            //store details
            
            if($rootScope.isImageRemoved == true && $rootScope.isImageAdded == true) {
            
            } else if($rootScope.isImageRemoved == true) {
                restservice.put(envconfig.get('host') + "/delete-logo", '', function (data, status) {                
                 }, function (data, status) {
                });
            }
            
            if($scope.addressOfRetailer.latitude === undefined){
                $scope.addressOfRetailer.latitude = "51.5072";
                $scope.addressOfRetailer.longitude = "0.1275";               
            }
            
            var storeData = {
                "retailerName": $scope.retailerRegisterObj.storeName,
                //"imageUrl": "",
                "address": {
                    "firstLine": $scope.addressOfRetailer.address1,
                    "secondLine": $scope.addressOfRetailer.address2 || "",
                    "city": $scope.addressOfRetailer.town,
                    "postCode": $scope.addressOfRetailer.postcode.replace(/ /g,'').toLowerCase()
                },
                "info": {
                    "storeName": $scope.retailerRegisterObj.storeName,
                    "mobileNumber": $scope.retailerRegisterObj.phoneNo,
                    "serviceCenterCode": $scope.serviceCenterCode || localStorage.serviceCenterCode,
                    "businessPhoneNumber": $scope.retailerRegisterObj.storeContactNo,
                    "website": $scope.retailerRegisterObj.storeWebsite,
                    "userName": $scope.retailerRegisterObj.email,
                    "branchEmail": $scope.retailerRegisterObj.email,
                    "storeDesc": $scope.retailerRegisterObj.storeDescription,
                    "openingHours": weekDaySumDetails,
                    "bankHolidayDetails": bankHolidayDetails
                },
                //"isWorkingOnHolidays": $scope.retailerRegisterObj.bankingHolidayStatus,
                "location": {
                    "lat": $scope.addressOfRetailer.latitude,
                    "lng": $scope.addressOfRetailer.longitude
                },
                "knowMore": {
                    "likeToBePartnerRetailer": parseInt($scope.retailerRegisterObj.partnerRole),
                    "storeType": parseInt($scope.retailerRegisterObj.storeType),
                    "havePortal": parseInt($scope.retailerRegisterObj.havePortal),
                    "shippingDetail": parseInt($scope.retailerRegisterObj.shippingDetail)
                }
            }
            var token;
            //Create store post call
            restservice.post(envconfig.get('host') + "/createStore", "",
                    function (data, status)
                    {
                        //$rootScope.loadingDiv = false;
                        $scope.storeCreationSuccess = true;
                        $scope.storeId = data.data.storeId;
                        $scope.domain = data.data.domain;
                        $scope.channel = data.data.channel;
                        if ($scope.userType == 'Social') {
                            var userData = {
                                "firstName": $scope.retailerRegisterObj.firstName,
                                "lastName": $scope.retailerRegisterObj.secondName,
                                "userName": $scope.retailerRegisterObj.email,
                                "telephoneNumber": $scope.retailerRegisterObj.phoneNo,
                                "storeId": $scope.storeId,
                                "domain": 'RTJ',
                                "channel": 'RTJ',
                                "userType": $scope.userType,
                                "id": $scope.retailerRegisterObj.id,
                                "appName": "retailer"
                            };
                            restservice.put(envconfig.get('host') + "/updateUserProfile", '', function (data, status) {
                                if ($scope.reload == undefined)
                                {
                                    $scope.updateSuccess = true;
                                    //$scope.UserRegSuccess = true;
                                    $scope.emailData();
                                    $timeout(function ()
                                    {
                                        //$rootScope.loadingDiv = false;
                                        // $scope.updateSuccess = false;
                                        //$route.reload();
                                        //$location.path('/my-deliveries');
                                        token = data.token;
                                        //$rootScope.loadingDiv = false;
                                        var rplogin = document.getElementById('rploginlink').href;
                                        //document.getElementById('rploginlink').href = rplogin;
                                        window.location.href = rplogin;
                                        $rootScope.getFailed = false;
                                        //$rootScope.saveSuccess = true;
                                        //$rootScope.successMessage = "Your details have been saved successfully!";
                                    }, 100);
                                    //$rootScope.loadingDiv = false;
                                }
                            }, function (data, status) {
                                $rootScope.loadingDiv = false;
                                $scope.updateFailed = true;
                                $scope.UserRegFailed = true;
                                $rootScope.getFailed = true;
                            }, userData);
                        } else {
                            var userData = {
                                "firstName": $scope.retailerRegisterObj.firstName,
                                "lastName": $scope.retailerRegisterObj.secondName,
                                "email": $scope.retailerRegisterObj.email,
                                "password": $scope.retailerRegisterObj.password,
                                "telephoneNumber": $scope.retailerRegisterObj.phoneNo,
                                "storeId": $scope.storeId,
                                "domain": 'RTJ',
                                "channel": 'RTJ',
                                "userType": $scope.userType,
                                "appName": "retailer"
                            };
                            //Register retailer post call
                            restservice.post(envconfig.get('host') + "/registerUser", "",
                                    function (data, status)
                                    {
                                        //$scope.UserRegSuccess = true;
                                        $scope.emailData();
                                        token = data.token;
                                        //$rootScope.loadingDiv = false;
                                        var rplogin = document.getElementById('loginlink').href + "&token=" + token;
                                        document.getElementById('rploginlink').href = rplogin;
                                        window.location.href = document.getElementById('rploginlink').href;
                                    }, function (data, status)
                            {
                                $rootScope.loadingDiv = false;
                                $scope.UserRegFailed = true;
                            }, userData);
                        }
                        //user details
                    }, function (data, status)
            {
                $rootScope.loadingDiv = false;
                $scope.storeCreationFailure = true;
            }, storeData);
        }
    };
    $scope.triggerEmail = function (emailType) {
        var emailData = {  
            /*"appName":"RetailerJourney",
             "domain":$scope.domain,
             "channel":$scope.channel,*/
            "emailTypeName": emailType,
            "storeId": $scope.storeId,
            "paramMap": {  
                "firstName": $scope.retailerRegisterObj.firstName,
                "lastName": $scope.retailerRegisterObj.secondName,
                "email": $scope.retailerRegisterObj.email,
                "mobileValidated": "false",
                "mobile": $scope.retailerRegisterObj.phoneNo
            }
        };
        //send  email call
        restservice.post(envconfig.get('host') + "/sendMail", '', function (data, status) {
            //success
        }, function (data, status) {
            //failure
        }, emailData);
    };
    $scope.emailData = function () {
        var retailerWelcome = "retailerWelcome";
        var retailerRegistration = "retailerRegistration"
        $scope.triggerEmail(retailerWelcome);
        $scope.triggerEmail(retailerRegistration);
    };
    $scope.openTimes = CommonService.shopOpenningTimes.slice(0, -1); //gets all open times from Commonservice
    $scope.closeTimes = CommonService.closeTimes.slice(1); //gets all close times from Commonservice
    $scope.shopOpen = '09:30'; //defaulting this value using ng-modal
    $scope.shopClose = '18:00'; //defaulting this value using ng-modal
    $scope.retailerRegisterObj.defaultOpenTime = []; //19 is 09:30: this is to default 09:30
    $scope.retailerRegisterObj.defaultCloseTime = []; //19 is 09:30: this is to default 18:00
    $scope.isWorkingDay = [];
    for (var i = 0; i < 7; i++) {
        $scope.retailerRegisterObj.defaultOpenTime.push($scope.shopOpen);
        $scope.retailerRegisterObj.defaultCloseTime.push($scope.shopClose);
    }
    $scope.weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    $scope.weekDaysAvail = [];
    for (var key in $scope.weekDays) {
        if ($scope.weekDays[key] != "Sunday") {
            $scope.weekDaysAvail.push({"name": $scope.weekDays[key], "availability": true, "opentime": "09:30", "closetime": "18:00"});
        } else {
            $scope.weekDaysAvail.push({"name": $scope.weekDays[key], "availability": false, "opentime": "09:30", "closetime": "18:00"});
        }
    }
    $scope.weekDaysAvail.push({"name": "", "availability": "", "opentime": "", "closetime": ""}); //cretes an extra row
    $scope.setData = partition($scope.weekDaysAvail, 4);
    //bank holiday
    $scope.bankholiday = function (val) {
        if (val === 'Yes')
        {
            $scope.isBankholiay = true;
        }
        else
        {
            $scope.isBankholiay = false;
        }
    };
    $scope.enterAddress = function () {
        $scope.manuallySelected = true;
        $scope.$watch(function () {
            if($('#city').is('[readonly]')) {
                $('#city, #postalCode').removeAttr('readonly');
                $('#city, #postalCode').removeAttr('onfocus');                
            }
         });        
    };
    $scope.formatedPostalCode = function (postCode) {
        //$scope.manuallySelected = true;
        postCode = postCode.match(/^([A-Z]{1,2}[\dA-Z]{1,2})[ ]?(\d[A-Z]{2})$/i);
        postCode.shift();
        $scope.formatedPostCodeV = postCode.join(' ');
    };
    /*$scope.retailer =
     {
     openTime: '09:30',
     closeTime: '18:00'
     };*/
    $scope.go = function (path) {
        formatedPostalCode(postCode);
        $location.path(path + $scope.mydeliveryuser.postCodeValue);
    };
    $scope.updateDefault = function (value, isValid) {
        if (!isValid) {
            return;
        }
        $scope.mydeliveryuser.postCodeValue = value.replace(/ /g,'');
        $scope.mydeliveryuser.postCodeValue = angular.uppercase($scope.mydeliveryuser.postCodeValue);
        $scope.validatePostCode();
    };
    $scope.edit = function () {
        //$scope.isGo = true;
        $scope.isGoTemp = false;
        modalservice.show('lg', 'views/template/modal/retailer/signup-edit-notification.html', 'SignupEditNotificationCtrl', $scope, 'medium-dialog');
    };
    $scope.shopclosecalcBh = function (a, i, j, value, anotherValue) {
        var closeTimes1 = ["00:30", "01:00", "01:30", "02:00", "02:30", "03:00", "03:30", "04:00", "04:30", "05:00", "05:30", "06:00", "06:30", "07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00", "23:30"];
        //console.log(i + "of" + j);
        //$scope.openT = {};
        $scope.takeFrom = a.indexOf(value);
        closeTimes1.splice(0, $scope.takeFrom + 1);
        var closeTimeIndex = closeTimes1.indexOf(anotherValue);
        //console.log($scope.setData);
        $scope.partitionedData[i][j].cTimes = closeTimes1;
        $scope.partitionedData[i][j].closetime = closeTimes1[closeTimeIndex];
    };
    $scope.shopclosecalc = function (a, i, j, value, anotherValue) {
        var closeTimes1 = ["00:30", "01:00", "01:30", "02:00", "02:30", "03:00", "03:30", "04:00", "04:30", "05:00", "05:30", "06:00", "06:30", "07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00", "23:30"];
        //console.log(i + "of" + j);
        //$scope.openT = {};
        $scope.takeFrom = a.indexOf(value);
        closeTimes1.splice(0, $scope.takeFrom + 1);
        var closeTimeIndex = closeTimes1.indexOf(anotherValue);
        //console.log($scope.setData);
        $scope.setData[i][j].cTimes = closeTimes1;
        $scope.setData[i][j].closetime = closeTimes1[closeTimeIndex];
    };
    function partition(arr, size) {
        var newArr = [];
        for (var i = 0; i < arr.length; i += size)
        {
            newArr.push(arr.slice(i, i + size));
        }
        return newArr;
    }
    //$scope.mydeliveryuser.postCodeValue = 'HA11JU'; //temporary purposes
    // mydeliveryuser
    $scope.validatePostCode = function () {
        var flagpostcode = $scope.mydeliveryuser.hiddenpostcodevalue;
        if (flagpostcode == null)
        {
            $scope.mydeliveryuser.hiddenpostcodevalue = $scope.mydeliveryuser.postCodeValue;
            var result = postcodeService.validate($scope.mydeliveryuser.postCodeValue);
            if (result !== false)
            {
                $rootScope.loadingDiv = true;
                var postcodepart = result.split(" ");
                var postObj = {
                    "postcode": $scope.mydeliveryuser.hiddenpostcodevalue
                };
                $rootScope.loadingDiv = true;
                /*var url = "scripts/json/postcodevalidation.json"
                 restservice.post(url, '',*/
                restservice.post(envconfig.get('host') + "/bookings/isPostCodeServiced/", '',
                        function (data, status)
                        {
                            $rootScope.loadingDiv = false;
//                            if (data.hasOwnProperty('isServiced'));
                            if (data.data.isServiced)
                            {
                                $scope.person = {};
                                /*$scope.person.selected = {
                                 town: "",
                                 postcode: $scope.mydeliveryuser.postCodeValue
                                 }*/
//                              $location.path(data['uuid'] + "isServiced" + postcodepart.join(''));
                                $scope.mydeliveryuser.hiddenpostcodevalue = '';
                                $scope.isGo = false;
                                $scope.isGoTemp = false;
                                $scope.isPostCodeServiceable = true;
                                $scope.PostcodeIsvalid = false;
                                $scope.serviceCenterCode = data.data.servicecentercode;
                                $scope.mydeliveryuser.postCodeValue = $scope.mydeliveryuser.postCodeValue.replace(/ /g,'');
                                if (typeof (Storage) != "undefined") {
                                    $scope.formatedPostalCode($scope.mydeliveryuser.postCodeValue);
                                    localStorage.setItem("postCode", $scope.formatedPostCodeV);
                                    localStorage.setItem("serviceCenterCode", $scope.serviceCenterCode);
                                }
                                $scope.collectAddresses($scope.mydeliveryuser.postCodeValue);
                                if (!$scope.partitionedData) {
                                    $scope.getBankHolidayList();
                                }
                            }
                            else {
                                $scope.mydeliveryuser.hiddenpostcodevalue = null;
                                $scope.uuid = data.data.uuid;
                                modalservice.show('lg', 'views/template/modal/retailer/signup-notification.html', 'ModalRetailerSignupCtrl', $scope, 'medium-dialog');
                            }
                        },
                        function (data, status)
                        {
                            $rootScope.loadingDiv = false;
                            $scope.ifPostcodeError = true;
                            $scope.UserRegFailed = true;
                            if (data.hasOwnProperty('error') && data.errors.error !== null)
                            {
                                $rootScope.noServiceUUID = data.errors;
                                $scope.mydeliveryuser.hiddenpostcodevalue = null;
                                modalservice.show('lg', 'views/template/modal/retailer/signup-notification.html', 'ModalRetailerSignupCtrl', $scope, 'medium-dialog');
                            }
                        }, postObj);
            }
            else
            {
                $scope.mydeliveryuser.postCodeValue = null;
                $scope.mydeliveryuser.hiddenpostcodevalue = null;
            }
        }
    };
    $scope.verifyEmail = function (isValid) {
        if (isValid)
        {
            var userExistsUrl = envconfig.get('host')
                    + "/user-exists?userId=" + $scope.retailerRegisterObj.email;
            restservice.get(userExistsUrl, '', function (data,
                    status)
            {
                $scope.invalidEmail = true;
            }, function (data, status)
            {
                if (status == '404')
                {
                    // $scope.validEmail=true;
                    $scope.invalidEmail = false;
                }
            });
        }
    };
    // getting the location
    $scope.findAndUseLocation = function (position) {
        if (navigator.geolocation)
        {
            navigator.geolocation.getCurrentPosition($scope.getPostalCode);
        }
        else
        {
            $scope.alertfunc('Geolocation is not supported by this browser.');
        }
    };
    // getting the postcode
    $scope.geolocate = function (position) {
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
        $scope.geolocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    };
    $scope.geolocate();
    $scope.getAllStates = function (callback) {
        callback($scope.allStates);
    };
    $scope.editNotifySubmit = function () {
        modalservice.close();
        $scope.mydeliveryuser.postCodeValue = '';
        $scope.mydeliveryuser.hiddenpostcodevalue = null;
        $scope.isPostCodeServiceable = false;
        $scope.ifSocialRegisterSuccess = false;
        $scope.isGo = true;
        $location.search('');
        //$window.location.reload();
        $scope.retailerRegisterObj = {
            firstName: "",
            secondName: "",
            email: "",
            phoneNo: "",
            storeName: "",
            storeDescription: "",
            storeContactNo: "",
            storeWebsite: "",
            defaultOpenTime: "",
            defaultCloseTime: "",
            bankingHolidayStatus: 0,
            partnerRole: 1,
            storeType: 0,
            shippingDetail: 0,
            havePortal: 2
        };
    };
    $scope.clearErrorMsg = function () {
        $scope.invalidEmail = false;
    };
    $scope.person = {};
    $scope.refreshAddresses = function (item, $model) {
        $scope.manuallySelected = true;
        $scope.addressOfRetailer = item;
    };
    /*$scope.$watch(function () {
     $('#postcode').focus();
     });*/
});
