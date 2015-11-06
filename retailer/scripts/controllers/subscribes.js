'use strict';

/**
 * @ngdoc function
 * @name app.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the app
 */
angular.module('app')
        .controller('SubscribeCtrl', function ($scope, $rootScope, $location, $modal, restservice, modalservice, $routeParams, $filter, envconfig) {

            $scope.buySubscriptions = function () {
                //var formData = '{"user":"'+ $rootScope.loggedUser + '"}';
                //var user = $rootScope.loggedUser;
                restservice.get(envconfig.get('host') + encodeURI("/subscription/buysubscription"), '',
                        //  restservice.get("http://localhost/MyDeliveryPortal/subscription/subs",'',
                                // restservice.get("http://localhost/MyDeliveryPortal/bookings/subscription",'',
                                        function (data, status) {
                                            //  console.log(data);
                                            document.getElementById("paymentForm").action = envconfig.get('payment');
                                            $scope.merchantId = data.merchantId;
                                            $scope.orderId = data.orderId;
                                            $scope.subaccount = data.subaccount;
                                            $scope.amount = data.amount;
                                            $scope.currency = data.currency;
                                            $scope.timestamp = data.timestamp;
                                            $scope.sha1hash = data.sha1hash;
                                            $scope.MERCHANT_RESPONSE_URL = data.MERCHANT_RESPONSE_URL;
                                            $scope.COMMENT1 = data.COMMENT1;
                                            $scope.COMMENT2 = data.COMMENT2;
                                            $scope.WORKFLOW = data.WORKFLOW;
                                            $scope.PROD_ID = data.PROD_ID;
                                            $scope.USER = data.USER;
                                            $scope.UUID = data.UUID;
                                            $scope.BOOKINGTYPE = data.BOOKINGTYPE;
                                            $scope.postcode = data.postcode;
                                            $scope.SUCCESSURL = data.SUCCESSURL;
                                            $scope.FAILUREURL = data.FAILUREURL;
                                            $scope.displayname = data.displayname;
                                            $scope.STOREID = data.STOREID;
                                            $scope.DOMAIN = data.DOMAIN;
                                            $scope.CHANNEL = data.CHANNEL;
                                            $scope.SUBSCRIPTION_COST = data.SUBSCRIPTION_COST;
                                            $scope.SUBSCRIPTION_VAT_COST = data.SUBSCRIPTION_VAT_COST;
                                            $scope.$apply();
                                            document.getElementById("paymentForm").submit();
                                        }, function (data, status) {
                                    if (status == 401) {
                                        $location.path("/register");
                                    } else {
                                        alert("internal server error");
                                    }
                                });
                            };

                    $scope.buySubscriptions();
                });