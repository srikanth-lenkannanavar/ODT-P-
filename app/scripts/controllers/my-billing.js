angular.module('app').controller('MyBillingCtrl', function ($scope, $filter, envconfig, restservice, $rootScope) {
    var user = $rootScope.loggedUser;
    var reverse = false;
    $scope.reverse = false;    
    $scope.getBilling = function () {
        // restservice.get(envconfig.get('host')+"/billinghistory/"+user, 
        restservice.get(envconfig.get('host') + "/billinghistory",
                '', function (data, status) {
                    if (data && data.mybilling)
                    {
                        $scope.reverse = !$scope.reverse;
                        data.mybilling.sort($scope.comparePayHistories);
                    }
                    $scope.orderByField = 'orderid';
                    $scope.reverseSort = true;

                    $scope.res = data;
                    $scope.billings = data.mybilling.sort($scope.comparePayHistories);

                }, function (data, status) {
            // error message
        });
    };
    $scope.getBilling();


    $scope.comparePayHistories = function(objLhs, objRhs){
        var aryLHSDateParts = objLhs.createdate.split("/");
        var aryRHSDateParts = objRhs.createdate.split("/");

        var lhsDate = new Date(aryLHSDateParts[2], aryLHSDateParts[1], aryLHSDateParts[0]);
        var rhsDate = new Date(aryRHSDateParts[2], aryRHSDateParts[1], aryRHSDateParts[0]);

        if($scope.reverse){
            var dateDiff = rhsDate.getTime() - lhsDate.getTime();
        }else{
            var dateDiff = lhsDate.getTime() - rhsDate.getTime();
        }

        if(dateDiff === 0)
        {
            return objRhs.orderid - objLhs.orderid;
        }
        else
        {
            return dateDiff;
        }
    };

    $scope.doSort = function(obj){
        $scope.reverse = !$scope.reverse;
        $scope.billings = obj.sort($scope.comparePayHistories);
    };



    var orderBy = $filter('orderBy');
    //var orderBy = $filter('date')(new Date(), 'd M yyyy');

    $scope.order = function(predicate)
    {
        console.log(predicate)
        reverse = !reverse;
        $scope.billings = orderBy($scope.billings,
            predicate, reverse);
    };

});