angular
    .module('app')
    .controller('GetInTouchRetailerCtrl',
    function ($scope, $upload, $rootScope, $location, envconfig, $modal, restservice, modalservice, $http, $routeParams,
              $filter, AddressConfirmationService, $timeout,
              geocodeservice, colrefdocservice)
    {

        $scope.sendSuccess = false;
        $scope.sendfailure = false;
        $scope.comment = "";
        $scope.subject = "Subject";

        $scope.reset = function(form){
            $scope.firstName = "";
            $scope.lastName = "";
            $scope.companyName  = "";
            $scope.emailAddress = "";
            $scope.phoneNumber = "";
            $scope.subject = "Subject";
            $scope.comment = "";
            $scope.getInTouchRetailer.$setPristine();

        };


        $scope.sendMail = function (isValid)
        {
            if (!isValid)
                return;
            //console.log("send mail");

            var objRequest = {
                "firstName": $scope.firstName,
                "lastName": $scope.lastName,
                "companyName": $scope.companyName,
                "emailAddress": $scope.emailAddress,
                "phoneNumber": $scope.phoneNumber,
                "subject": $scope.subject,
                "comment": $scope.comment
            };

            $http.post(envconfig.get('host') + '/get-in-touch/retailer', objRequest).
                success(function (data, status, headers, config)
                {
                    $scope.sendSuccess = true;
                    $scope.sendfailure = false;
                    $scope.reset();
                }).
                error(function (data, status, headers, config)
                {
                    $scope.sendSuccess = false;
                    $scope.sendfailure = true;



                });

        };



    });
