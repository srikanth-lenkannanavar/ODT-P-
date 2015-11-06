'use strict';

/**
* @ngdoc function
* @name app.controller:MainCtrl
* @description # MainCtrl Controller of the app
*/
app.controller('EditProfileCtrl', function($rootScope, $scope, $location,
                                $timeout, $modal, $routeParams, $upload, postcodeService,
                                geocodeservice, restservice, modalservice, envconfig, $window,
                                photourlservice, $cookies, $interval, $route, $http, CommonService)
{

    
    $scope.openTimes = CommonService.shopOpenningTimes; //gets all open times from Commonservice
    $scope.closeTimes = CommonService.closeTimes; //gets all close times from Commonservice
    $scope.shopOpen = '09:30'; //defaulting this value using ng-modal
    $scope.shopClose = '18:00';

    $scope.editSection = $routeParams['id'];
    $scope.passwordChange = false;
    $scope.isPostCodeServiceable = true;
    
    $rootScope.isImageAdded = false;
    $rootScope.isImageRemoved = false;
    
    $scope.resetPostCode = function() {
        modalservice.close();
        $scope.lastPostCode = $scope.mydeliveryuser.postCodeValue;
        //$scope.mydeliveryuser.postCodeValue = "";
        $scope.person = {}
        $scope.$watch(function () {
            $scope.isGo = true;
            //modalservice.close();
        });
        //$scope.person.selected = {};
        $scope.isPostCodeServiceable = false;
    };
    
    $scope.retrievePostCode = function() {
        $route.reload();
        $scope.mydeliveryuser.postCodeValue = $scope.lastPostCode;
        $scope.$watch(function () {
            $scope.isGo = false;
        });
        $scope.isPostCodeServiceable = true;        
        $scope.person.selected = {
            address1: $scope.retailerRetrievedObj.addressLine1,
            address2: $scope.retailerRetrievedObj.addressLine2,
            town: $scope.retailerRetrievedObj.city,
            postcode: $scope.retailerRetrievedObj.postCode
        };        
        /*if($scope.retailerRetrievedObj.imageUrl) {
            $timeout(function() {           
                buildDropzone($scope.retailerRetrievedObj.imageUrl)
            }, 2000);
        }   */     
    };
    
    $scope.getUserInfo = function() {
        restservice.get(envconfig.get('host') + "/user-profile", '', function (data, status) {
            $scope.userInfo = true;
            $scope.updateFailed = false;
            $scope.updateSuccess = false;
            $scope.getFailed = false;
            $scope.changePasswordSaved = false;
            $scope.changePasswordfailed = false;
            $scope.storeId = data.storeId;
            $scope.userType = data.userType;
            //$scope.title = data.title;
            $scope.firstName = data.firstName;
            $scope.lastName = data.lastName;
            $scope.regEmail = data.email;
            $scope.currentPhoneNumber = data.telephoneNumber;
            //$scope.dob = data.dateOfBirth;
            $scope.scimId = data.id;
            $scope.userName = $rootScope.loggedUser;
            $scope.UserTypeLogin = data.userType;
            //$scope.optNewsLetter = data.optNewsLetter;
//            $scope.optNewsLetter = false;
//            if (data.title == null)
//                $scope.title = "";
//            if (data.optNewsLetter == null || data.optNewsLetter == "" || data.optNewsLetter === "true")
//                $scope.optNewsLetter = true;
            $scope.phoneNoValidatedStatus = false;
            if (data.phoneNoValidatedStatus == "TRUE" || data.phoneNoValidatedStatus == "true")
            {
                $scope.phoneNoValidatedStatus = true;
            }
            $scope.retailerRegisterObjR = {
                firstName: data.firstName,
                lastName: data.lastName,
                regEmail: data.email,
                currentPhoneNumber: data.telephoneNumber,
                userType: data.userType,
                phoneNoValidatedStatus: data.phoneNoValidatedStatus
            };
        }, function (data, status) {
            // failure
            $scope.getFailed = true;		
            $scope.getSuccess = false;
            $scope.alertMessage = "Oops! something went wrong! try after sometime.";
        });
    };   


    if($scope.editSection =='user-info') {
        $scope.getUserInfo();
        //get user information call
        //$http.get("scripts/user-profile.json").success(function(data, status){
        /*var userProfileUrl = envconfig.get('host') + "/user-profile";
        restservice.get(userProfileUrl, '', function (data, status)  {
            $scope.userInfo = true;
            $scope.updateFailed = false;
            $scope.updateSuccess = false;
            $scope.getFailed = false;
            $scope.changePasswordSaved = false;
            $scope.changePasswordfailed = false;
            $scope.storeId = data.storeId;
            $scope.userType = data.userType;
            $scope.title = data.title;
            $scope.firstName = data.firstName;
            $scope.lastName = data.lastName;
            $scope.regEmail = data.email;
            $scope.currentPhoneNumber = data.telephoneNumber;
            $scope.dob = data.dateOfBirth;
            $scope.scimId = data.id;
            $scope.userName = $rootScope.loggedUser;
            $scope.UserTypeLogin = data.userType;
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
            }
            $scope.retailerRegisterObjR = {
                firstName: data.firstName,
                lastName: data.lastName,
                regEmail: data.email,
                currentPhoneNumber: data.telephoneNumber,
                userType: data.userType,
                phoneNoValidatedStatus: data.phoneNoValidatedStatus
            };
        }, function (data, status) {
            // failure
            $scope.getFailed = true;		
            $scope.getSuccess = false;
            $scope.alertMessage = "Oops! something went wrong! try after sometime.";
        });*/
    } else if($scope.editSection =='change-password') {   
        //$scope.getUserInfo();
        //get user information call
        var userProfileUrl = envconfig.get('host') + "/user-profile";
        restservice.get(userProfileUrl, '', function (data, status)  {
            
            //redirects user if he is a social type user
            if(data.userType == "Social"){
                $location.path('/my-profile');
            }
            $scope.storeId = data.storeId;
            $scope.passwordChange = true;
            $scope.updateFailed = false;
            $scope.updateSuccess = false;
            $scope.getFailed = false;
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
            }
            $scope.retailerRegisterObjR = {
                firstName: data.firstName,
                lastName: data.lastName,
                regEmail: data.email,
                currentPhoneNumber: data.telephoneNumber,
                userType: data.userType,
                phoneNoValidatedStatus: data.phoneNoValidatedStatus
            };
        }, function (data, status) {
            // failure
            $scope.getFailed = true;		
            $scope.getSuccess = false;
            $scope.alertMessage = "Oops! something went wrong! try after sometime.";
        });
    } else if($scope.editSection =='store-info') {
        $scope.storeInfo = true;
        getStoreInformation();
    } else if($scope.editSection =='store-opening-hours') {
        $scope.sOpeningHours = true;
        getStoreInformationOther();
    } else if($scope.editSection =='bank-holiday-opening-hours') {
        $scope.bOpeningHours = true;
        getStoreInformationOther();
    }
    function partition(arr, size)  {
        var newArr = [];
        for (var i = 0; i < arr.length; i += size)
        {
            newArr.push(arr.slice(i, i + size));
        }
        return newArr;
    }
    
    function getStoreInformation(){
        restservice.get(envconfig.get('host') + "/getStore", '', function (data, status) {
            if(data.data.address.secondLine == null) {
                data.data.address.secondLine = "";
            }
            $scope.retailerRetrievedObj = {
                storeId: data.data.storeId,
                storeName: data.data.info.storeName,
                retailerName: data.data.retailerName,
                userName: data.data.info.userName,
                storeDescription: data.data.info.storeDesc,
                storeContactNo: data.data.info.businessPhoneNumber,
                storeWebsite: data.data.info.website,
                addressLine1: data.data.address.firstLine,
                addressLine2: data.data.address.secondLine,
                postCode: data.data.address.postCode.toUpperCase(),
                city: data.data.address.city,
                //isWorkingOnHolidays: data.data.isWorkingOnHolidays,
                havePortal: data.data.knowMore.havePortal,
                partnerRole: data.data.knowMore.likeToBePartnerRetailer,
                storeType: data.data.knowMore.storeType,
                shippingDetail: data.data.knowMore.shippingDetail,
                imageUrl: data.data.imageUrl,
                openingHours: data.data.info.openingHours,
                bankingHolidayStatus: data.data.bankingHolidayStatus,
                bankHolidayDetails: data.data.info.bankHolidayDetails
                //userType: data.data.userType
            };
            $scope.person.selected = {
                address1: $scope.retailerRetrievedObj.addressLine1,
                address2: $scope.retailerRetrievedObj.addressLine2,
                town: $scope.retailerRetrievedObj.city,
                postcode: $scope.retailerRetrievedObj.postCode
            };
            
            /*var posts = [];            
            $scope.posts[0].town = data.data.address.city;
            $scope.posts[0].postcode = data.data.address.postCode;*/
            
            if($scope.person.selected.postcode) {
                $scope.mydeliveryuser.postCodeValue = $scope.person.selected.postcode.replace(/ /g,'');
            }

            restservice.get(envconfig.get('host') + "/address/postcode/" + $scope.mydeliveryuser.postCodeValue.replace(/ /g,''), '', function (data, status) {
                if (data && data.data)
                {
                    $scope.posts = data.data;
                    if(data.data.length==0) {
                        $scope.$watch(function () {
                            if($('#city').is('[readonly]')) {
                                $('#city, #postalCode').removeAttr('readonly');
                                $('#city, #postalCode').removeAttr('onfocus'); 
                                /*$('#city').val($scope.retailerRetrievedObj.city);
                                $('#postalCode').val($scope.retailerRetrievedObj.postCode);*/
                            }
                         });
                    }
                }
            }, function (data, status) {
                //alert("Failed to load Bank holiday list");
            });

            if($scope.retailerRetrievedObj.imageUrl) {
                $timeout(function() {           
                    buildDropzone($scope.retailerRetrievedObj.imageUrl)
                }, 2000);
            }

            $scope.mydeliveryuser = {
                postCodeValue: $scope.retailerRetrievedObj.postCode
            };

            $scope.weekDaysOpeningHourSummary = $scope.retailerRetrievedObj.openingHours;
            $scope.bankHolidayOpeningHourSummary = $scope.retailerRetrievedObj.bankHolidayDetails;

            $scope.weekDaysSummaryArr= [];
            Object.keys($scope.weekDaysOpeningHourSummary).forEach(function(key) {
                sPlit($scope.weekDaysOpeningHourSummary[key]);
                if(key=="MON"){
                    key= "Monday"
                  } else if(key=="TUE") {
                    key= "Tuesday"
                  } else if(key=="WED") {
                    key= "Wednesday"
                  } else if(key=="THU") {
                    key= "Thursday"
                  } else if(key=="FRI") {
                    key= "Friday"
                  } else if(key=="SAT") {
                    key= "Saturday"
                  } else {
                    key= "Sunday"
                  }
                if($scope.value2)
                    $scope.weekDaysSummaryArr.push({"name":key,"availability":true,"opentime":$scope.value1,"closetime":$scope.value2});

                else
                    $scope.weekDaysSummaryArr.push({"name":key,"availability":false,"opentime":"09:30","closetime":"18:00"});
            });
                    $scope.weekDaysSummaryArr.push({"name":"","availability":"false","opentime":"","closetime":""}); //cretes an extra row
            $scope.setData = partition($scope.weekDaysSummaryArr, 4);


            $scope.bankHolidaysSummaryArr= [];
            Object.keys($scope.bankHolidayOpeningHourSummary).forEach(function(key) {
                sPlit($scope.bankHolidayOpeningHourSummary[key]);
                if($scope.value2)
                    $scope.bankHolidaysSummaryArr.push({"name":key,"availability":true,"opentime":$scope.value1,"closetime":$scope.value2});

                else
                    $scope.bankHolidaysSummaryArr.push({"name":key,"availability":false,"opentime":"09:30","closetime":"18:00"});
            });

            var length = $scope.bankHolidaysSummaryArr.length;
            if((length %2)!=0) {
                length++;
                $scope.bankHolidaysSummaryArr.push({"name":"","availability":"","opentime":"","closetime":""})
                //$scope.showEmptyRow = true;
            }
            var numbers = length/2;
            //$scope.bankHolidaysSummaryArr.push({"name":"","availability":"false","opentime":"","closetime":""}); //cretes an extra row
            $scope.bankHolidaySetData = partition($scope.bankHolidaysSummaryArr, numbers);

            }, function (data, status) {
            // failure
            $scope.getFailed = true;		
            $scope.getSuccess = false;
            $scope.alertMessage = "Oops! something went wrong! try after sometime.";
        });
    };
    
    
    function getStoreInformationOther(){
        restservice.get(envconfig.get('host') + "/getStore", '', function (data, status) {
            if(data.data.address.secondLine == null) {
                data.data.address.secondLine = "";
            }
            $scope.retailerRetrievedObj = {
                storeId: data.data.storeId,
                storeName: data.data.info.storeName,
                retailerName: data.data.retailerName,
                userName: data.data.info.userName,
                storeDescription: data.data.info.storeDesc,
                storeContactNo: data.data.info.businessPhoneNumber,
                storeWebsite: data.data.info.website,
                addressLine1: data.data.address.firstLine,
                addressLine2: data.data.address.secondLine,
                postCode: data.data.address.postCode,
                city: data.data.address.city,
                channel: data.data.channel,
                domain: data.data.domain,
                //isWorkingOnHolidays: data.data.isWorkingOnHolidays,
                havePortal: data.data.knowMore.havePortal,
                partnerRole: data.data.knowMore.likeToBePartnerRetailer,
                storeType: data.data.knowMore.storeType,
                shippingDetail: data.data.knowMore.shippingDetail,
                imageUrl: data.data.imageUrl,
                openingHours: data.data.info.openingHours,
                bankingHolidayStatus: data.data.bankingHolidayStatus,
                bankHolidayDetails: data.data.info.bankHolidayDetails
            };
            $scope.person.selected = {
                address1: $scope.retailerRetrievedObj.addressLine1,
                address2: $scope.retailerRetrievedObj.addressLine2,
                town: $scope.retailerRetrievedObj.city,
                postcode: $scope.retailerRetrievedObj.postCode
            };
            
            restservice.get(envconfig.get('host') + "/address/postcode/" + $scope.retailerRetrievedObj.postCode.replace(/ /g,''), '', function (data, status) {
                if (data && data.data)
                {
                    $scope.posts = data.data;
                    if(data.data.length==0) {
                        $scope.$watch(function () {
                            $('#city').val() = $scope.retailerRetrievedObj.city;
                            $('#postalCode').val() = $scope.retailerRetrievedObj.postCode;
                         });
                    }
                    //$scope.posts[0].town;
                    /*$scope.posts[0].town;
                    $scope.posts[0].postcode;*/
                }
            }, function (data, status) {
                //alert("Failed to load Bank holiday list");
            });
            
            /*if($scope.retailerRetrievedObj.imageUrl) {
                buildDropzone($scope.retailerRetrievedObj.imageUrl)
            }*/

            $scope.mydeliveryuser = {
                postCodeValue: $scope.retailerRetrievedObj.postCode
            };

            $scope.weekDaysOpeningHourSummary = $scope.retailerRetrievedObj.openingHours;
            $scope.bankHolidayOpeningHourSummary = $scope.retailerRetrievedObj.bankHolidayDetails;

            $scope.weekDaysSummaryArr= [];
            Object.keys($scope.weekDaysOpeningHourSummary).forEach(function(key) {
                sPlit($scope.weekDaysOpeningHourSummary[key]);
                if(key=="MON"){
                    key= "Monday"
                  } else if(key=="TUE") {
                    key= "Tuesday"
                  } else if(key=="WED") {
                    key= "Wednesday"
                  } else if(key=="THU") {
                    key= "Thursday"
                  } else if(key=="FRI") {
                    key= "Friday"
                  } else if(key=="SAT") {
                    key= "Saturday"
                  } else {
                    key= "Sunday"
                  }
                if($scope.value2)
                    $scope.weekDaysSummaryArr.push({"name":key,"availability":true,"opentime":$scope.value1,"closetime":$scope.value2});

                else
                    $scope.weekDaysSummaryArr.push({"name":key,"availability":false,"opentime":"09:30","closetime":"18:00"});
            });
                    $scope.weekDaysSummaryArr.push({"name":"","availability":"false","opentime":"","closetime":""}); //cretes an extra row
            $scope.setData = partition($scope.weekDaysSummaryArr, 4);


            $scope.bankHolidaysSummaryArr= [];
            Object.keys($scope.bankHolidayOpeningHourSummary).forEach(function(key) {
                sPlit($scope.bankHolidayOpeningHourSummary[key]);
                if($scope.value2)
                    $scope.bankHolidaysSummaryArr.push({"name":key,"availability":true,"opentime":$scope.value1,"closetime":$scope.value2});

                else
                    $scope.bankHolidaysSummaryArr.push({"name":key,"availability":false,"opentime":"09:30","closetime":"18:00"});
            });

            var length = $scope.bankHolidaysSummaryArr.length;
            if((length %2)!=0) {
                length++;
                $scope.bankHolidaysSummaryArr.push({"name":"","availability":"","opentime":"","closetime":""})
                //$scope.showEmptyRow = true;
            }
            var numbers = length/2;
            //$scope.bankHolidaysSummaryArr.push({"name":"","availability":"false","opentime":"","closetime":""}); //cretes an extra row
            $scope.bankHolidaySetData = partition($scope.bankHolidaysSummaryArr, numbers);

            }, function (data, status) {
            // failure
            $scope.getFailed = true;		
            $scope.getSuccess = false;
            $scope.alertMessage = "Oops! something went wrong! try after sometime.";
        });
    };

    //get store information call
    //$http.get("scripts/json/getStore.json").success(function(data, status){
    /*restservice.get(envconfig.get('host') + "/getStore", '', function (data, status) {
        $scope.retailerRetrievedObj = {
            storeId: data.data.storeId,
            storeName: data.data.info.storeName,
            retailerName: data.data.retailerName,
            userName: data.data.info.userName,
            storeDescription: data.data.info.storeDesc,
            storeContactNo: data.data.info.businessPhoneNumber,
            storeWebsite: data.data.info.website,
            addressLine1: data.data.address.firstLine,
            addressLine2: data.data.address.secondLine,
            postCode: data.data.address.postCode,
            city: data.data.address.city,
            channel: data.data.channel,
            domain: data.data.domain,
            isWorkingOnHolidays: data.data.isWorkingOnHolidays,
            havePortal: data.data.knowMore.havePortal,
            partnerRole: data.data.knowMore.likeToBePartnerRetailer,
            storeType: data.data.knowMore.storeType,
            shippingDetail: data.data.knowMore.shippingDetail,
            imageUrl: data.data.imageUrl,
            openingHours: data.data.openingHours,
            bankingHolidayStatus: data.data.bankingHolidayStatus,
            bankHolidayDetails: data.data.bankHolidayDetails
        };
        $scope.person.selected = {
            address1: $scope.retailerRetrievedObj.addressLine1,
            address2: $scope.retailerRetrievedObj.addressLine2,
            town: $scope.retailerRetrievedObj.city,
            postcode: $scope.retailerRetrievedObj.postCode
        };
        
        if($scope.retailerRetrievedObj.imageUrl) {
            buildDropzone($scope.retailerRetrievedObj.imageUrl)
        }

        $scope.mydeliveryuser = {
            postCodeValue: $scope.retailerRetrievedObj.postCode
        };

        $scope.weekDaysOpeningHourSummary = $scope.retailerRetrievedObj.openingHours;
        $scope.bankHolidayOpeningHourSummary = $scope.retailerRetrievedObj.bankHolidayDetails;

        $scope.weekDaysSummaryArr= [];
        Object.keys($scope.weekDaysOpeningHourSummary).forEach(function(key) {
            sPlit($scope.weekDaysOpeningHourSummary[key]);
            if(key=="MON"){
                key= "Monday"
              } else if(key=="TUE") {
                key= "Tuesday"
              } else if(key=="WED") {
                key= "Wednesday"
              } else if(key=="THU") {
                key= "Thursday"
              } else if(key=="FRI") {
                key= "Friday"
              } else if(key=="SAT") {
                key= "Saturday"
              } else {
                key= "Sunday"
              }
            if($scope.value2)
                $scope.weekDaysSummaryArr.push({"name":key,"availability":true,"opentime":$scope.value1,"closetime":$scope.value2});

            else
                $scope.weekDaysSummaryArr.push({"name":key,"availability":false,"opentime":"09:30","closetime":"18:00"});
        });
                $scope.weekDaysSummaryArr.push({"name":"","availability":"false","opentime":"","closetime":""}); //cretes an extra row
        $scope.setData = partition($scope.weekDaysSummaryArr, 4);


        $scope.bankHolidaysSummaryArr= [];
        Object.keys($scope.bankHolidayOpeningHourSummary).forEach(function(key) {
            sPlit($scope.bankHolidayOpeningHourSummary[key]);
            if($scope.value2)
                $scope.bankHolidaysSummaryArr.push({"name":key,"availability":true,"opentime":$scope.value1,"closetime":$scope.value2});

            else
                $scope.bankHolidaysSummaryArr.push({"name":key,"availability":false,"opentime":"09:30","closetime":"18:00"});
        });

        var length = $scope.bankHolidaysSummaryArr.length;
        if((length %2)!=0) {
            length++;
            $scope.bankHolidaysSummaryArr.push({"name":"","availability":"","opentime":"","closetime":""})
            //$scope.showEmptyRow = true;
        }
        var numbers = length/2;
        //$scope.bankHolidaysSummaryArr.push({"name":"","availability":"false","opentime":"","closetime":""}); //cretes an extra row
        $scope.bankHolidaySetData = partition($scope.bankHolidaysSummaryArr, numbers);

        }, function (data, status) {
        // failure
        $scope.getFailed = true;		
        $scope.getSuccess = false;
        $scope.alertMessage = "Oops! something went wrong! try after sometime.";
    });*/

    // function that splits a value with a ' - '
    function sPlit(value)  {
        var value = value.split(" - ");
        $scope.value1 = value[0];
        $scope.value2 = value[1];
        return [$scope.value1, $scope.value2];
    }

    /*$scope.deletePhoto = function () {
        $('.photo').remove();
        $('.dropzone').removeClass('hide-dz');
        $('.click-remove').remove();
    };*/
    
    $scope.updateDefault = function (value, isValid) {
        if (!isValid) {
            return;
        }
        $scope.mydeliveryuser.postCodeValue = value.replace(/ /g,'');
        $scope.validatePostCode();
        
        $scope.addressOfRetailer = {
            address1: "",
            address2: "",
            town: "",
            postcode: ""
        };
        
        /*if($scope.retailerRetrievedObj.imageUrl) {
            $timeout(function() {           
                buildDropzone($scope.retailerRetrievedObj.imageUrl)
            }, 2000);
        } */
    };

    $scope.edit = function () {
        $scope.isGoTemp = false;
        modalservice.show('lg', 'views/template/modal/retailer/store-info-edit-alert.html', 'SignupEditNotificationCtrl', $scope, 'medium-dialog');
    };

    $scope.enterAddress = function () {
        $scope.manuallySelected = true;
        $scope.$watch(function () {
            if($('#city').is('[readonly]')) {
                $('#city, #postalCode').removeAttr('readonly');
                $('#city, #postalCode').removeAttr('onfocus');                 
                $('#city').val() = $scope.retailerRetrievedObj.city;
                $('#postalCode').val() = $scope.retailerRetrievedObj.postCode;
            }
         }); 
    };
    
    // mydeliveryuser
    $scope.validatePostCode = function () {
        var flagpostcode = $scope.mydeliveryuser.hiddenpostcodevalue;
        if (flagpostcode == null || flagpostcode == "")
        {
            $scope.mydeliveryuser.hiddenpostcodevalue = $scope.mydeliveryuser.postCodeValue;
            var result = postcodeService.validate($scope.mydeliveryuser.postCodeValue);
            if (result !== false)
            {
                var postcodepart = result.split(" ");
                var postObj = {
                    "postcode": $scope.mydeliveryuser.hiddenpostcodevalue
                };
                /*var url = "scripts/json/postcodevalidation.json"
                 restservice.post(url, '',*/
                restservice.post(envconfig.get('host') + "/bookings/isPostCodeServiced/", '',
                        function (data, status)
                        {
//                            if (data.hasOwnProperty('isServiced'));
                            if (data.data.isServiced)
                            {
//                              $location.path(data['uuid'] + "isServiced" + postcodepart.join(''));
                                $scope.mydeliveryuser.hiddenpostcodevalue = '';
                                $scope.$watch(function () {
                                    $scope.isGo = false;
                                    //modalservice.close();
                                });
                                $scope.isGoTemp = false;
                                $scope.isPostCodeServiceable = true;
                                $scope.PostcodeIsvalid = false;
                                $scope.serviceCenterCode = data.data.servicecentercode;
                                if($scope.retailerRetrievedObj.imageUrl) {
                                    $timeout(function() {           
                                        buildDropzone($scope.retailerRetrievedObj.imageUrl)
                                    }, 2000);
                                }

                                //viewContentLoaded
                                //$scope.$watch('$viewContentLoaded', function() {
                                //
                                //});  
                                restservice.get(envconfig.get('host') + "/address/postcode/" + $scope.mydeliveryuser.postCodeValue, '', function (data, status) {
                                    if(data.data.length==0){
                                        $scope.manuallySelected = true;
                                        $("#postalCode").removeAttr("readonly");
                                    }else if (data && data.data){
                                        $scope.posts = data.data;
                                        $scope.posts[0].town;
                                        $scope.posts[0].postcode;
                                    }
                                }, function (data, status) {
                                    //alert("Failed to load Bank holiday list");
                                });
                            }
                            else {
                                $scope.mydeliveryuser.hiddenpostcodevalue = null;
                                $scope.uuid = data.data.uuid;
                                modalservice.show('lg', 'views/template/modal/retailer/signup-notification.html', 'ModalRetailerSignupCtrl', $scope, 'medium-dialog');
                            }

                        },
                        function (data, status)
                        {
                            if (data.hasOwnProperty('error') && data.errors.error !== null)
                            {
                                $rootScope.noServiceUUID = data.errors;
                                $scope.mydeliveryuser.hiddenpostcodevalue = null;
                                modalservice.show('lg', 'views/template/modal/retailer/signup-notification.html', 'ModalRetailerSignupCtrl', $scope, 'medium-dialog');
                            }
                        }, postObj);
            } else {
                $scope.mydeliveryuser.postCodeValue = null;
                $scope.mydeliveryuser.hiddenpostcodevalue = null;
            }
            
            
            if($scope.manuallySelected == true){
                $("#postalCode").removeAttr("readonly");
            }
        }
    };

    //update user profile
    $scope.updateUserProfile = function (isValid) {        
        if (!isValid)
            return;
        

        $rootScope.loadingDiv = true;
        $scope.updateFailed = false;
        $scope.updateSuccess = false;
        $scope.getFailed = false;
        
        /*$scope.changePasswordSaved = false;
        $scope.changePasswordfailed = false;*/
        var phoneNoValidatedStatus = "TRUE";        
        var phoneNumber = $scope.currentPhoneNumber;
        
        if ($scope.currentPhoneNumber != $scope.retailerRegisterObjR.currentPhoneNumber) {
            phoneNoValidatedStatus = "FALSE";
        }

        var userData = {
            "firstName": $scope.retailerRegisterObjR.firstName,
            "lastName": $scope.retailerRegisterObjR.lastName,
            /*"email": $scope.retailerRegisterObjR.regEmail,*/
            "telephoneNumber": $scope.retailerRegisterObjR.currentPhoneNumber,
            "id": $scope.scimId,
            "userName": $rootScope.loggedUser,
            "phoneNoValidatedStatus": phoneNoValidatedStatus,
            "appName": "Retailer",
            "userType": $scope.userType
        };
        
        var storeData = {
            "storeId": $scope.storeId,
            "info":{
                "mobileNumber": $scope.retailerRegisterObjR.currentPhoneNumber,
                "userName":$rootScope.loggedUser                
            }
        }       

        restservice.put(envconfig.get('host') + "/updateUserProfile", '',
                function (data, status)
                {
                    restservice.put(envconfig.get('host') + "/updateStore", '', function (data, status) {
                        if ($scope.reload == undefined)
                        {
                            $scope.updateSuccess = true;
                            $timeout(function () {
                                // $scope.updateSuccess = false;
                                $rootScope.loadingDiv = false;
                                $location.path('/my-profile');
                                $rootScope.saveSuccess = true;
                                $rootScope.successMessage = "Your details have been saved successfully!";
                                $route.reload();
                            }, 100);
                        }
                    }, function (data, status) {
                        $rootScope.loadingDiv = false;
                        $scope.updateFailed = true;
                    }, storeData);
            
                    if ($scope.reload == undefined) {                        
                        $scope.updateSuccess = true;
                        $timeout(function (){
                            // $scope.updateSuccess = false;
                            $location.path('/my-profile');
                            $rootScope.getFailed = false;
                            $rootScope.saveSuccess = true;
                            $rootScope.successMessage = "Your details have been saved successfully!";
                            $route.reload();
                        }, 100);
                    }
                }, function (data, status)
        {
            $rootScope.loadingDiv = false;
            $scope.updateFailed = true;
            $scope.saveFailed = true;
            $rootScope.getFailed = true;
        }, userData);
    };

    //update store information
    $scope.updateStoreInformation = function (isValid) {        
        if (!isValid)
            return;
        
        if(typeof $scope.addressOfRetailer === 'undefined'){
             $scope.manuallySelected = false;
        } else {
            if($scope.addressOfRetailer.address1 == '') {
                $scope.manuallySelected = true;
                if(!$.isEmptyObject($scope.person)) {
                    $scope.addressOfRetailer.address1 = $scope.person.selected.address1;
                    $scope.addressOfRetailer.address2 = $scope.person.selected.address2;
                    $scope.addressOfRetailer.town = $scope.posts[0].town;
                    $scope.addressOfRetailer.postcode = $scope.posts[0].postcode.replace(/ /g,'');
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
        }
        $rootScope.loadingDiv = true;
        $scope.updateStoreInfoFailed = false;
        $scope.updateStoreInfoSuccess = false;
        $scope.getStoreInfoFailed = false;

        var saveWeekDaySummary = "{";
        for(var i=0;i<$scope.weekDaysSummaryArr.length;i++) {
            if($scope.weekDaysSummaryArr[i].name){
                if($scope.weekDaysSummaryArr[i].availability ==true) {
                    saveWeekDaySummary += '"'+angular.uppercase(($scope.weekDaysSummaryArr[i].name).slice(0,3))+'":"'+$scope.weekDaysSummaryArr[i].opentime + ' - ' +$scope.weekDaysSummaryArr[i].closetime +'",';
                }else {
                    saveWeekDaySummary += '"'+angular.uppercase(($scope.weekDaysSummaryArr[i].name).slice(0,3))+'":"Closed",';
                }
            }
        }
        saveWeekDaySummary = saveWeekDaySummary.slice(0, -1);
        saveWeekDaySummary += "}";

        var weekDaySumDetails = angular.fromJson(saveWeekDaySummary);

        /*if($scope.retailerRetrievedObj.isWorkingOnHolidays == "1"){
            var bankHolidaySum = "{";
            for(var i=0;i<$scope.bankHolidaysSummaryArr.length;i++) {
                if($scope.bankHolidaysSummaryArr[i].name){
                    if($scope.bankHolidaysSummaryArr[i].availability ==true) {
                        bankHolidaySum += '"'+$scope.bankHolidaysSummaryArr[i].name+'":"'+$scope.bankHolidaysSummaryArr[i].opentime + ' - ' +$scope.bankHolidaysSummaryArr[i].closetime +'",';
                    }else {
                        bankHolidaySum += '"'+$scope.bankHolidaysSummaryArr[i].name+'":"Closed",';
                    }
                }
            }
        } else {
            var bankHolidaySum = "{";
            for(var i=0;i<$scope.bankHolidaysSummaryArr.length;i++) {
                if($scope.bankHolidaysSummaryArr[i].availability == true) {
                    $scope.retailerRetrievedObj.isWorkingOnHolidays = "1";
                }
                if($scope.bankHolidaysSummaryArr[i].name){
                    if($scope.bankHolidaysSummaryArr[i].availability ==true) {
                        bankHolidaySum += '"'+$scope.bankHolidaysSummaryArr[i].name+'":"'+$scope.bankHolidaysSummaryArr[i].opentime + ' - ' +$scope.bankHolidaysSummaryArr[i].closetime +'",';
                    }else {
                        bankHolidaySum += '"'+$scope.bankHolidaysSummaryArr[i].name+'":"Closed",';
                    }
                }
            }
        }*/
            var bankHolidaySum = "{";
                for(var i=0;i<$scope.bankHolidaysSummaryArr.length;i++) {
                if($scope.bankHolidaysSummaryArr[i].name){
                    if($scope.bankHolidaysSummaryArr[i].availability ==true) {
                        bankHolidaySum += '"'+$scope.bankHolidaysSummaryArr[i].name+'":"'+$scope.bankHolidaysSummaryArr[i].opentime + ' - ' +$scope.bankHolidaysSummaryArr[i].closetime +'",';
                    }else {
                        bankHolidaySum += '"'+$scope.bankHolidaysSummaryArr[i].name+'":"Closed",';
                    }
                }
            }
            bankHolidaySum = bankHolidaySum.slice(0, -1);
            bankHolidaySum += "}";
            var bankHolidayDetails = angular.fromJson(bankHolidaySum);
        
        /*var storeWebsite = $scope.retailerRetrievedObj.storeWebsite.match("http://")
        if(storeWebsite == null)
        {
            $scope.retailerRetrievedObj.storeWebsite = "http://" + $scope.retailerRetrievedObj.storeWebsite;
        } */       
        
        /*$rootScope.isImageRemoved;
        $rootScope.isImageAdded;*/
        
        if($rootScope.isImageRemoved == true && $rootScope.isImageAdded == true) {
            
        } else if($rootScope.isImageRemoved == true) {
            //delete the logo in the bucket
            restservice.put(envconfig.get('host') + "/delete-photo", '', function (data, status) {                
            }, function (data, status) {
            });
            
            //delete the logo in the session
            restservice.put(envconfig.get('host') + "/delete-logo", '', function (data, status) {                
             }, function (data, status) {
            });
        }
        if($scope.posts.length>0){
            if($scope.posts[0].town) {
                $scope.retailerRetrievedObj.town  = $scope.posts[0].town;
                $scope.retailerRetrievedObj.postCode  = $scope.posts[0].postcode;
            }        
        }
        
        //store details
        var storeData = {
            /*"domain": $scope.retailerRetrievedObj.domain,
            "channel": $scope.retailerRetrievedObj.channel,*/
            //"serviceCenterCode": $scope.serviceCenterCode, //ask ramya
            "retailerName": $scope.retailerRetrievedObj.storeName,
            "imageUrl": $scope.retailerRetrievedObj.imageUrl,
            "address": {
                "firstLine": $scope.person.selected.address1,
                "secondLine": $scope.person.selected.address2 || "",
                "city": $scope.retailerRetrievedObj.town,
                "postCode": $scope.retailerRetrievedObj.postCode.replace(/ /g,'').toLowerCase() //$scope.retailerRetrievedObj.postcode.replace(/ /g,'').toLowerCase() || 
            },
            "info": {
                "storeName": $scope.retailerRetrievedObj.storeName,
                "businessPhoneNumber": $scope.retailerRetrievedObj.storeContactNo,
                "website": $scope.retailerRetrievedObj.storeWebsite,
                "userName": $scope.loggedUser,
                "branchEmail": $scope.loggedUser,
                "storeDesc": $scope.retailerRetrievedObj.storeDescription,
                "openingHours": weekDaySumDetails,
                "bankHolidayDetails": bankHolidayDetails
            },
            //"isWorkingOnHolidays": $scope.retailerRetrievedObj.isWorkingOnHolidays,
            /*"location": {
                "lat": $scope.addressOfRetailer.latitude,
                "lng": $scope.addressOfRetailer.longitude
            },*/
            "knowMore": {
                "likeToBePartnerRetailer": parseInt($scope.retailerRetrievedObj.partnerRole),
                "storeType": parseInt($scope.retailerRetrievedObj.storeType),
                "havePortal": parseInt($scope.retailerRetrievedObj.havePortal),
                "shippingDetail": parseInt($scope.retailerRetrievedObj.shippingDetail)
            }
        };
        restservice.put(envconfig.get('host') + "/updateStore", '',
                function (data, status)
                {
                    if ($scope.reload == undefined)
                    {
                        $scope.updateSuccess = true;
                        $timeout(function ()
                        {
                            // $scope.updateSuccess = false;
                            $location.path('/my-profile');
                            $rootScope.saveSuccess = true;
                            $rootScope.successMessage = "Your details have been saved successfully!";
                            $route.reload();
                        }, 100);
                        $rootScope.loadingDiv = false;
                    }
                }, function (data, status)
        {
            $rootScope.loadingDiv = false;
            $scope.updateFailed = true;
        }, storeData);
    };

    //change password
    $scope.changePassword = function (isValid) {        
        if(!isValid)
            return;
        
        $rootScope.loadingDiv = true;
        $scope.updateFailed = false;
        $scope.updateSuccess = false;
        $scope.getFailed = false;
        
        var userData = {
            "password": document.getElementById('cur-password').value,
            "newPassword": document.getElementById('new-password').value
        };

        restservice.post(envconfig.get('host') + "/changePassword", '',
                function (data, status)
                {

                    $scope.changePasswordSaved = true;
                    $rootScope.loadingDiv = false;
                    $location.path('/my-profile');
                    $rootScope.saveSuccess = true;
                    $rootScope.successMessage = "Your details have been saved successfully!";
                }, function (data, status)
        {
            // failure
            $rootScope.loadingDiv = false;
            if (status == '500')
            {
                $scope.changePasswordfailed = true;
            }
            else
            {

                //$scope.changePasswordfailed = true;
                /*
                 * $timeout(function() { $scope.changePasswordfailed =
                 * false; }, 3000);
                 */
            }

        }

        , userData);

    };
    
    /*$scope.shopclosecalc = function(a, i, j, value){
        var closeTimes1 = ["00:00", "00:30", "01:00", "01:30", "02:00", "02:30", "03:00", "03:30", "04:00", "04:30", "05:00", "05:30", "06:00", "06:30", "07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00", "23:30"];
        //console.log(i + "of" + j);
        $scope.takeFrom = a.indexOf(value);
        closeTimes1.splice(0, $scope.takeFrom +1);
        console.log($scope.bankHolidaySetData);
        $scope.bankHolidaySetData[i][j]['cTimes'] = closeTimes1;
     };*/
    
    /*$scope.shopclosecalcBh = function(a, i, j, value){
        var closeTimes1 = ["00:30", "01:00", "01:30", "02:00", "02:30", "03:00", "03:30", "04:00", "04:30", "05:00", "05:30", "06:00", "06:30", "07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00", "23:30"];
        //console.log(i + "of" + j);
        //$scope.openT = {};
        $scope.takeFrom = a.indexOf(value);
        closeTimes1.splice(0, $scope.takeFrom +1);
        //console.log($scope.setData);
        $scope.bankHolidaySetData[i][j].cTimes = closeTimes1;
        $scope.bankHolidaySetData[i][j].closetime = closeTimes1[0];
	};
    
    $scope.shopclosecalc = function(a, i, j, value){
        var closeTimes1 = ["00:30", "01:00", "01:30", "02:00", "02:30", "03:00", "03:30", "04:00", "04:30", "05:00", "05:30", "06:00", "06:30", "07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00", "23:30"];
        //console.log(i + "of" + j);
        //$scope.openT = {};
        $scope.takeFrom = a.indexOf(value);
        closeTimes1.splice(0, $scope.takeFrom +1);
        //console.log($scope.setData);
        $scope.setData[i][j].cTimes = closeTimes1;
        $scope.setData[i][j].closetime = closeTimes1[0];
	};*/
    
    $scope.shopclosecalcBh = function (a, i, j, value, anotherValue) {
        var closeTimes1 = ["00:30", "01:00", "01:30", "02:00", "02:30", "03:00", "03:30", "04:00", "04:30", "05:00", "05:30", "06:00", "06:30", "07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00", "23:30"];
        //console.log(i + "of" + j);
        //$scope.openT = {};
        $scope.takeFrom = a.indexOf(value);
        closeTimes1.splice(0, $scope.takeFrom + 1);
        var closeTimeIndex = closeTimes1.indexOf(anotherValue);
        //console.log($scope.setData);
        $scope.bankHolidaySetData[i][j].cTimes = closeTimes1;
        $scope.bankHolidaySetData[i][j].closetime = closeTimes1[closeTimeIndex];
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
    
    $scope.getPostalCode = function (position) {
        geocodeservice.getPostalCode(position, $scope.updatepostcode, $scope.alertfunc);
    };
    $scope.updatepostcode = function(postcode)
    {
        $scope.mydeliveryuser.postCodeValue = postcode;
        $scope.$apply();
    };
    
    function buildDropzone(url) {    
        var mockFile = { name: $scope.retailerRetrievedObj.storeName};        
        if($scope.isPostCodeServiceable == true) {
            var hel = Dropzone.forElement('.dropzone');
            hel.removeAllFiles();
            hel.emit("addedfile", mockFile);   
            hel.emit("thumbnail", mockFile, url);
            hel.emit("complete", mockFile);
            
            hel.on("removedfile", function(file){
                $scope.fileDropzone = file;
                $scope.retailerRetrievedObj.imageUrl = '';
            });
            hel.on("drop", function(event) {
                var _ref;
                /*if($scope.fileDropzone){
                    if ($scope.fileDropzone.previewElement) {
                      if ((_ref = $scope.fileDropzone.previewElement) != null) {
                          event.preventDefault();
                          event.currentTarget.dropzone.removeFile($scope.fileDropzone);
                      }
                    }
                }*/
                if(!$scope.fileDropzone){
                    event.preventDefault();
                    event.currentTarget.dropzone.removeFile($scope.fileDropzone);
                }
                
                /*if(this.files.length==0) {
                    event.preventDefault();
                    $scope.file = {
                        status: 'Dropzone.UPLOADING'
                    };
                    event.currentTarget.dropzone.removeFile($scope.fileDropzone);
                } */               
            });           
            
            //hel.destroy();
            
//            $timeout(function() {           
//                //hel.destroy();
//                
//                /*var existingFileCount = 1; // The number of files already uploaded
//                hel.options.maxFiles = hel.options.maxFiles - existingFileCount;*/
//            }, 1000);

            //var myDropzone = new Dropzone("#my-dropzone");
            /*myDropzone.on("success", function(file){
                debugger;
                restservice.put(envconfig.get('host') + "/retailerLogo", '', function (data1, status) {
                    //$scope.retailerRetrievedObj.imageUrl = ;
                    debugger;
                }, function (data1, status) {
                });
            });*/
//            hel.on("removedfile", function(file){
//                $scope.retailerRetrievedObj.imageUrl = '';
//                /*restservice.put(envconfig.get('host') + "/delete-photo", '', function (data1, status) {
//
//                }, function (data1, status) {
//                });*/
//            });
        }
         
        //$("div#dropmehere").get(0).emit("addedfile", mockFile);
        
        
      }

//    var url1 = "scripts/json/addressdropdown.json";
//    $http.get(url1).
////    $http.get(
////            envconfig.get('host') + '/address/'
////            + $routeParams.uuid).
//            success(
//                    function (data, status, headers, config)
//                    {
//                        console.log(angular.fromJson(data.enclosedObject));
//                        if (data && data.enclosedObject)
//                        {
//                            $scope.posts = angular.fromJson(data.enclosedObject);
//                            $scope.posts[0].town;
//                        }
//                    }).error(function (data, status, headers, config)
//    {
//        // log error
//    });
    
    
    
    $scope.closeModal = function() {
        modalservice.close();
    };
    
    $scope.editNotifySubmit = function () {
        modalservice.close();
        $scope.mydeliveryuser.postCodeValue = '';
        $scope.mydeliveryuser.hiddenpostcodevalue = null;
        $scope.isPostCodeServiceable = false;
        $scope.isSocialRegister = false;
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
    
    //delete photo 
    /*$scope.deletephoto = function(imageUrl) {
        restservice.put(envconfig.get('host') + "/delete-photo", '', function (data1, status) {
            $scope.retailerRetrievedObj.imageUrl = 'null';
        }, function (data1, status) {
        });
    };*/
    
    // function that splits a value with a ' - '
    /*function deletephoto(imageUrl)  {
        debugger;
        var value = value.split(" - ");
        $scope.value1 = value[0];
        $scope.value2 = value[1];
        return [$scope.value1, $scope.value2];
    }*/

    /*$scope.person = {};
    $scope.addressSelected = function () {
        $scope.$watch(function () {
            $scope.manuallySelected = true;
            $scope.addressOfRetailer = $scope.person.selected;
        });
    };*/
    $scope.person = {};
    $scope.refreshAddresses = function(item, $model) {    
        $scope.manuallySelected = true;
        $scope.addressOfRetailer = item;
        
    }
});
