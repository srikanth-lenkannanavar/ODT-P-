angular.module('app').controller('ModalRetailerSignupCtrl', function ($scope, modalservice, CommonService, $routeParams, restservice, envconfig, $location, $filter, $cookies, $interval, $rootScope, $route, $timeout, $window, $sce, geocodeservice, YourQuoteService) {

    $scope.person.selected = {};
    $scope.retDistHideModal = function ()
    {
        $scope.mydeliveryuser.postCodeValue = null;
        $scope.mydeliveryuser.hiddenpostcodevalue = null;
        modalservice.close();
        //$location.path('/signup');
    };


    $scope.changeHidemodal = function ()
    {
//      $scope.mydeliveryuser.postCodeValue = null;
        $scope.mydeliveryuser.hiddenpostcodevalue = null;
        modalservice.close();
        //$location.path('/signup');
    };

    $scope.quoteNotifySubmit = function (isValid)
    {

        if (!isValid) {
            return;
        }
        var postObj = {
            "email": $scope.userEmail,
            "postcode": $scope.mydeliveryuser.postCodeValue,
            "uuid": $scope.uuid
        };
        restservice.post(envconfig.get('host') + "/bookings/isPostCodeServiced/", '',
                function (data, status)
                {

                },
                function (data, status)
                {

                }, postObj);
        modalservice.close();
        $scope.mydeliveryuser.postCodeValue = '';
        $location.path('/are-you-a-retailer');
    };
});