'use strict';

/**
 * @ngdoc function
 * @name app.controller:PaymentSuccessCtrl
 * @description # PaymentSuccessCtrl Controller of the app
 */
angular.module('app')
        .controller('PaymentSuccessCtrl', function ($rootScope, $scope, $location, envconfig, restservice, $modal, $http, modalservice, $timeout)
        {


            $scope.landingPage = envconfig.get('home');// Appears on the Post
            $scope.fbRedirectUrl = envconfig.get('home') + "/views/fbredirect.html";// Change
            $scope.appId = envconfig.get('appId');

            $scope.content = '';
            $scope.maxlength = 140;
            $scope.orderNo = '';
            $scope.remainingSubscription = '0';
            $scope.totalSubscription = '';
            $scope.subscriptionDelivered = '0';
            $scope.deliveryDate = '';
            $scope.deliveryTime = '';
            $scope.deliveryToPostcode = '';
            $scope.deliveryToAddress = '';
            $scope.deliveryrefaddresstown = '';
            $scope.deliveryToPhone = '';
            $scope.retailerpostalcode = '';
            $scope.retaileraddress = '';
            $scope.retailercity = '';
            $scope.retailerstoreopentime = '';
            $scope.retailerstoreclosetime = '';
            $scope.price = '';
            $scope.subscriptionname = '';
            $scope.subscribeBook = false;
            $scope.vouchercode = '';
// $scope.home = 'home';
            $scope.isAddressEmpty = false;
            $scope.deliveryrefaddress1 = '';
            $scope.deliveryrefaddress2 = '';


            $scope.bookingFailed = false;


            $scope.orderDetail = function () {

                $scope.brJobNumber = $location.search().brJobNumber;
//                $scope.url = "scripts/json/payment-success.json";
//                restservice.get($scope.url, '', function (data, status) {

                $scope.url = "/bookings/orderconfirm";
                if ($scope.brJobNumber) {
                    $scope.url = "/bookings/orderconfirm?brJobNumber=" + $location.search().brJobNumber;
                }
                restservice.get(envconfig.get('host') + $scope.url, '', function (data, status) {
                    if (data.status == 'Booked')
                    {
                        //$scope.showSaveAddress = true;
                        $scope.deliveryrefname = data.deliveryrefname;
                        $scope.retailername = data.retailername;
                        $scope.orderNo = data.brjobnumber;
                        $scope.remainingSubscription = data.remainingbookingsforsubscription;
                        $scope.totalSubscription = data.totalbookingsforsubscription;
                        $scope.subscriptionDelivered = parseInt(data.totalbookingsforsubscription) - parseInt(data.remainingbookingsforsubscription);
                        $scope.deliveryDate = data.brdeliveryby;
                        /*
                         * if($scope.deliveryDate == null ||
                         * $scope.deliveryDate.trim() == ''){
                         * $scope.deliveryDate = ""; } else
                         * if($scope.deliveryDate.indexOf('T') > -1){ var date =
                         * $scope.deliveryDate.split('T'); $scope.deliveryDate =
                         * date[0]; }
                         */
                        $scope.retailerstoreopentime = data.timeslotstarttime;
                        $scope.retailerstoreclosetime = data.timeslotendtime;
                        $scope.deliveryTime = data.remainingbookingsforsubscription;
                        $scope.deliveryToPostcode = data.postcode;
                        $scope.deliveryrefaddress1 = data.deliveryrefaddress1;
                        $scope.deliveryrefaddress2 = data.deliveryrefaddress2;
                        $scope.deliveryToAddress = data.deliveryrefaddress1;
                        if ($scope.deliveryToAddress == null || $scope.deliveryToAddress.trim() == '') {
                            if (data.deliveryrefaddress2 != null && data.deliveryrefaddress2.trim() != '') {
                                $scope.deliveryToAddress = data.deliveryrefaddress2;
                            } else {
                                $scope.deliveryToAddress = '';
                            }
                        } else {
                            if (data.deliveryrefaddress2 != null && data.deliveryrefaddress2.trim() != '') {
                                $scope.deliveryToAddress = $scope.deliveryToAddress + ', ' + data.deliveryrefaddress2;
                            }
                        }

                        $scope.deliveryrefaddresstown = data.deliveryrefaddresstown;
                        /*
                         * if (data.deliveryrefaddresstown != null && data.deliveryrefaddresstown.trim() !=
                         * '') { if ($scope.deliveryToAddress == null || $scope.deliveryToAddress.trim() ==
                         * '') { $scope.deliveryrefaddresstown = data.deliveryrefaddresstown + "."; }
                         * else { $scope.deliveryrefaddresstown = ", " + data.deliveryrefaddresstown +
                         * "."; } } else { if ($scope.deliveryToAddress == null ||
                         * $scope.deliveryToAddress.trim() == '') { $scope.deliveryrefaddresstown = "."; }
                         * else { $scope.deliveryrefaddresstown = ""; } }
                         */
                        $scope.retailerpostalcode = data.retailerpostalcode;

                        $scope.retaileraddress = data.retaileraddressline1;

                        if ($scope.retaileraddress == null || $scope.retaileraddress.trim() == '') {
                            if (data.retaileraddressline2 != null && data.retaileraddressline2.trim() != '') {
                                $scope.retaileraddress = data.retaileraddressline2;
                            } else {
                                $scope.retaileraddress = '';
                            }
                        } else {
                            if (data.retaileraddressline2 != null && data.retaileraddressline2.trim() != '') {
                                $scope.retaileraddress = $scope.retaileraddress + ', ' + data.retaileraddressline2;
                            }
                        }

                        $scope.retailercity = data.retailercity;
                        /*
                         * if (data.retailercity != null && data.retailercity !=
                         * '') { if ($scope.retaileraddress == null ||
                         * $scope.retaileraddress.trim() == '') {
                         * $scope.retailercity = data.retailercity + "."; } else {
                         * $scope.retailercity = ", " + data.retailercity + "."; } }
                         * else { if ($scope.retaileraddress == null ||
                         * $scope.retaileraddress.trim() == '') {
                         * $scope.retailercity = "."; } else {
                         * $scope.retailercity = ""; } }
                         */
                        if (data.deliveryrefphoneno) {
                            $scope.deliveryToPhone = data.deliveryrefphoneno;
                        }

                        if (data.subscriptionname == null || data.subscriptionname.trim() == '') {
                            $scope.price = data.quoteamount;
                            $scope.subscribeBook = false;
                        } else {
                            $scope.subscriptionname = data.subscriptionname;
                            $scope.subscribeBook = true;
                        }
                        if (data.vouchercode == null || data.vouchercode.trim() == '') {

                        } else {
                            $scope.vouchercode = data.vouchercode;
                        }
                        $rootScope.showSubscriptionMenu = true;
                    } else if (data.status == 'Failed') {
                        $scope.bookingFailed = true;
                        $scope.isAddressEmpty = true;
                        // $timeout(function () {
                        //     $scope.bookingFailed = false;
                        // }, 20000);
                    }

                }, function (data, status) {

                    $scope.bookingFailed = true;
                    $scope.isAddressEmpty = true;
                    // $timeout(function () {
                    //     $scope.bookingFailed = false;
                    // }, 20000);
                    // failure
                }, $scope.book);



            };

            $scope.addressVerification = function ()
            {
// restservice.get(envconfig.get('host') + "/getUserProfile?userName=" +
// $rootScope.loggedUser, '', function (data, status)
                var userProfileUrl = envconfig.get('host') + "/user-profile";
                restservice.get(userProfileUrl, '', function (data, status)
                {
                    if (data.address == null || data.address == '') {
                        $scope.isAddressEmpty = false;
                    } else {

                        $scope.names = angular.fromJson(data.address);
                        if ($scope.names.length > 0) {
                            for (var i = 0; i < $scope.names.length; i++) {
                                if ($scope.names[i].addressline1 && $scope.names[i].addressline2 && $scope.names[i].town && $scope.names[i].postalcode) {
                                    if ($scope.deliveryrefaddress1.toUpperCase().trim() == $scope.names[i].addressline1.toUpperCase().trim() &&
                                            $scope.deliveryrefaddress2.toUpperCase().trim() == $scope.names[i].addressline2.toUpperCase().trim() &&
                                            $scope.deliveryrefaddresstown.toUpperCase().trim() == $scope.names[i].town.toUpperCase().trim() &&
                                            $scope.deliveryToPostcode.toUpperCase().trim() == $scope.names[i].postalcode.toUpperCase().trim()) {
                                        $scope.isAddressEmpty = true;
                                    }
                                }
                            }

                        } else {
                            $scope.isAddressEmpty = false;
                        }
                    }
                }, function (data, status) {
                    $scope.isAddressEmpty = false;
                    // failure
                });

            };

            $scope.orderDetail();
            $scope.addressVerification();



            $scope.closePage = function () {
                $location.path('my-deliveries');
            };

            $scope.getContent = function ()
            {
                if (!document.getElementById("idContent"))
                    return 'Amazing! I have just booked a delivery with @onthedotuk to get my goodies when I want them! #ihatewaiting\n';

                $scope.content = document.getElementById("idContent").value.trim();

                if ($scope.content.length > $scope.maxlength)
                    $scope.content = $scope.content.substring(0, $scope.maxlength + 1);

                return $scope.content;
            };

            $scope.twitterText = function ()
            {
                return $scope.getContent();
            };
            $scope.fbCaption = function ()
            {
                // Must be short. Say 25 Characters.
                return "Deliveries when you want them";
            };
            $scope.fbDescription = function ()
            {
                // Twitter text = fbDescription. FB accepts more than 140
                // characters. Don't know the limit.
                return $scope.getContent();
            };



            $scope.composeFbUrl = function () {
                var url = 'https://www.facebook.com/dialog/feed?link=' + $scope.landingPage + '&app_id=' + $scope.appId + '&caption=' + $scope.fbCaption() + '&description=' + $scope.fbDescription() + '&redirect_uri=' + encodeURIComponent($scope.fbRedirectUrl);
                //var url = '';
                return url;
            };
            //JO'n is moving this into directive

            // AngularJS Refactoring required. Move this to a directive?
            // (Ghanavel)
            /*window.twttr = (function (d, s, id) {
             var t, js, fjs = d.getElementsByTagName(s)[0];
             if (d.getElementById(id)) {
             return;
             }
             js = d.createElement(s);
             js.id = id;
             js.src = "https://platform.twitter.com/widgets.js";
             fjs.parentNode.insertBefore(js, fjs);
             return window.twttr || (t = {_e: [], ready: function (f) {
             t._e.push(f);
             }})
             }(document, "script", "twitter-wjs"));*/

            $scope.fbShare = function () {
                var url = 'https://www.facebook.com/dialog/feed?link=' + $scope.landingPage + '&app_id=' + $scope.appId + '&caption=' + encodeURIComponent($scope.fbCaption()) + '&description=' + encodeURIComponent($scope.fbDescription()) + '&redirect_uri=' + encodeURIComponent($scope.fbRedirectUrl) + '&picture=' + encodeURIComponent(envconfig.get('home') + '/images/fb_header.jpg');
                window.open(url, 'Facebook Share', 'width=800,height=550');
            };

            $scope.saveAddress = function () {
                $scope.getUserAddress();
                $scope.flagcheck = false;
                $scope.flag = false;
                $scope.flag1 = false;
                modalservice.show('lg', 'views/template/modal/save-delivery-address.html', 'ModalCtrl', $scope, 'medium-dialog');
                $scope.ifNameexist = false;
            };


            $scope.submitForm = function (userAddrMy) {
// var userAddrMy = userAddrMy.toLowerCase();
                $scope.flag1 = false;
                if ($scope.names != null) {
                    for (var i = 0; i < $scope.names.length; i++) {
                        // console.log($scope.names[i].id);
                        if (userAddrMy === $scope.names[i].id) {
                            $scope.flag1 = true;
                            $scope.flagcheck = false;
                        }
                        /*
                         * else { $scope.flag1 = false; }
                         */
                    }
                }
                if (userAddrMy == null) {
                    $scope.flag = true;
                    // $timeout(function () {
                    //     $scope.flag = false;
                    // }, 2000);
                }
                else {
                    if (!$scope.flag1) {
                        $scope.updateUserAddress(userAddrMy);
                    }
                }
            };
            $scope.getUserAddress = function () {
                //restservice.get(envconfig.get('host') + "/getUserProfile?userName=" + $rootScope.loggedUser, '', function (data, status)
                var userProfileUrl = envconfig.get('host') + "/user-profile";

                restservice.get(userProfileUrl, '', function (data, status)
                {
                    $scope.scimId = data.id;
                    $scope.address = data.address;
                    $scope.names = angular.fromJson(data.address);
                }, function (data, status) {
                });
            }


            $scope.updateUserAddress = function (userAddrMy) {

                var userData = {
                    "id": $scope.scimId,
                    "addressName": userAddrMy,
                    "addressLine1": $scope.deliveryrefaddress1,
                    "addressLine2": $scope.deliveryrefaddress2,
                    "town": $scope.deliveryrefaddresstown,
                    "postalCode": $scope.deliveryToPostcode,
                    "address": $scope.address,
                    "userName": $rootScope.loggedUser
                };

                restservice.put(envconfig.get('host') + "/updateUserAddress", '', function (data, status) {
                    $scope.flagcheck = true;
                    $scope.flag = false;
                    $scope.flag1 = false;
                    $scope.isAddressEmpty = true;
                    $timeout(function () {
                        $scope.flagcheck = false;
                        modalservice.hide();
                    }, 2000);
                }, function (data, status) {
                    alert("Error while saving address");
                }, userData);
            };

            $scope.userAddrMyCase = function (userAddrMy) {
                var names = [];
                $scope.userAddrMyC = userAddrMy.toLowerCase();
                for (var key in $scope.names) {
                    if ($scope.names[key].id === userAddrMy) {
                        names.push(userAddrMy);
                    }
                }
                if (names.length > 0 || $scope.userAddrMyC == "new") {
                    $scope.ifNameexist = true;
                } else {
                    $scope.ifNameexist = false;
                }
            };

            $scope.orderPrnt = function () {
                window.print();
            };

        });