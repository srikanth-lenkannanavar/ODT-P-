angular.module('app').controller('ModalRetailerSignupCtrl', function ($scope, modalservice, CommonService, $routeParams, restservice, envconfig, $location, $filter, $cookies, $interval, $rootScope, $route, $timeout, $window, $sce, geocodeservice, YourQuoteService) {

    $scope.retDistHideModal = function ()
    {
        modalservice.close();
        $location.path('/');
    };
});