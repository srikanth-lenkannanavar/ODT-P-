'use strict';
/**
 * @ngdoc function
 * @name app.controller:MainCtrl
 * @description # MainCtrl Controller of the app
 */
app.controller('MyProfileCtrl', function ($rootScope, $http, $scope, $location,
        $timeout, $modal, $routeParams, $upload, postcodeService,
        geocodeservice, restservice, modalservice, envconfig, $window,
        photourlservice, $cookies, $interval, $route)
{
    $scope.showBrowse = true;
    $scope.profilePreview = false;
    $scope.progress = false;
    $scope.errMesFlag = false;
    $scope.showMes = false;
    $scope.updateSuccess = false;
    $scope.updateFailed = false;
    $scope.getFailed = false;
    $scope.changePasswordSaved = false;
    $scope.changePasswordfailed = false;
    $scope.phoneNoValidatedStatus = true;
    $scope.isPinDisable = true;
    $scope.optNewsLetter = true;
    $rootScope.loadingDiv = false;

    $scope.title = "";
    //$rootScope.saveSuccess = true;
    function partition(arr, size) {
        var newArr = [];
        for (var i = 0; i < arr.length; i += size)
        {
            newArr.push(arr.slice(i, i + size));
        }
        return newArr;
    }
    //$http.get("scripts/json/getStore.json").success(function(data1, status){
    restservice.get(envconfig.get('host') + "/getStore", '', function (data1, status) {
        //success
        $scope.getFailed = false;
        $scope.getSuccess = true;
        $scope.storeInformation = data1;
        $scope.branchholidaydetails = data1.data.info.branchholidaydetails;
        $scope.imageUrl = data1.data.imageUrl;
        $scope.retailerName = data1.data.retailerName;
        $scope.isWorkingOnHolidays = data1.data.isWorkingOnHolidays;
        $scope.businessPhone = data1.data.info.businessPhoneNumber;
        if (data1.data.info.website) {
            var ifHttp = data1.data.info.website.match("http://")
            if (ifHttp != null)
            {
                $scope.websiteUrl = data1.data.info.website;
                $scope.website = data1.data.info.website.replace("http://", '')
            }
            if (ifHttp == null) {
                $scope.websiteUrl = "http://" + data1.data.info.website;
                $scope.website = data1.data.info.website;
            }
        }
        /*$scope.trustUrl ($scope.websiteUrl);
         $scope.trustUrl = function(url) {
         return $sce.trustAsResourceUrl(url);
         }*/
        $scope.storeDesc = data1.data.info.storeDesc;
        $scope.addressFirstLine = data1.data.address.firstLine;
        $scope.addressSecondLine = data1.data.address.secondLine;
        $scope.city = data1.data.address.city;
        $scope.postcode = data1.data.address.postCode.toUpperCase();
        $scope.storeOpeningHoursMonday = data1.data.info.openingHours.MON;
        $scope.storeOpeningHoursTuesday = data1.data.info.openingHours.TUE;
        $scope.storeOpeningHoursWednesday = data1.data.info.openingHours.WED;
        $scope.storeOpeningHoursThrusday = data1.data.info.openingHours.THU;
        $scope.storeOpeningHoursFriday = data1.data.info.openingHours.FRI;
        $scope.storeOpeningHoursSaturday = data1.data.info.openingHours.SAT;
        $scope.storeOpeningHoursSunday = data1.data.info.openingHours.SUN;
        $scope.partnerRetailer = data1.data.knowMore.likeToBePartnerRetailer;
        $scope.storeType = data1.data.knowMore.storeType;
        $scope.havePortal = data1.data.knowMore.havePortal;
        $scope.shippingDetail = data1.data.knowMore.shippingDetail;
        $scope.bankHolidayDetails = data1.data.info.bankHolidayDetails;
        if (data1.success.status == "OK") {
            //$http.get("scripts/user-profile.json").success(function(data){
            restservice.get(envconfig.get('host') + "/user-profile", '', function (data, status) {
                $scope.getFailed = false;
                $scope.getSuccess = true;
//                    $scope.updateFailed = false;
//                    $scope.updateSuccess = false;
                $scope.changePasswordSaved = false;
                $scope.changePasswordfailed = false;
                $scope.title = data.title;
                $scope.firstName = data.firstName;
                $scope.lastName = data.lastName;
                $scope.regEmail = data.email;
                $scope.currentPhoneNumber = data.telephoneNumber;
                $scope.dob = data.dateOfBirth;
                $scope.scimId = data.id;
                $scope.userName = $rootScope.loggedUser;
                $scope.UserTypeLogin = true;
                if (data.userType == 'Social') {
                    $scope.UserTypeLogin = false;
                }
                $scope.optNewsLetter = data.optNewsLetter;
                $scope.optNewsLetter = false;
                if (data.title == null)
                    $scope.title = "";
                if (data.optNewsLetter == null || data.optNewsLetter == "" || data.optNewsLetter === "true")
                    $scope.optNewsLetter = true;
                $scope.phoneNoValidatedStatus = false;
                if (data.phoneNoValidatedStatus == "TRUE" || data.phoneNoValidatedStatus == "true")
                {
                    $scope.phoneNoValidatedStatus = true;
                } else if (data.phoneNoValidatedStatus == "FALSE" || data.phoneNoValidatedStatus == "false" || data.phoneNoValidatedStatus == null || data.phoneNoValidatedStatus == "") {
                    $scope.phoneNoValidatedStatus = false;
                    $scope.getFailed = true;
                    $scope.alertMessage = "Note! Your account has not been activated yet! Please validate your mobile phone to activate your account & continue with your booking process.";
                }
            }, function (data, status)
            {
                // failure
                $scope.getFailed = true;
                $scope.getSuccess = false;
                $scope.alertMessage = "Oops! something went wrong! try after sometime.";
            });
        }
    }, function (data1, status) {
        // failure
        $scope.getFailed = true;
        $scope.getSuccess = false;
        $scope.alertMessage = "Oops! something went wrong! try after sometime.";
    });
    $scope.validateMob = function ()
    {
        if (!$cookies.smsSentTime)
        {
            $cookies.smsSentTime = moment().unix();
        }
        if ($scope.phoneNo != $scope.currentPhoneNumber)
        {
            $scope.reload = false;
            //$scope.updateUserProfile();
        }
        $scope.phoneNoValidatedStatus = false;
        $scope.requestPIN();
        modalservice.show('lg', 'views/template/modal/mobile-validate.html',
                'ModalCtrl', $scope, 'medium-dialog');
    };
    $scope.changePassword = function () {
        $scope.updateFailed = false;
        $scope.updateSuccess = false;
        $scope.getFailed = false;
        $scope.changePasswordSaved = false;
        $scope.changePasswordfailed = false;
        var userData = {
            "password": document.getElementById('cur-password').value,
            "newPassword": document.getElementById('new-password').value
        };
        document.getElementById('cur-password').value = "";
        document.getElementById('new-password').value = "";
        document.getElementById('con-password').value = "";
        //document.getElementById('cur-password').focus();
        restservice.post(envconfig.get('host') + "/changePassword", '',
                function (data, status)
                {
                    $scope.changePasswordSaved = true;
                    /*
                     * $timeout(function() { $scope.changePasswordSaved = false; },
                     * 3000);
                     */
                }, function (data, status)
        {
            // failure
            if (status == '500')
            {
                $scope.changePasswordfailed = true;
            }
            else
            {
                $scope.changePasswordfailed = true;
                /*
                 * $timeout(function() { $scope.changePasswordfailed =
                 * false; }, 3000);
                 */
            }
        }
        , userData);
    };
    $scope.requestPIN = function ()
    {
        $scope.brandName = "";
        $scope.servicekey = "";
        restservice.get(envconfig.get('host') + "/config?key=smsbrandname", '',
                function (data, status)
                {
                    $scope.brandName = data.value;
                    restservice.get(envconfig.get('host')
                            + "/config?key=smsapiservicekey", '', function (
                                    data, status)
                            {
                                $scope.servicekey = data.value;
//                                                                                            restservice.get(envconfig.get('host')
//                                                                                                                            + "/getUserProfile?userName="
//                                                                                                                            + $rootScope.loggedUser, '', function(data,
//                                                                                                                            status)
                                var userProfileUrl = envconfig.get('host') + "/user-profile";
                                restservice.get(userProfileUrl, '', function (data, status)
                                {
                                    $scope.scimId = data.id;
                                    $scope.userName = $rootScope.loggedUser;
                                    var phoneNum = data.telephoneNumber;
                                    phoneNum = phoneNum.replace(/^(0+)/g, ''); // removing
                                    // leading
                                    // zeros
                                    //$scope.phoneNo = phoneNum;
                                    // alert(data.id);
                                    var userData =
                                            {
                                                "servicekey": $scope.servicekey,
                                                "senderid": $scope.brandName,
                                                "phonenum": phoneNum,
                                                "msgtxt": "%7Botp%7C" + $scope.brandName
                                                        + "%7C3600%7CETEN%7C4%7D",
                                                "msgclientref": $scope.userName,
                                                "scimid": $scope.scimId,
                                                "username": $scope.userName
                                            };
                                    restservice.post(envconfig.get('host') + "/requestPin", '', function (data, status) {
                                        $scope.sendError = false;
                                        $scope.sendSuccess = true;
                                        $timeout(function () {
                                            $scope.sendSuccess = false;
                                        }, 5000);
                                        if (data.status == "failed") {
                                            $scope.sendSuccess = false;
                                            $scope.sendError = true;
                                            $timeout(function () {
                                                $scope.sendError = false;
                                            }, 5000);
                                        }
                                    }, function (data, status) {
                                        $scope.sendError = true;
                                        $scope.sendSuccess = false;
                                        $timeout(function () {
                                            $scope.sendError = false;
                                        }, 5000);
                                    }, userData);
                                }, function (data, status)
                                {
                                    // error message
                                    alert("error--" + data)
                                });
                            }, function (data, status)
                    {
                        // error message
                    });
                }, function (data, status)
        {
            // error message
        });
    }
});
