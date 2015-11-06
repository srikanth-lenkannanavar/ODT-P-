//controller for my-subscription.html
app.controller('MySubscriptionCtrl', function ($scope, envconfig, modalservice, restservice, $http, $rootScope, $location) {
    //  console.log(envconfig.get('host'));
    $scope.check = false;

    //$scope.uuid=$routeParams.uuid;
    var formData = '{"user":"' + $rootScope.loggedUser + '"}';
    var user = $rootScope.loggedUser;
    //console.log("rest service " + restservice);
    $scope.hasValidActiveSubscription = "false";
    $scope.getSubscriptions = function () {
        // restservice.get(envconfig.get('host') + "/subscription/mysubscription/" + user,
        restservice.get(envconfig.get('host') + "/subscription/mysubscription",
                //restservice.get("http://localhost/MyDeliveryPortal/subscription/mysubscrition/"+user, 
                '', function (data, status) {
                    $scope.res = data;
                    $scope.userSubs = data.userSubscriptions;
                    $scope.goldSubs = (data.allAvalaibleSubscriptions)[1];
                    $scope.AllSubscription = data.allAvalaibleSubscriptions;
                    if ($scope.userSubs != undefined) {
                        $scope.hasValidActiveSubscription = $scope.userSubs.hasValidActiveSubscription;
                        $scope.check = $scope.userSubs.hasValidActiveSubscription;
                    }
                }, function (data, status) {
            // error message
            //  console.log(data);
        });
    };
    $scope.getSubscriptions();

    $scope.buySubscriptions = function (cost, sub, displayname) {
        var subscription = sub;
        var cost = cost;
        var currency = 'GBP';
        var displayName = displayname;
        var uuid = '4480601c-cf36-4752-b12c-cab9d9b83a73';

        //var formData = '{"uuid":"'+ $rootScope.uuid + '","subscriptionname":"'+ subscription.subscriptionname +'","subscriptioncost":"'+ subscription.cost +'"}';
        var formData = '{"uuid":"' + uuid + '","subscriptionname":"' + subscription + '","currency":"' + currency + '","displayname":"' + displayName + '","subscriptioncost":"' + cost + '" }';
        restservice.post(envconfig.get('host') + "/subscription/subscribe", '',
                function (data, status) {
                    //console.log(data);
                    $location.path("/subscriptions/subscribes");
                }, function (data, status) {
            if (status == 401) {
                $location.path("/register");
            } else {
                alert("internal server error");
            }
        }, formData);
    };

    $scope.servicableLink = function () {
        $location.path("/servicable-zones");
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
                    if (count   == 0)
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
});


