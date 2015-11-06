angular
    .module('app')
    .controller(
    'MyDeliveriesCtrl',
    function ($scope, $filter, envconfig, restservice, $rootScope,
              $modal, modalservice, envconfig, $location)
    {
        //console.log(restservice);
        var user = $rootScope.loggedUser;
        var reverse = false;
        $scope.reverse = false;
        $scope.trackmap = false;
        $scope.bookingObj = {};
        $scope.jobgps = {
            lat: null,
            lng: null,
            vehicle: null
        };


                    $scope.compareDeliveries = function (objLhs, objRhs) {
                        var aryLHSDateParts = objLhs.createdate.split("/");
                        var aryRHSDateParts = objRhs.createdate.split("/");

                        var lhsDate = new Date(aryLHSDateParts[2], aryLHSDateParts[1], aryLHSDateParts[0]);
                        var rhsDate = new Date(aryRHSDateParts[2], aryRHSDateParts[1], aryRHSDateParts[0]);

                        if ($scope.reverse) {
                            var dateDiff = rhsDate.getTime() - lhsDate.getTime();
                        } else {
                            var dateDiff = lhsDate.getTime() - rhsDate.getTime();
                        }

                        if (dateDiff === 0)
                        {
                            return objRhs.brjobnumber - objLhs.brjobnumber;
                        }
                        else
                        {
                            return dateDiff;
                        }
                    };

                    $scope.doSort = function (obj) {

                        $scope.reverse = !$scope.reverse;
                        $scope.userdelivery = obj.sort($scope.compareDeliveries);

                    };



                    $scope.getDelivery = function ()
                    {
                        restservice.get(envconfig.get('host')
                                //			+ "/userbookingdetails/" + user, '', function(
                                + "/userbookingdetails/", '', function (
                                        data, status)
                                {

                                    if (data && data.userdelivery)
                                    {
                                        $scope.reverse = !$scope.reverse;
                                        data.userdelivery.sort($scope.compareDeliveries);
                                    }
                                    $scope.res = data;
                                    $scope.userdelivery = data.userdelivery;
                                }, function (data, status)
                        {
                            // error message
                            //	console.log(data);
                        });
                    };

                    $scope.getDelivery();

                    var orderBy = $filter('orderBy');
                    $scope.order = function (predicate)
                    {
                        reverse = !reverse;
                        $scope.userdelivery = orderBy($scope.userdelivery,
                                predicate, reverse);
                    };

                    $scope.track = function (job, account, deliveryObj) {
                        $scope.trackmap = true;

                        $scope.bookingObj = deliveryObj;
                        if (job != null && account != null) {
                            restservice.get(envconfig.get('host') + "/getjobgps/" + job + "/" + account,
                                    '', function (data, status) {

                                        $scope.jobgps.lat = data.lat;
                                        $scope.jobgps.lng = data.lng;
                                        $scope.jobgps.vehicle = data.vehicle;
                                        modalservice.show('lg', 'views/template/modal/track-your-delivery.html', 'ModalCtrl', $scope);
                                    }, function (data, status) {
                                // error message
                                //  console.log(data);
                            });
                        }

                    };


                    $scope.getNewBooking = function () {
                        //restservice.get(envconfig.get('host')+"/subscription/mysubscriptionnumber/"+$rootScope.loggedUser,
                        restservice.get(envconfig.get('host') + "/subscription/mysubscriptionnumber",
                                // restservice.get("http://localhost/MyDeliveryPortal/subscription/mysubscriptionnumber/"+user,             
                                '', function (data, status) {
                                    var count;
                                    var userpostcode;
                                    count = data.subcount.subscriptionCount;
                                    userpostcode = data.subcount.postCode;
                                    if (count == 0)
                                    {
                                        $location.path('/');
                                    }
                                    else
                                    {
                                        $location.path('/Booking/Retailers/' + userpostcode);
                                    }
                                }, function (data, status) {
                            // console.log(data);
                        });
                    };

                    /*   var count=1;
                     var postcode='HA11JU';
                     $scope.getNewBooking =  function() {
                     
                     $location.path('/Booking/Retailers/'+postcode);
                     restservice.get(envconfig.get('host')+"/subscription/mysubscriptionnumber/"+user,
                     // restservice.get("http://localhost/MyDeliveryPortal/subscription/mysubscriptionnumber/"+user,             
                     '', function(data, status) {
                     // count = data.subcount.subscriptionCount;
                     postcode=data.subcount.postcode;
                     if ( count ==0)
                     { 
                     $location.path('/');
                     } 
                     else 
                     {
                     $location.path('/Booking/Retailers/:'+postcode);
                     }
                     }, function(data, status) {
                     //  console.log(data);
                     });
                     };*/

                    $scope.confirmCancellation = function (userid, bookingStatus, transactionDate)
                    {
                        $scope.userid = userid;
                        $scope.bookingStatus = bookingStatus;
                        $scope.transactionDate = transactionDate;
                        modalservice.show('lg', 'views/template/modal/cancel-booking-popup.html', 'ModalCtrl', $scope, 'medium-dialog');
                    };


                    $scope.editBooking = function (bkuuid, userid, bookingstatus, transactiondate)
                    {

                        $location.path('/edit-booking/' + bkuuid + '/' + bookingstatus + '/' + transactiondate);
                    };

                });
