//controller for my-subscription.html
app.controller('MySubscriptionCtrl', function ($scope, envconfig, modalservice, restservice, $http, $rootScope, $location) {
    $scope.check = false;
    $scope.errFlag = false;
    $scope.getSubscriptions = function () {
//        restservice.get("scripts/json/retailer/Subscription_Response.json",
        restservice.get(envconfig.get('host') + "/subscription/getsubscriptions",
                '', function (data, status) {
                    $scope.userSubs = data.data;
                    if ($scope.userSubs != undefined && $scope.userSubs.isValidSubscription) {
                        $scope.check = $scope.userSubs.isValidSubscription;
                    }
                }, function (data, status) {
            $scope.errFlag = true;
            $scope.errStatusCode = status;
            if (Number($scope.errStatusCode) === 404) {
                $scope.errStatusMsg = ", Store not found.";
            }
        });
    };
    $scope.subdata = {};
    $scope.getSubscriptions();
    $scope.userSubscriptions = function (subindex) {
        $scope.subindex = subindex;
    };
    $scope.buySubscriptions = function (isValid) {
        if (!isValid) {
            return;
        }
        $scope.subdata = $scope.userSubs[$scope.subindex];
        var formData = {
            "uuid": "",
            "subscriptionname": $scope.subdata.subscriptionname,
            "currency": "GBP",
            "subscriptioncost": $scope.subdata.cost,
            "displayname": $scope.subdata.subscriptionname
        };
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
});
