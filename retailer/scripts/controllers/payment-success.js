'use strict';
/**
 * @ngdoc function
 * @name app.controller:PaymentSuccessCtrl
 * @description # PaymentSuccessCtrl Controller of the app
 */
angular.module('app')
        .controller('PaymentSuccessCtrl', function ($rootScope, $scope, $location, $filter, envconfig, restservice, $modal, $http, modalservice, $timeout, CommonService)
        {
            $scope.landingPage = envconfig.get('home'); // Appears on the Post
            $scope.fbRedirectUrl = envconfig.get('home') + "/views/fbredirect.html"; // Change
            $scope.appId = envconfig.get('appId');
            $scope.subscribeBook = false;
            $scope.vouchercode = '';
            $scope.bookingFailed = false;
            $scope.orderDetail = function () {
                $scope.brJobNumber = $location.search().brJobNumber;
////                $scope.brJobNumber = "CQRRL61";
//                $scope.url = "scripts/json/retailer/orderConfirmation.json";
                $scope.url = "/bookings/getorderdetails";
                if ($scope.brJobNumber) {
                    $scope.url = "/bookings/getorderdetails?brJobNumber=" + $scope.brJobNumber;
                }
                restservice.get(envconfig.get('host') + $scope.url, '', function (data, status) {
//                restservice.get($scope.url, '', function (data, status) {
                    $scope.orderConfirmation = data.data;
                    $scope.orderConfirmation.store.info.openTime = $scope.orderConfirmation.store.info.openTime.split(':');
                    $scope.orderConfirmation.store.info.openTime = $scope.orderConfirmation.store.info.openTime[0] + ":" + $scope.orderConfirmation.store.info.openTime[1]
                    $scope.orderConfirmation.store.info.closeTime = $scope.orderConfirmation.store.info.closeTime.split(':');
                    $scope.orderConfirmation.store.info.closeTime = $scope.orderConfirmation.store.info.closeTime[0] + ":" + $scope.orderConfirmation.store.info.closeTime[1]
                    $scope.deliveryDate = $scope.orderConfirmation.item.deliveryDate.split("T");

                    //$scope.orderConfirmation.item.readyAt = $filter("ISO8601Parse")($scope.deliveryDate[0] + "T" + $scope.orderConfirmation.item.readyAt + ":00Z", "UK", "HH:mm");
                    if ($scope.orderConfirmation.status == 'Booked') {
                        $scope.orderConfirmation.item.readyAt = $scope.orderConfirmation.item.readyAt;
                        if ($scope.orderConfirmation.voucherCode) {
                            $scope.vouchercode = $scope.orderConfirmation.voucherCode;
                        }
                        if ($scope.orderConfirmation.subscriptionName) {
                            $scope.remainingSubscription = data.remainingBookingsForSubscription;
                            $scope.totalbookingsforsubscription = data.totalBookingsForSubscription;
                            $scope.subscribeBook = true;
                        }
                    }
                    if ($scope.orderConfirmation.status === 'Failed') {
                        $scope.bookingFailed = true;
                    }
                });
            };
            $scope.orderDetail();
            $scope.closePage = function () {
                $location.path('my-deliveries');
            };
            $scope.getContent = function ()
            {
                if (!document.getElementById("idContent"))
                    return 'Amazing! My customers are getting their goodies delivered in a 1 hour window of their choice! Thanks @onthedotuk\n';
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
                return "Amazing! My customers are getting their goodies delivered in a 1 hour window of their choice! Thanks @onthedotuk";
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
                window.open(url, 'Facebook Share', 'width=800,height=700');
            };
            $scope.orderPrnt = function () {
                window.print();
            };
        });